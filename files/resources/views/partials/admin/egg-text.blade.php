{{-- Display translations for egg variable names and descriptions used by the admin scripts.
     Only text that has a translation is sent; anything else is shown as the egg defines it. --}}
@php
    $glassEggText = [];
    foreach (\Pterodactyl\Models\EggVariable::query()->get(['name', 'description']) as $glassVariable) {
        foreach ([$glassVariable->name, $glassVariable->description] as $glassText) {
            if (is_string($glassText) && $glassText !== '' && ($glassTranslated = __($glassText)) !== $glassText) {
                $glassEggText[$glassText] = $glassTranslated;
            }
        }
    }
@endphp
<script>
    window.__egg = (function (dict) {
        return function (text) {
            return Object.prototype.hasOwnProperty.call(dict, text) ? dict[text] : text;
        };
    })(@json((object) $glassEggText));
</script>
