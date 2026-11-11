<?php

namespace Pterodactyl\Http\Controllers\Admin\Settings;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Extensions\Themes\ThemeSettings;

/**
 * Admin → Settings → Appearance: accent colours, login page, footer text and
 * the announcement banner. The logo upload on the same page is handled by
 * BrandingController.
 */
class AppearanceController extends Controller
{
    public function __construct(private AlertsMessageBag $alert)
    {
    }

    public function index(): View
    {
        return view('admin.settings.appearance', [
            'theme' => ThemeSettings::all(),
            'presets' => ThemeSettings::PRESETS,
            'backgrounds' => [
                'page' => ThemeSettings::backgroundUrl('page'),
                'login' => ThemeSettings::backgroundUrl('login'),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'accent_a' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'accent_b' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'login_subtitle' => ['nullable', 'string', 'max:60'],
            'footer_text' => ['nullable', 'string', 'max:120'],
            'announcement_enabled' => ['required', Rule::in(['0', '1'])],
            'announcement_level' => ['required', Rule::in(ThemeSettings::ANNOUNCEMENT_LEVELS)],
            'announcement_text' => ['nullable', 'string', 'max:300'],
        ]);

        foreach (array_keys(ThemeSettings::DEFAULTS) as $key) {
            ThemeSettings::set($key, trim((string) ($data[$key] ?? '')));
        }

        $this->alert->success(__('Appearance settings have been updated.'))->flash();

        return redirect()->route('admin.settings.appearance');
    }

    public function storeBackground(Request $request): RedirectResponse
    {
        $request->validate([
            'target' => ['required', Rule::in(['page', 'login'])],
            'background' => ['required', 'file', 'mimes:png,jpg,jpeg,webp', 'max:4096', 'dimensions:min_width=800,min_height=450'],
        ]);
        $target = $request->input('target');

        $directory = public_path('brand');
        $failed = fn () => tap(redirect()->route('admin.settings.appearance'), function () use ($directory) {
            $this->alert->danger(__('Unable to save the image. Make sure the web server can write to :path.', ['path' => $directory]))->flash();
        });

        if (!is_dir($directory) && !@mkdir($directory, 0755, true)) {
            return $failed();
        }

        ThemeSettings::removeBackground($target);

        $extension = strtolower($request->file('background')->guessExtension() ?: 'jpg');
        $extension = $extension === 'jpeg' ? 'jpg' : $extension;
        try {
            $request->file('background')->move($directory, "$target-bg.$extension");
        } catch (\Throwable) {
            return $failed();
        }

        $this->alert->success(__('The background has been updated.'))->flash();

        return redirect()->route('admin.settings.appearance');
    }

    public function destroyBackground(Request $request): RedirectResponse
    {
        $request->validate(['target' => ['required', Rule::in(['page', 'login'])]]);

        ThemeSettings::removeBackground($request->input('target'));
        $this->alert->success(__('The background has been removed and the default restored.'))->flash();

        return redirect()->route('admin.settings.appearance');
    }
}
