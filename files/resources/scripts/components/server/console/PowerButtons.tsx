import React, { useEffect, useState } from 'react';
import { Button } from '@/components/elements/button/index';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';
import { Dialog } from '@/components/elements/dialog';

import { __ } from '@/i18n';
interface PowerButtonProps {
    className?: string;
}

export default ({ className }: PowerButtonProps) => {
    const [open, setOpen] = useState(false);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);

    const killable = status === 'stopping';
    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        e.preventDefault();
        if (action === 'kill') {
            return setOpen(true);
        }

        if (instance) {
            setOpen(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    useEffect(() => {
        if (status === 'offline') {
            setOpen(false);
        }
    }, [status]);

    return (
        <div className={className}>
            <Dialog.Confirm
                open={open}
                hideCloseIcon
                onClose={() => setOpen(false)}
                title={__('Forcibly Stop Process')}
                confirm={__('Continue')}
                onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
            >
                {__('Forcibly stopping a server can lead to data corruption.')}
            </Dialog.Confirm>
            <Can action={'control.start'}>
                <Button
                    className={'flex-1 sm:flex-none sm:min-w-[6rem] !bg-none !shadow-none border border-green-400/45 !bg-green-400/15 !text-green-100 hover:!bg-green-400/25'}
                    disabled={status !== 'offline'}
                    onClick={onButtonClick.bind(this, 'start')}
                >
                    {__('Start')}
                </Button>
            </Can>
            <Can action={'control.restart'}>
                <Button.Text className={'flex-1 sm:flex-none sm:min-w-[6rem]'} disabled={!status} onClick={onButtonClick.bind(this, 'restart')}>
                    {__('Restart')}
                </Button.Text>
            </Can>
            <Can action={'control.stop'}>
                <Button.Danger
                    className={'flex-1 sm:flex-none sm:min-w-[6rem]'}
                    disabled={status === 'offline'}
                    onClick={onButtonClick.bind(this, killable ? 'kill' : 'stop')}
                >
                    {killable ? __('Kill') : __('Stop')}
                </Button.Danger>
            </Can>
        </div>
    );
};
