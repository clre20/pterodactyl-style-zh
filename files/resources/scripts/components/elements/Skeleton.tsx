import React from 'react';
import classNames from 'classnames';

interface ListProps {
    /** How many placeholder rows to draw. */
    rows?: number;
    /** "card" matches a server card, "row" a list entry, "file" a file manager line. */
    variant?: 'card' | 'row' | 'file';
    className?: string;
}

const heights = { card: 'h-[5.5rem]', row: 'h-16', file: 'h-11' };

export const SkeletonLine = ({ className }: { className?: string }) => (
    <span className={classNames('skeleton block rounded-md', className)} />
);

/**
 * Placeholder shown while a list loads. It has the shape of the rows that are about
 * to appear, so the page does not jump when the data arrives.
 */
export const SkeletonList = ({ rows = 4, variant = 'row', className }: ListProps) => (
    <div
        role={'status'}
        aria-busy
        aria-live={'polite'}
        className={classNames(variant === 'file' ? 'space-y-1' : 'space-y-2', className)}
    >
        {Array.from({ length: rows }).map((_, index) => (
            <div
                key={index}
                className={classNames('glass flex items-center gap-4 rounded-2xl px-4', heights[variant])}
                style={{ opacity: 1 - index * (0.6 / rows) }}
            >
                <SkeletonLine
                    className={variant === 'card' ? 'h-12 w-12 flex-none !rounded-xl' : 'h-6 w-6 flex-none'}
                />
                <div className={'min-w-0 flex-1 space-y-2'}>
                    <SkeletonLine className={'h-3 w-1/3'} />
                    {variant !== 'file' && <SkeletonLine className={'h-2.5 w-1/5'} />}
                </div>
                <SkeletonLine className={'hidden h-3 w-24 sm:block'} />
                {variant === 'card' && <SkeletonLine className={'hidden h-3 w-24 md:block'} />}
            </div>
        ))}
    </div>
);

export default SkeletonList;
