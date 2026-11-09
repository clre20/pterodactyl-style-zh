<?php

namespace Pterodactyl\Http\Controllers\Admin\Settings;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Http\Controllers\Controller;

/**
 * Upload or remove the custom panel logo shown in the navigation, login page,
 * admin area, emails and browser tab (see Pterodactyl\Extensions\Themes\Brand).
 */
class BrandingController extends Controller
{
    private const EXTENSIONS = ['svg', 'png', 'webp', 'jpg', 'jpeg'];

    public function __construct(private AlertsMessageBag $alert)
    {
    }

    public function store(Request $request): RedirectResponse
    {
        // SVG is not accepted from uploads because it can carry scripts.
        $request->validate([
            'logo' => ['required', 'file', 'mimes:png,jpg,jpeg,webp', 'max:2048', 'dimensions:min_width=32,min_height=32'],
        ]);

        $directory = public_path('brand');
        if (!is_dir($directory) && !@mkdir($directory, 0755, true)) {
            $this->alert->danger(__('Unable to save the logo. Make sure the web server can write to :path.', ['path' => $directory]))->flash();

            return redirect()->route('admin.settings');
        }

        $this->removeExisting();

        $extension = strtolower($request->file('logo')->guessExtension() ?: 'png');
        $extension = $extension === 'jpeg' ? 'jpg' : $extension;
        try {
            $request->file('logo')->move($directory, "logo.$extension");
        } catch (\Throwable) {
            $this->alert->danger(__('Unable to save the logo. Make sure the web server can write to :path.', ['path' => $directory]))->flash();

            return redirect()->route('admin.settings');
        }

        $this->alert->success(__('The logo has been updated.'))->flash();

        return redirect()->route('admin.settings');
    }

    public function destroy(): RedirectResponse
    {
        $this->removeExisting();
        $this->alert->success(__('The custom logo has been removed and the default logo restored.'))->flash();

        return redirect()->route('admin.settings');
    }

    private function removeExisting(): void
    {
        foreach (self::EXTENSIONS as $ext) {
            $file = public_path("brand/logo.$ext");
            if (is_file($file)) {
                @unlink($file);
            }
        }
    }
}
