import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBan,
    faCrown,
    faCube,
    faListUl,
    faSlidersH,
    faSyncAlt,
    faTimes,
    faUserPlus,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import { SkeletonList } from '@/components/elements/Skeleton';
import EmptyState from '@/components/elements/EmptyState';
import { Button } from '@/components/elements/button/index';
import Input from '@/components/elements/Input';
import Select from '@/components/elements/Select';
import { ServerContext } from '@/state/server';
import { usePermissions } from '@/plugins/usePermissions';
import useFlash from '@/plugins/useFlash';
import getFileContents from '@/api/server/files/getFileContents';
import saveFileContents from '@/api/server/files/saveFileContents';
import getMinecraftStatus, { MinecraftStatus } from '@/api/server/getMinecraftStatus';
import { SocketRequest } from '@/components/server/events';
import { applyProperties, isValidPlayerName, parseProperties, Properties, propertyFields } from '@/lib/minecraft';
import { __ } from '@/i18n';

type ListName = 'whitelist' | 'ops' | 'banned';

interface Entry {
    name: string;
    detail?: string;
}

const lists: Record<
    ListName,
    { file: string; add: (n: string) => string; remove: (n: string) => string; label: string; empty: string }
> = {
    whitelist: {
        file: '/whitelist.json',
        add: (n) => `whitelist add ${n}`,
        remove: (n) => `whitelist remove ${n}`,
        label: 'Whitelist',
        empty: 'Nobody is on the whitelist yet.',
    },
    ops: {
        file: '/ops.json',
        add: (n) => `op ${n}`,
        remove: (n) => `deop ${n}`,
        label: 'Operators',
        empty: 'There are no operators yet.',
    },
    banned: {
        file: '/banned-players.json',
        add: (n) => `ban ${n}`,
        remove: (n) => `pardon ${n}`,
        label: 'Banned',
        empty: 'Nobody is banned.',
    },
};

const listIcons = { whitelist: faListUl, ops: faCrown, banned: faBan };

const Toggle = ({
    checked,
    onChange,
    disabled,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) => (
    <button
        type={'button'}
        role={'switch'}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={classNames(
            'relative h-6 w-11 flex-none rounded-full border transition-colors duration-150 disabled:opacity-50',
            checked ? 'border-transparent' : 'border-white/15 bg-white/10'
        )}
        style={checked ? { background: 'rgb(var(--ac-a))' } : undefined}
    >
        <span
            className={classNames(
                'absolute top-0.5 h-[1.125rem] w-[1.125rem] rounded-full bg-white shadow transition-all duration-150',
                checked ? 'left-[1.375rem]' : 'left-0.5'
            )}
        />
    </button>
);

export default () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const [canCommand, canRead, canWrite, canRestart] = usePermissions([
        'control.console',
        'file.read-content',
        'file.update',
        'control.restart',
    ]);
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();

    const running = status === 'running';
    const canAct = canCommand && running && connected && !!instance;

    const [mc, setMc] = useState<MinecraftStatus | null>(null);
    const [tab, setTab] = useState<ListName>('whitelist');
    const [entries, setEntries] = useState<Record<ListName, Entry[] | null>>({
        whitelist: null,
        ops: null,
        banned: null,
    });
    const [name, setName] = useState('');
    const [busy, setBusy] = useState(false);

    const [raw, setRaw] = useState<string | null>(null);
    const [missing, setMissing] = useState(false);
    const [draft, setDraft] = useState<Properties>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const original = useMemo(() => (raw === null ? {} : parseProperties(raw)), [raw]);
    const changed = useMemo(() => Object.keys(draft).filter((key) => draft[key] !== original[key]), [draft, original]);

    const loadStatus = useCallback(() => {
        if (!running) {
            setMc(null);
            return;
        }
        getMinecraftStatus(uuid)
            .then(setMc)
            .catch(() => setMc(null));
    }, [uuid, running]);

    const loadList = useCallback(
        (list: ListName) => {
            if (!canRead) return;
            getFileContents(uuid, lists[list].file)
                .then((text) => {
                    const data = JSON.parse(text || '[]');
                    setEntries((prev) => ({
                        ...prev,
                        [list]: (Array.isArray(data) ? data : [])
                            .filter((row) => row && typeof row.name === 'string')
                            .map((row) => ({
                                name: row.name,
                                detail:
                                    list === 'banned'
                                        ? row.reason
                                        : list === 'ops' && row.level
                                        ? __('Level {{level}}', { level: row.level })
                                        : undefined,
                            })),
                    }));
                })
                // The file does not exist until the server has started once: treat it as empty.
                .catch(() => setEntries((prev) => ({ ...prev, [list]: [] })));
        },
        [uuid, canRead]
    );

    const loadProperties = useCallback(() => {
        if (!canRead) return;
        getFileContents(uuid, '/server.properties')
            .then((text) => {
                setRaw(text);
                setDraft(parseProperties(text));
                setMissing(false);
            })
            .catch(() => setMissing(true));
    }, [uuid, canRead]);

    useEffect(() => {
        clearFlashes('minecraft');
        loadProperties();
        (Object.keys(lists) as ListName[]).forEach(loadList);
    }, [uuid]);

    useEffect(() => {
        loadStatus();
        const timer = setInterval(loadStatus, 20000);

        return () => clearInterval(timer);
    }, [loadStatus]);

    const send = (command: string, reload: ListName[] = []) => {
        if (!canAct || !instance) return;
        setBusy(true);
        instance.send(SocketRequest.SEND_COMMAND, command);
        // The server rewrites its JSON files as soon as it has handled the command.
        setTimeout(() => {
            reload.forEach(loadList);
            loadStatus();
            setBusy(false);
        }, 1400);
    };

    const submitName = (e: React.FormEvent) => {
        e.preventDefault();
        const value = name.trim();
        clearFlashes('minecraft');
        if (!isValidPlayerName(value)) {
            addFlash({
                key: 'minecraft',
                type: 'error',
                message: __('Enter a valid player name: 2 to 16 letters, numbers or underscores.'),
            });
            return;
        }
        send(lists[tab].add(value), [tab]);
        setName('');
    };

    const setWhitelist = (on: boolean) => {
        send(`whitelist ${on ? 'on' : 'off'}`);
        setDraft((d) => ('white-list' in d ? { ...d, 'white-list': String(on) } : d));
        setRaw((r) => (r === null ? r : applyProperties(r, { 'white-list': String(on) })));
    };

    const saveProperties = () => {
        if (raw === null || changed.length === 0) return;
        clearFlashes('minecraft');
        setSaving(true);
        const next = applyProperties(
            raw,
            changed.reduce((all, key) => ({ ...all, [key]: draft[key] }), {})
        );
        saveFileContents(uuid, '/server.properties', next)
            .then(() => {
                setRaw(next);
                setSaved(true);
            })
            .catch((error) => clearAndAddHttpError({ key: 'minecraft', error }))
            .then(() => setSaving(false));
    };

    const update = (key: string, value: string) => {
        setSaved(false);
        setDraft((d) => ({ ...d, [key]: value }));
    };

    const current = entries[tab];
    const whitelistOn = (original['white-list'] || 'false') === 'true';

    return (
        <ServerContentBlock title={'Minecraft'}>
            <FlashMessageRender byKey={'minecraft'} className={'mb-4'} />
            <div className={'grid grid-cols-1 gap-4 lg:grid-cols-3'}>
                <TitledGreyBox title={__('Server Status')} icon={faCube} className={'lg:col-span-1'}>
                    {!running ? (
                        <p className={'text-sm text-neutral-400'}>{__('The server is not running.')}</p>
                    ) : !mc ? (
                        <SkeletonList rows={2} variant={'file'} />
                    ) : !mc.reachable ? (
                        <p className={'text-sm leading-relaxed text-neutral-400'}>
                            {__(
                                'The server is running, but the panel could not ask it for its status. It may still be starting, or the game port is not reachable from the panel.'
                            )}
                        </p>
                    ) : (
                        <>
                            <div className={'flex items-end gap-2'}>
                                <span className={'text-4xl font-bold tabular-nums text-neutral-50'}>
                                    {mc.players.online}
                                </span>
                                <span className={'pb-1 text-sm text-neutral-400'}>
                                    / {mc.players.max} {__('players online')}
                                </span>
                            </div>
                            {mc.version && <p className={'mt-2 text-sm text-neutral-300'}>{mc.version}</p>}
                            {mc.motd && <p className={'mt-1 break-words text-sm text-neutral-400'}>{mc.motd}</p>}
                            {mc.players.sample.length > 0 && (
                                <ul className={'mt-4 space-y-1.5'}>
                                    {mc.players.sample.map((player) => (
                                        <li
                                            key={player}
                                            className={
                                                'flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-neutral-100'
                                            }
                                        >
                                            <span className={'state-dot live text-green-300'} />
                                            <span className={'min-w-0 flex-1 truncate font-mono'}>{player}</span>
                                            {canAct && (
                                                <button
                                                    type={'button'}
                                                    className={'text-xs text-neutral-400 hover:text-red-300'}
                                                    onClick={() => send(`kick ${player}`)}
                                                >
                                                    {__('Kick')}
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </TitledGreyBox>

                <TitledGreyBox title={__('Players')} icon={faUsers} className={'lg:col-span-2'}>
                    <div className={'mb-4 flex flex-wrap items-center gap-2'}>
                        {(Object.keys(lists) as ListName[]).map((key) => (
                            <button
                                key={key}
                                type={'button'}
                                onClick={() => setTab(key)}
                                className={classNames(
                                    'inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition-colors duration-150',
                                    tab === key
                                        ? 'bg-white/15 text-neutral-50'
                                        : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-100'
                                )}
                            >
                                <FontAwesomeIcon icon={listIcons[key]} />
                                {__(lists[key].label)}
                                {entries[key] && (
                                    <span className={'rounded-full bg-white/10 px-1.5 text-xs tabular-nums'}>
                                        {entries[key]!.length}
                                    </span>
                                )}
                            </button>
                        ))}
                        {tab === 'whitelist' && 'white-list' in original && (
                            <label className={'ml-auto flex items-center gap-2 text-sm text-neutral-300'}>
                                {whitelistOn ? __('Whitelist is on') : __('Whitelist is off')}
                                <Toggle checked={whitelistOn} onChange={setWhitelist} disabled={!canAct || busy} />
                            </label>
                        )}
                    </div>

                    {canCommand && (
                        <form onSubmit={submitName} className={'mb-4 flex gap-2'}>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                placeholder={__('Player name')}
                                maxLength={17}
                                disabled={!canAct}
                                autoCapitalize={'none'}
                                autoCorrect={'off'}
                                spellCheck={false}
                            />
                            <Button
                                type={'submit'}
                                disabled={!canAct || busy || name.trim() === ''}
                                className={'flex-none'}
                            >
                                <FontAwesomeIcon icon={tab === 'banned' ? faBan : faUserPlus} className={'mr-2'} />
                                {tab === 'banned' ? __('Ban') : __('Add')}
                            </Button>
                        </form>
                    )}
                    {canCommand && !running && (
                        <p className={'mb-4 rounded-xl bg-yellow-400/10 px-3 py-2 text-sm text-yellow-200'}>
                            {__('Start the server to change these lists. Changes are made with console commands.')}
                        </p>
                    )}

                    {current === null ? (
                        <SkeletonList rows={3} variant={'file'} />
                    ) : current.length === 0 ? (
                        <p className={'py-6 text-center text-sm text-neutral-400'}>{__(lists[tab].empty)}</p>
                    ) : (
                        <ul className={'grid grid-cols-1 gap-1.5 sm:grid-cols-2'}>
                            {current.map((entry) => (
                                <li
                                    key={entry.name}
                                    className={'flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2'}
                                >
                                    <span className={'min-w-0 flex-1'}>
                                        <span className={'block truncate font-mono text-sm text-neutral-100'}>
                                            {entry.name}
                                        </span>
                                        {entry.detail && (
                                            <span className={'block truncate text-xs text-neutral-400'}>
                                                {entry.detail}
                                            </span>
                                        )}
                                    </span>
                                    {canCommand && (
                                        <button
                                            type={'button'}
                                            disabled={!canAct || busy}
                                            title={tab === 'banned' ? __('Unban') : __('Remove')}
                                            aria-label={`${tab === 'banned' ? __('Unban') : __('Remove')} ${
                                                entry.name
                                            }`}
                                            onClick={() => send(lists[tab].remove(entry.name), [tab])}
                                            className={
                                                'flex h-7 w-7 flex-none items-center justify-center rounded-lg text-neutral-400 transition-colors duration-150 hover:bg-red-400/15 hover:text-red-300 disabled:opacity-40'
                                            }
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </TitledGreyBox>
            </div>

            <TitledGreyBox title={__('Server Settings')} icon={faSlidersH} className={'mt-4'}>
                {missing ? (
                    <EmptyState
                        bare
                        icon={faSlidersH}
                        title={__('server.properties was not found')}
                        message={__(
                            'The file is created the first time the server starts. Proxies such as Velocity and BungeeCord do not use it.'
                        )}
                    />
                ) : raw === null ? (
                    <SkeletonList rows={4} variant={'file'} />
                ) : (
                    <>
                        {propertyFields.map((group) => {
                            const fields = group.fields.filter((field) => field.key in original);
                            if (fields.length === 0) return null;

                            return (
                                <div key={group.title} className={'mb-6'}>
                                    <p
                                        className={
                                            'mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400'
                                        }
                                    >
                                        {__(group.title)}
                                    </p>
                                    <div className={'grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2'}>
                                        {fields.map((field) => (
                                            <div
                                                key={field.key}
                                                className={classNames(
                                                    field.type === 'toggle' && 'flex items-start justify-between gap-4'
                                                )}
                                            >
                                                <div className={'min-w-0'}>
                                                    <label
                                                        htmlFor={`mc-${field.key}`}
                                                        className={'block text-sm font-medium text-neutral-100'}
                                                    >
                                                        {__(field.label)}
                                                    </label>
                                                    {field.help && (
                                                        <p
                                                            className={
                                                                'mt-0.5 text-xs leading-relaxed text-neutral-400'
                                                            }
                                                        >
                                                            {__(field.help)}
                                                        </p>
                                                    )}
                                                </div>
                                                {field.type === 'toggle' ? (
                                                    <Toggle
                                                        checked={draft[field.key] === 'true'}
                                                        onChange={(v) => update(field.key, String(v))}
                                                        disabled={!canWrite}
                                                    />
                                                ) : field.type === 'select' ? (
                                                    <Select
                                                        id={`mc-${field.key}`}
                                                        className={'mt-1.5'}
                                                        value={draft[field.key]}
                                                        disabled={!canWrite}
                                                        onChange={(e) => update(field.key, e.currentTarget.value)}
                                                    >
                                                        {!field.options.some(
                                                            ([value]) => value === draft[field.key]
                                                        ) && (
                                                            <option value={draft[field.key]}>{draft[field.key]}</option>
                                                        )}
                                                        {field.options.map(([value, label]) => (
                                                            <option key={value} value={value}>
                                                                {__(label)}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                ) : (
                                                    <Input
                                                        id={`mc-${field.key}`}
                                                        className={'mt-1.5'}
                                                        type={field.type === 'number' ? 'number' : 'text'}
                                                        value={draft[field.key] ?? ''}
                                                        disabled={!canWrite}
                                                        min={field.type === 'number' ? field.min : undefined}
                                                        max={field.type === 'number' ? field.max : undefined}
                                                        maxLength={field.type === 'text' ? field.maxLength : undefined}
                                                        onChange={(e) => update(field.key, e.currentTarget.value)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        <div className={'flex flex-wrap items-center justify-end gap-3 border-t border-white/5 pt-4'}>
                            <p className={'mr-auto text-sm text-neutral-400'}>
                                {saved
                                    ? __('Saved. Restart the server for the changes to take effect.')
                                    : changed.length > 0
                                    ? __('{{n}} unsaved changes', { n: changed.length })
                                    : __('Other settings can be edited in server.properties from the Files tab.')}
                            </p>
                            {saved && canRestart && running && (
                                <Button.Text
                                    onClick={() => {
                                        instance && instance.send(SocketRequest.SET_STATE, 'restart');
                                        setSaved(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faSyncAlt} className={'mr-2'} />
                                    {__('Restart now')}
                                </Button.Text>
                            )}
                            {canWrite && (
                                <Button onClick={saveProperties} disabled={saving || changed.length === 0}>
                                    {__('Save')}
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </TitledGreyBox>
        </ServerContentBlock>
    );
};
