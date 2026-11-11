import React from 'react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import Illustration, { IllustrationTone } from '@/components/elements/Illustration';

interface Props {
    icon: IconDefinition;
    title: string;
    message?: React.ReactNode;
    tone?: IllustrationTone;
    /** Buttons or links that lead the user to the next step. */
    children?: React.ReactNode;
    /** Drop the glass panel when the state already sits inside a box. */
    bare?: boolean;
    className?: string;
}

/**
 * Shown where a list has nothing in it yet: says what belongs here and, where there
 * is one, offers the action that fills it.
 */
export default ({ icon, title, message, tone = 'neutral', children, bare, className }: Props) => (
    <div
        className={classNames(
            'enter flex flex-col items-center px-6 py-10 text-center',
            !bare && 'glass rounded-2xl',
            className
        )}
    >
        <Illustration icon={icon} tone={tone} size={124} />
        <h3 className={'mt-5 text-lg font-semibold text-neutral-50'}>{title}</h3>
        {message && <p className={'mt-1 max-w-md text-sm leading-relaxed text-neutral-400'}>{message}</p>}
        {children && <div className={'mt-5 flex flex-wrap items-center justify-center gap-3'}>{children}</div>}
    </div>
);
