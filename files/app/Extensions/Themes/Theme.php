<?php

namespace Pterodactyl\Extensions\Themes;

class Theme
{
    public function js($path): string
    {
        return sprintf('<script src="%s"></script>' . PHP_EOL, $this->getUrl($path));
    }

    public function css($path): string
    {
        return sprintf('<link media="all" type="text/css" rel="stylesheet" href="%s"/>' . PHP_EOL, $this->getUrl($path));
    }

    protected function getUrl($path): string
    {
        $path = ltrim($path, '/');

        // Replace the {cache-version} placeholder with the file's modification time so
        // browsers and CDNs (e.g. Cloudflare) fetch a new copy whenever the file changes.
        if (str_contains($path, '{cache-version}')) {
            $file = public_path('themes/pterodactyl/' . strtok($path, '?'));
            $path = str_replace('{cache-version}', is_file($file) ? (string) filemtime($file) : '0', $path);
        }

        return '/themes/pterodactyl/' . $path;
    }
}
