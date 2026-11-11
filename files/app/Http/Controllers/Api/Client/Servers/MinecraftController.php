<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Servers;

use Pterodactyl\Models\Server;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Pterodactyl\Services\Minecraft\ServerListPing;
use Pterodactyl\Http\Controllers\Api\Client\ClientApiController;
use Pterodactyl\Http\Requests\Api\Client\Servers\GetServerRequest;

class MinecraftController extends ClientApiController
{
    public function __construct(private ServerListPing $ping)
    {
        parent::__construct();
    }

    /**
     * Player counts, version and MOTD of a Minecraft server, asked from the server
     * itself over its game port. The answer is cached for 15 seconds, including
     * "no answer", so a list full of servers does not turn into a flood of pings.
     */
    public function status(GetServerRequest $request, Server $server): array
    {
        $status = Cache::remember("minecraft:status:$server->uuid", 15, function () use ($server) {
            $allocation = $server->allocation;
            if (!$allocation) {
                return false;
            }

            // The panel may reach the game port by a different address than players do, so
            // try each address this allocation is known by until one answers.
            $hosts = [];
            if (!in_array($allocation->ip, ['0.0.0.0', '::', ''], true)) {
                $hosts[] = $allocation->ip;
            }
            if (!empty($allocation->ip_alias)) {
                $hosts[] = $allocation->ip_alias;
            }
            $hosts[] = $server->node->fqdn;

            foreach (array_unique($hosts) as $host) {
                if ($result = $this->ping->query($host, (int) $allocation->port, 1.2)) {
                    return $result;
                }
            }

            return false;
        });

        return [
            'object' => 'minecraft_status',
            'attributes' => $status === false
                ? ['reachable' => false]
                : ['reachable' => true] + $status,
        ];
    }

    /**
     * The UUID a player name maps to, needed to edit whitelist.json and the other
     * lists while the server is stopped. Servers that verify accounts use the UUID
     * Mojang gives the name; servers that do not derive it from the name itself.
     */
    public function profile(GetServerRequest $request, Server $server): JsonResponse
    {
        $name = (string) $request->query('name');
        if (!preg_match('/^[A-Za-z0-9_]{2,16}$/', $name)) {
            return new JsonResponse(['error' => 'invalid'], 422);
        }

        if ($request->query('online', '1') === '0') {
            $hash = md5('OfflinePlayer:' . $name, true);
            $hash[6] = chr((ord($hash[6]) & 0x0F) | 0x30);
            $hash[8] = chr((ord($hash[8]) & 0x3F) | 0x80);

            return new JsonResponse(['uuid' => $this->dashed(bin2hex($hash)), 'name' => $name]);
        }

        $found = Cache::remember('minecraft:profile:' . strtolower($name), 86400, function () use ($name) {
            try {
                $response = Http::timeout(5)->get('https://api.mojang.com/users/profiles/minecraft/' . $name);
            } catch (\Throwable) {
                return null;
            }
            if ($response->ok() && is_string($response->json('id'))) {
                return ['uuid' => $this->dashed($response->json('id')), 'name' => (string) $response->json('name', $name)];
            }

            // 204 and 404 both mean that nobody has this name; anything else is a failed lookup.
            return in_array($response->status(), [204, 404], true) ? false : null;
        });

        if ($found === null) {
            Cache::forget('minecraft:profile:' . strtolower($name));

            return new JsonResponse(['error' => 'unavailable'], 503);
        }

        return $found === false ? new JsonResponse(['error' => 'not_found'], 404) : new JsonResponse($found);
    }

    private function dashed(string $hex): string
    {
        return preg_replace('/^(.{8})(.{4})(.{4})(.{4})(.{12})$/', '$1-$2-$3-$4-$5', strtolower($hex));
    }
}
