import React from 'react';

export type ErrorArtName = 'plug' | 'file' | 'lock' | 'gear';
export type ErrorArtTone = 'accent' | 'amber' | 'red';

const tones: Record<ErrorArtTone, { line: string; soft: string }> = {
    accent: { line: 'rgb(var(--primary-300))', soft: 'rgb(var(--ac-a) / 0.16)' },
    amber: { line: '#fcd34d', soft: 'rgba(245, 158, 11, 0.14)' },
    red: { line: '#fca5a5', soft: 'rgba(239, 68, 68, 0.15)' },
};

const drawings: Record<ErrorArtName, React.ReactNode> = {
    plug: (
        <>
            <path d='M200 44h-84a16 16 0 0 0-16 16v14' />
            <rect x='84' y='74' width='32' height='24' rx='6' />
            <path d='M92 98v12M108 98v12' />
            <rect x='82' y='128' width='36' height='26' rx='7' />
            <path d='M92 128v-7M108 128v-7' />
            <path d='M100 154v14a16 16 0 0 1-16 16H52a16 16 0 0 0-16 16' />
            <path className='spark' d='M70 106l-10-5M68 116H56M130 106l10-5M132 116h12' />
        </>
    ),
    file: (
        <>
            <path d='M64 30h52l32 32v100a10 10 0 0 1-10 10H64a10 10 0 0 1-10-10V40a10 10 0 0 1 10-10z' />
            <path d='M116 30v22a10 10 0 0 0 10 10h22' />
            <path d='M76 96l12 12M88 96l-12 12M112 96l12 12M124 96l-12 12' />
            <path d='M82 142q18-16 36 0' />
        </>
    ),
    lock: (
        <>
            <rect x='58' y='92' width='84' height='70' rx='12' />
            <path d='M76 92V72a24 24 0 0 1 48 0v20' />
            <circle cx='100' cy='120' r='7' />
            <path d='M100 127v14' />
        </>
    ),
    gear: (
        <>
            <g className='turn'>
                <circle cx='100' cy='100' r='16' />
                <circle cx='100' cy='100' r='36' />
                <path d='M100 52v12M100 136v12M52 100h12M136 100h12M66 66l8.5 8.5M125.500 125.500l8.500 8.500M66 134l8.500-8.500M125.500 74.500l8.500-8.500' />
            </g>
        </>
    ),
};

/**
 * Line drawings for full-page messages: an unplugged cable (not found / disconnected),
 * a sad file (something broke), a padlock (no access) and a cog (work in progress).
 * Drawn in the tone of the message on a soft disc. The same drawings are used by the
 * panel's HTTP error pages (resources/views/errors/art.blade.php).
 */
export default ({
    name,
    tone = 'accent',
    busy,
    className,
}: {
    name: ErrorArtName;
    tone?: ErrorArtTone;
    /** Turn the cog while work is in progress. */
    busy?: boolean;
    className?: string;
}) => (
    <svg
        aria-hidden
        viewBox={'0 0 200 200'}
        className={`error-art${busy ? ' busy' : ''}${className ? ' ' + className : ''}`}
        fill={'none'}
        stroke={tones[tone].line}
        strokeWidth={5}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
    >
        <circle cx={100} cy={104} r={68} fill={tones[tone].soft} stroke={'none'} />
        {drawings[name]}
    </svg>
);
