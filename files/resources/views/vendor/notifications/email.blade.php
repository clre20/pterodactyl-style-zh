<!DOCTYPE html>
<html lang="{{ app()->getLocale() === 'zh' ? 'zh-Hant' : 'en' }}">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />

    <style type="text/css" rel="stylesheet" media="all">
        @media only screen and (max-width: 600px) {
            .email-card-cell {
                padding: 28px 22px !important;
            }

            .email-outer {
                padding: 24px 12px !important;
            }
        }
    </style>
</head>

<?php
// A light card design: email clients do not support backdrop blur and many force
// their own dark mode, so a plain light layout with the panel's accent reads best.
$font = "font-family: 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', -apple-system, 'Segoe UI', Arial, sans-serif;";
$accent = $level === 'error' ? '#dc4d4d' : '#4f63e8';
$accentBar = $level === 'error'
    ? 'background-color: #dc4d4d; background-image: linear-gradient(90deg, #f87171, #fb923c);'
    : 'background-color: #4f63e8; background-image: linear-gradient(90deg, #6366f1, #22d3ee);';
$iconBg = $level === 'error' ? '#fdecec' : '#e8f8f1';
$iconBorder = $level === 'error' ? '#f6c9c9' : '#bfe8d5';
$iconColor = $level === 'error' ? '#d93636' : '#0f9d6b';
?>

<body style="margin: 0; padding: 0; width: 100%; background-color: #f3f5fa; {{ $font }}">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f3f5fa;">
        <tr>
            <td class="email-outer" align="center" style="padding: 40px 16px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px;">
                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding-bottom: 26px;">
                            <a href="{{ url('/') }}" target="_blank" style="text-decoration: none;">
                                <table cellpadding="0" cellspacing="0" role="presentation">
                                    <tr>
                                        @if($brandLogo = \Pterodactyl\Extensions\Themes\Brand::logoUrl(true))
                                            <td style="width: 38px; height: 38px;"><img src="{{ $brandLogo }}" width="38" height="38" alt="" style="display: block; width: 38px; height: 38px; border-radius: 9px; border: 0;"></td>
                                        @else
                                            <td style="width: 38px; height: 38px; border-radius: 11px; background-color: #6d8af5; background-image: linear-gradient(135deg, #818cf8, #22d3ee); text-align: center; vertical-align: middle; color: #0b1020; font-weight: 800; font-size: 18px; {{ $font }}">Λ</td>
                                        @endif
                                        <td style="padding-left: 12px; color: #1f2937; font-size: 20px; font-weight: 600; {{ $font }}">{{ config('app.name') }}</td>
                                    </tr>
                                </table>
                            </a>
                        </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                        <td style="border-radius: 18px; background-color: #ffffff; border: 1px solid #e3e7f0; box-shadow: 0 8px 24px rgba(31, 41, 55, 0.06); overflow: hidden;">
                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                <tr>
                                    <td style="height: 6px; line-height: 6px; font-size: 0; border-radius: 18px 18px 0 0; {{ $accentBar }}">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td class="email-card-cell" style="padding: 40px 44px; {{ $font }}">
                                        <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 22px;">
                                            <tr>
                                                <td style="width: 54px; height: 54px; border-radius: 16px; background-color: {{ $iconBg }}; border: 1px solid {{ $iconBorder }}; text-align: center; vertical-align: middle; color: {{ $iconColor }}; font-size: 26px; font-weight: 700;">
                                                    {{ $level === 'error' ? '!' : '✓' }}
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Greeting -->
                                        <h1 style="margin: 0 0 18px; color: #111827; font-size: 22px; font-weight: 700; line-height: 1.4; {{ $font }}">
                                            @if (! empty($greeting))
                                                {{ $greeting }}
                                            @else
                                                {{ $level == 'error' ? __('Whoops!') : __('Hello!') }}
                                            @endif
                                        </h1>

                                        <!-- Intro -->
                                        @foreach ($introLines as $line)
                                            <p style="margin: 0 0 12px; color: #4b5563; font-size: 15px; line-height: 1.8; {{ $font }}">{{ $line }}</p>
                                        @endforeach

                                        <!-- Action Button -->
                                        @if (isset($actionText))
                                            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 28px 0 8px;">
                                                <tr>
                                                    <td align="center" style="border-radius: 12px; background-color: {{ $accent }};">
                                                        <a href="{{ $actionUrl }}" target="_blank" style="display: block; padding: 15px 0; border-radius: 12px; color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none; {{ $font }}">{{ $actionText }}</a>
                                                    </td>
                                                </tr>
                                            </table>
                                        @endif

                                        <!-- Outro -->
                                        @foreach ($outroLines as $line)
                                            <p style="margin: 16px 0 0; color: #4b5563; font-size: 15px; line-height: 1.8; {{ $font }}">{{ $line }}</p>
                                        @endforeach

                                        <!-- Salutation -->
                                        <p style="margin: 28px 0 0; color: #6b7280; font-size: 14px; line-height: 1.8; {{ $font }}">
                                            {{ __('Regards,') }}<br>{{ __(':app team', ['app' => config('app.name')]) }}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Sub copy & footer -->
                    <tr>
                        <td align="center" style="padding: 26px 12px 0; color: #8a94a6; font-size: 12px; line-height: 1.8; {{ $font }}">
                            @if (isset($actionText))
                                {{ __('If the ":action" button does not work, copy this address into your browser:', ['action' => $actionText]) }}<br>
                                <a href="{{ $actionUrl }}" target="_blank" style="color: #4f46e5; word-break: break-all;">{{ $actionUrl }}</a><br>
                            @endif
                            &copy; {{ date('Y') }} <a href="{{ url('/') }}" target="_blank" style="color: #4f46e5; text-decoration: none;">{{ config('app.name') }}</a>. {{ __('All rights reserved.') }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
