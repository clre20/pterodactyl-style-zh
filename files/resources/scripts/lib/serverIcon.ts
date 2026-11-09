import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCube, faCode, faGamepad, faMicrochip, faServer, faDatabase, faGlobe } from '@fortawesome/free-solid-svg-icons';

export interface ServerIconStyle {
    icon: IconDefinition;
    /** Tailwind-free inline colours so the tile works on any background. */
    color: string;
    tint: string;
}

const style = (icon: IconDefinition, color: string, tint: string): ServerIconStyle => ({ icon, color, tint });

/**
 * Picks an icon for a server from what the client API exposes about its egg: the
 * egg features, the startup command and the Docker image. Nothing is hard coded
 * per server, and anything unrecognised gets the generic server icon.
 */
export default (server: { eggFeatures?: string[]; invocation?: string; dockerImage?: string }): ServerIconStyle => {
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
