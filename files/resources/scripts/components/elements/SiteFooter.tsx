import React from 'react';
import tw from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { themeConfig } from '@/lib/theme';
import { __ } from '@/i18n';

/**
 * Footer shared by the login pages and the client area: the owner's optional
 * footer text, then the copyright line.
 */
export default ({ className }: { className?: string }) => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data?.name || 'Pterodactyl');

    return (
        <div className={className} css={tw`text-center text-neutral-500 text-xs leading-relaxed`}>
            {themeConfig.footerText && <p css={tw`text-neutral-400 mb-1`}>{themeConfig.footerText}</p>}
            <p>
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
};
