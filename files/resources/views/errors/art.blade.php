{{-- Line drawings for the error pages. Same paths as resources/scripts/components/elements/ErrorArt.tsx. --}}
<svg class="error-art" aria-hidden="true" viewBox="0 0 200 200" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="100" cy="104" r="68" fill="var(--soft)" stroke="none"/>
    @switch($art ?? 'file')
        @case('plug')
            <path d="M200 44h-84a16 16 0 0 0-16 16v14"/>
            <rect x="84" y="74" width="32" height="24" rx="6"/>
            <path d="M92 98v12M108 98v12"/>
            <rect x="82" y="128" width="36" height="26" rx="7"/>
            <path d="M92 128v-7M108 128v-7"/>
            <path d="M100 154v14a16 16 0 0 1-16 16H52a16 16 0 0 0-16 16"/>
            <path class="spark" d="M70 106l-10-5M68 116H56M130 106l10-5M132 116h12"/>
            @break
        @case('file')
            <path d="M64 30h52l32 32v100a10 10 0 0 1-10 10H64a10 10 0 0 1-10-10V40a10 10 0 0 1 10-10z"/>
            <path d="M116 30v22a10 10 0 0 0 10 10h22"/>
            <path d="M76 96l12 12M88 96l-12 12M112 96l12 12M124 96l-12 12"/>
            <path d="M82 142q18-16 36 0"/>
            @break
        @case('lock')
            <rect x="58" y="92" width="84" height="70" rx="12"/>
            <path d="M76 92V72a24 24 0 0 1 48 0v20"/>
            <circle cx="100" cy="120" r="7"/>
            <path d="M100 127v14"/>
            @break
        @case('gear')
            <g class="turn"><circle cx="100" cy="100" r="16"/>
            <circle cx="100" cy="100" r="36"/>
            <path d="M100 52v12M100 136v12M52 100h12M136 100h12M66 66l8.5 8.5M125.500 125.500l8.500 8.500M66 134l8.500-8.500M125.500 74.500l8.500-8.500"/></g>
            @break
    @endswitch
</svg>
