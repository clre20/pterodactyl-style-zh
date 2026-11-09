@extends('layouts.admin')

@section('title')
    Administration
@endsection

@section('footer-scripts')
    @parent
    <script>
        (function () {
            var T = {
                online: @json(__('Online')),
                offline: @json(__('Offline')),
                maintenance: @json(__('Under Maintenance')),
                running: @json(__(':running of :total servers running')),
                memory: @json(__('Memory')),
                disk: @json(__('Disk')),
                threads: @json(__(':count threads')),
                failed: @json(__('Unable to load')),
            };
            var C = 2 * Math.PI * 50;
            function bytes(b) {
                if (!b) return '0 B';
                var u = ['B', 'KiB', 'MiB', 'GiB', 'TiB'], i = Math.floor(Math.log(b) / Math.log(1024));
                return (b / Math.pow(1024, i)).toFixed(i > 2 ? 1 : 0) + ' ' + u[i];
            }
            function ring(svg, fraction, text) {
                var f = Math.max(0, Math.min(1, fraction || 0));
                var color = f >= 0.9 ? '#f87171' : f >= 0.8 ? '#fbbf24' : svg.getAttribute('data-color');
                var c = svg.querySelector('circle.value');
                c.setAttribute('stroke-dasharray', (f > 0 ? Math.max(f * C, 1) : 0) + ' ' + C);
                c.setAttribute('stroke', color);
                c.style.opacity = f > 0 ? 1 : 0;
                svg.querySelector('text').textContent = text;
            }
            function load() {
                fetch(@json(route('admin.node-usage', [], false)), { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
                    .then(function (r) {
                        if (!r.ok) throw new Error(r.status);
                        return r.json();
                    })
                    .then(function (res) {
                        res.data.forEach(function (n) {
                            var card = document.querySelector('[data-node-usage="' + n.id + '"]');
                            if (!card) return;
                            var status = card.querySelector('[data-field="status"]');
                            status.className = 'label ' + (!n.online ? 'label-danger' : n.maintenance ? 'label-warning' : 'label-success');
                            status.textContent = '● ' + (!n.online ? T.offline : n.maintenance ? T.maintenance : T.online);
                            var cpu = n.cpu.capacity ? n.cpu.used / n.cpu.capacity : 0;
                            var mem = n.memory.total ? n.memory.used / n.memory.total : 0;
                            var disk = n.disk.total ? n.disk.used / n.disk.total : 0;
                            ring(card.querySelector('[data-ring="cpu"]'), cpu, n.online ? Math.round(n.cpu.capacity ? cpu * 100 : n.cpu.used) + '%' : '—');
                            ring(card.querySelector('[data-ring="memory"]'), mem, n.online ? Math.round(mem * 100) + '%' : '—');
                            ring(card.querySelector('[data-ring="disk"]'), disk, n.online ? Math.round(disk * 100) + '%' : '—');
                            card.querySelector('[data-field="foot"]').textContent = n.online
                                ? T.running.replace(':running', n.running).replace(':total', n.servers) +
                                  ' · ' + T.memory + ' ' + bytes(n.memory.used) + ' / ' + bytes(n.memory.total) +
                                  ' · ' + T.disk + ' ' + bytes(n.disk.used) + ' / ' + bytes(n.disk.total) +
                                  (n.cpu.threads ? ' · ' + T.threads.replace(':count', n.cpu.threads) : '')
                                : '';
                        });
                    })
                    .catch(function () {
                        document.querySelectorAll('[data-node-usage] [data-field="status"]').forEach(function (el) {
                            if (el.textContent.indexOf('●') === -1) {
                                el.className = 'label label-danger';
                                el.textContent = T.failed;
                            }
                        });
                    });
            }
            load();
            setInterval(load, 10000);
        })();
    </script>
@endsection

@section('content-header')
    <h1>{{ __('Administrative Overview') }}<small>{{ __('A quick glance at your system.') }}</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">{{ __('Admin') }}</a></li>
        <li class="active">{{ __('Index') }}</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="box
            @if($version->isLatestPanel())
                box-success
            @else
                box-danger
            @endif
        ">
            <div class="box-header with-border">
                <h3 class="box-title">{{ __('System Information') }}</h3>
            </div>
            <div class="box-body">
                @if ($version->isLatestPanel())
                    {{ __('You are running Pterodactyl Panel version') }} <code>{{ config('app.version') }}</code>{{ __('. Your panel is up-to-date!') }}
                @else
                    {{ __('Your panel is') }} <strong>{{ __('not up-to-date!') }}</strong> {{ __('The latest version is') }} <a href="https://github.com/Pterodactyl/Panel/releases/v{{ $version->getPanel() }}" target="_blank"><code>{{ $version->getPanel() }}</code></a> {{ __('and you are currently running version') }} <code>{{ config('app.version') }}</code>{{ __('. You can find instructions on how to update your panel') }} <a href="https://pterodactyl.io/panel/1.0/updating.html">here</a>.
                @endif
            </div>
        </div>
    </div>
</div>
<div class="row">
    @foreach ([
        ['label' => __('Servers'), 'value' => $counts['servers'], 'icon' => 'fa-server', 'color' => '#a5b4fc', 'route' => 'admin.servers'],
        ['label' => __('Nodes'), 'value' => $counts['nodes'], 'icon' => 'fa-sitemap', 'color' => '#67e8f9', 'route' => 'admin.nodes'],
        ['label' => __('Users'), 'value' => $counts['users'], 'icon' => 'fa-users', 'color' => '#c4b5fd', 'route' => 'admin.users'],
        ['label' => __('Eggs'), 'value' => $counts['eggs'], 'icon' => 'fa-th-large', 'color' => '#fcd34d', 'route' => 'admin.nests'],
    ] as $stat)
        <div class="col-xs-6 col-md-3">
            <a href="{{ route($stat['route']) }}" class="box glass-stat" style="display: block; text-decoration: none;">
                <i class="fa {{ $stat['icon'] }} glass-watermark" style="color: {{ $stat['color'] }}" aria-hidden="true"></i>
                <p>{{ $stat['label'] }}</p>
                <div class="value">{{ $stat['value'] }}</div>
            </a>
        </div>
    @endforeach
</div>
<div class="row">
    <div class="col-xs-12">
        <h3 style="margin: 6px 0 4px; font-size: 18px; font-weight: 700;">{{ __('Node Usage') }}</h3>
        <p class="text-muted small" style="margin-bottom: 14px;">{{ __('Combined usage of all servers on each node, refreshed every 10 seconds.') }}</p>
    </div>
    @foreach ($nodes as $node)
        <div class="col-xs-12 col-md-6 col-lg-4">
            <div class="box node-usage-card" data-node-usage="{{ $node->id }}">
                <i class="fa fa-server glass-watermark" style="color: #a5b4fc" aria-hidden="true"></i>
                <div class="node-usage-head">
                    <a href="{{ route('admin.nodes.view', $node->id) }}"><strong>{{ $node->name }}</strong></a>
                    <span class="label label-default" data-field="status">{{ __('Checking…') }}</span>
                </div>
                <div class="node-usage-rings">
                    @foreach (['cpu' => [__('CPU'), '#a78bfa'], 'memory' => [__('Memory'), '#60a5fa'], 'disk' => [__('Disk'), '#22d3ee']] as $key => [$label, $color])
                        <div>
                            <svg class="node-usage-ring" data-ring="{{ $key }}" data-color="{{ $color }}" width="78" height="78" viewBox="0 0 120 120" role="img" aria-label="{{ $label }}">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="12"></circle>
                                <circle class="value" cx="60" cy="60" r="50" fill="none" stroke="{{ $color }}" stroke-width="12" stroke-linecap="round" stroke-dasharray="0 314.2" transform="rotate(-90 60 60)" style="opacity: 0"></circle>
                                <text x="60" y="68" text-anchor="middle" fill="#e6e9f2" font-size="24" font-weight="600" font-family="Inter, sans-serif">—</text>
                            </svg>
                            <p>{{ $label }}</p>
                        </div>
                    @endforeach
                </div>
                <p class="node-usage-foot" data-field="foot">&nbsp;</p>
            </div>
        </div>
    @endforeach
</div>
<div class="row">
    <div class="col-xs-6 col-sm-3 text-center">
        <a href="{{ $version->getDiscord() }}"><button class="btn btn-warning" style="width:100%;"><i class="fa fa-fw fa-support"></i> {{ __('Get Help') }} <small>{{ __('(via Discord)') }}</small></button></a>
    </div>
    <div class="col-xs-6 col-sm-3 text-center">
        <a href="https://pterodactyl.io"><button class="btn btn-primary" style="width:100%;"><i class="fa fa-fw fa-link"></i> {{ __('Documentation') }}</button></a>
    </div>
    <div class="clearfix visible-xs-block">&nbsp;</div>
    <div class="col-xs-6 col-sm-3 text-center">
        <a href="https://github.com/pterodactyl/panel"><button class="btn btn-primary" style="width:100%;"><i class="fa fa-fw fa-support"></i> {{ __('GitHub') }}</button></a>
    </div>
    <div class="col-xs-6 col-sm-3 text-center">
        <a href="{{ $version->getDonations() }}"><button class="btn btn-success" style="width:100%;"><i class="fa fa-fw fa-money"></i> {{ __('Support the Project') }}</button></a>
    </div>
</div>
@endsection
