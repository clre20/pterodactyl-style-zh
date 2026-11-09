<?php

namespace Pterodactyl\Extensions\Themes;

/**
 * Custom panel logo. Put an image at public/brand/logo.(svg|png|webp|jpg) and it
 * replaces the default mark in the navigation bar, login page, admin area, emails
 * and browser tab. The file time is added to the URL so a new logo is never stale
 * in a browser or CDN cache.
 */
class Brand
{
    public static function logoUrl(bool $absolute = false): ?string
    {
        foreach (['svg', 'png', 'webp', 'jpg', 'jpeg'] as $ext) {
            $path = public_path("brand/logo.$ext");
            if (is_file($path)) {
                $url = "/brand/logo.$ext?v=" . filemtime($path);

                return $absolute ? url($url) : $url;
            }
        }

        return null;
    }

    /**
     * Versioned URL for a theme stylesheet or script, so updates reach browsers
     * even when a CDN such as Cloudflare caches static files.
     */
    public static function asset(string $path): string
    {
        $file = public_path('themes/pterodactyl/' . ltrim($path, '/'));

        return '/themes/pterodactyl/' . ltrim($path, '/') . '?v=' . (is_file($file) ? filemtime($file) : '0');
    }
}
