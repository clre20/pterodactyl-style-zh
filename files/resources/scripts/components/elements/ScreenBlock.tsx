import React from 'react';
import { Link } from 'react-router-dom';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome, faSyncAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { IllustrationTone } from '@/components/elements/Illustration';
import ErrorArt, { ErrorArtName } from '@/components/elements/ErrorArt';
import tw from 'twin.macro';
import NotFoundSvg from '@/assets/images/not_found.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';

import { __ } from '@/i18n';
interface BaseProps {
    title: string;
    /** Legacy picture. It only selects the default drawing now; pass "art" to choose one. */
    image: string;
    message: string;
    /** Which line drawing to show beside the text. */
    art?: ErrorArtName;
    /** Kept for callers that still pass an icon; the drawing is chosen by "art". */
    icon?: IconDefinition;
    tone?: IllustrationTone;
    /** No longer used: every drawing is animated. Kept so older callers still compile. */
    busy?: boolean;
    onRetry?: () => void;
    onBack?: () => void;
}

interface PropsWithRetry extends BaseProps {
    onRetry?: () => void;
    onBack?: never;
}

interface PropsWithBack extends BaseProps {
    onBack?: () => void;
    onRetry?: never;
}

export type ScreenBlockProps = PropsWithBack | PropsWithRetry;

// The old SVG pictures were drawn for a light page. Each one maps to a line drawing instead.
const defaults: Record<string, ErrorArtName> = {
    [NotFoundSvg]: 'not-found',
    [ServerErrorSvg]: 'error',
};

const actionClass =
    'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold no-underline transition-transform duration-150 hover:-translate-y-0.5';

const ScreenBlock = ({ title, image, message, art, onBack, onRetry }: ScreenBlockProps) => {
    // Each drawing carries its own tone, so the colour always matches the picture.
    const drawing: ErrorArtName = art || defaults[image] || 'installing';
    const isNotFound = image === NotFoundSvg;

    return (
        <PageContentBlock>
            <div css={tw`flex justify-center`}>
                <div
                    className={'glass enter'}
                    css={tw`w-full max-w-3xl rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-10`}
                >
                    <ErrorArt name={drawing} className={'w-44 sm:w-56 flex-none'} />
                    <div css={tw`min-w-0 text-center sm:text-left`}>
                        <h2
                            className={isNotFound ? 'accent-text' : undefined}
                            css={[
                                tw`font-extrabold text-neutral-50 leading-none`,
                                isNotFound ? tw`text-7xl tracking-tight` : tw`text-3xl leading-tight`,
                            ]}
                        >
                            {title}
                        </h2>
                        {isNotFound && (
                            <p css={tw`mt-3 text-xl font-semibold text-neutral-50`}>{__('Page not found')}</p>
                        )}
                        <p css={tw`mt-2 text-sm text-neutral-300 leading-relaxed`}>{message}</p>
                        <div css={tw`mt-6 flex flex-wrap gap-3 justify-center sm:justify-start`}>
                            {typeof onRetry === 'function' && (
                                <button
                                    type={'button'}
                                    onClick={onRetry}
                                    className={`${actionClass} accent-gradient text-white`}
                                >
                                    <FontAwesomeIcon icon={faSyncAlt} />
                                    {__('Try again')}
                                </button>
                            )}
                            {typeof onBack === 'function' && (
                                <button
                                    type={'button'}
                                    onClick={onBack}
                                    className={`${actionClass} accent-gradient text-white`}
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} />
                                    {__('Go back')}
                                </button>
                            )}
                            {isNotFound && typeof onBack !== 'function' && (
                                <Link to={'/'} className={`${actionClass} accent-gradient text-white`}>
                                    <FontAwesomeIcon icon={faHome} />
                                    {__('Back to home')}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageContentBlock>
    );
};

type ServerErrorProps = (Omit<PropsWithBack, 'image' | 'title'> | Omit<PropsWithRetry, 'image' | 'title'>) & {
    title?: string;
};

const ServerError = ({ title, ...props }: ServerErrorProps) => (
    <ScreenBlock title={title || __('Something went wrong')} image={ServerErrorSvg} {...props} />
);

const NotFound = ({ title, message, onBack }: Partial<Pick<ScreenBlockProps, 'title' | 'message' | 'onBack'>>) => (
    <ScreenBlock
        title={title || '404'}
        image={NotFoundSvg}
        message={message || __('The requested resource was not found.')}
        onBack={onBack}
    />
);

export { ServerError, NotFound };
export default ScreenBlock;
