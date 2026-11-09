<?php

namespace Pterodactyl\Http\Controllers\Admin;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Pterodactyl\Models\Node;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Services\Helpers\SoftwareVersionService;
use Pterodactyl\Repositories\Wings\DaemonServerRepository;
use Pterodactyl\Repositories\Wings\DaemonConfigurationRepository;

class BaseController extends Controller
{
    /**
     * BaseController constructor.
     */
    public function __construct(
        private SoftwareVersionService $version,
        private DaemonServerRepository $serverRepository,
        private DaemonConfigurationRepository $configurationRepository,
    ) {
    }

    /**
     * Return the admin index view.
     */
    public function index(): View
    {
        return view('admin.index', [
            'version' => $this->version,
            'nodes' => Node::query()->withCount('servers')->orderBy('name')->get(),
            'counts' => [
                'servers' => \Pterodactyl\Models\Server::query()->count(),
                'nodes' => Node::query()->count(),
                'users' => \Pterodactyl\Models\User::query()->count(),
                'eggs' => \Pterodactyl\Models\Egg::query()->count(),
            ],
        ]);
    }

    /**
     * Live resource usage for every node: the sum of what the servers on that node are
     * using right now, as reported by Wings. Wings does not expose whole-host usage, so
     * this is the load placed on each node by its game servers.
     */
    public function nodeUsage(): JsonResponse
    {
        $data = Cache::remember('admin:node-usage', 10, function () {
            return Node::query()->with('servers')->orderBy('name')->get()->map(function (Node $node) {
                $online = true;
                $cpuCount = null;
                try {
                    $info = $this->configurationRepository->setNode($node)->getSystemInformation();
                    $cpuCount = (int) ($info['cpu_count'] ?? 0) ?: null;
                } catch (\Throwable) {
                    $online = false;
                }

                $usage = ['cpu' => 0.0, 'memory' => 0, 'disk' => 0, 'running' => 0];
                if ($online) {
                    foreach ($node->servers as $server) {
                        try {
                            $details = $this->serverRepository->setServer($server)->getDetails();
                        } catch (\Throwable) {
                            continue;
                        }

                        $utilization = $details['utilization'] ?? [];
                        $usage['cpu'] += (float) ($utilization['cpu_absolute'] ?? 0);
                        $usage['memory'] += (int) ($utilization['memory_bytes'] ?? 0);
                        $usage['disk'] += (int) ($utilization['disk_bytes'] ?? 0);
                        if (($details['state'] ?? null) === 'running') {
                            ++$usage['running'];
                        }
                    }
                }

                return [
                    'id' => $node->id,
                    'name' => $node->name,
                    'online' => $online,
                    'maintenance' => (bool) $node->maintenance_mode,
                    'servers' => $node->servers->count(),
                    'running' => $usage['running'],
                    'cpu' => ['used' => round($usage['cpu'], 1), 'capacity' => $cpuCount ? $cpuCount * 100 : null, 'threads' => $cpuCount],
                    'memory' => ['used' => $usage['memory'], 'total' => $node->memory * 1024 * 1024],
                    'disk' => ['used' => $usage['disk'], 'total' => $node->disk * 1024 * 1024],
                ];
            })->values()->all();
        });

        return new JsonResponse(['data' => $data]);
    }

    /**
     * Switch the language used for the signed in administrator.
     */
    public function language(Request $request): RedirectResponse
    {
        $language = (string) $request->input('language');
        if (array_key_exists($language, $request->user()->getAvailableLanguages())) {
            $request->user()->forceFill(['language' => $language])->save();
        }

        return redirect()->back();
    }
}
