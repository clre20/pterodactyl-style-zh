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
import {
    faCheckCircle,
    faLayerGroup,
    faList,
    faSearch,
    faServer,
    faStopCircle,
    faThLarge,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { ip } from '@/lib/formatters';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ServerPowerState } from '@/api/server/getServerResourceUsage';

const StatCard = ({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: React.ReactNode;
    icon: IconDefinition;
    color: string;
}) => (
    <div className={'glass relative overflow-hidden rounded-2xl px-5 py-4'}>
        <FontAwesomeIcon icon={icon} className={'watermark'} style={{ color }} />
        <p className={'text-sm text-neutral-400'}>{label}</p>
        <p className={'mt-1 text-3xl font-semibold tabular-nums'} style={{ color }}>
            {value}
        </p>
    </div>
);

import { SkeletonList } from '@/components/elements/Skeleton';
import EmptyState from '@/components/elements/EmptyState';
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
    // How the list is shown is a personal preference, remembered per account in this browser.
    const [view, setView] = usePersistedState<'list' | 'grid'>(`${uuid}:server_view`, 'list');
    const [grouped, setGrouped] = usePersistedState<boolean>(`${uuid}:server_grouped`, false);
    const [pinned, setPinned] = usePersistedState<string[]>(`${uuid}:server_pinned`, []);
    const [filter, setFilter] = useState('');
    const togglePin = useCallback(
        (id: string) =>
            setPinned((current) =>
                (current || []).includes(id) ? (current || []).filter((v) => v !== id) : [...(current || []), id]
            ),
        []
    );

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
                <h1 className={'text-3xl font-bold text-neutral-50'}>
                    {__('Welcome back, {{name}}', { name: username })}
                </h1>
                {rootAdmin && (
                    <label className={'glass flex items-center gap-3 rounded-xl px-4 h-11 cursor-pointer'}>
                        <span className={'text-sm text-neutral-300'}>
                            {showOnlyAdmin ? __("Showing others' servers") : __('Showing your servers')}
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
                    <StatCard label={__('Running')} value={runningCount} icon={faCheckCircle} color={'#6ee7b7'} />
                    <StatCard label={__('Stopped')} value={stoppedCount} icon={faStopCircle} color={'#fca5a5'} />
                    <StatCard label={__('Total')} value={servers.items.length} icon={faServer} color={'#c7d2fe'} />
                </div>
            )}
            {servers && servers.items.length > 1 && (
                <div className={'mb-4 flex flex-wrap items-center gap-2'}>
                    <label
                        className={
                            'glass flex h-10 min-w-[12rem] flex-1 items-center gap-2 rounded-xl px-3 sm:max-w-xs'
                        }
                    >
                        <FontAwesomeIcon icon={faSearch} className={'text-neutral-400'} />
                        <input
                            type={'search'}
                            value={filter}
                            onChange={(e) => setFilter(e.currentTarget.value)}
                            placeholder={__('Filter servers')}
                            aria-label={__('Filter servers')}
                            className={
                                'h-full w-full bg-transparent text-sm text-neutral-100 placeholder-neutral-500 outline-none'
                            }
                        />
                    </label>
                    <div className={'ml-auto flex items-center gap-2'}>
                        <button
                            type={'button'}
                            aria-pressed={!!grouped}
                            onClick={() => setGrouped((v) => !v)}
                            className={classNames(
                                'glass flex h-10 items-center gap-2 rounded-xl px-3 text-sm transition-colors duration-150',
                                grouped ? 'text-neutral-50 !bg-white/15' : 'text-neutral-400 hover:text-neutral-100'
                            )}
                        >
                            <FontAwesomeIcon icon={faLayerGroup} />
                            <span className={'hidden sm:inline'}>{__('Group by node')}</span>
                        </button>
                        <div
                            className={'glass flex h-10 items-center rounded-xl p-1'}
                            role={'group'}
                            aria-label={__('Layout')}
                        >
                            {(
                                [
                                    ['list', faList, __('List')],
                                    ['grid', faThLarge, __('Cards')],
                                ] as const
                            ).map(([value, icon, label]) => (
                                <button
                                    key={value}
                                    type={'button'}
                                    title={label}
                                    aria-label={label}
                                    aria-pressed={view === value}
                                    onClick={() => setView(value)}
                                    className={classNames(
                                        'flex h-8 w-9 items-center justify-center rounded-lg transition-colors duration-150',
                                        view === value
                                            ? 'bg-white/15 text-neutral-50'
                                            : 'text-neutral-400 hover:text-neutral-100'
                                    )}
                                >
                                    <FontAwesomeIcon icon={icon} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {!servers ? (
                <SkeletonList rows={3} variant={'card'} />
            ) : (
                <Pagination data={servers} onPageSelect={setPage}>
                    {({ items }) => {
                        const needle = filter.trim().toLowerCase();
                        const isPinned = (server: Server) => (pinned || []).includes(server.uuid);
                        const visible = items
                            .filter(
                                (server) =>
                                    !needle ||
                                    [
                                        server.name,
                                        server.description,
                                        server.node,
                                        ...server.allocations.map((a) => `${a.alias || ip(a.ip)}:${a.port}`),
                                    ]
                                        .join(' ')
                                        .toLowerCase()
                                        .includes(needle)
                            )
                            // Pinned servers first; otherwise keep the order the panel returned.
                            .map((server, index) => ({ server, index }))
                            .sort(
                                (a, b) => Number(isPinned(b.server)) - Number(isPinned(a.server)) || a.index - b.index
                            )
                            .map(({ server }) => server);

                        const groups: [string | null, Server[]][] = grouped
                            ? Array.from(
                                  visible.reduce(
                                      (map, server) => map.set(server.node, [...(map.get(server.node) || []), server]),
                                      new Map<string, Server[]>()
                                  )
                              )
                            : [[null, visible]];

                        const list = (rows: Server[]) => (
                            <div
                                className={classNames(
                                    'stagger',
                                    view === 'grid'
                                        ? 'grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'
                                        : 'flex flex-col gap-3'
                                )}
                            >
                                {rows.map((server) => (
                                    <ServerRow
                                        key={server.uuid}
                                        server={server}
                                        onStatus={onStatus}
                                        view={view === 'grid' ? 'grid' : 'list'}
                                        pinned={isPinned(server)}
                                        onTogglePin={togglePin}
                                    />
                                ))}
                            </div>
                        );

                        return items.length > 0 ? (
                            visible.length === 0 ? (
                                <EmptyState
                                    icon={faSearch}
                                    title={__('No matching servers')}
                                    message={__('No server matches "{{filter}}".', { filter: filter.trim() })}
                                />
                            ) : (
                                <div className={'flex flex-col gap-6'}>
                                    {groups.map(([node, rows]) => (
                                        <section key={node || 'all'}>
                                            {node && (
                                                <h2
                                                    className={
                                                        'mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-300'
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faLayerGroup}
                                                        className={'text-neutral-500'}
                                                    />
                                                    {node}
                                                    <span
                                                        className={
                                                            'rounded-full bg-white/10 px-2 text-xs tabular-nums text-neutral-400'
                                                        }
                                                    >
                                                        {rows.length}
                                                    </span>
                                                </h2>
                                            )}
                                            {list(rows)}
                                        </section>
                                    ))}
                                </div>
                            )
                        ) : (
                            <EmptyState
                                icon={faServer}
                                tone={'accent'}
                                title={showOnlyAdmin ? __('No other servers') : __('No servers yet')}
                                message={
                                    showOnlyAdmin
                                        ? __('There are no other servers to display.')
                                        : rootAdmin
                                        ? __('Create your first server in the admin area and it will appear here.')
                                        : __('There are no servers associated with your account.')
                                }
                            >
                                {rootAdmin && !showOnlyAdmin && (
                                    <a
                                        href={'/admin/servers/new'}
                                        className={
                                            'accent-gradient inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white no-underline'
                                        }
                                    >
                                        {__('Create a server')}
                                    </a>
                                )}
                            </EmptyState>
                        );
                    }}
                </Pagination>
            )}
        </PageContentBlock>
    );
};
