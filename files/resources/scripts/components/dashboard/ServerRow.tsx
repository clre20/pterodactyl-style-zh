import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
import classNames from 'classnames';
import serverIcon from '@/lib/serverIcon';

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
        className={classNames('inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full border whitespace-nowrap', {
            'bg-green-400/15 text-green-300 border-green-400/35': tone === 'green',
            'bg-red-400/15 text-red-300 border-red-400/35': tone === 'red',
            'bg-yellow-400/15 text-yellow-200 border-yellow-400/35': tone === 'amber',
            'bg-white/5 text-neutral-300 border-white/15': tone === 'grey',
        })}
    >
        <span aria-hidden className={classNames('state-dot', live && 'live')} />
        {children}
    </span>
);

const Metric = ({ label, value, sub, alarm }: { label: string; value: React.ReactNode; sub: string; alarm: boolean }) => (
    <div className={'min-w-0'}>
        <p className={'text-xs text-neutral-400'}>{label}</p>
        <p className={classNames('text-[0.95rem] font-semibold tabular-nums truncate', alarm ? 'text-red-300' : 'text-neutral-50')}>
            {value}
        </p>
        <p className={'text-[0.7rem] text-neutral-500 truncate'}>/ {sub}</p>
    </div>
);

type Timer = ReturnType<typeof setInterval>;

export default ({
    server,
    className,
    onStatus,
}: {
    server: Server;
    className?: string;
    onStatus?: (uuid: string, status: ServerPowerState | undefined) => void;
}) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        // Don't waste a HTTP request if there is nothing important to show to the user because
        // the server is suspended.
        if (isSuspended || server.isNodeUnderMaintenance) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended, server.isNodeUnderMaintenance]);

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

    return (
        <GreyRowBox
            as={Link}
            to={`/server/${server.id}`}
            className={classNames('relative overflow-hidden flex-wrap gap-x-5 gap-y-3', isBusy && 'state-busy', className)}
            // A wash of the server type's colour from the left edge tells the kinds of server apart at a
            // glance; it is stronger while the server is running.
            style={{
                backgroundImage: `linear-gradient(100deg, ${look.tint.replace(
                    /[\d.]+\)$/,
                    isUp ? '0.2)' : '0.09)'
                )} 0%, transparent 38%)`,
                ...(isSuspended ? { borderColor: 'rgba(248, 113, 113, 0.45)' } : {}),
            }}
        >
            <span
                aria-hidden
                className={'absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-opacity duration-300'}
                style={{ background: look.color, opacity: isUp ? 1 : 0.35 }}
            />
            <div
                aria-hidden
                className={'w-12 h-12 flex-none rounded-xl flex items-center justify-center border'}
                style={{ background: look.tint, borderColor: look.tint.replace(/0\.1\d\)$/, '0.35)'), color: look.color }}
            >
                <ServerTypeIcon look={look} />
            </div>
            <div className={'flex-1 min-w-[12rem]'}>
                <div className={'flex flex-wrap items-center gap-2'}>
                    <p className={'text-[1.05rem] font-bold text-neutral-50 break-words'}>{server.name}</p>
                    {statusPill || (!stats && <Spinner size={'small'} />)}
                </div>
                {!!server.description && (
                    <p className={'text-sm text-neutral-400 break-words line-clamp-1 mt-0.5'}>{server.description}</p>
                )}
            </div>
            <p className={'hidden lg:block w-60 font-mono text-[0.8rem] text-neutral-300 truncate'}>{address}</p>
            <div className={'grid grid-cols-3 gap-4 w-full sm:w-auto sm:min-w-[19rem]'}>
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
        </GreyRowBox>
    );
};
