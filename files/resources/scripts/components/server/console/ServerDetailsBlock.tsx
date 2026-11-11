import React, { useEffect, useMemo, useState } from 'react';
import {
    faCloudDownloadAlt,
    faCloudUploadAlt,
    faHdd,
    faMemory,
    faMicrochip,
    faUserFriends,
    faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import { ServerContext } from '@/state/server';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import UptimeDuration from '@/components/server/UptimeDuration';
import Gauge from '@/components/server/console/Gauge';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { isMinecraftServer } from '@/lib/minecraft';
import getMinecraftStatus from '@/api/server/getMinecraftStatus';
import { capitalize } from '@/lib/strings';

import { __ } from '@/i18n';
type Stats = Record<'memory' | 'cpu' | 'disk' | 'uptime' | 'rx' | 'tx', number>;

const ServerDetailsBlock = ({ className }: { className?: string }) => {
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0, tx: 0, rx: 0 });

    const status = ServerContext.useStoreState((state) => state.status.value);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);

    const textLimits = useMemo(
        () => ({
            cpu: limits?.cpu ? `${limits.cpu}%` : null,
            memory: limits?.memory ? bytesToString(mbToBytes(limits.memory)) : null,
            disk: limits?.disk ? bytesToString(mbToBytes(limits.disk)) : null,
        }),
        [limits]
    );

    const allocation = ServerContext.useStoreState((state) => {
        const match = state.server.data!.allocations.find((allocation) => allocation.isDefault);

        return !match ? 'n/a' : `${match.alias || ip(match.ip)}:${match.port}`;
    });

    useEffect(() => {
        if (!connected || !instance) {
            return;
        }

        instance.send(SocketRequest.SEND_STATS);
    }, [instance, connected]);

    useWebsocketEvent(SocketEvent.STATS, (data) => {
        let stats: any = {};
        try {
            stats = JSON.parse(data);
        } catch (e) {
            return;
        }

        setStats({
            memory: stats.memory_bytes,
            cpu: stats.cpu_absolute,
            disk: stats.disk_bytes,
            tx: stats.network.tx_bytes,
            rx: stats.network.rx_bytes,
            uptime: stats.uptime || 0,
        });
    });

    // Minecraft servers also show how many players are online, asked from the game port.
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const serverPath = ServerContext.useStoreState((state) => `/server/${state.server.data!.id}`);
    const minecraft = ServerContext.useStoreState((state) => isMinecraftServer(state.server.data!));
    const [players, setPlayers] = useState<{ online: number; max: number } | null>(null);

    useEffect(() => {
        if (!minecraft || status !== 'running') {
            setPlayers(null);
            return;
        }
        const load = () =>
            getMinecraftStatus(uuid)
                .then((mc) => setPlayers(mc.reachable ? mc.players : null))
                .catch(() => setPlayers(null));
        load();
        const timer = setInterval(load, 20000);

        return () => clearInterval(timer);
    }, [uuid, minecraft, status]);

    const offline = status === 'offline' || status === null;
    const memLimitBytes = limits.memory ? mbToBytes(limits.memory) : 0;
    const diskLimitBytes = limits.disk ? mbToBytes(limits.disk) : 0;
    const cpuFraction = offline ? 0 : stats.cpu / (limits.cpu || 100);
    const memFraction = offline || !memLimitBytes ? 0 : stats.memory / memLimitBytes;
    const diskFraction = !diskLimitBytes ? 0 : stats.disk / diskLimitBytes;
    const pct = (fraction: number, known: boolean) => (known ? `${Math.round(fraction * 100)}%` : '—');

    return (
        <div className={classNames('grid grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 stagger', className)}>
            <Gauge
                title={__('CPU Load')}
                icon={faMicrochip}
                color={'#a78bfa'}
                fraction={cpuFraction}
                value={offline ? '—' : `${stats.cpu.toFixed(stats.cpu >= 100 ? 0 : 1)}%`}
                caption={'CPU'}
            >
                <p>{offline ? __('Offline') : textLimits.cpu ? __('Limit {{value}}', { value: textLimits.cpu }) : __('Unlimited')}</p>
            </Gauge>
            <Gauge
                title={__('Memory')}
                icon={faMemory}
                color={'#60a5fa'}
                fraction={memFraction}
                value={offline ? '—' : pct(memFraction, !!memLimitBytes)}
                caption={'RAM'}
            >
                <p>{__('Used {{value}}', { value: offline ? '—' : bytesToString(stats.memory) })}</p>
                <p>{__('Total {{value}}', { value: textLimits.memory || __('Unlimited') })}</p>
            </Gauge>
            <Gauge
                title={__('Disk')}
                icon={faHdd}
                color={'#22d3ee'}
                fraction={diskFraction}
                value={pct(diskFraction, !!diskLimitBytes)}
                caption={'DISK'}
            >
                <p>{__('Used {{value}}', { value: bytesToString(stats.disk) })}</p>
                <p>{__('Total {{value}}', { value: textLimits.disk || __('Unlimited') })}</p>
            </Gauge>
            <div className={'glass relative overflow-hidden rounded-2xl p-4 sm:p-5 flex flex-col justify-center gap-2 col-span-3 xl:col-span-1'}>
                <FontAwesomeIcon icon={faWifi} className={'watermark'} style={{ color: '#fcd34d' }} />
                <CopyOnClick text={allocation}>
                    <div className={'relative cursor-pointer'}>
                        <p className={'text-xs text-neutral-400'}>{__('Address')}</p>
                        <p className={'font-mono text-sm text-neutral-100 truncate'}>{allocation}</p>
                    </div>
                </CopyOnClick>
                <div className={'relative'}>
                    <p className={'text-xs text-neutral-400'}>{__('Uptime')}</p>
                    <p className={'text-sm font-semibold text-neutral-100 truncate'}>
                        {status === null ? (
                            __('Offline')
                        ) : stats.uptime > 0 ? (
                            <UptimeDuration uptime={stats.uptime / 1000} />
                        ) : (
                            __(capitalize(status))
                        )}
                    </p>
                </div>
                {players && (
                    <Link to={`${serverPath}/minecraft`} className={'relative block no-underline'}>
                        <p className={'text-xs text-neutral-400'}>{__('Players online')}</p>
                        <p className={'text-sm font-semibold tabular-nums text-neutral-100'}>
                            <FontAwesomeIcon icon={faUserFriends} className={'mr-1.5 text-green-300'} />
                            {players.online} / {players.max}
                        </p>
                    </Link>
                )}
                <div className={'relative grid grid-cols-2 gap-2'}>
                    <div className={'min-w-0'}>
                        <p className={'text-xs text-neutral-400'}>
                            <FontAwesomeIcon icon={faCloudDownloadAlt} className={'mr-1 text-yellow-300'} />
                            {__('Inbound')}
                        </p>
                        <p className={'text-sm font-semibold text-neutral-100 truncate'}>{offline ? '—' : bytesToString(stats.rx)}</p>
                    </div>
                    <div className={'min-w-0'}>
                        <p className={'text-xs text-neutral-400'}>
                            <FontAwesomeIcon icon={faCloudUploadAlt} className={'mr-1 text-cyan-300'} />
                            {__('Outbound')}
                        </p>
                        <p className={'text-sm font-semibold text-neutral-100 truncate'}>{offline ? '—' : bytesToString(stats.tx)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServerDetailsBlock;
