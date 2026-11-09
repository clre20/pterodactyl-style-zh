import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18NextHttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import zhUi from '@/locales/zh.json';

// If we're using HMR use a unique hash per page reload so that we're always
// doing cache busting. Otherwise just use the builder provided hash value in
// the URL to allow cache busting to occur whenever the front-end is rebuilt.
const hash = module.hot ? Date.now().toString(16) : process.env.WEBPACK_BUILD_HASH;

export const LANGUAGES: { code: string; label: string }[] = [
    { code: 'zh', label: '繁體中文' },
    { code: 'en', label: 'English' },
];

const STORAGE_KEY = 'panel:language';

const w = window as unknown as {
    PterodactylUser?: { language?: string };
    SiteConfiguration?: { locale?: string };
};

const supported = (code?: string | null): string | null =>
    code && LANGUAGES.some((l) => l.code === code) ? code : null;

const readStored = (): string | null => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
};

/**
 * Resolve the language for this page load: the signed in user's saved language,
 * then the language picked on the login page, then the panel default (APP_LOCALE).
 */
export const currentLanguage: string =
    supported(w.PterodactylUser?.language) ||
    supported(readStored()) ||
    supported(w.SiteConfiguration?.locale) ||
    'en';

export const rememberLanguage = (code: string) => {
    try {
        localStorage.setItem(STORAGE_KEY, code);
    } catch {
        // Storage can be unavailable (private mode); the account setting still applies.
    }
};

document.documentElement.lang = currentLanguage === 'zh' ? 'zh-Hant' : 'en';

// One request per language and namespace. The multi-load adapter would join the
// current and fallback languages as "zh+en", which the panel rejects.
i18n.use(I18NextHttpBackend)
    .use(initReactI18next)
    .init({
        debug: process.env.DEBUG === 'true',
        lng: currentLanguage,
        fallbackLng: 'en',
        keySeparator: '.',
        partialBundledLanguages: true,
        resources: {
            zh: { ui: zhUi },
        },
        backend: {
            loadPath: '/locales/locale.json?locale={{lng}}&namespace={{ns}}',
            queryStringParams: { hash },
            customHeaders: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            // The panel answers { [locale]: { [namespace]: {...} } }.
            parse: (data: string, lng?: string | string[], ns?: string | string[]) => {
                const json = JSON.parse(data);
                const l = Array.isArray(lng) ? lng[0] : lng;
                const n = Array.isArray(ns) ? ns[0] : ns;
                return (l && n && json[l]?.[n]) || {};
            },
        } as HttpBackendOptions,
        interpolation: {
            // Per i18n-react documentation: this is not needed since React is already
            // handling escapes for us.
            escapeValue: false,
        },
    });

/**
 * Translate a user facing English string. The English text is the key, so a
 * missing translation simply falls back to the original English.
 */
export const __ = (text: string, values?: Record<string, unknown>): string => {
    if (currentLanguage === 'en') {
        return values ? i18n.t(text, { ...values, lng: 'en', ns: 'ui', keySeparator: false, nsSeparator: false }) : text;
    }

    return i18n.t(text, {
        ...(values || {}),
        ns: 'ui',
        keySeparator: false,
        nsSeparator: false,
        defaultValue: text,
    }) as string;
};

export default i18n;
