import React, { forwardRef, useEffect } from 'react';
import { Form } from 'formik';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import LanguageSwitcher from '@/components/elements/LanguageSwitcher';
import BrandMark from '@/components/elements/BrandMark';

import { themeConfig } from '@/lib/theme';
import SiteFooter from '@/components/elements/SiteFooter';
import { __ } from '@/i18n';
type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data?.name || 'Pterodactyl');
    const recaptcha = useStoreState((state: ApplicationStore) => state.settings.data?.recaptcha.enabled);

    // The login page has its own set of backgrounds (Admin → Settings → Appearance).
    useEffect(() => {
        const background = (window as any).GlassBackground;
        background?.use('login');

        return () => background?.use('page');
    }, []);

    return (
        <div css={tw`relative min-h-screen flex flex-col items-center justify-center px-4 py-20`}>
            <div css={tw`absolute top-4 right-4 sm:top-6 sm:right-6`}>
                <LanguageSwitcher variant={'segmented'} />
            </div>

            <div
                className={'glass-strong enter'}
                css={tw`w-full rounded-3xl overflow-hidden grid md:grid-cols-2`}
                style={{
                    maxWidth: 880,
                    ...(themeConfig.loginBackground ? { background: 'rgba(10, 14, 26, 0.74)' } : {}),
                }}
            >
                {/* Brand panel: beside the form on wide screens, a compact header on phones. */}
                <div
                    css={tw`relative flex md:flex-col items-center md:justify-center gap-4 md:gap-5 px-7 pt-7 md:p-10 text-left md:text-center`}
                >
                    <div
                        aria-hidden
                        css={tw`hidden md:block absolute inset-0 pointer-events-none`}
                        style={{
                            background:
                                'radial-gradient(420px circle at 30% 20%, rgb(var(--ac-a-l) / .28), transparent 70%), radial-gradient(360px circle at 80% 90%, rgb(var(--ac-b-l) / .18), transparent 70%)',
                            borderRight: '1px solid rgba(255,255,255,.06)',
                        }}
                    />
                    <span css={tw`relative md:hidden`}>
                        <BrandMark size={48} />
                    </span>
                    <span css={tw`relative hidden md:block`}>
                        <BrandMark size={112} />
                    </span>
                    <div css={tw`relative`}>
                        <p css={tw`text-xl md:text-3xl font-bold text-neutral-50 leading-tight`}>{name}</p>
                        <p css={tw`mt-1 md:mt-2 text-sm text-neutral-400`}>
                            {themeConfig.loginSubtitle || __('Server control panel')}
                        </p>
                    </div>
                </div>

                <div css={tw`p-7 sm:p-10`}>
                    {title && <h2 css={tw`text-2xl text-neutral-50 font-bold mb-6`}>{title}</h2>}
                    <FlashMessageRender css={tw`mb-4`} />
                    <Form {...props} ref={ref}>
                        <div css={tw`w-full`}>{props.children}</div>
                    </Form>
                    {recaptcha && (
                        <p css={tw`mt-6 text-center text-xs text-neutral-500 leading-relaxed`}>
                            {__('This site is protected by reCAPTCHA. The Google')}{' '}
                            <a
                                href={'https://policies.google.com/privacy'}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                                css={tw`text-neutral-400 hover:text-neutral-200`}
                            >
                                {__('Privacy Policy')}
                            </a>{' '}
                            {__('and')}{' '}
                            <a
                                href={'https://policies.google.com/terms'}
                                target={'_blank'}
                                rel={'noopener noreferrer'}
                                css={tw`text-neutral-400 hover:text-neutral-200`}
                            >
                                {__('Terms of Service')}
                            </a>{' '}
                            {__('apply.')}
                        </p>
                    )}
                </div>
            </div>

            <SiteFooter css={tw`mt-6`} />
        </div>
    );
});
