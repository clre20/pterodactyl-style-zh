import React from 'react';
import { ServerContext } from '@/state/server';
import ScreenBlock from '@/components/elements/ScreenBlock';
import ServerInstallSvg from '@/assets/images/server_installing.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';
import ServerRestoreSvg from '@/assets/images/server_restore.svg';

import { __ } from '@/i18n';
export default () => {
    const status = ServerContext.useStoreState((state) => state.server.data?.status || null);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data?.isTransferring || false);
    const isNodeUnderMaintenance = ServerContext.useStoreState(
        (state) => state.server.data?.isNodeUnderMaintenance || false
    );

    return status === 'installing' || status === 'install_failed' || status === 'reinstall_failed' ? (
        <ScreenBlock
            title={status === 'installing' ? __('Running Installer') : __('Installation Failed')}
            image={ServerInstallSvg}
            art={status === 'installing' ? 'gear' : 'file'}
            tone={status === 'installing' ? 'amber' : 'red'}
            busy={status === 'installing'}
            message={__('Your server should be ready soon, please try again in a few minutes.')}
        />
    ) : status === 'suspended' ? (
        <ScreenBlock
            title={__('Server Suspended')}
            image={ServerErrorSvg}
            art={'lock'}
            tone={'red'}
            message={__('This server is suspended and cannot be accessed.')}
        />
    ) : isNodeUnderMaintenance ? (
        <ScreenBlock
            title={__('Node under Maintenance')}
            image={ServerErrorSvg}
            art={'gear'}
            tone={'amber'}
            message={__('The node of this server is currently under maintenance.')}
        />
    ) : (
        <ScreenBlock
            title={isTransferring ? __('Transferring') : __('Restoring from Backup')}
            image={ServerRestoreSvg}
            art={'gear'}
            tone={'accent'}
            busy
            message={
                isTransferring
                    ? __('Your server is being transferred to a new node, please check back later.')
                    : __('Your server is currently being restored from a backup, please check back in a few minutes.')
            }
        />
    );
};
