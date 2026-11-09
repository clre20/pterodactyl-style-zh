import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface GaugeProps {
    /** Ring fill from 0 to 1. */
    fraction: number;
    /** Text in the centre of the ring. */
    value: string;
    /** Small caption under the value inside the ring. */
    caption: string;
    color: string;
    size?: number;
    label?: string;
}

const R = 50;
const CIRCUMFERENCE = 2 * Math.PI * R;

export const Ring = ({ fraction, value, caption, color, size = 96, label }: GaugeProps) => {
    const clamped = Math.min(Math.max(fraction, 0), 1);
    const ring = clamped >= 0.9 ? '#f87171' : clamped >= 0.8 ? '#fbbf24' : color;

    return (
        <svg
            viewBox={'0 0 120 120'}
            role={'img'}
            aria-label={label || `${caption} ${value}`}
            className={'flex-none w-[4.75rem] h-[4.75rem] sm:w-24 sm:h-24'}
            style={{ maxWidth: size, maxHeight: size }}
            width={size}
            height={size}
        >
            <circle cx={60} cy={60} r={R} fill={'none'} stroke={'rgba(255,255,255,0.08)'} strokeWidth={11} />
            {/* Below half a percent the round line cap would draw a lone dot. */}
            {clamped >= 0.005 && (
                <circle
                    cx={60}
                    cy={60}
                    r={R}
                    fill={'none'}
                    stroke={ring}
                    strokeWidth={11}
                    strokeLinecap={'round'}
                    strokeDasharray={`${Math.max(clamped * CIRCUMFERENCE, 1)} ${CIRCUMFERENCE}`}
                    transform={'rotate(-90 60 60)'}
                    style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.2, 0.7, 0.2, 1), stroke 0.3s' }}
                />
            )}
            <text x={60} y={value.length > 6 ? 63 : 64} textAnchor={'middle'} fill={'#e6e9f2'} fontSize={value.length > 6 ? 17 : 22} fontWeight={600} fontFamily={'Inter, sans-serif'}>
                {value}
            </text>
            <text x={60} y={82} textAnchor={'middle'} fill={'#94a0b8'} fontSize={11} fontFamily={'Inter, sans-serif'}>
                {caption}
            </text>
        </svg>
    );
};

interface CardProps extends GaugeProps {
    title: string;
    icon: IconDefinition;
    children?: React.ReactNode;
}

/** A glass card with a circular gauge, a title, detail lines and a faint watermark icon. */
export default ({ title, icon, children, ...gauge }: CardProps) => (
    <div
        className={
            'glass relative overflow-hidden rounded-2xl p-3 sm:p-5 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left'
        }
    >
        <FontAwesomeIcon icon={icon} className={'watermark hidden sm:block'} style={{ color: gauge.color }} />
        <Ring {...gauge} />
        <div className={'relative min-w-0'}>
            <p className={'text-xs sm:text-[0.95rem] font-bold text-neutral-50'}>{title}</p>
            <div className={'hidden sm:block mt-1 text-xs text-neutral-400 space-y-0.5'}>{children}</div>
        </div>
    </div>
);
