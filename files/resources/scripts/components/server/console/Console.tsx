import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ITerminalOptions, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { SearchBarAddon } from 'xterm-addon-search-bar';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { ScrollDownHelperAddon } from '@/plugins/XtermScrollDownHelperAddon';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ServerContext } from '@/state/server';
import { usePermissions } from '@/plugins/usePermissions';
import { theme as th } from 'twin.macro';
import { accentColor } from '@/lib/theme';
import useEventListener from '@/plugins/useEventListener';
import { debounce } from 'debounce';
import { usePersistedState } from '@/plugins/usePersistedState';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import classNames from 'classnames';
import { ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faDownload, faEraser, faHistory, faPlus, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { isMinecraftServer } from '@/lib/minecraft';

import 'xterm/css/xterm.css';
import styles from './style.module.css';

import { __ } from '@/i18n';
import { capitalize } from '@/lib/strings';
const theme = {
    background: 'rgba(0, 0, 0, 0)',
    cursor: 'transparent',
    black: th`colors.black`.toString(),
    red: '#E54B4B',
    green: '#9ECE58',
    yellow: '#FAED70',
    blue: '#396FE2',
    magenta: '#BB80B3',
    cyan: '#2DDAFD',
    white: '#d0d0d0',
    brightBlack: 'rgba(255, 255, 255, 0.2)',
    brightRed: '#FF5370',
    brightGreen: '#C3E88D',
    brightYellow: '#FFCB6B',
    brightBlue: '#82AAFF',
    brightMagenta: '#C792EA',
    brightCyan: '#89DDFF',
    brightWhite: '#ffffff',
    selection: accentColor('--ac-a-l', 0.45),
};

const terminalProps: ITerminalOptions = {
    disableStdin: true,
    cursorStyle: 'underline',
    allowTransparency: true,
    fontSize: 12,
    fontFamily: th('fontFamily.mono'),
    rows: 30,
    theme: theme,
};

// Colours for log lines that carry no colour codes of their own, by the level named in the line.
const RED = '\u001b[38;5;210m';
const YELLOW = '\u001b[38;5;221m';
const GREEN = '\u001b[38;5;114m';
const DIM = '\u001b[38;5;245m';

const colourise = (line: string): string => {
    // Lines the server already coloured are left exactly as they are.
    if (line.includes('\u001b[')) return line;
    if (/\b(ERROR|SEVERE|FATAL|CRITICAL)\b|Exception\b|^\s+at [\w.$<>]+\(|^Caused by:/.test(line)) return RED + line;
    if (/\bWARN(ING)?\b/.test(line)) return YELLOW + line;
    if (/\bDone \(\d|\bjoined the game\b|\bsuccessfully\b|\blistening on\b/i.test(line)) return GREEN + line;
    if (/\bDEBUG\b|\bTRACE\b/.test(line)) return DIM + line;

    return line;
};

interface QuickCommand {
    label: string;
    command: string;
}

const toolButton =
    'flex h-8 w-8 items-center justify-center rounded-lg text-neutral-300 transition-colors duration-150 hover:bg-white/15 hover:text-white';

export default () => {
    const TERMINAL_PRELUDE = '\u001b[1m\u001b[33mcontainer@pterodactyl~ \u001b[0m';
    const ref = useRef<HTMLDivElement>(null);
    const terminal = useMemo(() => new Terminal({ ...terminalProps }), []);
    const fitAddon = new FitAddon();
    const searchAddon = new SearchAddon();
    const searchBar = new SearchBarAddon({ searchAddon });
    // The add-on instances above are recreated on every render; this keeps the one that was loaded.
    const loadedSearchBar = useRef<SearchBarAddon | null>(null);
    const input = useRef<HTMLInputElement>(null);
    const webLinksAddon = new WebLinksAddon();
    const unicode11Addon = new Unicode11Addon();
    const scrollDownHelperAddon = new ScrollDownHelperAddon();
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const [canSendCommands] = usePermissions(['control.console']);
    const serverId = ServerContext.useStoreState((state) => state.server.data!.id);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const [history, setHistory] = usePersistedState<string[]>(`${serverId}:command_history`, []);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const serverName = ServerContext.useStoreState((state) => state.server.data!.name);
    const minecraft = ServerContext.useStoreState((state) => isMinecraftServer(state.server.data!));
    const [quick, setQuick] = usePersistedState<QuickCommand[] | null>(`${serverId}:quick_commands`, null);
    const [panel, setPanel] = useState<'history' | 'add' | null>(null);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState({ label: '', command: '' });

    // Until the user edits the list, Minecraft servers get a few useful commands to start with.
    const quickCommands: QuickCommand[] =
        quick ||
        (minecraft
            ? [
                  { label: 'list', command: 'list' },
                  { label: 'save-all', command: 'save-all' },
                  { label: 'whitelist list', command: 'whitelist list' },
              ]
            : []);

    const sendCommand = (command: string) => {
        if (!instance || !connected || command.trim() === '') return;
        setHistory((previous) => [command, ...(previous || []).filter((c) => c !== command)].slice(0, 32));
        setHistoryIndex(-1);
        instance.send('send command', command);
    };

    const addQuick = (e: React.FormEvent) => {
        e.preventDefault();
        const command = draft.command.trim();
        if (!command) return;
        setQuick([...quickCommands, { label: draft.label.trim() || command, command }].slice(0, 12));
        setDraft({ label: '', command: '' });
        setPanel(null);
    };

    const downloadLog = () => {
        const buffer = terminal.buffer.active;
        const lines: string[] = [];
        for (let i = 0; i < buffer.length; i++) {
            lines.push(buffer.getLine(i)?.translateToString(true) || '');
        }
        while (lines.length && lines[lines.length - 1] === '') lines.pop();

        // Local time, e.g. 20261111-1502, so the name matches the clock the user sees.
        const now = new Date();
        const two = (n: number) => String(n).padStart(2, '0');
        const stamp = `${now.getFullYear()}${two(now.getMonth() + 1)}${two(now.getDate())}-${two(now.getHours())}${two(
            now.getMinutes()
        )}`;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([lines.join('\n') + '\n'], { type: 'text/plain;charset=utf-8' }));
        // Keep the server's own name (any language); only replace characters a file name cannot hold.
        link.download = `${serverName.replace(/[\\/:*?"<>|\s]+/g, '_') || 'server'}-console-${stamp}.log`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    };
    // SearchBarAddon has hardcoded z-index: 999 :(
    const zIndex = `
    .xterm-search-bar__addon {
        z-index: 10;
    }`;

    const handleConsoleOutput = (line: string, prelude = false) =>
        terminal.writeln(
            (prelude ? TERMINAL_PRELUDE : '') + colourise(line.replace(/(?:\r\n|\r|\n)$/im, '')) + '\u001b[0m'
        );

    const handleTransferStatus = (status: string) => {
        switch (status) {
            // Sent by either the source or target node if a failure occurs.
            case 'failure':
                terminal.writeln(TERMINAL_PRELUDE + __('Transfer has failed.') + '\u001b[0m');
                return;
        }
    };

    const handleDaemonErrorOutput = (line: string) =>
        terminal.writeln(
            TERMINAL_PRELUDE + '\u001b[1m\u001b[41m' + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m'
        );

    const handlePowerChangeEvent = (state: string) =>
        terminal.writeln(
            TERMINAL_PRELUDE + __('Server marked as {{state}}...', { state: __(capitalize(state)) }) + '\u001b[0m'
        );

    const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            const newIndex = Math.min(historyIndex + 1, history!.length - 1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';

            // By default up arrow will also bring the cursor to the start of the line,
            // so we'll preventDefault to keep it at the end.
            e.preventDefault();
        }

        if (e.key === 'ArrowDown') {
            const newIndex = Math.max(historyIndex - 1, -1);

            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';
        }

        const command = e.currentTarget.value;
        if (e.key === 'Enter' && command.length > 0) {
            sendCommand(command);
            e.currentTarget.value = '';
        }
    };

    useEffect(() => {
        if (connected && ref.current && !terminal.element) {
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(searchAddon);
            terminal.loadAddon(searchBar);
            loadedSearchBar.current = searchBar;
            terminal.loadAddon(webLinksAddon);
            terminal.loadAddon(unicode11Addon);
            terminal.loadAddon(scrollDownHelperAddon);

            terminal.open(ref.current);

            // Activate Unicode 11 for proper emoji and special character width handling
            terminal.unicode.activeVersion = '11';

            fitAddon.fit();
            searchBar.addNewStyle(zIndex);

            // Add support for capturing keys
            terminal.attachCustomKeyEventHandler((e: KeyboardEvent) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                    document.execCommand('copy');
                    return false;
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    searchBar.show();
                    return false;
                } else if (e.key === 'Escape') {
                    searchBar.hidden();
                }
                return true;
            });
        }
    }, [terminal, connected]);

    useEventListener(
        'resize',
        debounce(() => {
            if (terminal.element) {
                fitAddon.fit();
            }
        }, 100)
    );

    useEffect(() => {
        const listeners: Record<string, (s: string) => void> = {
            [SocketEvent.STATUS]: handlePowerChangeEvent,
            [SocketEvent.CONSOLE_OUTPUT]: handleConsoleOutput,
            [SocketEvent.INSTALL_OUTPUT]: handleConsoleOutput,
            [SocketEvent.TRANSFER_LOGS]: handleConsoleOutput,
            [SocketEvent.TRANSFER_STATUS]: handleTransferStatus,
            [SocketEvent.DAEMON_MESSAGE]: (line) => handleConsoleOutput(line, true),
            [SocketEvent.DAEMON_ERROR]: handleDaemonErrorOutput,
        };

        if (connected && instance) {
            // Do not clear the console if the server is being transferred.
            if (!isTransferring) {
                terminal.clear();
            }

            Object.keys(listeners).forEach((key: string) => {
                instance.addListener(key, listeners[key]);
            });
            instance.send(SocketRequest.SEND_LOGS);
        }

        return () => {
            if (instance) {
                Object.keys(listeners).forEach((key: string) => {
                    instance.removeListener(key, listeners[key]);
                });
            }
        };
    }, [connected, instance]);

    return (
        <div className={classNames(styles.terminal, 'relative')}>
            <SpinnerOverlay visible={!connected} size={'large'} />
            <div
                className={classNames(styles.container, styles.overflows_container, 'relative', {
                    'rounded-b': !canSendCommands,
                })}
            >
                <div
                    className={
                        'absolute right-3 top-2 z-10 flex items-center gap-0.5 rounded-xl bg-black/40 p-0.5 backdrop-blur-sm'
                    }
                    role={'toolbar'}
                    aria-label={__('Console tools')}
                >
                    <button
                        type={'button'}
                        className={toolButton}
                        title={__('Search the log (Ctrl+F)')}
                        aria-label={__('Search the log (Ctrl+F)')}
                        onClick={() => loadedSearchBar.current?.show()}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                    <button
                        type={'button'}
                        className={toolButton}
                        title={__('Download the log')}
                        aria-label={__('Download the log')}
                        onClick={downloadLog}
                    >
                        <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button
                        type={'button'}
                        className={toolButton}
                        title={__('Clear the screen')}
                        aria-label={__('Clear the screen')}
                        onClick={() => terminal.clear()}
                    >
                        <FontAwesomeIcon icon={faEraser} />
                    </button>
                </div>
                <div className={'h-full'}>
                    <div id={styles.terminal} ref={ref} />
                </div>
            </div>
            {canSendCommands && (
                <div className={classNames(styles.overflows_container, styles.quick_bar)}>
                    <FontAwesomeIcon
                        icon={faBolt}
                        className={'flex-none text-neutral-500'}
                        title={__('Quick commands')}
                    />
                    <div className={'hide-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto'}>
                        {quickCommands.length === 0 && (
                            <span className={'whitespace-nowrap text-xs text-neutral-500'}>
                                {__('Add commands you use often and run them with one click.')}
                            </span>
                        )}
                        {quickCommands.map((item, index) => (
                            <button
                                key={`${item.command}-${index}`}
                                type={'button'}
                                title={editing ? __('Remove') : item.command}
                                disabled={!editing && (!instance || !connected)}
                                onClick={() =>
                                    editing
                                        ? setQuick(quickCommands.filter((_, i) => i !== index))
                                        : sendCommand(item.command)
                                }
                                className={classNames(styles.quick_chip, editing && styles.quick_chip_editing)}
                            >
                                {item.label}
                                {editing && <FontAwesomeIcon icon={faTimes} className={'ml-1.5 h-3 w-3'} />}
                            </button>
                        ))}
                    </div>
                    {quickCommands.length > 0 && (
                        <button
                            type={'button'}
                            className={'flex-none whitespace-nowrap text-xs text-neutral-400 hover:text-neutral-100'}
                            onClick={() => setEditing((v) => !v)}
                        >
                            {editing ? __('Done') : __('Edit')}
                        </button>
                    )}
                    <button
                        type={'button'}
                        className={classNames(toolButton, 'h-7 w-7 flex-none')}
                        title={__('Add a quick command')}
                        aria-label={__('Add a quick command')}
                        aria-expanded={panel === 'add'}
                        onClick={() => setPanel(panel === 'add' ? null : 'add')}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            )}
            {canSendCommands && panel === 'add' && (
                <form onSubmit={addQuick} className={classNames(styles.overflows_container, styles.quick_form)}>
                    <input
                        autoFocus
                        value={draft.command}
                        onChange={(e) => setDraft({ ...draft, command: e.currentTarget.value })}
                        placeholder={__('Command, e.g. say Restarting in 5 minutes')}
                        aria-label={__('Command')}
                        maxLength={200}
                        autoCapitalize={'none'}
                        autoCorrect={'off'}
                        spellCheck={false}
                    />
                    <input
                        value={draft.label}
                        onChange={(e) => setDraft({ ...draft, label: e.currentTarget.value })}
                        placeholder={__('Button label (optional)')}
                        aria-label={__('Button label (optional)')}
                        maxLength={24}
                    />
                    <button type={'submit'} disabled={draft.command.trim() === ''}>
                        {__('Add')}
                    </button>
                </form>
            )}
            {canSendCommands && (
                <div className={classNames('relative', styles.overflows_container)}>
                    {panel === 'history' && (
                        <ul className={styles.history_list} role={'listbox'} aria-label={__('Command history')}>
                            {(history || []).length === 0 && (
                                <li className={'px-3 py-2 text-xs text-neutral-500'}>{__('No commands sent yet.')}</li>
                            )}
                            {(history || []).map((command, index) => (
                                <li key={`${command}-${index}`}>
                                    <button
                                        type={'button'}
                                        role={'option'}
                                        aria-selected={false}
                                        onClick={() => {
                                            if (input.current) {
                                                input.current.value = command;
                                                input.current.focus();
                                            }
                                            setPanel(null);
                                        }}
                                    >
                                        {command}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <input
                        ref={input}
                        className={classNames('peer', styles.command_input)}
                        type={'text'}
                        placeholder={__('Type a command...')}
                        aria-label={__('Console command input.')}
                        disabled={!instance || !connected}
                        onKeyDown={handleCommandKeyDown}
                        autoCorrect={'off'}
                        autoCapitalize={'none'}
                    />
                    <div
                        className={classNames(
                            'text-gray-100 peer-focus:text-gray-50 peer-focus:animate-pulse',
                            styles.command_icon
                        )}
                    >
                        <ChevronDoubleRightIcon className={'w-4 h-4'} />
                    </div>
                    <button
                        type={'button'}
                        className={classNames(toolButton, 'absolute right-2 top-1/2 z-10 -translate-y-1/2')}
                        title={__('Command history')}
                        aria-label={__('Command history')}
                        aria-expanded={panel === 'history'}
                        onClick={() => setPanel(panel === 'history' ? null : 'history')}
                    >
                        <FontAwesomeIcon icon={faHistory} />
                    </button>
                </div>
            )}
        </div>
    );
};
