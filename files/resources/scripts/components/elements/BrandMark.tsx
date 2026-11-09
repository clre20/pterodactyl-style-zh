import React from 'react';

const customLogo = (window as unknown as { BrandLogo?: string }).BrandLogo;

/**
 * The logo used in the navigation bar and login page. A custom image placed at
 * public/brand/logo.* on the server replaces the default gradient tile.
 */
export default ({ size = 34 }: { size?: number }) =>
    customLogo ? (
        <img
            src={customLogo}
            alt={''}
            aria-hidden
            className={'flex-none object-contain'}
            style={{ width: size, height: size, borderRadius: Math.round(size * 0.24) }}
        />
    ) : (
    <span
        aria-hidden
        className={'inline-flex items-center justify-center flex-none accent-gradient'}
        style={{
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.3),
            backgroundImage: 'linear-gradient(135deg, #818cf8, #22d3ee)',
        }}
    >
        <svg
            width={size * 0.52}
            height={size * 0.52}
            viewBox={'0 0 24 24'}
            fill={'none'}
            stroke={'#0b1020'}
            strokeWidth={2.3}
            strokeLinecap={'round'}
            strokeLinejoin={'round'}
        >
            <path d={'M4 18 12 5l8 13'} />
            <path d={'M8 13h8'} />
        </svg>
    </span>
);
