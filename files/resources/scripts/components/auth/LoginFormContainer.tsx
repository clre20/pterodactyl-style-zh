import React, { forwardRef } from 'react';
import { Form } from 'formik';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import LanguageSwitcher from '@/components/elements/LanguageSwitcher';
import BrandMark from '@/components/elements/BrandMark';

import { __ } from '@/i18n';
type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data?.name || 'Pterodactyl');
    const recaptcha = useStoreState((state: ApplicationStore) => state.settings.data?.recaptcha.enabled);

    return (
        <div css={tw`relative min-h-screen flex flex-col items-center justify-center px-4 py-20`}>
            <div css={tw`absolute top-4 right-4 sm:top-6 sm:right-6`}>
                <LanguageSwitcher variant={'segmented'} />
            </div>

            <div
                className={'glass-strong enter'}
                css={tw`w-full rounded-3xl overflow-hidden grid md:grid-cols-2`}
                style={{ maxWidth: 880 }}
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
                                'radial-gradient(420px circle at 30% 20%, rgba(129,140,248,.28), transparent 70%), radial-gradient(360px circle at 80% 90%, rgba(34,211,238,.18), transparent 70%)',
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
                        <p css={tw`mt-1 md:mt-2 text-sm text-neutral-400`}>{__('Server control panel')}</p>
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

            <p css={tw`text-center text-neutral-500 text-xs mt-6`}>
                &copy; {new Date().getFullYear()} {name} &middot; {__('Powered by')}{' '}
                <a
                    rel={'noopener nofollow noreferrer'}
                    href={'https://pterodactyl.io'}
                    target={'_blank'}
                    css={tw`no-underline text-neutral-500 hover:text-neutral-300`}
                >
                    Pterodactyl
                </a>
            </p>
        </div>
    );
});
