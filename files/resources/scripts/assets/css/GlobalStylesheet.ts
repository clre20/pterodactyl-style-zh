import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';

export default createGlobalStyle`
    :root {
        --glass-bg: rgba(255, 255, 255, 0.055);
        --glass-bg-strong: rgba(255, 255, 255, 0.08);
        --glass-border: rgba(255, 255, 255, 0.1);
        --glass-blur: blur(22px) saturate(140%);
        --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06);
        /* Accent colours as "r g b" triplets. These are the defaults; the page injects the values
           chosen under Admin → Settings → Appearance right after this stylesheet. */
        --ac-a: 99 102 241;
        --ac-a-l: 129 140 248;
        --ac-b: 14 165 233;
        --ac-b-l: 62 183 237;
        --ac-c: 168 85 247;
        --primary-50: 238 238 254;
        --primary-100: 224 224 252;
        --primary-200: 196 197 250;
        --primary-300: 177 179 248;
        --primary-400: 136 139 244;
        --primary-500: 99 102 241;
        --primary-600: 87 89 211;
        --primary-700: 72 75 177;
        --primary-800: 60 62 147;
        --primary-900: 49 52 122;
        --accent: rgb(var(--ac-a-l));
        --accent-strong: rgb(var(--ac-a));
        --accent-2: rgb(var(--ac-b-l));
        --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    html {
        background: #070b14;
    }

    body {
        ${tw`font-sans text-neutral-200`};
        background: transparent;
        min-height: 100vh;
        letter-spacing: 0.01em;
        -webkit-font-smoothing: antialiased;
    }

    /* Soft colour glow behind the glass panels. Fixed so it does not scroll. */
    body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        /* Large-viewport height so the glow still covers the screen while a phone's
           address bar slides away during scrolling; its own GPU layer avoids repaint tears. */
        height: 100vh;
        height: 100lvh;
        z-index: -1;
        pointer-events: none;
        transform: translateZ(0);
        will-change: transform;
        /* --page-bg is set when the owner uploaded a page background (Settings → Appearance). */
        background: var(
            --page-bg,
            radial-gradient(680px circle at 6% -6%, rgb(var(--ac-a) / 0.46), transparent 70%),
            radial-gradient(600px circle at 102% 30%, rgb(var(--ac-b-l) / 0.26), transparent 70%),
            radial-gradient(660px circle at 46% 112%, rgb(var(--ac-c) / 0.3), transparent 70%)
        );
    }

    /* Phones and tablets: blurring the fixed background behind every card while scrolling
       causes flicker and torn backgrounds on mobile browsers. The background is a soft
       gradient, so dropping the blur there changes almost nothing visually. */
    @media (hover: none) and (pointer: coarse), (max-width: 767px) {
        :root {
            --glass-blur: none;
            --glass-bg: rgba(255, 255, 255, 0.06);
        }
    }

    #app {
        position: relative;
        isolation: isolate;
    }

    ::selection {
        background: rgb(var(--ac-a-l) / 0.45);
        color: #fff;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header`};
    }

    p {
        ${tw`text-neutral-200 leading-snug font-sans`};
    }

    code, pre, kbd, samp {
        ${tw`font-mono`};
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    a, button, input, select, textarea {
        &:focus-visible {
            box-shadow: 0 0 0 3px rgb(var(--ac-a-l) / 0.45);
        }
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Frosted glass surfaces used across the panel. */
    .glass {
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        box-shadow: var(--glass-shadow);
    }

    .glass-strong {
        background: rgba(17, 22, 38, 0.82);
        border: 1px solid var(--glass-border);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }

    /* Large faint icon tucked into the corner of a card. */
    .watermark,
    svg.svg-inline--fa.watermark {
        position: absolute;
        right: -14px;
        bottom: -22px;
        width: 7.5rem !important;
        height: 7.5rem !important;
        opacity: 0.09;
        pointer-events: none;
        transform: rotate(-8deg);
    }

    /* Narrow cards (phone stat tiles): a smaller, fainter mark so it never sits behind the number. */
    @media (max-width: 639px) {
        .watermark,
        svg.svg-inline--fa.watermark {
            right: -10px;
            bottom: -14px;
            width: 4rem !important;
            height: 4rem !important;
            opacity: 0.07;
        }
    }

    .accent-gradient {
        background-image: linear-gradient(135deg, rgb(var(--ac-a)), rgb(var(--ac-b)));
    }

    /* The login card shows the reCAPTCHA notice itself, so the floating badge can go. */
    .grecaptcha-badge {
        visibility: hidden !important;
    }

    /* Loading placeholders */
    .skeleton {
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.07) 25%,
            rgba(255, 255, 255, 0.16) 37%,
            rgba(255, 255, 255, 0.07) 63%
        );
        background-size: 400% 100%;
        animation: skeleton-shimmer 1.4s ease infinite;
    }
    @keyframes skeleton-shimmer {
        from { background-position: 100% 50%; }
        to { background-position: 0 50%; }
    }

    /* Server state: a breathing dot while running, a sweep while starting or stopping */
    .state-dot {
        position: relative;
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 9999px;
        background: currentColor;
        flex: none;
    }
    .state-dot.live::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: currentColor;
        animation: state-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    @keyframes state-ping {
        0% { transform: scale(1); opacity: 0.7; }
        80%, 100% { transform: scale(2.8); opacity: 0; }
    }
    .state-busy {
        position: relative;
        overflow: hidden;
    }
    .state-busy::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #fcd34d, transparent);
        background-size: 50% 100%;
        background-repeat: no-repeat;
        animation: state-sweep 1.6s ease-in-out infinite;
    }
    @keyframes state-sweep {
        from { background-position: -50% 0; }
        to { background-position: 150% 0; }
    }

    /* Line drawings on full-page messages */
    .error-art .turn {
        transform-origin: 100px 100px;
    }
    .error-art.busy .turn {
        animation: error-art-turn 6s linear infinite;
    }
    .error-art .spark {
        animation: error-art-spark 1.8s ease-in-out infinite;
    }
    @keyframes error-art-turn {
        to { transform: rotate(360deg); }
    }
    @keyframes error-art-spark {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.25; }
    }
    .accent-text {
        background-image: linear-gradient(135deg, rgb(var(--primary-200)), rgb(var(--ac-b-l)));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    /* The pin star only appears on hover; touch screens have no hover, so keep it visible there. */
    @media (hover: none) {
        .pin-touch {
            opacity: 0.7 !important;
        }
    }

    .hide-scrollbar {
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }

    /* Page and card entrance animation; cards inside a .stagger parent cascade in. */
    @keyframes panel-enter {
        from {
            opacity: 0;
            transform: translateY(12px) scale(0.985);
            filter: blur(3px);
        }
        to {
            opacity: 1;
            transform: none;
            filter: none;
        }
    }

    .enter {
        animation: panel-enter 0.45s var(--ease-out) both;
    }

    .stagger > * {
        animation: panel-enter 0.45s var(--ease-out) both;
    }
    .stagger > *:nth-child(2) { animation-delay: 0.05s; }
    .stagger > *:nth-child(3) { animation-delay: 0.1s; }
    .stagger > *:nth-child(4) { animation-delay: 0.15s; }
    .stagger > *:nth-child(5) { animation-delay: 0.2s; }
    .stagger > *:nth-child(n + 6) { animation-delay: 0.25s; }

    @media (prefers-reduced-motion: reduce) {
        .enter, .stagger > *,
        .skeleton,
        .error-art.busy .turn, .error-art .spark,
        .state-dot.live::after, .state-busy::after {
            animation: none;
        }
    }

    /* Scroll Bar Style */
    ::-webkit-scrollbar {
        background: none;
        width: 14px;
        height: 14px;
    }

    ::-webkit-scrollbar-thumb {
        border: solid 0 rgb(0 0 0 / 0%);
        border-right-width: 4px;
        border-left-width: 4px;
        -webkit-border-radius: 9px 4px;
        -webkit-box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18), inset 0 0 0 4px rgba(255, 255, 255, 0.08);
    }

    ::-webkit-scrollbar-track-piece {
        margin: 4px 0;
    }

    ::-webkit-scrollbar-thumb:horizontal {
        border-right-width: 0;
        border-left-width: 0;
        border-top-width: 4px;
        border-bottom-width: 4px;
        -webkit-border-radius: 4px 9px;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }
`;
