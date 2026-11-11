@extends('layouts.admin')

@section('title')
    Nests &rarr; Egg: {{ $egg->name }}
@endsection

@section('content-header')
    <h1>{{ $egg->name }}<small>{{ str_limit($egg->description, 50) }}</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">{{ __('Admin') }}</a></li>
        <li><a href="{{ route('admin.nests') }}">{{ __('Nests') }}</a></li>
        <li><a href="{{ route('admin.nests.view', $egg->nest->id) }}">{{ $egg->nest->name }}</a></li>
        <li class="active">{{ $egg->name }}</li>
    </ol>
@endsection

@section('content')
<div class="row">
    <div class="col-xs-12">
        <div class="nav-tabs-custom nav-tabs-floating">
            <ul class="nav nav-tabs">
                <li class="active"><a href="{{ route('admin.nests.egg.view', $egg->id) }}">{{ __('Configuration') }}</a></li>
                <li><a href="{{ route('admin.nests.egg.variables', $egg->id) }}">{{ __('Variables') }}</a></li>
                <li><a href="{{ route('admin.nests.egg.scripts', $egg->id) }}">{{ __('Install Script') }}</a></li>
            </ul>
        </div>
    </div>
</div>
<form action="{{ route('admin.nests.egg.view', $egg->id) }}" enctype="multipart/form-data" method="POST">
    <div class="row">
        <div class="col-xs-12">
            <div class="box box-danger">
                <div class="box-body">
                    <div class="row">
                        <div class="col-xs-8">
                            <div class="form-group no-margin-bottom">
                                <label for="pName" class="control-label">{{ __('Egg File') }}</label>
                                <div>
                                    <input type="file" name="import_file" class="form-control" style="border: 0;margin-left:-10px;" />
                                    <p class="text-muted small no-margin-bottom">{{ __('If you would like to replace settings for this Egg by uploading a new JSON file, simply select it here and press "Update Egg". This will not change any existing startup strings or Docker images for existing servers.') }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-4">
                            {!! csrf_field() !!}
                            <button type="submit" name="_method" value="PUT" class="btn btn-sm btn-danger pull-right">{{ __('Update Egg') }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
@php($eggIcon = \Pterodactyl\Extensions\Themes\EggIcons::get($egg->id))
<form action="{{ route('admin.nests.egg.icon', $egg->id) }}" method="POST" id="eggIconForm">
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">{{ __('Server Icon') }}</h3>
                </div>
                <div class="box-body">
                    <div class="glass-logo-row">
                        <div class="glass-logo-preview glass-egg-preview" id="eggIconPreview" style="@if($eggIcon && $eggIcon['color'])color: {{ $eggIcon['color'] }};@endif">
                            @if($eggIcon)
                                <span class="egg-glyph {{ $eggIcon['style'] }}">{{ $eggIcon['glyph'] }}</span>
                            @else
                                <span class="glass-egg-auto">{{ __('Auto') }}</span>
                            @endif
                        </div>
                        <div class="glass-logo-actions">
                            <p class="text-muted small">{!! __('Shown on the server list for every server that uses this egg. Type the name of an icon from :link, for example :example, or paste the code copied from that site. Leave empty to let the panel pick an icon automatically.', ['link' => '<a href="https://fontawesome.com/search?o=r&m=free" target="_blank" rel="noopener">Font Awesome Free</a>', 'example' => '<code>cube</code>']) !!}</p>
                            <div class="glass-egg-form">
                                <input type="text" class="form-control" name="icon" id="eggIconInput" maxlength="120" autocomplete="off" spellcheck="false"
                                       value="{{ old('icon', $eggIcon ? ($eggIcon['style'] === 'b' ? 'fa-brands fa-' : ($eggIcon['style'] === 'r' ? 'fa-regular fa-' : '')) . $eggIcon['name'] : '') }}" placeholder="cube">
                                <label class="glass-egg-color">
                                    <input type="hidden" name="icon_color_enabled" value="0">
                                    <input type="checkbox" name="icon_color_enabled" id="eggIconColorOn" value="1" @if($eggIcon && $eggIcon['color']) checked @endif>
                                    {{ __('Custom colour') }}
                                    <input type="color" name="icon_color" id="eggIconColor" value="{{ old('icon_color', $eggIcon['color'] ?? '#6ee7b7') }}">
                                </label>
                                {!! csrf_field() !!}
                                <button type="submit" class="btn btn-sm btn-primary">{{ __('Save') }}</button>
                            </div>
                            <p class="glass-egg-status small" id="eggIconStatus" aria-live="polite"></p>
                            <div class="glass-egg-picks">
                                @foreach (['cube', 'gamepad', 'dragon', 'ghost', 'rocket', 'robot', 'microchip', 'brain', 'database', 'globe', 'code', 'terminal', 'music', 'fa-brands fa-discord', 'fa-brands fa-python', 'fa-brands fa-java', 'fa-brands fa-node-js', 'fa-brands fa-steam'] as $pick)
                                    @php($pickIcon = \Pterodactyl\Extensions\Themes\EggIcons::parse($pick))
                                    @if($pickIcon)
                                        <button type="button" class="glass-egg-pick" data-icon="{{ $pick }}" title="{{ $pickIcon['name'] }}"><span class="egg-glyph {{ $pickIcon['style'] }}">{{ $pickIcon['glyph'] }}</span></button>
                                    @endif
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
<form action="{{ route('admin.nests.egg.view', $egg->id) }}" method="POST">
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">{{ __('Configuration') }}</h3>
                </div>
                <div class="box-body">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="pName" class="control-label">{{ __('Name') }} <span class="field-required"></span></label>
                                <input type="text" id="pName" name="name" value="{{ $egg->name }}" class="form-control" />
                                <p class="text-muted small">{{ __('A simple, human-readable name to use as an identifier for this Egg.') }}</p>
                            </div>
                            <div class="form-group">
                                <label for="pUuid" class="control-label">{{ __('UUID') }}</label>
                                <input type="text" id="pUuid" readonly value="{{ $egg->uuid }}" class="form-control" />
                                <p class="text-muted small">{{ __('This is the globally unique identifier for this Egg which the Daemon uses as an identifier.') }}</p>
                            </div>
                            <div class="form-group">
                                <label for="pAuthor" class="control-label">{{ __('Author') }}</label>
                                <input type="text" id="pAuthor" readonly value="{{ $egg->author }}" class="form-control" />
                                <p class="text-muted small">{{ __('The author of this version of the Egg. Uploading a new Egg configuration from a different author will change this.') }}</p>
                            </div>
                            <div class="form-group">
                                <label for="pDockerImage" class="control-label">{{ __('Docker Images') }} <span class="field-required"></span></label>
                                <textarea id="pDockerImages" name="docker_images" class="form-control" rows="4">{{ implode(PHP_EOL, $images) }}</textarea>
                                <p class="text-muted small">
                                    {{ __('The docker images available to servers using this egg. Enter one per line. Users') }}
                                    {{ __('will be able to select from this list of images if more than one value is provided.') }}
                                    {{ __('Optionally, a display name may be provided by prefixing the image with the name') }}
                                    {{ __('followed by a pipe character, and then the image URL. Example:') }} <code>Display Name|ghcr.io/my/egg</code>
                                </p>
                            </div>
                            <div class="form-group">
                                <div class="checkbox checkbox-primary no-margin-bottom">
                                    <input id="pForceOutgoingIp" name="force_outgoing_ip" type="checkbox" value="1" @if($egg->force_outgoing_ip) checked @endif />
                                    <label for="pForceOutgoingIp" class="strong">{{ __('Force Outgoing IP') }}</label>
                                    <p class="text-muted small">
                                        {{ __('Forces all outgoing network traffic to have its Source IP NATed to the IP of the server\'s primary allocation IP.') }}
                                        {{ __('Required for certain games to work properly when the Node has multiple public IP addresses.') }}
                                        <br>
                                        <strong>
                                            {{ __('Enabling this option will disable internal networking for any servers using this egg,') }}
                                            {{ __('causing them to be unable to internally access other servers on the same node.') }}
                                        </strong>
                                    </p>
                                </div>
                            </div>

                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="pDescription" class="control-label">{{ __('Description') }}</label>
                                <textarea id="pDescription" name="description" class="form-control" rows="8">{{ $egg->description }}</textarea>
                                <p class="text-muted small">{{ __('A description of this Egg that will be displayed throughout the Panel as needed.') }}</p>
                            </div>
                            <div class="form-group">
                                <label for="pStartup" class="control-label">{{ __('Startup Command') }} <span class="field-required"></span></label>
                                <textarea id="pStartup" name="startup" class="form-control" rows="8">{{ $egg->startup }}</textarea>
                                <p class="text-muted small">{{ __('The default startup command that should be used for new servers using this Egg.') }}</p>
                            </div>
                            <div class="form-group">
                                <label for="pConfigFeatures" class="control-label">{{ __('Features') }}</label>
                                <div>
                                    <select class="form-control" name="features[]" id="pConfigFeatures" multiple>
                                        @foreach(($egg->features ?? []) as $feature)
                                            <option value="{{ $feature }}" selected>{{ $feature }}</option>
                                        @endforeach
                                    </select>
                                    <p class="text-muted small">{{ __('Additional features belonging to the egg. Useful for configuring additional panel modifications.') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">{{ __('Process Management') }}</h3>
                </div>
                <div class="box-body">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="alert alert-warning">
                                <p>{{ __('The following configuration options should not be edited unless you understand how this system works. If wrongly modified it is possible for the daemon to break.') }}</p>
                                <p>{{ __('All fields are required unless you select a separate option from the \'Copy Settings From\' dropdown, in which case fields may be left blank to use the values from that Egg.') }}</p>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="pConfigFrom" class="form-label">{{ __('Copy Settings From') }}</label>
                                <select name="config_from" id="pConfigFrom" class="form-control">
                                    <option value="">{{ __('None') }}</option>
                                    @foreach($egg->nest->eggs as $o)
                                        <option value="{{ $o->id }}" {{ ($egg->config_from !== $o->id) ?: 'selected' }}>{{ $o->name }} &lt;{{ $o->author }}&gt;</option>
                                    @endforeach
                                </select>
                                <p class="text-muted small">{{ __('If you would like to default to settings from another Egg select it from the menu above.') }}</p>
                            </div>
                            <div class="form-group">
                                <label for="pConfigStop" class="form-label">{{ __('Stop Command') }}</label>
                                <input type="text" id="pConfigStop" name="config_stop" class="form-control" value="{{ $egg->config_stop }}" />
                                <p class="text-muted small">{{ __('The command that should be sent to server processes to stop them gracefully. If you need to send a') }} <code>SIGINT</code> {{ __('you should enter') }} <code>^C</code> here.</p>
                            </div>
                            <div class="form-group">
                                <label for="pConfigLogs" class="form-label">{{ __('Log Configuration') }}</label>
                                <textarea data-action="handle-tabs" id="pConfigLogs" name="config_logs" class="form-control" rows="6">{{ ! is_null($egg->config_logs) ? json_encode(json_decode($egg->config_logs), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) : '' }}</textarea>
                                <p class="text-muted small">{{ __('This should be a JSON representation of where log files are stored, and whether or not the daemon should be creating custom logs.') }}</p>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="pConfigFiles" class="form-label">{{ __('Configuration Files') }}</label>
                                <textarea data-action="handle-tabs" id="pConfigFiles" name="config_files" class="form-control" rows="6">{{ ! is_null($egg->config_files) ? json_encode(json_decode($egg->config_files), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) : '' }}</textarea>
                                <p class="text-muted small">{{ __('This should be a JSON representation of configuration files to modify and what parts should be changed.') }}</p>
                            </div>
                            <div class="form-group">
                                <label for="pConfigStartup" class="form-label">{{ __('Start Configuration') }}</label>
                                <textarea data-action="handle-tabs" id="pConfigStartup" name="config_startup" class="form-control" rows="6">{{ ! is_null($egg->config_startup) ? json_encode(json_decode($egg->config_startup), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) : '' }}</textarea>
                                <p class="text-muted small">{{ __('This should be a JSON representation of what values the daemon should be looking for when booting a server to determine completion.') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-footer">
                    {!! csrf_field() !!}
                    <button type="submit" name="_method" value="PATCH" class="btn btn-primary btn-sm pull-right">{{ __('Save') }}</button>
                    <a href="{{ route('admin.nests.egg.export', $egg->id) }}" class="btn btn-sm btn-info pull-right" style="margin-right:10px;">{{ __('Export') }}</a>
                    <button id="deleteButton" type="submit" name="_method" value="DELETE" class="btn btn-danger btn-sm muted muted-hover">
                        <i class="fa fa-trash-o"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</form>
@endsection

@section('footer-scripts')
    @parent
    <script>
    $('#pConfigFrom').select2();
    $('#deleteButton').on('mouseenter', function (event) {
        $(this).find('i').html(' Delete Egg');
    }).on('mouseleave', function (event) {
        $(this).find('i').html('');
    });
    $('textarea[data-action="handle-tabs"]').on('keydown', function(event) {
        if (event.keyCode === 9) {
            event.preventDefault();

            var curPos = $(this)[0].selectionStart;
            var prepend = $(this).val().substr(0, curPos);
            var append = $(this).val().substr(curPos);

            $(this).val(prepend + '    ' + append);
        }
    });
    $('#pConfigFeatures').select2({
        tags: true,
        selectOnClose: false,
        tokenSeparators: [',', ' '],
    });
    </script>
    <script>
        // Live preview for the server icon: asks the panel which Font Awesome icon the text names.
        (function () {
            var input = document.getElementById('eggIconInput');
            if (!input) return;
            var preview = document.getElementById('eggIconPreview');
            var status = document.getElementById('eggIconStatus');
            var colorOn = document.getElementById('eggIconColorOn');
            var color = document.getElementById('eggIconColor');
            var T = { auto: @json(__('Auto')), unknown: @json(__('No free icon with that name.')), found: @json(__('Icon: :name')) };
            var timer, request = 0;
            function paintColor() { preview.style.color = colorOn.checked ? color.value : ''; }
            function show(icon) {
                preview.textContent = '';
                var el = document.createElement('span');
                if (icon) { el.className = 'egg-glyph ' + icon.style; el.textContent = icon.glyph; }
                else { el.className = 'glass-egg-auto'; el.textContent = T.auto; }
                preview.appendChild(el);
            }
            function lookup() {
                var value = input.value.trim();
                if (!value) { show(null); status.textContent = ''; status.className = 'glass-egg-status small'; return; }
                var mine = ++request;
                fetch(@json(route('admin.nests.egg.icon.preview', [], false)) + '?icon=' + encodeURIComponent(value), { credentials: 'same-origin', headers: { Accept: 'application/json' } })
                    .then(function (r) { return r.json(); })
                    .then(function (json) {
                        if (mine !== request) return;
                        show(json.icon);
                        status.textContent = json.icon ? T.found.replace(':name', json.icon.name) : T.unknown;
                        status.className = 'glass-egg-status small ' + (json.icon ? 'ok' : 'bad');
                    })
                    .catch(function () {});
            }
            input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(lookup, 250); });
            colorOn.addEventListener('change', paintColor);
            color.addEventListener('input', function () { colorOn.checked = true; paintColor(); });
            document.querySelectorAll('.glass-egg-pick').forEach(function (el) {
                el.addEventListener('click', function () { input.value = el.dataset.icon; lookup(); });
            });
            paintColor();
        })();
    </script>
@endsection
