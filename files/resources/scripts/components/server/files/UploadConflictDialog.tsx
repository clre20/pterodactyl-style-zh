import React from 'react';
import { DocumentIcon, FolderIcon } from '@heroicons/react/outline';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import { FileObject } from '@/api/server/files/loadDirectory';
import { bytesToString } from '@/lib/formatters';

import { __ } from '@/i18n';

export interface UploadConflict {
    file: File;
    existing: FileObject;
}

export type ConflictChoice = 'overwrite' | 'keep';

interface Props {
    open: boolean;
    conflicts: UploadConflict[];
    /** Number of files in the upload that do not clash with anything. */
    others: number;
    /** What the first clashing file would be renamed to with "Keep both". */
    example?: string;
    onCancel: () => void;
    onChoose: (choice: ConflictChoice) => void;
}

export default ({ open, conflicts, others, example, onCancel, onChoose }: Props) => {
    const folders = conflicts.filter((c) => !c.existing.isFile).length;

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            title={__('Files already exist')}
            description={__('{{count}} of the files you are uploading already exist in this folder.', {
                count: conflicts.length,
            })}
        >
            <Dialog.Icon type={'warning'} />
            <ul
                className={
                    'mt-4 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-black/20 divide-y divide-white/5'
                }
            >
                {conflicts.map(({ file, existing }) => (
                    <li key={file.name} className={'flex items-center gap-3 px-3 py-2.5 text-sm'}>
                        {existing.isFile ? (
                            <DocumentIcon className={'w-5 h-5 flex-none text-neutral-400'} />
                        ) : (
                            <FolderIcon className={'w-5 h-5 flex-none text-primary-300'} />
                        )}
                        <span className={'flex-1 min-w-0 truncate text-neutral-100'} title={file.name}>
                            {file.name}
                        </span>
                        {existing.isFile ? (
                            <span className={'flex-none text-xs text-neutral-400 tabular-nums'}>
                                {bytesToString(existing.size)}
                                <span className={'mx-1.5 text-neutral-500'}>→</span>
                                <span className={'text-neutral-200'}>{bytesToString(file.size)}</span>
                            </span>
                        ) : (
                            <span
                                className={
                                    'flex-none rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2 py-0.5 text-2xs text-yellow-200'
                                }
                            >
                                {__('Folder')}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
            <div className={'mt-4 space-y-1.5 text-sm text-neutral-300'}>
                {example && (
                    <p>
                        {__('"Keep both" uploads the new files under a new name, for example')}{' '}
                        <code className={'rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-neutral-100'}>
                            {example}
                        </code>
                    </p>
                )}
                {folders > 0 && (
                    <p className={'text-yellow-200/90'}>
                        {__('A folder cannot be overwritten, so files named after a folder are always renamed.')}
                    </p>
                )}
                {others > 0 && (
                    <p className={'text-neutral-400'}>
                        {__('The other {{count}} files will be uploaded as usual.', { count: others })}
                    </p>
                )}
            </div>
            <Dialog.Footer>
                <Button.Text onClick={onCancel}>{__('Cancel Upload')}</Button.Text>
                <Button.Danger onClick={() => onChoose('overwrite')}>{__('Overwrite')}</Button.Danger>
                <Button onClick={() => onChoose('keep')}>{__('Keep Both')}</Button>
            </Dialog.Footer>
        </Dialog>
    );
};
