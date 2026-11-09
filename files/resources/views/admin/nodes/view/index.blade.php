@extends('layouts.admin')

@section('title')
    {{ $node->name }}
@endsection

@section('content-header')
    <h1>{{ $node->name }}<small>{{ __('A quick overview of your node.') }}</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">{{ __('Admin') }}</a></li>
        <li><a href="{{ route('admin.nodes') }}">{{ __('Nodes') }}</a></li>
        <li class="active">{{ $node->name }}</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="nav-tabs-custom nav-tabs-floating">
            <ul class="nav nav-tabs">
                <li class="active"><a href="{{ route('admin.nodes.view', $node->id) }}">{{ __('About') }}</a></li>
                <li><a href="{{ route('admin.nodes.view.settings', $node->id) }}">{{ __('Settings') }}</a></li>
                <li><a href="{{ route('admin.nodes.view.configuration', $node->id) }}">{{ __('Configuration') }}</a></li>
                <li><a href="{{ route('admin.nodes.view.allocation', $node->id) }}">{{ __('Allocation') }}</a></li>
                <li><a href="{{ route('admin.nodes.view.servers', $node->id) }}">{{ __('Servers') }}</a></li>
            </ul>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-sm-8">
        <div class="row">
            <div class="col-xs-12">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">{{ __('Information') }}</h3>
                    </div>
                    <div class="box-body table-responsive no-padding">
                        <table class="table table-hover">
                            <tr>
                                <td>{{ __('Daemon Version') }}</td>
                                <td><code data-attr="info-version"><i class="fa fa-refresh fa-fw fa-spin"></i></code> {{ __('(Latest:') }} <code>{{ $version->getDaemon() }}</code>)</td>
                            </tr>
                            <tr>
                                <td>{{ __('System Information') }}</td>
                                <td data-attr="info-system"><i class="fa fa-refresh fa-fw fa-spin"></i></td>
                            </tr>
                            <tr>
                                <td>{{ __('Total CPU Threads') }}</td>
                                <td data-attr="info-cpus"><i class="fa fa-refresh fa-fw fa-spin"></i></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            @if ($node->description)
                <div class="col-xs-12">
                    <div class="box box-default">
                        <div class="box-header with-border">
                            {{ __('Description') }}
                        </div>
                        <div class="box-body table-responsive">
                            <pre>{{ $node->description }}</pre>
                        </div>
                    </div>
                </div>
            @endif
            <div class="col-xs-12">
                <div class="box box-danger">
                    <div class="box-header with-border">
                        <h3 class="box-title">{{ __('Delete Node') }}</h3>
                    </div>
                    <div class="box-body">
                        <p class="no-margin">{{ __('Deleting a node is a irreversible action and will immediately remove this node from the panel. There must be no servers associated with this node in order to continue.') }}</p>
                    </div>
                    <div class="box-footer">
                        <form action="{{ route('admin.nodes.view.delete', $node->id) }}" method="POST">
                            {!! csrf_field() !!}
                            {!! method_field('DELETE') !!}
                            <button type="submit" class="btn btn-danger btn-sm pull-right" {{ ($node->servers_count < 1) ?: 'disabled' }}>{{ __('Yes, Delete This Node') }}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-sm-4">
        <div class="box box-primary">
            <div class="box-header with-border">
                <h3 class="box-title">{{ __('At-a-Glance') }}</h3>
            </div>
            <div class="box-body" style="padding: 4px 0 0;">
                @if($node->maintenance_mode)
                    <div class="alert alert-warning" style="margin: 14px 20px 4px;">
                        <i class="fa fa-wrench"></i> {{ __('This node is under') }} <strong>{{ __('Maintenance') }}</strong>
                    </div>
                @endif
                @foreach ([
                    'disk' => [__('Disk Space Allocated'), '#22d3ee', 'fa-hdd-o'],
                    'memory' => [__('Memory Allocated'), '#60a5fa', 'fa-microchip'],
                ] as $key => [$label, $color, $icon])
                    @php
                        $pct = (float) $stats[$key]['percent'];
                        $f = max(0, min(1, $pct / 100));
                        $ringColor = $f >= 0.9 ? '#f87171' : ($f >= 0.8 ? '#fbbf24' : $color);
                        $c = 2 * M_PI * 50;
                    @endphp
                    <div class="node-alloc">
                        <i class="fa {{ $icon }} glass-watermark" style="color: {{ $color }}" aria-hidden="true"></i>
                        <div class="ring">
                            <svg width="92" height="92" viewBox="0 0 120 120" role="img" aria-label="{{ $label }}">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="12"></circle>
                                @if($f > 0)
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="{{ $ringColor }}" stroke-width="12" stroke-linecap="round" stroke-dasharray="{{ max($f * $c, 1) }} {{ $c }}"></circle>
                                @endif
                            </svg>
                            <span>{{ round($pct) }}%</span>
                        </div>
                        <div class="meta">
                            <p>{{ $label }}</p>
                            <strong>{{ $stats[$key]['value'] }} {{ __('MiB') }}</strong>
                            <p>{{ __('of :max MiB', ['max' => $stats[$key]['max']]) }}</p>
                        </div>
                    </div>
                @endforeach
                <a href="{{ route('admin.nodes.view.servers', $node->id) }}" class="glass-stat" style="display: block; text-decoration: none; position: relative; overflow: hidden; border-top: 1px solid rgba(255,255,255,.06);">
                    <i class="fa fa-server glass-watermark" style="color: #c4b5fd" aria-hidden="true"></i>
                    <p>{{ __('Total Servers') }}</p>
                    <div class="value">{{ $node->servers_count }}</div>
                </a>
            </div>
        </div>
    </div>
</div>
@endsection

@section('footer-scripts')
    @parent
    <script>
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    (function getInformation() {
        $.ajax({
            method: 'GET',
            url: '/admin/nodes/view/{{ $node->id }}/system-information',
            timeout: 5000,
        }).done(function (data) {
            $('[data-attr="info-version"]').html(escapeHtml(data.version));
            $('[data-attr="info-system"]').html(escapeHtml(data.system.type) + ' (' + escapeHtml(data.system.arch) + ') <code>' + escapeHtml(data.system.release) + '</code>');
            $('[data-attr="info-cpus"]').html(data.system.cpus);
        }).fail(function (jqXHR) {

        }).always(function() {
            setTimeout(getInformation, 10000);
        });
    })();
    </script>
@endsection
