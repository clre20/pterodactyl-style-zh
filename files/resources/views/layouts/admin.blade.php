<!DOCTYPE html>
<html lang="{{ app()->getLocale() === 'zh' ? 'zh-Hant' : 'en' }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>{{ config('app.name', 'Pterodactyl') }} - @yield('title')</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta name="_token" content="{{ csrf_token() }}">

        @include('partials.favicons')
        <meta name="theme-color" content="#070b14">

        @include('layouts.scripts')

        @section('scripts')
            {!! Theme::css('vendor/select2/select2.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/bootstrap/bootstrap.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/admin.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/colors/skin-blue.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/sweetalert/sweetalert.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/animate/animate.min.css?t={cache-version}') !!}
            {!! Theme::css('css/pterodactyl.css?t={cache-version}') !!}
            <link media="all" type="text/css" rel="stylesheet" href="{{ \Pterodactyl\Extensions\Themes\Brand::asset('css/glass.css') }}"/>
            <style id="theme-vars">{!! \Pterodactyl\Extensions\Themes\ThemeSettings::cssVariables() !!}</style>
            @include('partials.glass-background')
            <script>
                // Coming from another admin page: skip the sidebar's entrance animation.
                try {
                    if (sessionStorage.getItem('glass:admin')) document.documentElement.classList.add('glass-returning');
                    sessionStorage.setItem('glass:admin', '1');
                } catch (e) {}
            </script>
            <link rel="stylesheet" href="{{ \Pterodactyl\Extensions\Themes\Brand::asset('css/fonts.css') }}">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">

            <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
            <![endif]-->
        @show
    </head>
    <body class="hold-transition skin-blue fixed sidebar-mini">
        <div class="wrapper">
            <header class="main-header">
                <a href="{{ route('index') }}" class="logo">
                    <span class="glass-brand">
                        @if($brandLogo = \Pterodactyl\Extensions\Themes\Brand::logoUrl())
                            <img class="glass-brand-logo" src="{{ $brandLogo }}" alt="" aria-hidden="true">
                        @else
                            <span class="glass-brand-mark" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b1020" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18 12 5l8 13"/><path d="M8 13h8"/></svg></span>
                        @endif
                        <span>{{ config('app.name', 'Pterodactyl') }}</span>
                    </span>
                </a>
                <nav class="navbar navbar-static-top">
                    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span class="sr-only">{{ __('Toggle navigation') }}</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <div class="navbar-custom-menu">
                        <ul class="nav navbar-nav">
                            <li>
                                <form method="POST" action="{{ route('admin.language') }}" class="glass-lang" aria-label="{{ __('Language') }}">
                                    {!! csrf_field() !!}
                                    @foreach (['zh' => '繁體中文', 'en' => 'English'] as $code => $label)
                                        <button type="submit" name="language" value="{{ $code }}" class="btn-link {{ app()->getLocale() === $code ? 'active' : '' }}" aria-pressed="{{ app()->getLocale() === $code ? 'true' : 'false' }}">{{ $label }}</button>
                                    @endforeach
                                </form>
                            </li>
                            <li class="user-menu">
                                <a href="{{ route('account') }}">
                                    <img src="https://www.gravatar.com/avatar/{{ md5(strtolower(Auth::user()->email)) }}?s=160" class="user-image" alt="{{ __('User Image') }}">
                                    <span class="hidden-xs">{{ Auth::user()->name_first }} {{ Auth::user()->name_last }}</span>
                                </a>
                            </li>
                            <li>
                                <li><a href="{{ route('index') }}" data-toggle="tooltip" data-placement="bottom" title="{{ __('Exit Admin Control') }}"><i class="fa fa-server"></i></a></li>
                            </li>
                            <li>
                                <li><a href="{{ route('auth.logout') }}" id="logoutButton" data-toggle="tooltip" data-placement="bottom" title="{{ __('Logout') }}"><i class="fa fa-sign-out"></i></a></li>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
            <aside class="main-sidebar">
                <section class="sidebar">
                    <ul class="sidebar-menu">
                        <li class="header">{{ __('BASIC ADMINISTRATION') }}</li>
                        <li class="{{ Route::currentRouteName() !== 'admin.index' ?: 'active' }}">
                            <a href="{{ route('admin.index') }}">
                                <i class="fa fa-home"></i> <span>{{ __('Overview') }}</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.settings') ?: 'active' }}">
                            <a href="{{ route('admin.settings')}}">
                                <i class="fa fa-wrench"></i> <span>{{ __('Settings') }}</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.api') ?: 'active' }}">
                            <a href="{{ route('admin.api.index')}}">
                                <i class="fa fa-gamepad"></i> <span>{{ __('Application API') }}</span>
                            </a>
                        </li>
                        <li class="header">{{ __('MANAGEMENT') }}</li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.databases') ?: 'active' }}">
                            <a href="{{ route('admin.databases') }}">
                                <i class="fa fa-database"></i> <span>{{ __('Databases') }}</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.locations') ?: 'active' }}">
                            <a href="{{ route('admin.locations') }}">
                                <i class="fa fa-globe"></i> <span>{{ __('Locations') }}</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nodes') ?: 'active' }}">
                            <a href="{{ route('admin.nodes') }}">
                                <i class="fa fa-sitemap"></i> <span>{{ __('Nodes') }}</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.servers') ?: 'active' }}">
                            <a href="{{ route('admin.servers') }}">
                                <i class="fa fa-server"></i> <span>{{ __('Servers') }}</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.users') ?: 'active' }}">
                            <a href="{{ route('admin.users') }}">
                                <i class="fa fa-users"></i> <span>{{ __('Users') }}</span>
                            </a>
                        </li>
                        <li class="header">{{ __('SERVICE MANAGEMENT') }}</li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.mounts') ?: 'active' }}">
                            <a href="{{ route('admin.mounts') }}">
                                <i class="fa fa-magic"></i> <span>{{ __('Mounts') }}</span>
                            </a>
                        </li>
                        <li class="{{ ! starts_with(Route::currentRouteName(), 'admin.nests') ?: 'active' }}">
                            <a href="{{ route('admin.nests') }}">
                                <i class="fa fa-th-large"></i> <span>{{ __('Nests') }}</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </aside>
            <div class="content-wrapper">
                <section class="content-header">
                    @yield('content-header')
                </section>
                <section class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            @if (count($errors) > 0)
                                <div class="alert alert-danger">
                                    {{ __('There was an error validating the data provided.') }}<br><br>
                                    <ul>
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                            @endif
                            @foreach (Alert::getMessages() as $type => $messages)
                                @foreach ($messages as $message)
                                    <div class="alert alert-{{ $type }} alert-dismissable" role="alert">
                                        {{ $message }}
                                    </div>
                                @endforeach
                            @endforeach
                        </div>
                    </div>
                    @yield('content')
                </section>
            </div>
            <footer class="main-footer">
                <div class="pull-right small text-gray" style="margin-right:10px;margin-top:-7px;">
                    <strong><i class="fa fa-fw {{ $appIsGit ? 'fa-git-square' : 'fa-code-fork' }}"></i></strong> {{ $appVersion }}<br />
                    <strong><i class="fa fa-fw fa-clock-o"></i></strong> {{ round(microtime(true) - LARAVEL_START, 3) }}s
                </div>
                Copyright &copy; 2015 - {{ date('Y') }} <a href="https://pterodactyl.io/">{{ __('Pterodactyl Software') }}</a>
                <span class="glass-credit"><span class="glass-credit-dot">&middot; </span>{{ __('Theme by') }} <a href="https://github.com/clre20/pterodactyl-style-zh" target="_blank" rel="noopener">clre20</a></span>
            </footer>
        </div>
        @section('footer-scripts')
            <script src="/js/keyboard.polyfill.js" type="application/javascript"></script>
            <script>keyboardeventKeyPolyfill.polyfill();</script>

            {!! Theme::js('vendor/jquery/jquery.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/sweetalert/sweetalert.min.js?t={cache-version}') !!}
            @php
                $glassSwalStrings = [
                    'Cancel', 'OK', 'Delete', 'Revoke', 'Test', 'Log out', 'Whoops!', 'Error', 'Success',
                    'Do you want to log out?',
                    'Revoke API Key',
                    'Once this API key is revoked any applications currently using it will stop working.',
                    'API Key has been revoked.',
                    'An error occurred while attempting to revoke this key.',
                    'Egg detached.', 'Node detached.',
                    'Are you sure you want to delete this allocation?',
                    'Port Deleted!',
                    'Allocations Deleted',
                    'An error occurred while attempting to delete these allocations. Please try again.',
                    'Please select allocation(s) to delete.',
                    'Token created.',
                    'Something went wrong creating your token.',
                    'Are you sure that you want to delete this database? There is no going back, all data will immediately be removed.',
                    'An error occurred while processing this request.',
                    'The password for this database has been reset.',
                    'Are you sure that you want to delete this server? There is no going back, all data will immediately be removed.',
                    'Test Mail Settings',
                    'Click "Test" to begin the test.',
                    'The test message was sent successfully.',
                    'Mail settings have been updated successfully and the queue worker was restarted to apply these changes.',
                    'EULA Acceptance',
                    'I Accept',
                    'I do not Accept',
                    'The EULA for this server has been accepted, restarting server now.',
                    'Startup Command Variable:', 'Input Rules:', 'Access in Startup:', 'Validation Rules:', 'Required',
                    'Select Additional Allocations', 'Select a Node', 'Select a Nest', 'Select a Nest Egg', 'Select a Service Pack', 'Select a Default Allocation',
                ];
                $glassSwal = [];
                foreach ($glassSwalStrings as $glassString) {
                    $glassSwal[$glassString] = __($glassString);
                }
                $glassSwalPatterns = [
                    ['^Are you sure you want to delete the following allocations: (.*)\\?$', __('Are you sure you want to delete the following allocations: :items?', ['items' => '$1'])],
                    ['^An error occurred while attempting to (\\w+) mail settings: ', __('An error occurred while processing the mail settings: ')],
                    ['^To auto-configure your node run the following command:', __('To auto-configure your node run the following command:')],
                    ['By pressing \'I Accept\' below you are indicating your agreement to the ', __('By pressing \'I Accept\' below you are indicating your agreement to the ')],
                    ['^An error occurred while attempting to set the EULA as accepted: ', __('An error occurred while attempting to set the EULA as accepted: ')],
                ];
            @endphp
            <script>
                // Translate and restyle every SweetAlert dialog in the admin area without
                // editing each page: the English text is looked up in the panel's language.
                (function () {
                    var dict = @json($glassSwal);
                    // Translator for strings written in the admin theme's JavaScript files.
                    window.__t = function (text) {
                        return Object.prototype.hasOwnProperty.call(dict, text) ? dict[text] : text;
                    };
                    var original = window.swal;
                    if (!original) return;
                    var patterns = @json($glassSwalPatterns).map(function (p) { return [new RegExp(p[0]), p[1]]; });
                    function t(value) {
                        if (typeof value !== 'string' || value === '') return value;
                        if (Object.prototype.hasOwnProperty.call(dict, value)) return dict[value];
                        for (var i = 0; i < patterns.length; i++) {
                            if (patterns[i][0].test(value)) return value.replace(patterns[i][0], patterns[i][1]);
                        }
                        return value;
                    }
                    var wrapped = function (options) {
                        var args = Array.prototype.slice.call(arguments);
                        if (options && typeof options === 'object') {
                            var o = $.extend({}, options);
                            ['title', 'text', 'confirmButtonText', 'cancelButtonText'].forEach(function (k) { o[k] = t(o[k]); });
                            o.confirmButtonText = o.confirmButtonText || dict.OK;
                            o.cancelButtonText = o.cancelButtonText || dict.Cancel;
                            var danger = /^#(d9534f|d33|dd3333|d73925)$/i.test(o.confirmButtonColor || '') || o.type === 'error';
                            o.customClass = ((o.customClass || '') + (danger ? ' glass-danger' : '')).trim();
                            delete o.confirmButtonColor;
                            delete o.cancelButtonColor;
                            args[0] = o;
                        } else {
                            args = args.map(t);
                        }
                        return original.apply(this, args);
                    };
                    for (var key in original) {
                        if (Object.prototype.hasOwnProperty.call(original, key)) wrapped[key] = original[key];
                    }
                    window.swal = wrapped;
                })();
            </script>
            {!! Theme::js('vendor/bootstrap/bootstrap.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/slimscroll/jquery.slimscroll.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/adminlte/app.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap-notify/bootstrap-notify.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/select2/select2.full.min.js?t={cache-version}') !!}
            {!! Theme::js('js/admin/functions.js?t={cache-version}') !!}
            <script src="/js/autocomplete.js" type="application/javascript"></script>

            @if(Auth::user()->root_admin)
                <script>
                    $('#logoutButton').on('click', function (event) {
                        event.preventDefault();

                        var that = this;
                        swal({
                            title: 'Do you want to log out?',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d9534f',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Log out'
                        }, function () {
                             $.ajax({
                                type: 'POST',
                                url: '{{ route('auth.logout') }}',
                                data: {
                                    _token: '{{ csrf_token() }}'
                                },complete: function () {
                                    window.location.href = '{{route('auth.login')}}';
                                }
                        });
                    });
                });
                </script>
            @endif

            <script>
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                    // Glass boxes use backdrop blur, which traps fixed children. Move modals to <body>
                    // so they sit above the backdrop instead of inside a box.
                    $('.modal').appendTo('body');

                    // Header shadow once the page is scrolled.
                    var onScroll = function () { document.body.classList.toggle('glass-scrolled', window.scrollY > 8); };
                    window.addEventListener('scroll', onScroll, { passive: true });
                    onScroll();

                    // Loading bar while the next page is fetched.
                    var bar = document.createElement('div');
                    bar.className = 'glass-progress';
                    document.body.appendChild(bar);
                    window.addEventListener('beforeunload', function () {
                        bar.classList.add('run');
                        // A download (e.g. exporting an egg) never leaves the page, so clear the bar again.
                        setTimeout(function () { bar.classList.remove('run'); }, 6000);
                    });
                    window.addEventListener('pageshow', function () { bar.classList.remove('run'); });

                    // Numbers on stat cards count up from zero.
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        document.querySelectorAll('.glass-stat .value').forEach(function (el) {
                            var text = el.textContent.trim();
                            if (!/^\d{1,7}$/.test(text)) return;
                            var target = parseInt(text, 10), start = performance.now(), duration = 700;
                            if (target === 0) return;
                            el.textContent = '0';
                            (function tick(now) {
                                var p = Math.min(1, (now - start) / duration);
                                el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
                                if (p < 1) requestAnimationFrame(tick);
                            })(start);
                        });
                    }
                })
            </script>
        @show
    </body>
</html>
