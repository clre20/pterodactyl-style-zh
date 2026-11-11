/**
 * Helpers for the Minecraft tools: recognising a Minecraft server, and reading and
 * writing server.properties without disturbing the lines the form does not manage.
 */

type Described = { eggFeatures?: string[]; invocation?: string; dockerImage?: string };

/** Same signals the server icon uses: the egg's features, start command and image. */
export const isMinecraftServer = (server: Described): boolean => {
    const features = server.eggFeatures || [];
    const text = `${server.invocation || ''} ${server.dockerImage || ''}`.toLowerCase();

    return (
        features.includes('eula') ||
        features.includes('java_version') ||
        /minecraft|paper|purpur|spigot|bukkit|forge|fabric|server\.jar/.test(text)
    );
};

/** Java names, plus the "." or "*" prefix Floodgate gives Bedrock players. */
export const isValidPlayerName = (name: string): boolean => /^[.*]?[A-Za-z0-9_]{2,16}$/.test(name);

export type Properties = Record<string, string>;

export const parseProperties = (text: string): Properties => {
    const out: Properties = {};
    text.split(/\r?\n/).forEach((line) => {
        if (/^\s*[#!]/.test(line)) return;
        const at = line.indexOf('=');
        if (at > 0) out[line.slice(0, at).trim()] = line.slice(at + 1);
    });

    return out;
};

/**
 * Returns the file with the given keys changed. Comments, ordering and every other
 * key stay exactly as they were.
 */
export const applyProperties = (text: string, changes: Properties): string => {
    const pending = { ...changes };
    const lines = text.split(/\r?\n/).map((line) => {
        if (/^\s*[#!]/.test(line)) return line;
        const at = line.indexOf('=');
        if (at <= 0) return line;
        const key = line.slice(0, at).trim();
        if (!(key in pending)) return line;
        const value = pending[key];
        delete pending[key];

        return `${key}=${value}`;
    });

    return lines.join('\n');
};

export type PropertyField =
    | { key: string; type: 'text'; label: string; help?: string; maxLength?: number }
    | { key: string; type: 'number'; label: string; help?: string; min: number; max: number }
    | { key: string; type: 'toggle'; label: string; help?: string }
    | { key: string; type: 'select'; label: string; help?: string; options: [string, string][] };

/**
 * The settings offered as a form. Labels are English keys translated at render time.
 * A field is only shown when the key exists in the server's file, since the set of
 * keys differs between Minecraft versions.
 */
export const propertyFields: { title: string; fields: PropertyField[] }[] = [
    {
        title: 'General',
        fields: [
            {
                key: 'motd',
                type: 'text',
                label: 'Server description (MOTD)',
                help: 'The line shown under the server name in the multiplayer list.',
                maxLength: 120,
            },
            { key: 'max-players', type: 'number', label: 'Maximum players', min: 1, max: 1000 },
            {
                key: 'gamemode',
                type: 'select',
                label: 'Default game mode',
                options: [
                    ['survival', 'Survival'],
                    ['creative', 'Creative'],
                    ['adventure', 'Adventure'],
                    ['spectator', 'Spectator'],
                ],
            },
            {
                key: 'difficulty',
                type: 'select',
                label: 'Difficulty',
                options: [
                    ['peaceful', 'Peaceful'],
                    ['easy', 'Easy'],
                    ['normal', 'Normal'],
                    ['hard', 'Hard'],
                ],
            },
            { key: 'hardcore', type: 'toggle', label: 'Hardcore', help: 'Players become spectators when they die.' },
            { key: 'pvp', type: 'toggle', label: 'Player versus player (PvP)' },
        ],
    },
    {
        title: 'Access',
        fields: [
            {
                key: 'online-mode',
                type: 'toggle',
                label: 'Verify accounts with Mojang',
                help: 'Turn off only for offline-mode servers or behind a proxy such as Velocity or BungeeCord.',
            },
            { key: 'white-list', type: 'toggle', label: 'Whitelist', help: 'Only players on the whitelist can join.' },
            {
                key: 'enforce-whitelist',
                type: 'toggle',
                label: 'Enforce whitelist',
                help: 'Kick players who are online but not on the whitelist when it is reloaded.',
            },
            {
                key: 'spawn-protection',
                type: 'number',
                label: 'Spawn protection radius',
                help: 'Blocks around the spawn point that only operators can change. 0 turns it off.',
                min: 0,
                max: 512,
            },
        ],
    },
    {
        title: 'World',
        fields: [
            {
                key: 'view-distance',
                type: 'number',
                label: 'View distance',
                help: 'In chunks. Lower values use less memory and CPU.',
                min: 2,
                max: 32,
            },
            {
                key: 'simulation-distance',
                type: 'number',
                label: 'Simulation distance',
                help: 'How far from players mobs and crops stay active, in chunks.',
                min: 2,
                max: 32,
            },
            {
                key: 'allow-flight',
                type: 'toggle',
                label: 'Allow flight',
                help: 'Stops the server kicking players that mods let fly.',
            },
            { key: 'allow-nether', type: 'toggle', label: 'Allow the Nether' },
            { key: 'enable-command-block', type: 'toggle', label: 'Command blocks' },
            {
                key: 'level-seed',
                type: 'text',
                label: 'World seed',
                help: 'Only used when a new world is generated.',
                maxLength: 64,
            },
        ],
    },
];
