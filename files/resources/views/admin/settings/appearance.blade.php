@extends('layouts.admin')
@include('partials/admin.settings.nav', ['activeTab' => 'appearance'])

@section('title')
    {{ __('Appearance') }}
@endsection

@section('content-header')
    <h1>{{ __('Appearance') }}<small>{{ __('Colours, logo, login page and announcements.') }}</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">{{ __('Admin') }}</a></li>
        <li class="active">{{ __('Settings') }}</li>
    </ol>
@endsection

@section('content')
    @yield('settings::nav')
    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">{{ __('Logo') }}</h3>
                </div>
                <div class="box-body">
                    @php($currentLogo = \Pterodactyl\Extensions\Themes\Brand::logoUrl())
                    <div class="glass-logo-row">
                        <div class="glass-logo-preview">
                            @if($currentLogo)
                                <img src="{{ $currentLogo }}" alt="">
                            @else
                                <span class="glass-brand-mark" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0b1020" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18 12 5l8 13"/><path d="M8 13h8"/></svg></span>
                            @endif
                        </div>
                        <div class="glass-logo-actions">
                            <p class="text-muted small">{{ __('Shown in the navigation bar, on the login page, in the admin area, in emails and as the browser tab icon. Use a square PNG, JPG or WebP image of at least 128 × 128 pixels, up to 2 MB.') }}</p>
                            <form action="{{ route('admin.settings.branding') }}" method="POST" enctype="multipart/form-data" class="glass-logo-form">
                                {!! csrf_field() !!}
                                <input type="file" name="logo" accept="image/png,image/jpeg,image/webp" class="form-control" required>
                                <button type="submit" class="btn btn-sm btn-primary">{{ __('Upload') }}</button>
                            </form>
                            @if($currentLogo)
                                <form action="{{ route('admin.settings.branding.delete') }}" method="POST" style="margin-top: 10px;">
                                    {!! csrf_field() !!}
                                    <input type="hidden" name="_method" value="DELETE">
                                    <button type="submit" class="btn btn-sm btn-danger">{{ __('Restore default logo') }}</button>
                                </form>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <form action="{{ route('admin.settings.appearance') }}" method="POST">
        <div class="row">
            <div class="col-xs-12">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">{{ __('Theme Colour') }}</h3>
                    </div>
                    <div class="box-body">
                        <p class="text-muted small">{{ __('Used for buttons, links, highlights and the background glow in both the client area and the admin area.') }}</p>
                        <div class="glass-presets">
                            @foreach ($presets as $name => [$from, $to])
                                <button type="button" class="glass-preset @if(strtolower($theme['accent_a']) === $from && strtolower($theme['accent_b']) === $to) active @endif"
                                        data-from="{{ $from }}" data-to="{{ $to }}" title="{{ $from }} → {{ $to }}"
                                        style="background-image: linear-gradient(135deg, {{ $from }}, {{ $to }});">
                                    <span class="sr-only">{{ $name }}</span>
                                </button>
                            @endforeach
                        </div>
                        <div class="row" style="margin-top: 16px;">
                            <div class="form-group col-sm-4 col-md-3">
                                <label class="control-label">{{ __('Primary colour') }}</label>
                                <div class="glass-color">
                                    <input type="color" id="accentA" name="accent_a" value="{{ old('accent_a', $theme['accent_a']) }}">
                                    <code data-for="accentA">{{ old('accent_a', $theme['accent_a']) }}</code>
                                </div>
                            </div>
                            <div class="form-group col-sm-4 col-md-3">
                                <label class="control-label">{{ __('Secondary colour') }}</label>
                                <div class="glass-color">
                                    <input type="color" id="accentB" name="accent_b" value="{{ old('accent_b', $theme['accent_b']) }}">
                                    <code data-for="accentB">{{ old('accent_b', $theme['accent_b']) }}</code>
                                </div>
                            </div>
                            <div class="form-group col-sm-4 col-md-6">
                                <label class="control-label">{{ __('Preview') }}</label>
                                <div class="glass-accent-preview" id="accentPreview">
                                    <span class="glass-accent-button">{{ __('Button') }}</span>
                                    <span class="glass-accent-link">{{ __('Link') }}</span>
                                    <span class="glass-accent-ring"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">{{ __('Login Page & Footer') }}</h3>
                    </div>
                    <div class="box-body">
                        <div class="form-group">
                            <label class="control-label">{{ __('Login page subtitle') }} <span class="field-optional"></span></label>
                            <input type="text" class="form-control" name="login_subtitle" maxlength="60" value="{{ old('login_subtitle', $theme['login_subtitle']) }}" placeholder="{{ __('Server control panel') }}">
                            <p class="text-muted small">{{ __('The line under the panel name on the login page. Leave empty to use the default.') }}</p>
                        </div>
                        <div class="form-group">
                            <label class="control-label">{{ __('Footer text') }} <span class="field-optional"></span></label>
                            <input type="text" class="form-control" name="footer_text" maxlength="120" value="{{ old('footer_text', $theme['footer_text']) }}">
                            <p class="text-muted small">{{ __('Shown at the bottom of the login page and the client area, before the copyright line. Leave empty to hide.') }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">{{ __('Announcement') }}</h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-sm-6">
                                <label class="control-label">{{ __('Status') }}</label>
                                <div>
                                    <div class="btn-group" data-toggle="buttons">
                                        @php($announcementOn = old('announcement_enabled', $theme['announcement_enabled']) === '1')
                                        <label class="btn btn-primary @if(!$announcementOn) active @endif">
                                            <input type="radio" name="announcement_enabled" autocomplete="off" value="0" @if(!$announcementOn) checked @endif> {{ __('Hidden') }}
                                        </label>
                                        <label class="btn btn-primary @if($announcementOn) active @endif">
                                            <input type="radio" name="announcement_enabled" autocomplete="off" value="1" @if($announcementOn) checked @endif> {{ __('Shown') }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col-sm-6">
                                <label class="control-label">{{ __('Style') }}</label>
                                <select name="announcement_level" class="form-control">
                                    @foreach (['info' => __('Information'), 'success' => __('Good news'), 'warning' => __('Warning'), 'danger' => __('Urgent')] as $value => $label)
                                        <option value="{{ $value }}" @if(old('announcement_level', $theme['announcement_level']) === $value) selected @endif>{{ $label }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label">{{ __('Message') }}</label>
                            <textarea name="announcement_text" class="form-control" rows="3" maxlength="300" placeholder="{{ __('e.g. Maintenance tonight from 23:00 to 23:30.') }}">{{ old('announcement_text', $theme['announcement_text']) }}</textarea>
                            <p class="text-muted small">{{ __('Shown at the top of every page of the client area. Each user can dismiss it; a new message is shown to everyone again.') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">{{ __('Background Rotation') }}</h3>
                    </div>
                    <div class="box-body">
                        <div class="row">
                            <div class="form-group col-sm-6">
                                <label class="control-label">{{ __('When there are several backgrounds') }}</label>
                                <select name="background_mode" class="form-control">
                                    @foreach (['random' => __('Pick one at random for each visit'), 'slideshow' => __('Slideshow: change at a set interval')] as $value => $label)
                                        <option value="{{ $value }}" @if(old('background_mode', $theme['background_mode']) === $value) selected @endif>{{ $label }}</option>
                                    @endforeach
                                </select>
                                <p class="text-muted small">{{ __('Applies to both the page backgrounds and the login backgrounds uploaded below.') }}</p>
                            </div>
                            <div class="form-group col-sm-6">
                                <label class="control-label">{{ __('Slideshow interval (seconds)') }}</label>
                                <input type="number" name="background_interval" class="form-control" min="5" max="3600" value="{{ old('background_interval', $theme['background_interval']) }}">
                                <p class="text-muted small">{{ __('Between 5 and 3600 seconds. Images fade from one to the next.') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <div class="box">
                    <div class="box-footer" style="border-top: 0;">
                        {!! csrf_field() !!}
                        <button type="submit" name="_method" value="PATCH" class="btn btn-sm btn-primary pull-right">{{ __('Save') }}</button>
                        <button type="button" class="btn btn-sm btn-default" id="accentReset">{{ __('Reset colours') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    <div class="row">
        @foreach ([
            'page' => [__('Page Background'), __('Shown behind every page of the client area and the admin area. Without an image, the default glow in your theme colours is used.')],
            'login' => [__('Login Background'), __('Shown behind the login card. Without an image, the login page uses the page background.')],
        ] as $target => [$heading, $help])
            <div class="col-md-6">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">{{ $heading }}</h3>
                    </div>
                    <div class="box-body">
                        <p class="text-muted small">{{ $help }} {{ __('Use a landscape PNG, JPG or WebP image of at least 1600 × 900 pixels, up to 4 MB. It is darkened automatically so text stays readable.') }} {{ __('You can keep up to :max images; with more than one, they are shown at random or as a slideshow.', ['max' => \Pterodactyl\Extensions\Themes\ThemeSettings::MAX_BACKGROUNDS]) }}</p>
                        <div class="glass-bg-grid">
                            @forelse($backgrounds[$target] as $file => $url)
                                <div class="glass-bg-thumb" style="background-image: url('{{ $url }}');">
                                    <form action="{{ route('admin.settings.appearance.background') }}" method="POST">
                                        {!! csrf_field() !!}
                                        <input type="hidden" name="_method" value="DELETE">
                                        <input type="hidden" name="target" value="{{ $target }}">
                                        <input type="hidden" name="file" value="{{ $file }}">
                                        <button type="submit" title="{{ __('Remove') }}" aria-label="{{ __('Remove') }}"><i class="fa fa-times"></i></button>
                                    </form>
                                </div>
                            @empty
                                <div class="glass-bg-thumb is-default"><span>{{ __('Default') }}</span></div>
                            @endforelse
                        </div>
                        <form action="{{ route('admin.settings.appearance.background') }}" method="POST" enctype="multipart/form-data" class="glass-logo-form" style="margin-top: 14px;">
                            {!! csrf_field() !!}
                            <input type="hidden" name="target" value="{{ $target }}">
                            <input type="file" name="background[]" accept="image/png,image/jpeg,image/webp" class="form-control" multiple required>
                            <button type="submit" class="btn btn-sm btn-primary">{{ __('Upload') }}</button>
                        </form>
                        @if(count($backgrounds[$target]) > 1)
                            <form action="{{ route('admin.settings.appearance.background') }}" method="POST" style="margin-top: 10px;">
                                {!! csrf_field() !!}
                                <input type="hidden" name="_method" value="DELETE">
                                <input type="hidden" name="target" value="{{ $target }}">
                                <button type="submit" class="btn btn-sm btn-danger">{{ __('Remove all') }}</button>
                            </form>
                        @endif
                    </div>
                </div>
            </div>
        @endforeach
    </div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        (function () {
            var a = document.getElementById('accentA');
            var b = document.getElementById('accentB');
            var preview = document.getElementById('accentPreview');
            function sync() {
                preview.style.setProperty('--pa', a.value);
                preview.style.setProperty('--pb', b.value);
                document.querySelector('code[data-for="accentA"]').textContent = a.value;
                document.querySelector('code[data-for="accentB"]').textContent = b.value;
                document.querySelectorAll('.glass-preset').forEach(function (el) {
                    el.classList.toggle('active', el.dataset.from === a.value.toLowerCase() && el.dataset.to === b.value.toLowerCase());
                });
            }
            document.querySelectorAll('.glass-preset').forEach(function (el) {
                el.addEventListener('click', function () {
                    a.value = el.dataset.from;
                    b.value = el.dataset.to;
                    sync();
                });
            });
            document.getElementById('accentReset').addEventListener('click', function () {
                a.value = '#6366f1';
                b.value = '#0ea5e9';
                sync();
            });
            a.addEventListener('input', sync);
            b.addEventListener('input', sync);
            sync();
        })();
    </script>
@endsection
