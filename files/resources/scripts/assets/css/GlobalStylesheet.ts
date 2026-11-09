import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';

export default createGlobalStyle`
    :root {
        --glass-bg: rgba(255, 255, 255, 0.055);
        --glass-bg-strong: rgba(255, 255, 255, 0.08);
        --glass-border: rgba(255, 255, 255, 0.1);
        --glass-blur: blur(22px) saturate(140%);
        --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06);
        --accent: #818cf8;
        --accent-strong: #6366f1;
        --accent-2: #22d3ee;
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
        background:
            radial-gradient(680px circle at 6% -6%, rgba(99, 102, 241, 0.46), transparent 70%),
            radial-gradient(600px circle at 102% 30%, rgba(34, 211, 238, 0.26), transparent 70%),
            radial-gradient(660px circle at 46% 112%, rgba(168, 85, 247, 0.3), transparent 70%);
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
        background: rgba(129, 140, 248, 0.45);
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
            box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.45);
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
        background-image: linear-gradient(135deg, #6366f1, #0ea5e9);
    }

    /* The login card shows the reCAPTCHA notice itself, so the floating badge can go. */
    .grecaptcha-badge {
        visibility: hidden !important;
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
        .enter, .stagger > * {
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
