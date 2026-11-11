import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBullhorn,
    faCheckCircle,
    faExclamationCircle,
    faExclamationTriangle,
    faTimes,
    IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { AnnouncementLevel, themeConfig } from '@/lib/theme';
import { __ } from '@/i18n';

const STORAGE_KEY = 'panel:announcement-dismissed';

const styles: Record<AnnouncementLevel, { icon: IconDefinition; color: string; tint: string }> = {
    info: { icon: faBullhorn, color: 'rgb(var(--primary-300))', tint: 'rgb(var(--ac-a) / 0.16)' },
    success: { icon: faCheckCircle, color: '#6ee7b7', tint: 'rgba(16, 185, 129, 0.14)' },
    warning: { icon: faExclamationTriangle, color: '#fcd34d', tint: 'rgba(245, 158, 11, 0.14)' },
    danger: { icon: faExclamationCircle, color: '#fca5a5', tint: 'rgba(239, 68, 68, 0.16)' },
};

const wasDismissed = (id: string): boolean => {
    try {
        return localStorage.getItem(STORAGE_KEY) === id;
    } catch (e) {
        return false;
    }
};

/**
 * The panel owner's announcement (Admin → Settings → Appearance). Dismissing it is
 * remembered per browser until the message changes.
 */
export default () => {
    const announcement = themeConfig.announcement;
    const [hidden, setHidden] = useState(() => !announcement || wasDismissed(announcement.id));

    if (!announcement || hidden) {
        return null;
    }

    const style = styles[announcement.level] || styles.info;

    const dismiss = () => {
        try {
            localStorage.setItem(STORAGE_KEY, announcement.id);
        } catch (e) {
            // Private mode: it simply comes back on the next page load.
        }
        setHidden(true);
    };

    return (
        <div
            role={announcement.level === 'danger' ? 'alert' : 'status'}
            className={'glass enter mx-auto mt-3 flex w-full max-w-[1200px] items-start gap-3 rounded-2xl py-3 pl-4 pr-2'}
            style={{ backgroundImage: `linear-gradient(90deg, ${style.tint}, transparent 70%)` }}
        >
            <FontAwesomeIcon icon={style.icon} className={'mt-1 flex-none'} style={{ color: style.color }} />
            <p className={'min-w-0 flex-1 whitespace-pre-line break-words text-sm leading-relaxed text-neutral-100'}>
                {announcement.text}
            </p>
            <button
                type={'button'}
                onClick={dismiss}
                aria-label={__('Dismiss')}
                className={
                    'flex h-8 w-8 flex-none items-center justify-center rounded-lg text-neutral-400 transition-colors duration-150 hover:bg-white/10 hover:text-neutral-100'
                }
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </div>
    );
};
