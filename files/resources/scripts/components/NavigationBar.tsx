import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Announcement from '@/components/elements/Announcement';
import BrandMark from '@/components/elements/BrandMark';
import LanguageSwitcher from '@/components/elements/LanguageSwitcher';

import { __ } from '@/i18n';
const RightNavigation = styled.div`
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center gap-2 h-10 no-underline text-neutral-300 px-3 rounded-xl cursor-pointer transition-all duration-150 text-sm whitespace-nowrap`};

        &:hover {
            ${tw`text-white`};
            background: rgba(255, 255, 255, 0.06);
        }

        &.active {
            ${tw`text-white`};
            background: rgb(var(--ac-a-l) / 0.18);
        }
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <div className={'relative z-30 w-full px-3 sm:px-4 pt-3 sm:pt-5'}>
            <SpinnerOverlay visible={isLoggingOut} fixed />
            <div
                className={
                    'glass relative z-20 mx-auto w-full flex flex-wrap items-center justify-between gap-2 min-h-[3.75rem] max-w-[1200px] rounded-2xl pl-4 pr-2 py-2'
                }
            >
                <div id={'logo'} className={'flex-1 min-w-0'}>
                    <Link
                        to={'/'}
                        className={
                            'inline-flex items-center gap-3 text-lg font-header font-semibold no-underline text-neutral-50 hover:text-white transition-colors duration-150'
                        }
                    >
                        <BrandMark />
                        <span className={'hidden sm:inline truncate'}>{name}</span>
                    </Link>
                </div>
                <RightNavigation className={'flex items-center gap-0.5 sm:gap-1'}>
                    <SearchContainer />
                    <NavLink to={'/'} exact aria-label={__('Dashboard')}>
                        <FontAwesomeIcon icon={faLayerGroup} />
                        <span className={'hidden md:inline'}>{__('Servers')}</span>
                    </NavLink>
                    <NavLink to={'/account'} aria-label={__('Account Settings')}>
                        <FontAwesomeIcon icon={faUserCircle} />
                        <span className={'hidden md:inline'}>{__('Account Settings')}</span>
                    </NavLink>
                    {rootAdmin && (
                        <a href={'/admin'} rel={'noreferrer'} aria-label={__('Admin')}>
                            <FontAwesomeIcon icon={faCogs} />
                            <span className={'hidden md:inline'}>{__('Admin')}</span>
                        </a>
                    )}
                    <LanguageSwitcher className={'ml-1'} />
                    <Tooltip placement={'bottom'} content={__('Sign Out')}>
                        <button onClick={onTriggerLogout} aria-label={__('Sign Out')}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </Tooltip>
                </RightNavigation>
            </div>
            <Announcement />
        </div>
    );
};
