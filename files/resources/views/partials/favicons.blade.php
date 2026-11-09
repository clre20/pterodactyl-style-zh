@if($brandIcon = \Pterodactyl\Extensions\Themes\Brand::logoUrl())
    <link rel="icon" href="{{ $brandIcon }}">
    <link rel="apple-touch-icon" href="{{ $brandIcon }}">
@else
    <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
    <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
    <link rel="shortcut icon" href="/favicons/favicon.ico">
@endif
<link rel="manifest" href="/favicons/manifest.json">
<meta name="msapplication-config" content="/favicons/browserconfig.xml">
