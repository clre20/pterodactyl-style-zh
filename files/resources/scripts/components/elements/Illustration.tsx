import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type IllustrationTone = 'accent' | 'green' | 'amber' | 'red' | 'neutral';

const tones: Record<IllustrationTone, { glow: string; icon: string }> = {
    accent: { glow: 'rgb(var(--ac-a) / 0.4)', icon: 'rgb(var(--primary-300))' },
    green: { glow: 'rgba(16, 185, 129, 0.36)', icon: '#6ee7b7' },
    amber: { glow: 'rgba(245, 158, 11, 0.34)', icon: '#fcd34d' },
    red: { glow: 'rgba(239, 68, 68, 0.36)', icon: '#fca5a5' },
    neutral: { glow: 'rgba(148, 163, 184, 0.26)', icon: '#cbd5e1' },
};

interface Props {
    icon: IconDefinition;
    tone?: IllustrationTone;
    size?: number;
    /** Spin the icon, for work that is in progress. */
    busy?: boolean;
    className?: string;
}

/**
 * The picture used by empty states and full-page messages: one icon on a glass tile
 * with a soft glow in the tone of the message. Deliberately plain, so the title and
 * the message carry the screen.
 */
export default ({ icon, tone = 'accent', size = 148, busy, className }: Props) => {
    const t = tones[tone];
    const tile = Math.round(size * 0.56);

    return (
        <div
            aria-hidden
            className={className}
            style={{
                position: 'relative',
                width: size,
                height: size,
                margin: '0 auto',
                flex: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${t.glow}, transparent 68%)`,
                }}
            />
            <div
                style={{
                    position: 'relative',
                    width: tile,
                    height: tile,
                    borderRadius: Math.round(tile * 0.28),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(145deg, rgba(255,255,255,.14), rgba(255,255,255,.04))',
                    border: '1px solid rgba(255,255,255,.14)',
                    boxShadow: '0 14px 34px rgba(0,0,0,.35)',
                    color: t.icon,
                    fontSize: Math.round(tile * 0.44),
                }}
            >
                <FontAwesomeIcon icon={icon} spin={busy} />
            </div>
        </div>
    );
};
