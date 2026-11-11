<?php

namespace Pterodactyl\Http\Controllers\Api\Client;

use Illuminate\Http\Request;
use Pterodactyl\Models\Node;
use Pterodactyl\Models\Server;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Pterodactyl\Repositories\Wings\DaemonServerRepository;

/**
 * Live usage of several servers in one request, for the server list.
 *
 * Wings reports every server on a node in a single call, so the panel asks each node
 * once and keeps the answer for two seconds. A list of twenty servers therefore costs
 * one request to the panel and one per node, instead of twenty of each.
 */
class ResourceOverviewController extends ClientApiController
{
    private const TTL = 2;

    public function __construct(private DaemonServerRepository $repository)
    {
        parent::__construct();
    }

    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        $uuids = array_slice(array_filter((array) $request->query('uuids', []), 'is_string'), 0, 100);
        if (empty($uuids)) {
            return new JsonResponse(['data' => (object) []]);
        }

        $query = Server::query()->with('node')->whereIn('servers.uuid', $uuids);
        if (!$user->root_admin) {
            $query->whereIn('servers.id', $user->accessibleServers()->pluck('id')->all());
        }

        $data = [];
        foreach ($query->get()->groupBy('node_id') as $servers) {
            $onNode = $this->node($servers->first()->node);
            foreach ($servers as $server) {
                $details = $onNode[$server->uuid] ?? ($onNode === null ? null : $this->single($server));
                if ($details === null) {
                    continue;
                }
                $u = $details['utilization'] ?? [];
                $data[$server->uuid] = [
                    'current_state' => $details['state'] ?? 'offline',
                    'is_suspended' => (bool) ($details['is_suspended'] ?? false),
                    'resources' => [
                        'memory_bytes' => (int) ($u['memory_bytes'] ?? 0),
                        'cpu_absolute' => (float) ($u['cpu_absolute'] ?? 0),
                        'disk_bytes' => (int) ($u['disk_bytes'] ?? 0),
                        'network_rx_bytes' => (int) ($u['network']['rx_bytes'] ?? 0),
                        'network_tx_bytes' => (int) ($u['network']['tx_bytes'] ?? 0),
                        'uptime' => (int) ($u['uptime'] ?? 0),
                    ],
                ];
            }
        }

        return new JsonResponse(['data' => (object) $data]);
    }

    /**
     * Every server on a node keyed by uuid, or null when the node cannot be reached.
     * A node that is down is remembered a little longer so it is not asked again on every poll.
     */
    private function node(Node $node): ?array
    {
        $key = "glass:node-resources:$node->id";
        $cached = Cache::get($key);
        if ($cached !== null) {
            return $cached === false ? null : $cached;
        }

        try {
            $response = $this->repository->setNode($node)->getHttpClient()->get('/api/servers', ['timeout' => 4, 'connect_timeout' => 2]);
            $list = json_decode($response->getBody()->__toString(), true);
            $map = [];
            foreach (is_array($list) ? $list : [] as $entry) {
                $uuid = $entry['configuration']['uuid'] ?? null;
                if (is_string($uuid)) {
                    $map[$uuid] = ['state' => $entry['state'] ?? null, 'is_suspended' => $entry['is_suspended'] ?? false, 'utilization' => $entry['utilization'] ?? []];
                }
            }
            Cache::put($key, $map, self::TTL);

            return $map;
        } catch (\Throwable) {
            Cache::put($key, false, 10);

            return null;
        }
    }

    /** A server the node's list did not include: ask for it alone. */
    private function single(Server $server): ?array
    {
        return Cache::remember("glass:server-resources:$server->uuid", self::TTL, function () use ($server) {
            try {
                return $this->repository->setServer($server)->getDetails();
            } catch (\Throwable) {
                return ['state' => 'offline', 'utilization' => []];
            }
        });
    }
}
