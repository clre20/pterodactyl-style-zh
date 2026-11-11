import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faExchangeAlt, faStar, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import { ServerPowerState } from '@/api/server/getServerResourceUsage';
import { readTrendMetric, saveTrendMetric, TREND_METRICS, TrendMetric, useLiveServer } from '@/lib/liveStats';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
import classNames from 'classnames';
import serverIcon from '@/lib/serverIcon';
import { isMinecraftServer } from '@/lib/minecraft';
import getMinecraftStatus from '@/api/server/getMinecraftStatus';

import ServerTypeIcon from '@/components/elements/ServerTypeIcon';
import { __ } from '@/i18n';
// Determines if the current value is in an alarm threshold so we can show it in red rather
// than the more faded default style.
const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

const Pill = ({
    tone,
    live,
    children,
}: {
    tone: 'green' | 'red' | 'amber' | 'grey';
    /** Adds the breathing ring that marks a server as up right now. */
    live?: boolean;
    children: React.ReactNode;
}) => (
    <span
        className={classNames(
            'inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full border whitespace-nowrap',
            {
                'bg-green-400/15 text-green-300 border-green-400/35': tone === 'green',
                'bg-red-400/15 text-red-300 border-red-400/35': tone === 'red',
                'bg-yellow-400/15 text-yellow-200 border-yellow-400/35': tone === 'amber',
                'bg-white/5 text-neutral-300 border-white/15': tone === 'grey',
            }
        )}
    >
        <span aria-hidden className={classNames('state-dot', live && 'live')} />
        {children}
    </span>
);

/**
 * The chosen metric over the last minute, drawn from the readings this page has collected.
 */
const MIN_POINTS = 8;

const UPLOAD_COLOR = '#fbbf24';

const Sparkline = ({
    values,
    second,
    max,
    color,
    className,
}: {
    values: number[];
    /** A second line on the same scale: upload, next to download. */
    second?: number[];
    max: number;
    color: string;
    className?: string;
}) => {
    if (!values.length) {
        return <div className={className} aria-hidden />;
    }

    // With only a few readings the line is stretched across the width rather than squeezed into a corner.
    const pad = (list: number[]) => [...Array(Math.max(0, MIN_POINTS - list.length)).fill(list[0] || 0), ...list];
    const a = pad(values);
    const b = second && second.length ? pad(second).slice(-a.length) : null;
    const top = Math.max(max, ...a, ...(b || []), 1);
    const path = (list: number[]) => {
        const step = 100 / (list.length - 1);

        return list.map((v, i) => `${(i * step).toFixed(1)},${(22 - (v / top) * 20).toFixed(1)}`).join(' ');
    };
    const line = (points: string, stroke: string) => (
        <polyline
            points={points}
            fill={'none'}
            stroke={stroke}
            strokeWidth={1.5}
            strokeLinejoin={'round'}
            strokeLinecap={'round'}
            vectorEffect={'non-scaling-stroke'}
        />
    );

    return (
        <svg aria-hidden viewBox={'0 0 100 24'} preserveAspectRatio={'none'} className={className}>
            <polygon points={`0,24 ${path(a)} 100,24`} fill={color} opacity={0.14} />
            {b && line(path(b), UPLOAD_COLOR)}
            {line(path(a), color)}
        </svg>
    );
};

const Metric = ({
    label,
    value,
    sub,
    alarm,
}: {
    label: string;
    value: React.ReactNode;
    sub: string;
    alarm: boolean;
}) => (
    <div className={'min-w-0'}>
        <p className={'text-xs text-neutral-400'}>{label}</p>
        <p
            className={classNames(
                'text-[0.95rem] font-semibold tabular-nums truncate',
                alarm ? 'text-red-300' : 'text-neutral-50'
            )}
        >
            {value}
        </p>
        <p className={'text-[0.7rem] text-neutral-500 truncate'}>/ {sub}</p>
    </div>
);

export default ({
    server,
    className,
    onStatus,
    view = 'list',
    pinned,
    onTogglePin,
}: {
    server: Server;
    className?: string;
    onStatus?: (uuid: string, status: ServerPowerState | undefined) => void;
    /** "list" is one wide row per server, "grid" a compact card. */
    view?: 'list' | 'grid';
    pinned?: boolean;
    onTogglePin?: (uuid: string) => void;
}) => {
    const live = useLiveServer(server.uuid);
    const stats = live?.stats || null;
    const isSuspended = stats?.isSuspended || server.status === 'suspended';
    const [metric, setMetric] = useState<TrendMetric>(() => readTrendMetric(server.uuid));

    const [players, setPlayers] = useState<{ online: number; max: number } | null>(null);
    const minecraft = isMinecraftServer(server);
    const running = stats?.status === 'running';

    // Ask a running Minecraft server how many players are on. This is slower-moving than usage.
    useEffect(() => {
        if (!minecraft || !running) {
            setPlayers(null);

            return;
        }
        const ask = () =>
            getMinecraftStatus(server.uuid)
                .then((mc) => setPlayers(mc.reachable ? mc.players : null))
                .catch(() => setPlayers(null));
        ask();
        const timer = setInterval(ask, 20000);

        return () => clearInterval(timer);
    }, [minecraft, running]);

    useEffect(() => {
        onStatus && onStatus(server.uuid, stats?.status);
    }, [stats?.status]);

    const alarms = { cpu: false, memory: false, disk: false };
    if (stats) {
        alarms.cpu = server.limits.cpu === 0 ? false : stats.cpuUsagePercent >= server.limits.cpu * 0.9;
        alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
        alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
    }

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : __('Unlimited');
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : __('Unlimited');
    const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + '%' : __('Unlimited');
    const look = serverIcon(server);
    const address = server.allocations
        .filter((alloc) => alloc.isDefault)
        .map((allocation) => `${allocation.alias || ip(allocation.ip)}:${allocation.port}`)
        .join(', ');

    const statusPill = isSuspended ? (
        <Pill tone={'red'}>{server.status === 'suspended' ? __('Suspended') : __('Connection Error')}</Pill>
    ) : server.isNodeUnderMaintenance ? (
        <Pill tone={'amber'}>{__('Under Maintenance')}</Pill>
    ) : server.isTransferring || server.status ? (
        <Pill tone={'amber'}>
            {server.isTransferring
                ? __('Transferring')
                : server.status === 'installing'
                ? __('Installing')
                : server.status === 'restoring_backup'
                ? __('Restoring Backup')
                : __('Unavailable')}
        </Pill>
    ) : !stats ? null : stats.status === 'running' ? (
        <Pill tone={'green'} live>
            {__('Running')}
        </Pill>
    ) : stats.status === 'offline' ? (
        <Pill tone={'red'}>{__('Offline')}</Pill>
    ) : (
        <Pill tone={'amber'}>{stats.status === 'starting' ? __('Starting') : __('Stopping')}</Pill>
    );

    const showStats = stats && !isSuspended && !server.isNodeUnderMaintenance;
    const isBusy = !isSuspended && !!stats && (stats.status === 'starting' || stats.status === 'stopping');
    const isUp = !isSuspended && stats?.status === 'running';

    const grid = view === 'grid';
    const trendMax =
        metric === 'cpu' ? server.limits.cpu || 100 : metric === 'memory' ? mbToBytes(server.limits.memory) || 1 : 1024;
    const trendLabel = metric === 'cpu' ? __('CPU') : metric === 'memory' ? __('Memory') : __('Network');
    const trendValue = !showStats ? (
        '—'
    ) : metric === 'cpu' ? (
        `${stats!.cpuUsagePercent.toFixed(1)}%`
    ) : metric === 'memory' ? (
        bytesToString(stats!.memoryUsageInBytes)
    ) : (
        <>
            <span title={__('Download')} style={{ color: look.color }}>
                <FontAwesomeIcon icon={faArrowDown} className={'mr-1 h-2.5 w-2.5'} />
                {bytesToString(live!.rxRate)}/s
            </span>
            <span title={__('Upload')} className={'ml-2'} style={{ color: UPLOAD_COLOR }}>
                <FontAwesomeIcon icon={faArrowUp} className={'mr-1 h-2.5 w-2.5'} />
                {bytesToString(live!.txRate)}/s
            </span>
        </>
    );
    const nextMetric = () => {
        const next = TREND_METRICS[(TREND_METRICS.indexOf(metric) + 1) % TREND_METRICS.length];
        saveTrendMetric(server.uuid, next);
        setMetric(next);
    };
    const trend = (
        <div className={classNames('relative flex-none', grid ? 'mt-auto w-full' : 'hidden xl:block w-48')}>
            <button
                type={'button'}
                title={`${trendLabel} · ${__('Change what the line shows')}`}
                onClick={(e) => {
                    // The whole card is a link; this must not open the server.
                    e.preventDefault();
                    e.stopPropagation();
                    nextMetric();
                }}
                className={
                    'relative z-10 flex w-full items-center justify-between gap-2 rounded-md px-1 text-[0.7rem] leading-5 text-neutral-400 transition-colors duration-150 hover:bg-white/10 hover:text-neutral-100'
                }
            >
                <span className={'inline-flex items-center gap-1 whitespace-nowrap'}>
                    <FontAwesomeIcon icon={faExchangeAlt} className={'h-2.5 w-2.5 opacity-70'} />
                    {/* The two network rates need the room in the narrow list column. */}
                    {(grid || metric !== 'network') && trendLabel}
                </span>
                <span className={'whitespace-nowrap tabular-nums text-neutral-200'}>{trendValue}</span>
            </button>
            <Sparkline
                values={showStats ? live!.history[metric] : []}
                second={showStats && metric === 'network' ? live!.history.upload : undefined}
                max={trendMax}
                color={look.color}
                className={classNames('block w-full', grid ? 'h-8' : 'h-6')}
            />
        </div>
    );

    return (
        <GreyRowBox
            as={Link}
            to={`/server/${server.id}`}
            className={classNames(
                'group relative overflow-hidden gap-x-5 gap-y-3',
                grid ? 'h-full flex-col !items-stretch' : 'flex-wrap',
                isBusy && 'state-busy',
                className
            )}
            // A wash of the server type's colour from the left edge tells the kinds of server apart at a
            // glance; it is stronger while the server is running.
            style={{
                backgroundImage: `linear-gradient(100deg, ${look.tint.replace(
                    /[\d.]+\)$/,
                    isUp ? '0.2)' : '0.09)'
                )} 0%, transparent ${grid ? 70 : 38}%)`,
                ...(isSuspended ? { borderColor: 'rgba(248, 113, 113, 0.45)' } : {}),
            }}
        >
            <span
                aria-hidden
                className={'absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-opacity duration-300'}
                style={{ background: look.color, opacity: isUp ? 1 : 0.35 }}
            />
            {onTogglePin && (
                <button
                    type={'button'}
                    title={pinned ? __('Unpin') : __('Pin to top')}
                    aria-label={`${pinned ? __('Unpin') : __('Pin to top')} ${server.name}`}
                    aria-pressed={!!pinned}
                    onClick={(e) => {
                        // The whole card is a link; the star must not open the server.
                        e.preventDefault();
                        e.stopPropagation();
                        onTogglePin(server.uuid);
                    }}
                    className={classNames(
                        'absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150 hover:bg-white/10',
                        pinned
                            ? 'text-yellow-300'
                            : 'text-neutral-500 opacity-0 hover:text-yellow-200 focus:opacity-100 group-hover:opacity-100 pin-touch'
                    )}
                >
                    <FontAwesomeIcon icon={faStar} className={'h-3.5 w-3.5'} />
                </button>
            )}
            <div
                className={classNames(
                    'flex min-w-0 items-center gap-4',
                    grid ? 'pr-7' : 'flex-1 min-w-[12rem] pr-7 sm:pr-0'
                )}
            >
                <div
                    aria-hidden
                    className={'w-12 h-12 flex-none rounded-xl flex items-center justify-center border'}
                    style={{
                        background: look.tint,
                        borderColor: look.tint.replace(/0\.1\d\)$/, '0.35)'),
                        color: look.color,
                    }}
                >
                    <ServerTypeIcon look={look} />
                </div>
                <div className={'min-w-0 flex-1'}>
                    <div className={'flex flex-wrap items-center gap-2'}>
                        <p className={'text-[1.05rem] font-bold text-neutral-50 break-words'}>{server.name}</p>
                        {statusPill || (!stats && <Spinner size={'small'} />)}
                        {players && isUp && (
                            <span
                                className={
                                    'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs text-neutral-200'
                                }
                                title={__('Players online')}
                            >
                                <FontAwesomeIcon icon={faUserFriends} className={'text-neutral-400'} />
                                <span className={'tabular-nums'}>
                                    {players.online} / {players.max}
                                </span>
                            </span>
                        )}
                    </div>
                    {!!server.description && (
                        <p className={'text-sm text-neutral-400 break-words line-clamp-1 mt-0.5'}>
                            {server.description}
                        </p>
                    )}
                    {grid && <p className={'mt-1 font-mono text-[0.75rem] text-neutral-400 truncate'}>{address}</p>}
                </div>
            </div>
            {!grid && (
                <p className={'hidden lg:block w-52 font-mono text-[0.8rem] text-neutral-300 truncate'}>{address}</p>
            )}
            {!grid && trend}
            <div
                className={classNames(
                    'grid grid-cols-3 gap-4',
                    grid ? 'w-full' : 'w-full sm:w-auto sm:min-w-[19rem] sm:pr-6'
                )}
            >
                <Metric
                    label={__('CPU')}
                    value={showStats ? `${stats!.cpuUsagePercent.toFixed(1)}%` : '—'}
                    sub={cpuLimit}
                    alarm={alarms.cpu}
                />
                <Metric
                    label={__('Memory')}
                    value={showStats ? bytesToString(stats!.memoryUsageInBytes) : '—'}
                    sub={memoryLimit}
                    alarm={alarms.memory}
                />
                <Metric
                    label={__('Disk')}
                    value={showStats ? bytesToString(stats!.diskUsageInBytes) : '—'}
                    sub={diskLimit}
                    alarm={alarms.disk}
                />
            </div>
            {grid && trend}
        </GreyRowBox>
    );
};
