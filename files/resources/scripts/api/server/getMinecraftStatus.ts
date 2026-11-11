import http from '@/api/http';

export interface MinecraftStatus {
    /** False when the panel could not reach the server's game port. */
    reachable: boolean;
    players: { online: number; max: number; sample: string[] };
    version: string;
    motd: string;
}

export default async (uuid: string): Promise<MinecraftStatus> => {
    const { data } = await http.get(`/api/client/servers/${uuid}/minecraft/status`);
    const a = data.attributes || {};

    return {
        reachable: !!a.reachable,
        players: {
            online: a.players?.online || 0,
            max: a.players?.max || 0,
            sample: a.players?.sample || [],
        },
        version: a.version || '',
        motd: a.motd || '',
    };
};
