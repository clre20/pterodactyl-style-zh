import React from 'react';

// Generated from the drawing sources; each drawing's CSS is scoped to .ea-<name> so its class and
// keyframe names never clash with the rest of the panel.
export type ErrorArtName =
    | 'installing'
    | 'install-failed'
    | 'suspended'
    | 'node-maintenance'
    | 'transferring'
    | 'restoring'
    | 'denied'
    | 'error'
    | 'not-found'
    | 'sign-in'
    | 'forbidden'
    | 'unplugged'
    | 'expired'
    | 'rate-limit'
    | 'server-error'
    | 'maintenance';
export type ErrorArtTone = 'accent' | 'amber' | 'red';

const tones: Record<ErrorArtTone, { line: string; soft: string }> = {
    accent: { line: 'rgb(var(--primary-300))', soft: 'rgb(var(--ac-a) / 0.16)' },
    amber: { line: '#fcd34d', soft: 'rgba(245, 158, 11, 0.14)' },
    red: { line: '#fca5a5', soft: 'rgba(239, 68, 68, 0.15)' },
};

const arts: Record<ErrorArtName, { tone: ErrorArtTone; css: string; body: string }> = {
    installing: {
        tone: 'amber',
        css: '@keyframes ea-installing-spin{to{transform:rotate(360deg)}}@keyframes ea-installing-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-installing-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-installing *{animation:none!important}}',
        body: '<g><animateTransform attributeName="transform" type="rotate" dur="1.6s" repeatCount="indefinite" keyTimes="0.0000;0.0550;0.1100;0.1650;0.2200;0.2750;0.3300;0.3850;0.4400;0.4950;0.5500;0.5950;0.6400;0.6850;0.7300;0.7750;0.8200;0.8650;0.9100;0.9550;1.0000" values="0.00 130 84;0.12 130 84;0.96 130 84;3.24 130 84;7.68 130 84;15.00 130 84;22.32 130 84;26.76 130 84;29.04 130 84;29.88 130 84;30.00 130 84;30.00 130 84;30.00 130 84;30.00 130 84;30.00 130 84;30.00 130 84;30.00 130 84;30.00 130 84;30.00 130 84;30.00 130 84;30.00 130 84"/><path d="M149.5 84.0 L154.0 85.5 L153.3 89.6 L148.6 89.7 L146.9 93.8 L150.0 97.3 L147.4 100.5 L143.3 98.3 L139.8 100.9 L140.7 105.5 L136.8 107.0 L134.4 103.0 L130.0 103.5 L128.5 108.0 L124.4 107.3 L124.3 102.6 L120.2 100.9 L116.7 104.0 L113.5 101.4 L115.7 97.3 L113.1 93.8 L108.5 94.7 L107.0 90.8 L111.0 88.4 L110.5 84.0 L106.0 82.5 L106.7 78.4 L111.4 78.3 L113.1 74.2 L110.0 70.7 L112.6 67.5 L116.7 69.7 L120.2 67.1 L119.3 62.5 L123.2 61.0 L125.6 65.0 L130.0 64.5 L131.5 60.0 L135.6 60.7 L135.7 65.4 L139.8 67.1 L143.3 64.0 L146.5 66.6 L144.3 70.7 L146.9 74.2 L151.5 73.3 L153.0 77.2 L149.0 79.6 Z"/><circle cx="130" cy="84" r="3.5" fill="currentColor"/></g><g stroke="#fdba74"><animateTransform attributeName="transform" type="rotate" dur="1.6s" repeatCount="indefinite" keyTimes="0.0000;0.0550;0.1100;0.1650;0.2200;0.2750;0.3300;0.3850;0.4400;0.4950;0.5500;0.5950;0.6400;0.6850;0.7300;0.7750;0.8200;0.8650;0.9100;0.9550;1.0000" values="-0.00 150 112;-0.18 150 112;-1.44 150 112;-4.86 150 112;-11.52 150 112;-22.50 150 112;-33.48 150 112;-40.14 150 112;-43.56 150 112;-44.82 150 112;-45.00 150 112;-45.00 150 112;-45.00 150 112;-45.00 150 112;-45.00 150 112;-45.00 150 112;-45.00 150 112;-45.00 150 112;-45.00 150 112;-45.00 150 112;-45.00 150 112"/><path d="M161.0 112.0 L164.9 113.4 L164.1 117.2 L159.9 116.8 L157.8 119.8 L159.6 123.6 L156.3 125.6 L153.6 122.4 L150.0 123.0 L148.6 126.9 L144.8 126.1 L145.2 121.9 L142.2 119.8 L138.4 121.6 L136.4 118.3 L139.6 115.6 L139.0 112.0 L135.1 110.6 L135.9 106.8 L140.1 107.2 L142.2 104.2 L140.4 100.4 L143.7 98.4 L146.4 101.6 L150.0 101.0 L151.4 97.1 L155.2 97.9 L154.8 102.1 L157.8 104.2 L161.6 102.4 L163.6 105.7 L160.4 108.4 Z"/><circle cx="150" cy="112" r="3.5"/></g><g stroke="#fb923c"><path d="M48 83a12 12 0 0 1 24 0"/><path d="M44 83h32"/></g><circle cx="60" cy="94" r="11"/><path d="M34 160v-18a26 26 0 0 1 52 0v18"/><line x1="82" y1="128" x2="103.8" y2="110.2"><animate attributeName="x2" dur="1.6s" repeatCount="indefinite" keyTimes="0.0000;0.0550;0.1100;0.1650;0.2200;0.2750;0.3300;0.3850;0.4400;0.4950;0.5500;0.5950;0.6400;0.6850;0.7300;0.7750;0.8200;0.8650;0.9100;0.9550;1.0000" values="103.8;103.8;103.4;102.4;100.6;98.0;95.9;94.9;94.4;94.3;94.3;94.3;94.4;94.9;95.9;98.0;100.6;102.4;103.4;103.8;103.8"/><animate attributeName="y2" dur="1.6s" repeatCount="indefinite" keyTimes="0.0000;0.0550;0.1100;0.1650;0.2200;0.2750;0.3300;0.3850;0.4400;0.4950;0.5500;0.5950;0.6400;0.6850;0.7300;0.7750;0.8200;0.8650;0.9100;0.9550;1.0000" values="110.2;110.1;109.7;108.6;106.4;102.5;98.3;95.6;94.2;93.7;93.6;93.7;94.2;95.6;98.3;102.5;106.4;108.6;109.7;110.1;110.2"/></line><g><animateTransform attributeName="transform" type="rotate" dur="1.6s" repeatCount="indefinite" keyTimes="0.0000;0.0550;0.1100;0.1650;0.2200;0.2750;0.3300;0.3850;0.4400;0.4950;0.5500;0.5950;0.6400;0.6850;0.7300;0.7750;0.8200;0.8650;0.9100;0.9550;1.0000" values="0.00 130 84;0.12 130 84;0.96 130 84;3.24 130 84;7.68 130 84;15.00 130 84;22.32 130 84;26.76 130 84;29.04 130 84;29.88 130 84;30.00 130 84;29.88 130 84;29.04 130 84;26.76 130 84;22.32 130 84;15.00 130 84;7.68 130 84;3.24 130 84;0.96 130 84;0.12 130 84;0.00 130 84"/><path d="M140.0 84.9A10 10 0 1 1 129.1 74.0M120.1 93.9L105.3 108.7" stroke="#0d1220" stroke-width="12"/><path d="M140.0 84.9A10 10 0 1 1 129.1 74.0" stroke="#cbd5e1" stroke-width="6"/><path d="M120.1 93.9L105.3 108.7" stroke="#cbd5e1" stroke-width="7"/><circle cx="103.8" cy="110.2" r="5" fill="#0d1220"/></g><path d="M139 98l5 5M146 94l7 1" stroke="#fde047"><animate attributeName="opacity" dur="1.6s" repeatCount="indefinite" keyTimes="0.0000;0.0550;0.1100;0.1650;0.2200;0.2750;0.3300;0.3850;0.4400;0.4950;0.5500;0.5950;0.6400;0.6850;0.7300;0.7750;0.8200;0.8650;0.9100;0.9550;1.0000" values="1;1;1;1;1;1;1;1;1;1;1;0.15;0.15;0.15;0.15;0.15;0.15;0.15;0.15;0.15;0.15"/></path>',
    },
    'install-failed': {
        tone: 'red',
        css: '@keyframes ea-install-failed-spin{to{transform:rotate(360deg)}}@keyframes ea-install-failed-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-install-failed-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-install-failed *{animation:none!important}}.ea-install-failed .drop{animation:ea-install-failed-drop 2.8s ease-in-out infinite}.ea-install-failed .badge{transform-origin:142px 64px;animation:ea-install-failed-pop 2.8s ease-out infinite}@keyframes ea-install-failed-drop{0%{transform:translateY(-14px);opacity:0}12%{opacity:1}40%{transform:translateY(8px)}46%{transform:translate(-4px,8px)}52%{transform:translate(4px,8px)}58%{transform:translate(-2px,8px)}64%,86%{transform:translateY(8px);opacity:1}100%{transform:translateY(8px);opacity:0}}@keyframes ea-install-failed-pop{0%,44%{transform:scale(0);opacity:0}52%{transform:scale(1.25);opacity:1}60%,86%{transform:scale(1);opacity:1}100%{transform:scale(1);opacity:0}}',
        body: '<path d="M52 120v24a10 10 0 0 0 10 10h76a10 10 0 0 0 10-10v-24" stroke="#cbd5e1"/><path d="M52 120h24l6 10h36l6-10h24" stroke="#cbd5e1"/><g class="drop" stroke="#7dd3fc"><path d="M100 42v48"/><path d="M84 76l16 16 16-16"/></g><g class="badge" stroke="#f87171"><circle cx="142" cy="64" r="15" fill="#2a1418"/><path d="M136 58l12 12M148 58l-12 12"/></g>',
    },
    suspended: {
        tone: 'red',
        css: '@keyframes ea-suspended-spin{to{transform:rotate(360deg)}}@keyframes ea-suspended-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-suspended-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-suspended *{animation:none!important}}.ea-suspended .ring{animation:ea-suspended-ring 3s ease-in-out infinite}.ea-suspended .slash{animation:ea-suspended-slash 3s ease-in infinite}.ea-suspended .srv{animation:ea-suspended-dim 3s ease-in-out infinite}.ea-suspended .led{animation:ea-suspended-off 3s steps(1,end) infinite}@keyframes ea-suspended-ring{0%{stroke-dashoffset:327;opacity:1}30%,86%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}@keyframes ea-suspended-slash{0%,32%{stroke-dashoffset:105;opacity:1}42%,86%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}@keyframes ea-suspended-dim{0%,40%{opacity:1}48%,90%{opacity:0.3}100%{opacity:1}}@keyframes ea-suspended-off{0%{opacity:1}42%{opacity:0.08}92%{opacity:1}}',
        body: '<g class="srv" stroke="#7dd3fc"><rect x="70" y="80" width="60" height="22" rx="6"/><rect x="70" y="106" width="60" height="22" rx="6"/><path d="M94 91h24M94 117h24"/></g><circle class="led" cx="81" cy="91" r="2.5" stroke="#34d399" fill="#34d399"/><circle class="led" cx="81" cy="117" r="2.5" stroke="#34d399" fill="#34d399"/><circle class="ring" cx="100" cy="104" r="52" stroke="#f87171" stroke-width="7" transform="rotate(-90 100 104)" stroke-dasharray="327 327"/><path class="slash" d="M63.2 67.2l73.6 73.6" stroke="#f87171" stroke-width="7" stroke-dasharray="105 105"/>',
    },
    'node-maintenance': {
        tone: 'amber',
        css: '@keyframes ea-node-maintenance-spin{to{transform:rotate(360deg)}}@keyframes ea-node-maintenance-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-node-maintenance-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-node-maintenance *{animation:none!important}}.ea-node-maintenance .led{animation:ea-node-maintenance-blink 1.8s steps(2,jump-none) infinite}.ea-node-maintenance .l2{animation-delay:-0.6s}.ea-node-maintenance .l3{animation-delay:-1.2s}.ea-node-maintenance .ray{animation:ea-node-maintenance-blink 0.9s ease-in-out infinite}',
        body: '<rect x="48" y="58" width="62" height="104" rx="9"/><path d="M60 78h26M60 94h26M60 110h26"/><circle class="led l1" cx="97" cy="78" r="3.5" stroke="#34d399" fill="#34d399"/><circle class="led l2" cx="97" cy="94" r="3.5" stroke="#34d399" fill="#34d399"/><circle class="led l3" cx="97" cy="110" r="3.5" stroke="#34d399" fill="#34d399"/><circle cx="79" cy="142" r="6"/><path d="M118 162h46"/><path d="M126 162l10-56h10l10 56"/><path d="M131 140h20M134 122h14" stroke="#fef3c7"/><path class="ray" d="M141 94v-8M129 98l-6-5M153 98l6-5" stroke="#fb923c"/>',
    },
    transferring: {
        tone: 'accent',
        css: '@keyframes ea-transferring-spin{to{transform:rotate(360deg)}}@keyframes ea-transferring-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-transferring-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-transferring *{animation:none!important}}.ea-transferring .parcel{animation:ea-transferring-travel 2s ease-in-out infinite}.ea-transferring .dash{animation:ea-transferring-dash 1s linear infinite}@keyframes ea-transferring-travel{0%{transform:translateX(0);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(26px);opacity:0}}@keyframes ea-transferring-dash{to{stroke-dashoffset:-14}}',
        body: '<rect x="30" y="74" width="42" height="64" rx="7"/><rect x="128" y="74" width="42" height="64" rx="7"/><path d="M40 92h22M40 106h22M138 92h22M138 106h22"/><circle cx="51" cy="124" r="3" stroke="#34d399" fill="#34d399"/><circle cx="149" cy="124" r="3" stroke="#7dd3fc" fill="#7dd3fc"/><path class="dash" d="M80 152h38" stroke="#5eead4" stroke-dasharray="6 8"/><path d="M114 146l6 6-6 6" stroke="#5eead4"/><g class="parcel" stroke="#fdba74"><rect x="78" y="94" width="18" height="18" rx="3"/><path d="M78 101h18"/></g>',
    },
    restoring: {
        tone: 'accent',
        css: '@keyframes ea-restoring-spin{to{transform:rotate(360deg)}}@keyframes ea-restoring-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-restoring-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-restoring *{animation:none!important}}.ea-restoring .back{transform-origin:100px 104px;animation:ea-restoring-spin 3s linear infinite reverse}',
        body: '<g stroke="#5eead4"><ellipse cx="100" cy="82" rx="26" ry="9"/><path d="M74 82v44a26 9 0 0 0 52 0V82"/><path d="M74 104a26 9 0 0 0 52 0"/></g><circle cx="114" cy="115" r="2.5" stroke="#34d399" fill="#34d399"/><g class="back"><path d="M47.4 84.8A56 56 0 1 1 72.0 152.5"/><path d="M41.7 74.3L46.0 88.6L58.6 80.4" stroke="#c4b5fd"/></g>',
    },
    denied: {
        tone: 'red',
        css: '@keyframes ea-denied-spin{to{transform:rotate(360deg)}}@keyframes ea-denied-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-denied-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-denied *{animation:none!important}}.ea-denied .rattle{transform-origin:100px 149px;animation:ea-denied-rattle 2.4s ease-in-out infinite}.ea-denied .shackle{animation:ea-denied-tug 2.4s ease-in-out infinite}@keyframes ea-denied-tug{0%,40%,100%{transform:none}50%{transform:translateY(-7px)}58%{transform:none}}@keyframes ea-denied-rattle{0%,56%,100%{transform:none}62%{transform:rotate(-4deg)}68%{transform:rotate(4deg)}74%{transform:rotate(-2deg)}80%{transform:none}}',
        body: '<g class="rattle"><g class="shackle" stroke="#cbd5e1"><path d="M81 95V79a19 19 0 0 1 38 0v16"/></g><rect x="66" y="95" width="68" height="54" rx="11"/><g stroke="#fcd34d"><circle cx="100" cy="118" r="6"/><path d="M100 124v10"/></g></g>',
    },
    error: {
        tone: 'red',
        css: '@keyframes ea-error-spin{to{transform:rotate(360deg)}}@keyframes ea-error-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-error-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-error *{animation:none!important}}.ea-error .warn{transform-origin:100px 110px;animation:ea-error-pulse 1s ease-in-out infinite}.ea-error .win{animation:ea-error-glitch 2s steps(1,end) infinite}.ea-error .glitch{opacity:0;animation:ea-error-flash 2s steps(1,end) infinite}.ea-error .g2{animation-delay:-1s}@keyframes ea-error-glitch{0%,70%,100%{transform:none}72%{transform:translateX(-3px)}76%{transform:translateX(3px)}80%{transform:none}}@keyframes ea-error-flash{0%,68%{opacity:0}70%,82%{opacity:1}84%,100%{opacity:0}}',
        body: '<g class="win"><rect x="40" y="56" width="120" height="92" rx="10" stroke="#cbd5e1"/><path d="M40 74h120" stroke="#cbd5e1"/><circle cx="52" cy="65" r="2.5" stroke="#f87171" fill="#f87171"/><circle cx="62" cy="65" r="2.5" stroke="#fde047" fill="#fde047"/><circle cx="72" cy="65" r="2.5" stroke="#34d399" fill="#34d399"/></g><path class="glitch g1" d="M50 96h16M52 132h10" stroke="#c4b5fd"/><path class="glitch g2" d="M134 120h16M138 92h10" stroke="#7dd3fc"/><g class="warn"><path d="M100 86l26 44H74z" stroke="#fde047"/><path d="M100 100v14"/><circle cx="100" cy="122" r="1.5"/></g>',
    },
    'not-found': {
        tone: 'accent',
        css: '@keyframes ea-not-found-spin{to{transform:rotate(360deg)}}@keyframes ea-not-found-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-not-found-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-not-found *{animation:none!important}}.ea-not-found .lens{animation:ea-not-found-search 3s ease-in-out infinite}@keyframes ea-not-found-search{0%,100%{transform:translate(0,0)}25%{transform:translate(-18px,-10px)}50%{transform:translate(-6px,-28px)}75%{transform:translate(-20px,-24px)}}',
        body: '<rect x="70" y="62" width="60" height="82" rx="8"/><path d="M82 80h36M82 94h36M82 108h26M82 122h30" stroke="#94a3b8"/><g class="lens"><circle cx="112" cy="116" r="13" stroke="#7dd3fc" fill="rgba(125,211,252,0.12)"/><path d="M121.5 125.5l11 11" stroke="#fdba74" stroke-width="6"/></g>',
    },
    'sign-in': {
        tone: 'red',
        css: '@keyframes ea-sign-in-spin{to{transform:rotate(360deg)}}@keyframes ea-sign-in-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-sign-in-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-sign-in *{animation:none!important}}.ea-sign-in .slide{animation:ea-sign-in-slide 3.2s ease-in-out infinite}.ea-sign-in .turn{transform-origin:132px 100px;animation:ea-sign-in-turn 3.2s ease-in-out infinite}.ea-sign-in .click{opacity:0;animation:ea-sign-in-click 3.2s steps(1,end) infinite}@keyframes ea-sign-in-slide{0%{transform:translateX(-24px);opacity:0}8%{opacity:1}28%,80%{transform:translateX(0)}92%{transform:translateX(-24px);opacity:1}100%{transform:translateX(-24px);opacity:0}}@keyframes ea-sign-in-turn{0%,32%{transform:scaleY(1)}40%{transform:scaleY(0.15)}48%,64%{transform:scaleY(-1)}72%{transform:scaleY(0.15)}80%,100%{transform:scaleY(1)}}@keyframes ea-sign-in-click{0%,44%{opacity:0}46%,58%{opacity:1}52%{opacity:0.25}62%,100%{opacity:0}}',
        body: '<defs><clipPath id="clip-401"><rect x="0" y="0" width="126" height="200"/></clipPath></defs><rect x="104" y="56" width="56" height="96" rx="14" fill="#22141b"/><circle cx="132" cy="96" r="8"/><path d="M128 102l-3 16h14l-3-16"/><g class="turn"><g clip-path="url(#clip-401)"><g class="slide" stroke="#fcd34d"><circle cx="52" cy="100" r="13"/><circle cx="52" cy="100" r="4"/><path d="M65 100h67M120 100v9M128 100v7"/></g></g></g><path class="click" d="M164 80l6-5M166 100h8M164 120l6 5" stroke="#34d399"/>',
    },
    forbidden: {
        tone: 'red',
        css: '@keyframes ea-forbidden-spin{to{transform:rotate(360deg)}}@keyframes ea-forbidden-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-forbidden-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-forbidden *{animation:none!important}}.ea-forbidden .glint{animation:ea-forbidden-glint 2.6s ease-in-out infinite}.ea-forbidden .x{animation:ea-forbidden-xdraw 2.6s ease-out infinite}.ea-forbidden .x2{animation-name:ea-forbidden-xdraw2}@keyframes ea-forbidden-glint{0%,40%{transform:translateX(-50px)}80%,100%{transform:translateX(110px)}}@keyframes ea-forbidden-xdraw{0%{stroke-dashoffset:46}15%,100%{stroke-dashoffset:0}}@keyframes ea-forbidden-xdraw2{0%,15%{stroke-dashoffset:46}30%,100%{stroke-dashoffset:0}}',
        body: '<defs><clipPath id="clip-403"><path d="M100 46l46 16v36c0 30-20 50-46 62-26-12-46-32-46-62V62z"/></clipPath></defs><g clip-path="url(#clip-403)"><path class="glint" d="M40 160l40-120" stroke="#ffffff" stroke-width="12" stroke-opacity="0.25"/></g><path d="M100 46l46 16v36c0 30-20 50-46 62-26-12-46-32-46-62V62z" stroke="#7dd3fc"/><path class="x x1" d="M84 88l32 32" stroke="#f87171" stroke-width="6" stroke-dasharray="46 46"/><path class="x x2" d="M116 88l-32 32" stroke="#f87171" stroke-width="6" stroke-dasharray="46 46"/>',
    },
    unplugged: {
        tone: 'accent',
        css: '@keyframes ea-unplugged-spin{to{transform:rotate(360deg)}}@keyframes ea-unplugged-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-unplugged-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-unplugged *{animation:none!important}}.ea-unplugged .up{animation:ea-unplugged-reach-down 2s ease-in-out infinite}.ea-unplugged .down{animation:ea-unplugged-reach-up 2s ease-in-out infinite}.ea-unplugged .spark{animation:ea-unplugged-blink 2s ease-in-out infinite}@keyframes ea-unplugged-reach-down{0%,100%{transform:none}50%{transform:translateY(5px)}}@keyframes ea-unplugged-reach-up{0%,100%{transform:none}50%{transform:translateY(-5px)}}',
        body: '<g class="up" stroke="#7dd3fc"><path d="M168 44h-52a16 16 0 0 0-16 16v14"/><rect x="84" y="74" width="32" height="24" rx="6"/><path d="M92 98v12M108 98v12"/></g><g class="down" stroke="#c4b5fd"><rect x="82" y="128" width="36" height="26" rx="7"/><path d="M92 128v-7M108 128v-7"/><path d="M100 154v8a14 14 0 0 1-14 14H40"/></g><path class="spark" d="M70 106l-10-5M68 116H56M130 106l10-5M132 116h12" stroke="#fde047"/>',
    },
    expired: {
        tone: 'accent',
        css: '@keyframes ea-expired-spin{to{transform:rotate(360deg)}}@keyframes ea-expired-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-expired-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-expired *{animation:none!important}}.ea-expired .hand{transform-origin:100px 112px;animation:ea-expired-sweep 3.2s linear infinite}.ea-expired .left{animation:ea-expired-runout 3.2s linear infinite}.ea-expired .watch{transform-origin:100px 112px;animation:ea-expired-ring 3.2s ease-in-out infinite}.ea-expired .ring-l,.ea-expired .ring-r{opacity:0;animation:ea-expired-rings 3.2s steps(1,end) infinite}@keyframes ea-expired-sweep{0%{transform:rotate(0)}65%,100%{transform:rotate(360deg)}}@keyframes ea-expired-runout{0%{stroke-dashoffset:0;stroke:#34d399}32%{stroke:#fde047}65%,100%{stroke-dashoffset:201;stroke:#f87171}}@keyframes ea-expired-ring{0%,66%,100%{transform:none}70%{transform:rotate(-7deg)}74%{transform:rotate(7deg)}78%{transform:rotate(-6deg)}82%{transform:rotate(6deg)}86%{transform:rotate(-3deg)}90%{transform:none}}@keyframes ea-expired-rings{0%,66%{opacity:0}68%,72%,80%{opacity:1}70%,76%{opacity:0.2}90%,100%{opacity:0}}',
        body: '<g class="watch"><circle cx="100" cy="112" r="44"/><path d="M92 56h16M100 56v12M136 76l8-8" stroke="#cbd5e1"/><circle class="left" cx="100" cy="112" r="32" stroke-width="7" stroke-opacity="0.7" transform="rotate(-90 100 112)" stroke-dasharray="201 201"/><path class="hand" d="M100 112V86" stroke="#fdba74"/><circle cx="100" cy="112" r="4" stroke="#fdba74" fill="#fdba74"/></g><path class="ring-l" d="M50 70l-8-6M46 86h-10" stroke="#fde047"/><path class="ring-r" d="M150 92l8-4M152 106h10" stroke="#fde047"/>',
    },
    'rate-limit': {
        tone: 'red',
        css: '@keyframes ea-rate-limit-spin{to{transform:rotate(360deg)}}@keyframes ea-rate-limit-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-rate-limit-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-rate-limit *{animation:none!important}}.ea-rate-limit .needle{transform-origin:100px 118px;animation:ea-rate-limit-rev 2.4s ease-in-out infinite}.ea-rate-limit .hot{opacity:0;animation:ea-rate-limit-hot 2.4s steps(1,end) infinite}@keyframes ea-rate-limit-rev{0%{transform:rotate(-80deg)}45%{transform:rotate(68deg)}52%{transform:rotate(60deg)}58%{transform:rotate(70deg)}64%{transform:rotate(62deg)}70%{transform:rotate(69deg)}100%{transform:rotate(-80deg)}}@keyframes ea-rate-limit-hot{0%,44%{opacity:0}46%,52%,60%,68%{opacity:1}49%,56%,64%{opacity:0.2}72%,100%{opacity:0}}',
        body: '<path d="M46.0 116.1A54 54 0 0 1 52.3 92.6" stroke="#86efac" stroke-width="4"/><path d="M54.2 89.4A54 54 0 0 1 71.4 72.2" stroke="#bef264" stroke-width="5"/><path d="M74.6 70.3A54 54 0 0 1 98.1 64.0" stroke="#fde047" stroke-width="6"/><path d="M101.9 64.0A54 54 0 0 1 125.4 70.3" stroke="#fdba74" stroke-width="8"/><path d="M128.6 72.2A54 54 0 0 1 145.8 89.4" stroke="#fb923c" stroke-width="10"/><path d="M147.7 92.6A54 54 0 0 1 154.0 116.1" stroke="#f87171" stroke-width="12"/><g class="needle"><path d="M100 118V80"/></g><circle cx="100" cy="118" r="7"/><path d="M66 150h68"/><path class="hot" d="M150 70l6-8M160 82l9-4" stroke="#f87171"/>',
    },
    'server-error': {
        tone: 'red',
        css: '@keyframes ea-server-error-spin{to{transform:rotate(360deg)}}@keyframes ea-server-error-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-server-error-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-server-error *{animation:none!important}}.ea-server-error .flame{transform-origin:100px 102px;animation:ea-server-error-flicker 1.2s ease-in-out infinite}.ea-server-error .core{transform-origin:100px 99px;animation:ea-server-error-flicker 0.6s ease-in-out infinite reverse}@keyframes ea-server-error-flicker{0%,100%{transform:scale(1,1) skewX(0)}25%{transform:scale(0.96,1.06) skewX(-3deg)}50%{transform:scale(1.03,0.95) skewX(2deg)}75%{transform:scale(0.98,1.04) skewX(3deg)}}',
        body: '<rect x="56" y="104" width="88" height="24" rx="7"/><rect x="56" y="132" width="88" height="24" rx="7"/><circle cx="70" cy="116" r="3"/><circle cx="70" cy="144" r="3"/><path d="M90 116h40M90 144h40"/><g class="flame"><path d="M100 42c14 16 22 26 22 40a22 22 0 0 1-44 0c0-10 6-18 12-22 0 8 4 14 10 14 0-12-6-20 0-32z" stroke="#fb923c"/><path class="core" d="M100 74c6 8 9 12 9 16a9 9 0 0 1-18 0c0-4 4-8 9-16z" stroke="#fde047"/></g>',
    },
    maintenance: {
        tone: 'amber',
        css: '@keyframes ea-maintenance-spin{to{transform:rotate(360deg)}}@keyframes ea-maintenance-blink{0%,100%{opacity:1}50%{opacity:0.2}}@keyframes ea-maintenance-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@media (prefers-reduced-motion:reduce){.ea-maintenance *{animation:none!important}}.ea-maintenance .lamp-a{animation:ea-maintenance-blink 0.8s steps(2,jump-none) infinite}.ea-maintenance .lamp-b{animation:ea-maintenance-blink 0.8s steps(2,jump-none) infinite reverse}',
        body: '<rect x="36" y="50" width="128" height="100" rx="10"/><path d="M36 68h128"/><circle cx="48" cy="59" r="2.5"/><circle cx="58" cy="59" r="2.5"/><circle cx="68" cy="59" r="2.5"/><rect x="50" y="98" width="100" height="22" rx="4"/><path d="M62 120l14-22M86 120l14-22M110 120l14-22M134 120l12-20" stroke="#fef3c7"/><path d="M64 120v20M136 120v20M56 140h16M128 140h16"/><path d="M64 98v-6M136 98v-6"/><circle class="lamp-a" cx="64" cy="86" r="6" stroke="#fb923c" fill="#fb923c"/><circle class="lamp-b" cx="136" cy="86" r="6" stroke="#fb923c" fill="#fb923c"/>',
    },
};

/**
 * Animated line drawings for full-page messages (installing, suspended, errors, ...), drawn in the tone of
 * the message on a soft disc. The HTTP error pages use the same drawings (resources/views/errors/art.blade.php).
 */
export default ({ name, tone, className }: { name: ErrorArtName; tone?: ErrorArtTone; className?: string }) => {
    const art = arts[name];
    const colours = tones[tone || art.tone];

    return (
        <svg
            aria-hidden
            viewBox={'0 0 200 200'}
            className={`error-art ea-${name}${className ? ' ' + className : ''}`}
            fill={'none'}
            stroke={colours.line}
            color={colours.line}
            strokeWidth={5}
            strokeLinecap={'round'}
            strokeLinejoin={'round'}
            dangerouslySetInnerHTML={{
                __html: `<style>${art.css}</style><circle cx="100" cy="104" r="68" fill="${colours.soft}" stroke="none"/>${art.body}`,
            }}
        />
    );
};
