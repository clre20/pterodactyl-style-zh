<?php

namespace Pterodactyl\Extensions\Themes;

use Illuminate\Database\QueryException;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;

/**
 * The icon shown for every server that uses an egg, chosen under Admin → Nests → Egg
 * by typing the name of a Font Awesome Free icon. Eggs without a choice keep the
 * automatic icon the client picks from the egg's features.
 *
 * Choices are stored in the settings table as "settings::glass:egg_icon:{egg id}".
 */
class EggIcons
{
    private const PREFIX = ThemeSettings::PREFIX . 'egg_icon:';

    private const STYLES = ['solid' => 's', 'regular' => 'r', 'brands' => 'b'];

    private static ?array $index = null;

    private static ?array $cache = null;

    /**
     * Turns what an admin typed or pasted into an icon. Accepts a bare name ("cube"),
     * class names ("fa-solid fa-cube", "fab fa-github") or the HTML snippet copied
     * from fontawesome.com ('<i class="fa-solid fa-cube"></i>').
     *
     * @return array{name: string, style: string, glyph: string}|null
     */
    public static function parse(string $input): ?array
    {
        $input = strtolower($input);
        // From a pasted HTML snippet only the class list matters; the tag name "i" is itself an icon name.
        if (preg_match('/class\s*=\s*["\']([^"\']*)/', $input, $match)) {
            $input = $match[1];
        }
        $tokens = preg_split('/[^a-z0-9-]+/', $input, -1, PREG_SPLIT_NO_EMPTY);

        $style = null;
        $name = null;
        foreach ($tokens as $token) {
            $token = preg_replace('/^fa-/', '', $token);
            if (in_array($token, ['fas', 'solid'], true)) {
                $style = 's';
            } elseif (in_array($token, ['far', 'regular'], true)) {
                $style = 'r';
            } elseif (in_array($token, ['fab', 'brands'], true)) {
                $style = 'b';
            } elseif ($name === null && isset(self::index()[$token])) {
                $name = $token;
            }
        }

        if ($name === null) {
            return null;
        }

        [$unicode, $styles] = self::index()[$name];
        // Use the requested style when the free set has it, otherwise the first available one.
        $style = $style !== null && str_contains($styles, $style) ? $style : $styles[0];

        return ['name' => $name, 'style' => $style, 'glyph' => mb_chr(hexdec($unicode), 'UTF-8')];
    }

    /**
     * @return array{name: string, style: string, glyph: string, color: string|null}|null
     */
    public static function get(int $eggId): ?array
    {
        return self::all()[$eggId] ?? null;
    }

    public static function set(int $eggId, ?string $icon, ?string $color): bool
    {
        $repository = app(SettingsRepositoryInterface::class);
        self::$cache = null;

        if ($icon === null || trim($icon) === '') {
            $repository->forget(self::PREFIX . $eggId);

            return true;
        }

        $parsed = self::parse($icon);
        if ($parsed === null) {
            return false;
        }

        $repository->set(self::PREFIX . $eggId, json_encode([
            'name' => $parsed['name'],
            'style' => $parsed['style'],
            'color' => $color !== null && preg_match('/^#[0-9a-fA-F]{6}$/', $color) ? strtolower($color) : null,
        ]));

        return true;
    }

    /**
     * Every saved choice, keyed by egg id.
     */
    private static function all(): array
    {
        if (self::$cache !== null) {
            return self::$cache;
        }

        $icons = [];
        try {
            foreach (app(SettingsRepositoryInterface::class)->all() as $row) {
                if (!str_starts_with($row->key, self::PREFIX)) {
                    continue;
                }
                $data = json_decode((string) $row->value, true);
                $entry = self::index()[$data['name'] ?? ''] ?? null;
                if ($entry === null) {
                    continue;
                }
                $style = in_array($data['style'] ?? '', self::STYLES, true) && str_contains($entry[1], $data['style']) ? $data['style'] : $entry[1][0];
                $icons[(int) substr($row->key, strlen(self::PREFIX))] = [
                    'name' => $data['name'],
                    'style' => $style,
                    'glyph' => mb_chr(hexdec($entry[0]), 'UTF-8'),
                    'color' => $data['color'] ?? null,
                ];
            }
        } catch (QueryException) {
            // Settings table unavailable: fall back to automatic icons.
        }

        return self::$cache = $icons;
    }

    /**
     * Font Awesome Free icon names: name => [unicode, available styles ("s", "r", "b")].
     */
    private static function index(): array
    {
        return self::$index ??= json_decode(file_get_contents(__DIR__ . '/fa-icons.json'), true) ?: [];
    }
}
