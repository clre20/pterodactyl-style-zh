import React from 'react';
import { currentLanguage } from '@/i18n';

const zh = currentLanguage === 'zh';

export default ({ uptime }: { uptime: number }) => {
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((Math.floor(uptime) / 60 / 60) % 24);
    const remainder = Math.floor(uptime - hours * 60 * 60);
    const minutes = Math.floor((remainder / 60) % 60);
    const seconds = remainder % 60;

    if (days > 0) {
        return (
            <>
                {zh ? `${days} 天 ${hours} 小時 ${minutes} 分` : `${days}d ${hours}h ${minutes}m`}
            </>
        );
    }

    return (
        <>
            {zh ? `${hours} 小時 ${minutes} 分 ${seconds} 秒` : `${hours}h ${minutes}m ${seconds}s`}
        </>
    );
};
