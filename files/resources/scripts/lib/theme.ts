/**
 * Appearance options set by the panel owner under Admin → Settings → Appearance,
 * injected into the page as window.ThemeConfig.
 */
export type AnnouncementLevel = 'info' | 'success' | 'warning' | 'danger';

export interface ThemeConfig {
    loginSubtitle: string;
    footerText: string;
    loginBackground: string | null;
    announcement: { id: string; level: AnnouncementLevel; text: string } | null;
}

const fallback: ThemeConfig = { loginSubtitle: '', footerText: '', loginBackground: null, announcement: null };

export const themeConfig: ThemeConfig = {
    ...fallback,
    ...((window as unknown as { ThemeConfig?: Partial<ThemeConfig> }).ThemeConfig || {}),
};

type AccentName = '--ac-a' | '--ac-a-l' | '--ac-b' | '--ac-b-l';

/**
 * Resolves an accent colour to a plain CSS colour string. Needed where CSS variables
 * are not understood: canvas charts and the terminal.
 */
export const accentColor = (name: AccentName, alpha = 1): string => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const [r, g, b] = (value || '129 140 248').split(/\s+/);

    return alpha >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
