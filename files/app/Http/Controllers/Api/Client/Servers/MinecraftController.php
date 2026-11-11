<?php

namespace Pterodactyl\Http\Controllers\Api\Client\Servers;

use Pterodactyl\Models\Server;
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
}
