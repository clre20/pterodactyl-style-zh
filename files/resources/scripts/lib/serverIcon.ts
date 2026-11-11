import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCube, faCode, faGamepad, faMicrochip, faServer, faDatabase, faGlobe } from '@fortawesome/free-solid-svg-icons';

export interface ServerIconStyle {
    icon: IconDefinition;
    /** Set when the panel owner chose an icon for the egg; drawn instead of "icon". */
    glyph?: { char: string; style: 's' | 'r' | 'b' };
    /** Tailwind-free inline colours so the tile works on any background. */
    color: string;
    tint: string;
}

const style = (icon: IconDefinition, color: string, tint: string): ServerIconStyle => ({ icon, color, tint });

type Described = {
    eggFeatures?: string[];
    invocation?: string;
    dockerImage?: string;
    eggIcon?: { glyph: string; style: 's' | 'r' | 'b'; color: string | null } | null;
};

const hexToTint = (hex: string, alpha: number): string => {
    const n = parseInt(hex.slice(1), 16);

    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/**
 * Picks an icon for a server. An icon the panel owner set on the egg (Admin → Nests →
 * Egg) wins; otherwise one is chosen from what the client API exposes about the egg:
 * its features, the startup command and the Docker image. Nothing is hard coded per
 * server, and anything unrecognised gets the generic server icon.
 */
export default (server: Described): ServerIconStyle => {
    const detected = detect(server);
    const custom = server.eggIcon;
    if (!custom) {
        return detected;
    }

    return {
        ...detected,
        glyph: { char: custom.glyph, style: custom.style },
        // Without a colour of its own the icon keeps the colour of the detected server type.
        ...(custom.color ? { color: custom.color, tint: hexToTint(custom.color, 0.14) } : {}),
    };
};

const detect = (server: Described): ServerIconStyle => {
    const features = server.eggFeatures || [];
    const text = `${server.invocation || ''} ${server.dockerImage || ''}`.toLowerCase();

    if (features.includes('eula') || features.includes('java_version') || /minecraft|paper|spigot|bungee|velocity|forge|fabric|\.jar/.test(text)) {
        return style(faCube, '#6ee7b7', 'rgba(52, 211, 153, 0.14)');
    }
    if (/ollama|llama|vulkan|rocm|cuda|\bgpu\b|stable-diffusion|comfy/.test(text)) {
        return style(faMicrochip, '#a5b4fc', 'rgba(129, 140, 248, 0.16)');
    }
    if (features.includes('steam_disk_space') || features.includes('gsl_token') || /steamcmd|srcds|rust|valheim|terraria|ark|palworld|hytale/.test(text)) {
        return style(faGamepad, '#f9a8d4', 'rgba(236, 72, 153, 0.14)');
    }
    if (/mysql|mariadb|postgres|redis|mongo/.test(text)) {
        return style(faDatabase, '#fdba74', 'rgba(251, 146, 60, 0.14)');
    }
    if (/nginx|apache|caddy|php|wordpress/.test(text)) {
        return style(faGlobe, '#67e8f9', 'rgba(34, 211, 238, 0.14)');
    }
    if (/python|node|bun|deno|golang|\bgo\b|java|dotnet|discord|bot/.test(text)) {
        return style(faCode, '#fcd34d', 'rgba(251, 191, 36, 0.12)');
    }

    return style(faServer, '#c4cbe0', 'rgba(255, 255, 255, 0.07)');
};
