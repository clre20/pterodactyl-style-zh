import React, { useCallback, useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faStopCircle, faServer } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ServerPowerState } from '@/api/server/getServerResourceUsage';

const StatCard = ({ label, value, icon, color }: { label: string; value: React.ReactNode; icon: IconDefinition; color: string }) => (
    <div className={'glass relative overflow-hidden rounded-2xl px-5 py-4'}>
        <FontAwesomeIcon icon={icon} className={'watermark'} style={{ color }} />
        <p className={'text-sm text-neutral-400'}>{label}</p>
        <p className={'mt-1 text-3xl font-semibold tabular-nums'} style={{ color }}>
            {value}
        </p>
    </div>
);

import { __ } from '@/i18n';
export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const username = useStoreState((state) => state.user.data!.username);
    const [statuses, setStatuses] = useState<Record<string, ServerPowerState | undefined>>({});
    const onStatus = useCallback((id: string, status: ServerPowerState | undefined) => {
        setStatuses((current) => (current[id] === status ? current : { ...current, [id]: status }));
    }, []);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        setPage(1);
    }, [showOnlyAdmin]);

    // Only count the servers that are on screen, so the cards match the list below.
    const listed = (servers?.items || []).map((s) => statuses[s.uuid]);
    const runningCount = listed.filter((v) => v === 'running' || v === 'starting' || v === 'stopping').length;
    const stoppedCount = listed.filter((v) => v === 'offline').length;

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        // Don't use react-router to handle changing this part of the URL, otherwise it
        // triggers a needless re-render. We just want to track this in the URL incase the
        // user refreshes the page.
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    return (
        <PageContentBlock title={__('Dashboard')} showFlashKey={'dashboard'}>
            <div className={'flex flex-wrap items-end justify-between gap-4 mb-6'}>
                <h1 className={'text-3xl font-bold text-neutral-50'}>{__('Welcome back, {{name}}', { name: username })}</h1>
                {rootAdmin && (
                    <label className={'glass flex items-center gap-3 rounded-xl px-4 h-11 cursor-pointer'}>
                        <span className={'text-sm text-neutral-300'}>
                            {showOnlyAdmin ? __('Showing others\' servers') : __('Showing your servers')}
                        </span>
                        <Switch
                            name={'show_all_servers'}
                            defaultChecked={showOnlyAdmin}
                            onChange={() => setShowOnlyAdmin((s) => !s)}
                        />
                    </label>
                )}
            </div>
            {servers && servers.items.length > 0 && (
                <div className={'grid grid-cols-3 gap-3 sm:gap-4 mb-6 stagger'}>
                    <StatCard
                        label={__('Running')}
                        value={runningCount}
                        icon={faCheckCircle}
                        color={'#6ee7b7'}
                    />
                    <StatCard
                        label={__('Stopped')}
                        value={stoppedCount}
                        icon={faStopCircle}
                        color={'#fca5a5'}
                    />
                    <StatCard label={__('Total')} value={servers.items.length} icon={faServer} color={'#c7d2fe'} />
                </div>
            )}
            {!servers ? (
                <Spinner centered size={'large'} />
            ) : (
                <Pagination data={servers} onPageSelect={setPage}>
                    {({ items }) =>
                        items.length > 0 ? (
                            <div className={'flex flex-col gap-3 stagger'}>
                                {items.map((server) => (
                                    <ServerRow key={server.uuid} server={server} onStatus={onStatus} />
                                ))}
                            </div>
                        ) : (
                            <p css={tw`text-center text-sm text-neutral-400`}>
                                {showOnlyAdmin
                                    ? __('There are no other servers to display.')
                                    : __('There are no servers associated with your account.')}
                            </p>
                        )
                    }
                </Pagination>
            )}
        </PageContentBlock>
    );
};
