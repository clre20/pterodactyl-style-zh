import {
    format as fnsFormat,
    formatDistanceToNow as fnsDistance,
    formatDistanceToNowStrict as fnsDistanceStrict,
} from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { currentLanguage } from '@/i18n';

const zh = currentLanguage === 'zh';

/**
 * date-fns wrappers that follow the panel language. English keeps the original
 * patterns; Traditional Chinese uses the usual Taiwanese numeric date style.
 */
export const format = (date: Date | number, pattern: string): string => {
    if (!zh) return fnsFormat(date, pattern);

    const time = /[hH]/.test(pattern) ? (pattern.includes('ss') ? ' HH:mm:ss' : ' HH:mm') : '';
    const day = /y/.test(pattern) ? 'yyyy/MM/dd' : 'M月d日';

    return fnsFormat(date, day + time, { locale: zhTW });
};

export const formatDistanceToNow = (date: Date | number, options?: Parameters<typeof fnsDistance>[1]): string =>
    fnsDistance(date, { ...options, locale: zh ? zhTW : undefined });

export const formatDistanceToNowStrict = (
    date: Date | number,
    options?: Parameters<typeof fnsDistanceStrict>[1]
): string => fnsDistanceStrict(date, { ...options, locale: zh ? zhTW : undefined });
