<?php

namespace Pterodactyl\Extensions\Themes;

use Illuminate\Database\QueryException;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;

/**
 * Appearance options edited under Admin → Settings → Appearance: accent colours,
 * login page text and background, footer text and the announcement banner.
 *
 * Values live in the panel's own settings table under "settings::glass:*", so they
 * need no migration and are removed with the rest of the theme's data on restore.
 */
class ThemeSettings
{
    public const PREFIX = 'settings::glass:';

    /** Accent presets: [from, to]. "from" drives buttons, links and focus rings. */
    public const PRESETS = [
        'indigo' => ['#6366f1', '#0ea5e9'],
        'violet' => ['#8b5cf6', '#ec4899'],
        'emerald' => ['#10b981', '#06b6d4'],
        'amber' => ['#f59e0b', '#ef4444'],
        'rose' => ['#f43f5e', '#f97316'],
        'sky' => ['#0ea5e9', '#22d3ee'],
    ];

    public const DEFAULTS = [
        'accent_a' => '#6366f1',
        'accent_b' => '#0ea5e9',
        'login_subtitle' => '',
        'footer_text' => '',
        'announcement_enabled' => '0',
        'announcement_level' => 'info',
        'announcement_text' => '',
    ];

    public const ANNOUNCEMENT_LEVELS = ['info', 'success', 'warning', 'danger'];

    private const BACKGROUND_EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png'];

    private static ?array $cache = null;

    /**
     * Every option with its stored value, or the default when it was never saved.
     */
    public static function all(): array
    {
        if (self::$cache !== null) {
            return self::$cache;
        }

        $values = self::DEFAULTS;
        try {
            $stored = app(SettingsRepositoryInterface::class)->all()
                ->filter(fn ($row) => str_starts_with($row->key, self::PREFIX))
                ->mapWithKeys(fn ($row) => [substr($row->key, strlen(self::PREFIX)) => $row->value]);
            foreach ($values as $key => $default) {
                if (isset($stored[$key]) && $stored[$key] !== null) {
                    $values[$key] = (string) $stored[$key];
                }
            }
        } catch (QueryException) {
            // The settings table is not reachable (e.g. during installation): use the defaults.
        }

        foreach (['accent_a', 'accent_b'] as $key) {
            if (!preg_match('/^#[0-9a-fA-F]{6}$/', $values[$key])) {
                $values[$key] = self::DEFAULTS[$key];
            }
        }

        return self::$cache = $values;
    }

    public static function get(string $key): string
    {
        return self::all()[$key] ?? '';
    }

    public static function set(string $key, ?string $value): void
    {
        app(SettingsRepositoryInterface::class)->set(self::PREFIX . $key, $value ?? '');
        self::$cache = null;
    }

    /**
     * The announcement to show to signed-in users, or null when it is switched off or empty.
     * The id changes with the text, so dismissing one announcement does not hide the next.
     */
    public static function announcement(): ?array
    {
        $all = self::all();
        $text = trim($all['announcement_text']);
        if ($all['announcement_enabled'] !== '1' || $text === '') {
            return null;
        }

        $level = in_array($all['announcement_level'], self::ANNOUNCEMENT_LEVELS, true) ? $all['announcement_level'] : 'info';

        return ['id' => substr(sha1($level . '|' . $text), 0, 12), 'level' => $level, 'text' => $text];
    }

    /**
     * URL of an uploaded background image, or null when the default glow is used.
     * "login" is shown behind the login card, "page" behind every other page.
     */
    public static function backgroundUrl(string $target): ?string
    {
        foreach (self::BACKGROUND_EXTENSIONS as $ext) {
            $path = public_path("brand/$target-bg.$ext");
            if (is_file($path)) {
                return "/brand/$target-bg.$ext?v=" . filemtime($path);
            }
        }

        return null;
    }

    public static function removeBackground(string $target): void
    {
        foreach (self::BACKGROUND_EXTENSIONS as $ext) {
            $path = public_path("brand/$target-bg.$ext");
            if (is_file($path)) {
                @unlink($path);
            }
        }
    }

    /**
     * What the React app needs, exposed as window.ThemeConfig.
     */
    public static function forClient(): array
    {
        $all = self::all();

        return [
            'loginSubtitle' => $all['login_subtitle'],
            'footerText' => $all['footer_text'],
            'loginBackground' => self::backgroundUrl('login'),
            // Announcements are for people using the panel, not for the public login page.
            'announcement' => auth()->check() ? self::announcement() : null,
        ];
    }

    /**
     * CSS custom properties for the chosen accent, as "r g b" triplets so they can be
     * used with any opacity: rgb(var(--ac-a) / 0.4). The same names are read by the
     * client stylesheet, the Tailwind "primary" palette and the admin stylesheet.
     */
    public static function cssVariables(): string
    {
        $all = self::all();
        $a = self::rgb($all['accent_a']);
        $b = self::rgb($all['accent_b']);

        $vars = [
            '--ac-a' => $a,
            '--ac-a-l' => self::mix($a, [255, 255, 255], 0.22),
            '--ac-b' => $b,
            '--ac-b-l' => self::mix($b, [255, 255, 255], 0.2),
            // Third glow of the page background: the primary colour turned 30° round the colour wheel.
            '--ac-c' => self::rotateHue($a, 30),
        ];

        // A full tint/shade scale around the accent, matching Tailwind's 50–900 steps.
        $steps = [50 => 0.92, 100 => 0.84, 200 => 0.7, 300 => 0.5, 400 => 0.24, 500 => 0, 600 => -0.14, 700 => -0.3, 800 => -0.44, 900 => -0.56];
        foreach ($steps as $step => $amount) {
            $vars["--primary-$step"] = $amount >= 0
                ? self::mix($a, [255, 255, 255], $amount)
                : self::mix($a, [10, 12, 28], -$amount);
        }

        $css = '';
        foreach ($vars as $name => $rgb) {
            $css .= $name . ':' . implode(' ', $rgb) . ';';
        }

        // An uploaded page background replaces the default glow; it is darkened so text stays readable.
        if ($background = self::backgroundUrl('page')) {
            $css .= "--page-bg:linear-gradient(rgba(7,11,20,.66),rgba(7,11,20,.88)),url('$background') center/cover no-repeat;";
        }

        // "html:root" outranks the ":root" defaults that the client injects at runtime.
        return 'html:root{' . $css . '}';
    }

    /**
     * @param int[] $rgb
     *
     * @return int[]
     */
    private static function rotateHue(array $rgb, float $degrees): array
    {
        [$r, $g, $b] = array_map(fn ($v) => $v / 255, $rgb);
        $max = max($r, $g, $b);
        $min = min($r, $g, $b);
        $l = ($max + $min) / 2;
        $d = $max - $min;
        if ($d == 0.0) {
            return $rgb;
        }
        $s = $d / (1 - abs(2 * $l - 1));
        $h = match (true) {
            $max === $r => 60 * fmod(($g - $b) / $d, 6),
            $max === $g => 60 * (($b - $r) / $d + 2),
            default => 60 * (($r - $g) / $d + 4),
        };
        $h = fmod($h + $degrees + 360, 360);

        $c = (1 - abs(2 * $l - 1)) * $s;
        $x = $c * (1 - abs(fmod($h / 60, 2) - 1));
        $m = $l - $c / 2;
        [$r, $g, $b] = match ((int) floor($h / 60)) {
            0 => [$c, $x, 0],
            1 => [$x, $c, 0],
            2 => [0, $c, $x],
            3 => [0, $x, $c],
            4 => [$x, 0, $c],
            default => [$c, 0, $x],
        };

        return [(int) round(($r + $m) * 255), (int) round(($g + $m) * 255), (int) round(($b + $m) * 255)];
    }

    /** @return int[] */
    private static function rgb(string $hex): array
    {
        return [hexdec(substr($hex, 1, 2)), hexdec(substr($hex, 3, 2)), hexdec(substr($hex, 5, 2))];
    }

    /**
     * @param int[] $from
     * @param int[] $to
     *
     * @return int[]
     */
    private static function mix(array $from, array $to, float $amount): array
    {
        return array_map(fn ($f, $t) => (int) round($f + ($t - $f) * $amount), $from, $to);
    }
}
