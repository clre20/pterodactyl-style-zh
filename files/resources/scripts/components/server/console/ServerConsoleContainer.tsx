import React, { memo } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import Console from '@/components/server/console/Console';
import StatGraphs from '@/components/server/console/StatGraphs';
import PowerButtons from '@/components/server/console/PowerButtons';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import { Alert } from '@/components/elements/alert';

import { __ } from '@/i18n';
const StatusPill = ({ status }: { status: string | null }) => {
    const tone =
        status === 'running'
            ? 'bg-green-400/15 text-green-300 border-green-400/35'
            : status === 'starting' || status === 'stopping'
            ? 'bg-yellow-400/15 text-yellow-200 border-yellow-400/35'
            : 'bg-red-400/15 text-red-300 border-red-400/35';
    const label =
        status === 'running'
            ? __('Running')
            : status === 'starting'
            ? __('Starting')
            : status === 'stopping'
            ? __('Stopping')
            : __('Offline');

    return <span className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap ${tone}`}>● {label}</span>;
};

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ServerConsoleContainer = () => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const description = ServerContext.useStoreState((state) => state.server.data!.description);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);

    return (
        <ServerContentBlock title={__('Console')}>
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className={'mb-4'}>
                    {isNodeUnderMaintenance
                        ? __('The node of this server is currently under maintenance and all actions are unavailable.')
                        : isInstalling
                        ? __('This server is currently running its installation process and most actions are unavailable.')
                        : __('This server is currently being transferred to another node and all actions are unavailable.')}
                </Alert>
            )}
            <div className={'flex flex-wrap items-center justify-between gap-4 mb-5'}>
                <div className={'min-w-0'}>
                    <div className={'flex flex-wrap items-center gap-3'}>
                        <h1 className={'font-header font-bold text-2xl sm:text-3xl text-gray-50 leading-relaxed line-clamp-1'}>
                            {name}
                        </h1>
                        <StatusPill status={status} />
                    </div>
                    {description && <p className={'text-sm text-neutral-400 line-clamp-2'}>{description}</p>}
                </div>
                <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                    <PowerButtons className={'flex w-full sm:w-auto gap-2'} />
                </Can>
            </div>
            <ServerDetailsBlock className={'mb-4'} />
            <div className={'flex mb-4 enter'}>
                <Spinner.Suspense>
                    <Console />
                </Spinner.Suspense>
            </div>
            <div className={'grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 stagger'}>
                <Spinner.Suspense>
                    <StatGraphs />
                </Spinner.Suspense>
            </div>
            <Features enabled={eggFeatures} />
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
