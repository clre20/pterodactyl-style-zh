<?php

namespace Pterodactyl\Services\Minecraft;

/**
 * Asks a Minecraft: Java Edition server for its status with the Server List Ping
 * protocol (the same request the game's multiplayer screen makes): player counts,
 * a sample of player names, the version and the MOTD. Nothing has to be installed
 * or enabled on the server for this to work.
 */
class ServerListPing
{
    /**
     * @return array{players: array{online: int, max: int, sample: string[]}, version: string, motd: string}|null
     *                                                                                                             null when the server did not answer
     */
    public function query(string $host, int $port, float $timeout = 1.5): ?array
    {
        $socket = @stream_socket_client("tcp://$host:$port", $errno, $error, $timeout);
        if ($socket === false) {
            return null;
        }

        try {
            stream_set_timeout($socket, (int) $timeout, (int) (($timeout - (int) $timeout) * 1_000_000));

            // Handshake (packet 0x00): protocol version -1 = "tell me yours", then next state 1 (status).
            $handshake = "\x00" . $this->varInt(-1) . $this->varInt(strlen($host)) . $host . pack('n', $port) . $this->varInt(1);
            fwrite($socket, $this->varInt(strlen($handshake)) . $handshake);
            // Status request: an empty packet 0x00.
            fwrite($socket, "\x01\x00");

            if ($this->readVarInt($socket) === null) {          // packet length
                return null;
            }
            if ($this->readVarInt($socket) !== 0) {             // packet id
                return null;
            }
            $length = $this->readVarInt($socket);               // JSON length
            if ($length === null || $length < 2 || $length > 1_048_576) {
                return null;
            }

            $json = '';
            while (strlen($json) < $length) {
                $chunk = fread($socket, $length - strlen($json));
                if ($chunk === false || $chunk === '') {
                    return null;
                }
                $json .= $chunk;
            }
        } finally {
            fclose($socket);
        }

        $data = json_decode($json, true);
        if (!is_array($data) || !isset($data['players'])) {
            return null;
        }

        $sample = [];
        foreach ($data['players']['sample'] ?? [] as $player) {
            if (is_array($player) && isset($player['name']) && is_string($player['name'])) {
                $sample[] = mb_substr($this->stripFormatting($player['name']), 0, 32);
            }
        }

        return [
            'players' => [
                'online' => (int) ($data['players']['online'] ?? 0),
                'max' => (int) ($data['players']['max'] ?? 0),
                'sample' => array_slice($sample, 0, 30),
            ],
            'version' => mb_substr($this->stripFormatting((string) ($data['version']['name'] ?? '')), 0, 64),
            'motd' => mb_substr(trim($this->stripFormatting($this->flatten($data['description'] ?? ''))), 0, 256),
        ];
    }

    /**
     * The MOTD is either plain text or a chat component tree; reduce it to its text.
     */
    private function flatten(mixed $component): string
    {
        if (is_string($component)) {
            return $component;
        }
        if (!is_array($component)) {
            return '';
        }

        $text = isset($component['text']) && is_string($component['text']) ? $component['text'] : '';
        foreach ($component['extra'] ?? [] as $child) {
            $text .= $this->flatten($child);
        }

        return $text;
    }

    /** Removes "§x" colour and style codes. */
    private function stripFormatting(string $text): string
    {
        return preg_replace('/§[0-9a-fk-orx]/iu', '', $text) ?? $text;
    }

    private function varInt(int $value): string
    {
        $value &= 0xFFFFFFFF;
        $out = '';
        do {
            $byte = $value & 0x7F;
            $value >>= 7;
            $out .= chr($value ? $byte | 0x80 : $byte);
        } while ($value);

        return $out;
    }

    /**
     * @param resource $socket
     */
    private function readVarInt($socket): ?int
    {
        $value = 0;
        for ($i = 0; $i < 5; ++$i) {
            $byte = fread($socket, 1);
            if ($byte === false || $byte === '') {
                return null;
            }
            $byte = ord($byte);
            $value |= ($byte & 0x7F) << (7 * $i);
            if (!($byte & 0x80)) {
                return $value;
            }
        }

        return null;
    }
}
