import { useEffect, useState } from 'react';
import http from '@/api/http';
import { ServerStats } from '@/api/server/getServerResourceUsage';

/**
 * Live usage for the server list. One request every two seconds covers every server
 * on the page (half the rate of the console page, which hears from Wings every second),
 * and each server keeps a short history per metric for its trend line.
 */
export type TrendMetric = 'cpu' | 'memory' | 'network';
export const TREND_METRICS: TrendMetric[] = ['cpu', 'memory', 'network'];
export const HISTORY_POINTS = 30;
const POLL_MS = 2000;

export interface LiveServer {
    stats: ServerStats;
    /** Bytes per second in both directions together, from the last two readings. */
    networkRate: number;
    history: Record<TrendMetric, number[]>;
}

const servers = new Map<string, LiveServer>();
const lastNetwork = new Map<string, { bytes: number; at: number }>();
const listeners = new Set<() => void>();
let wanted: string[] = [];
let timer: ReturnType<typeof setInterval> | null = null;
let inFlight = false;

const storageKey = (uuid: string) => `panel:trend:${uuid}`;

const restore = (uuid: string): Record<TrendMetric, number[]> => {
    const empty = { cpu: [], memory: [], network: [] };
    try {
        const saved = JSON.parse(sessionStorage.getItem(storageKey(uuid)) || 'null');
        // Readings older than a minute would draw a misleading line.
        if (!saved || Date.now() - saved.at > 60000) return empty;
        TREND_METRICS.forEach((m) => {
            if (Array.isArray(saved.h?.[m])) {
                (empty[m] as number[]) = saved.h[m]
                    .filter((v: unknown) => typeof v === 'number')
                    .slice(-HISTORY_POINTS);
            }
        });
    } catch (e) {
        // Storage is unavailable: the line starts empty.
    }

    return empty;
};

const persist = () => {
    try {
        servers.forEach((live, uuid) =>
            sessionStorage.setItem(storageKey(uuid), JSON.stringify({ at: Date.now(), h: live.history }))
        );
    } catch (e) {
        // Nothing to do.
    }
};

const push = (list: number[], value: number) => [...list, value].slice(-HISTORY_POINTS);

const poll = () => {
    if (inFlight || !wanted.length || document.hidden) return;
    inFlight = true;
    http.get('/api/client/resources', { params: { uuids: wanted } })
        .then(({ data }) => {
            const now = Date.now();
            Object.keys(data.data || {}).forEach((uuid) => {
                const a = data.data[uuid];
                const stats: ServerStats = {
                    status: a.current_state,
                    isSuspended: a.is_suspended,
                    memoryUsageInBytes: a.resources.memory_bytes,
                    cpuUsagePercent: a.resources.cpu_absolute,
                    diskUsageInBytes: a.resources.disk_bytes,
                    networkRxInBytes: a.resources.network_rx_bytes,
                    networkTxInBytes: a.resources.network_tx_bytes,
                    uptime: a.resources.uptime,
                };
                const bytes = stats.networkRxInBytes + stats.networkTxInBytes;
                const before = lastNetwork.get(uuid);
                let rate = servers.get(uuid)?.networkRate || 0;
                // The panel answers from a two second cache, so identical readings can arrive twice.
                if (!before) {
                    lastNetwork.set(uuid, { bytes, at: now });
                } else if (bytes !== before.bytes || now - before.at > 6000) {
                    rate = bytes >= before.bytes ? ((bytes - before.bytes) * 1000) / (now - before.at) : 0;
                    lastNetwork.set(uuid, { bytes, at: now });
                }
                const off = stats.status === 'offline';
                const history = servers.get(uuid)?.history || restore(uuid);
                servers.set(uuid, {
                    stats,
                    networkRate: off ? 0 : rate,
                    history: {
                        cpu: push(history.cpu, off ? 0 : stats.cpuUsagePercent),
                        memory: push(history.memory, off ? 0 : stats.memoryUsageInBytes),
                        network: push(history.network, off ? 0 : rate),
                    },
                });
            });
            listeners.forEach((fn) => fn());
        })
        .catch((error) => console.error(error))
        .then(() => {
            inFlight = false;
        });
};

/** Called by the list: keeps the given servers up to date while it is mounted. */
export const useLivePolling = (uuids: string[]) => {
    const key = uuids.join(',');
    useEffect(() => {
        wanted = uuids;
        poll();
        timer = setInterval(poll, POLL_MS);
        const onVisible = () => !document.hidden && poll();
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            timer && clearInterval(timer);
            document.removeEventListener('visibilitychange', onVisible);
            wanted = [];
            persist();
        };
    }, [key]);
};

/** Called by a row: its latest reading, or undefined until the first one arrives. */
export const useLiveServer = (uuid: string): LiveServer | undefined => {
    const [, tick] = useState(0);
    useEffect(() => {
        const fn = () => tick((n) => n + 1);
        listeners.add(fn);

        return () => {
            listeners.delete(fn);
        };
    }, []);

    return servers.get(uuid);
};

export const readTrendMetric = (uuid: string): TrendMetric => {
    try {
        const saved = localStorage.getItem(`panel:trend-metric:${uuid}`) as TrendMetric;

        return TREND_METRICS.includes(saved) ? saved : 'cpu';
    } catch (e) {
        return 'cpu';
    }
};

export const saveTrendMetric = (uuid: string, metric: TrendMetric) => {
    try {
        localStorage.setItem(`panel:trend-metric:${uuid}`, metric);
    } catch (e) {
        // The choice lasts until the page is reloaded.
    }
};
