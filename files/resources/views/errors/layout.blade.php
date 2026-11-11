<!DOCTYPE html>
@php
    // This page must render even when the database or cache is down, so every
    // lookup falls back to a safe default instead of throwing a second error.
    try {
        $glassVars = \Pterodactyl\Extensions\Themes\ThemeSettings::cssVariables();
    } catch (\Throwable $e) {
        $glassVars = '';
    }
    try {
        $glassLogo = \Pterodactyl\Extensions\Themes\Brand::logoUrl();
    } catch (\Throwable $e) {
        $glassLogo = null;
    }
    $glassName = config('app.name', 'Pterodactyl');
    $glassTone = trim($__env->yieldContent('tone')) ?: 'accent';
@endphp
<html lang="{{ app()->getLocale() === 'zh' ? 'zh-Hant' : 'en' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <meta name="theme-color" content="#070b14">
    <title>@yield('code') · {{ $glassName }}</title>
    @if($glassLogo)
        <link rel="icon" href="{{ $glassLogo }}">
    @else
        <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
    @endif
    <link rel="stylesheet" href="/themes/pterodactyl/css/fonts.css">
    <style>
        :root { --ac-a: 99 102 241; --ac-a-l: 129 140 248; --ac-b: 14 165 233; --ac-b-l: 62 183 237; --ac-c: 168 85 247; --primary-300: 177 179 248; }
        {!! $glassVars !!}
        * { box-sizing: border-box; }
        html { background: #070b14; }
        body {
            margin: 0; min-height: 100vh; min-height: 100dvh; display: flex; flex-direction: column;
            align-items: center; justify-content: center; padding: 24px 16px; color: #e6e9f2;
            font-family: Inter, 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', -apple-system, 'Segoe UI', Arial, sans-serif;
            background:
                radial-gradient(680px circle at 6% -6%, rgb(var(--ac-a) / .42), transparent 70%),
                radial-gradient(600px circle at 102% 30%, rgb(var(--ac-b-l) / .22), transparent 70%),
                radial-gradient(760px circle at 50% 118%, rgb(var(--ac-c) / .2), transparent 70%);
            background-attachment: fixed;
        }
        .brand { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 26px; color: #f4f6fb; font-size: 20px; font-weight: 600; text-decoration: none; }
        .brand img, .brand span { width: 36px; height: 36px; border-radius: 10px; flex: none; }
        .brand span { display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, rgb(var(--ac-a-l)), rgb(var(--ac-b-l))); color: #0b1020; font-weight: 800; }
        .card {
            width: 100%; max-width: 760px; padding: 44px 44px; border-radius: 28px;
            display: flex; align-items: center; gap: 40px;
            background: rgba(255, 255, 255, .07); border: 1px solid rgba(255, 255, 255, .12);
            box-shadow: 0 24px 64px rgba(0, 0, 0, .45), inset 0 1px 0 rgba(255, 255, 255, .08);
        }
        .error-art { width: 230px; flex: none; }
        .error-art .turn { transform-origin: 100px 100px; animation: turn 6s linear infinite; }
        .error-art .spark { animation: spark 1.8s ease-in-out infinite; }
        @keyframes turn { to { transform: rotate(360deg); } }
        @keyframes spark { 50% { opacity: .25; } }
        .text { min-width: 0; text-align: left; }
        .code {
            margin: 0; font-size: 84px; font-weight: 800; letter-spacing: -2px; line-height: 1; font-variant-numeric: tabular-nums;
            background: linear-gradient(135deg, #fff, var(--ink)); -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        h1 { margin: 12px 0 8px; font-size: 22px; font-weight: 700; color: #f4f6fb; }
        p { margin: 0; max-width: 400px; font-size: 15px; line-height: 1.8; color: #aab4c8; }
        .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px; }
        .btn { display: inline-block; padding: 11px 22px; border-radius: 12px; font-size: 15px; font-weight: 600; text-decoration: none; cursor: pointer; border: 0; font-family: inherit; }
        .btn-primary { color: #fff; background: linear-gradient(135deg, rgb(var(--ac-a)), rgb(var(--ac-b))); box-shadow: 0 8px 22px rgb(var(--ac-a) / .35); }
        .btn-ghost { color: #d6dbe8; background: rgba(255, 255, 255, .07); border: 1px solid rgba(255, 255, 255, .12); }
        .tone-accent { --soft: rgb(var(--ac-a) / .16); --ink: rgb(var(--primary-300)); }
        .tone-amber { --soft: rgba(245, 158, 11, .14); --ink: #fcd34d; }
        .tone-red { --soft: rgba(239, 68, 68, .15); --ink: #fca5a5; }
        @media (prefers-reduced-motion: reduce) { .error-art .turn, .error-art .spark { animation: none; } }
        @media (max-width: 640px) {
            .card { flex-direction: column; gap: 18px; padding: 32px 22px 28px; border-radius: 22px; }
            .error-art { width: 170px; }
            .text { text-align: center; }
            .code { font-size: 64px; }
            p { margin: 0 auto; }
            .actions { justify-content: center; }
        }
    </style>
</head>
<body>
    <a class="brand" href="/">
        @if($glassLogo)
            <img src="{{ $glassLogo }}" alt="">
        @else
            <span aria-hidden="true">Λ</span>
        @endif
        {{ $glassName }}
    </a>
    <main class="card tone-{{ $glassTone }}">
        @include('errors.art', ['art' => trim($__env->yieldContent('art')) ?: 'file'])
        <div class="text">
            <p class="code">@yield('code')</p>
            <h1>@yield('title')</h1>
            <p>@yield('message')</p>
            <div class="actions">
                @hasSection('actions')
                    @yield('actions')
                @else
                    <a class="btn btn-primary" href="/">{{ __('Back to the panel') }}</a>
                    <button class="btn btn-ghost" type="button" onclick="history.back()">{{ __('Go back') }}</button>
                @endif
            </div>
        </div>
    </main>
</body>
</html>
