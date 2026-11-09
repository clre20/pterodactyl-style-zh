import React, { useState } from 'react';
import classNames from 'classnames';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { LANGUAGES, currentLanguage, rememberLanguage, __ } from '@/i18n';
import updateAccountLanguage from '@/api/account/updateAccountLanguage';
import { GlobeAltIcon } from '@heroicons/react/outline';

interface Props {
    /** "menu" is the compact globe button in the navigation bar, "segmented" the two-button toggle. */
    variant?: 'menu' | 'segmented';
    className?: string;
}

export default ({ variant = 'menu', className }: Props) => {
    const loggedIn = useStoreState((state: ApplicationStore) => !!state.user.data);
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const change = (code: string) => {
        setOpen(false);
        if (code === currentLanguage || busy) return;

        rememberLanguage(code);
        setBusy(true);
        const request = loggedIn ? updateAccountLanguage(code) : Promise.resolve();
        request
            .catch((error) => console.error(error))
            .then(() => {
                // Every translated string is read on render, so a reload switches the whole panel at once.
                window.location.reload();
            });
    };

    if (variant === 'segmented') {
        return (
            <div role={'group'} aria-label={__('Language')} className={classNames('glass flex gap-1 rounded-xl p-1', className)}>
                {LANGUAGES.map((language) => (
                    <button
                        key={language.code}
                        type={'button'}
                        aria-pressed={language.code === currentLanguage}
                        disabled={busy}
                        onClick={() => change(language.code)}
                        className={classNames(
                            'min-h-[2.5rem] px-4 rounded-lg text-sm transition-colors duration-200',
                            language.code === currentLanguage
                                ? 'bg-primary-400/30 text-white font-semibold'
                                : 'text-neutral-300 hover:text-white hover:bg-white/5'
                        )}
                    >
                        {language.label}
                    </button>
                ))}
            </div>
        );
    }

    const active = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

    return (
        <div className={classNames('relative', className)} onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
        }}>
            <button
                type={'button'}
                aria-haspopup={'menu'}
                aria-expanded={open}
                aria-label={`${__('Language')}: ${active.label}`}
                disabled={busy}
                onClick={() => setOpen((v) => !v)}
                className={'flex items-center gap-2 h-10 px-3 rounded-xl text-sm text-neutral-200 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors'}
            >
                <GlobeAltIcon className={'w-4 h-4'} />
                <span className={'hidden sm:inline'}>{active.label}</span>
            </button>
            {open && (
                <div role={'menu'} className={'glass-strong enter absolute right-0 mt-2 w-40 rounded-xl p-1 z-50'}>
                    {LANGUAGES.map((language) => (
                        <button
                            key={language.code}
                            role={'menuitemradio'}
                            aria-checked={language.code === currentLanguage}
                            onClick={() => change(language.code)}
                            className={classNames(
                                'w-full text-left px-3 h-10 rounded-lg text-sm transition-colors',
                                language.code === currentLanguage
                                    ? 'bg-primary-400/25 text-white'
                                    : 'text-neutral-200 hover:bg-white/10'
                            )}
                        >
                            {language.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
