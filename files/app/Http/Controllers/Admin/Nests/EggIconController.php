<?php

namespace Pterodactyl\Http\Controllers\Admin\Nests;

use Illuminate\Http\Request;
use Pterodactyl\Models\Egg;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Extensions\Themes\EggIcons;
use Pterodactyl\Http\Controllers\Controller;

/**
 * Admin → Nests → Egg: the Font Awesome icon shown for servers that use the egg.
 */
class EggIconController extends Controller
{
    public function __construct(private AlertsMessageBag $alert)
    {
    }

    /**
     * Resolves what the admin typed to an icon, for the live preview.
     */
    public function preview(Request $request): JsonResponse
    {
        return new JsonResponse(['icon' => EggIcons::parse((string) $request->query('icon', ''))]);
    }

    public function update(Request $request, Egg $egg): RedirectResponse
    {
        $data = $request->validate([
            'icon' => ['nullable', 'string', 'max:120'],
            'icon_color' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'icon_color_enabled' => ['nullable', 'in:0,1'],
        ]);

        $color = ($data['icon_color_enabled'] ?? '0') === '1' ? ($data['icon_color'] ?? null) : null;

        if (!EggIcons::set($egg->id, $data['icon'] ?? null, $color)) {
            $this->alert->danger(__('":icon" is not a Font Awesome Free icon. Copy the name from fontawesome.com, for example "cube" or "fa-solid fa-cube".', ['icon' => $data['icon']]))->flash();

            return redirect()->route('admin.nests.egg.view', $egg->id)->withInput();
        }

        $this->alert->success(
            empty($data['icon'])
                ? __('This egg now uses the automatic server icon.')
                : __('The server icon for this egg has been updated.')
        )->flash();

        return redirect()->route('admin.nests.egg.view', $egg->id);
    }
}
