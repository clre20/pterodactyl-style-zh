import axios, { AxiosProgressEvent } from 'axios';
import getFileUploadUrl from '@/api/server/files/getFileUploadUrl';
import tw from 'twin.macro';
import { Button } from '@/components/elements/button/index';
import React, { useEffect, useRef, useState } from 'react';
import { ModalMask } from '@/components/elements/Modal';
import Fade from '@/components/elements/Fade';
import useEventListener from '@/plugins/useEventListener';
import { useFlashKey } from '@/plugins/useFlash';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import { ServerContext } from '@/state/server';
import { WithClassname } from '@/components/types';
import Portal from '@/components/elements/Portal';
import { CloudUploadIcon } from '@heroicons/react/outline';
import { useSignal } from '@preact/signals-react';
import { FileObject } from '@/api/server/files/loadDirectory';
import UploadConflictDialog, { ConflictChoice, UploadConflict } from '@/components/server/files/UploadConflictDialog';

import { __ } from '@/i18n';
function isFileOrDirectory(event: DragEvent): boolean {
    if (!event.dataTransfer?.types) {
        return false;
    }

    return event.dataTransfer.types.some((value) => value.toLowerCase() === 'files');
}

/** Splits "server.properties" into "server" + ".properties", keeping ".tar.gz" style endings together. */
function splitName(name: string): [string, string] {
    const match = name.match(/^(.+?)((?:\.tar)?\.[^.]+)$/);

    return match ? [match[1], match[2]] : [name, ''];
}

/** The first "name (n).ext" that is not in `taken`. */
function availableName(name: string, taken: Set<string>): string {
    const [base, extension] = splitName(name);
    for (let i = 1; ; i++) {
        const candidate = `${base} (${i})${extension}`;
        if (!taken.has(candidate)) return candidate;
    }
}

interface PendingUpload {
    files: File[];
    conflicts: UploadConflict[];
    existing: FileObject[];
}

export default ({ className }: WithClassname) => {
    const fileUploadInput = useRef<HTMLInputElement>(null);

    const visible = useSignal(false);
    const [pending, setPending] = useState<PendingUpload | null>(null);
    const timeouts = useSignal<NodeJS.Timeout[]>([]);

    const { mutate, data: listed } = useFileManagerSwr();
    const { addError, clearAndAddHttpError } = useFlashKey('files');

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const directory = ServerContext.useStoreState((state) => state.files.directory);
    const { clearFileUploads, removeFileUpload, pushFileUpload, setUploadProgress } = ServerContext.useStoreActions(
        (actions) => actions.files
    );

    useEventListener(
        'dragenter',
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isFileOrDirectory(e)) {
                visible.value = true;
            }
        },
        { capture: true }
    );

    useEventListener('dragexit', () => (visible.value = false), { capture: true });

    useEventListener('keydown', () => (visible.value = false));

    useEffect(() => {
        return () => timeouts.value.forEach(clearTimeout);
    }, []);

    const onUploadProgress = (data: AxiosProgressEvent, name: string) => {
        setUploadProgress({ name, loaded: data.loaded });
    };

    const startUpload = (list: File[]) => {
        const uploads = list.map((file) => {
            const controller = new AbortController();
            pushFileUpload({
                name: file.name,
                data: { abort: controller, loaded: 0, total: file.size },
            });

            return () =>
                getFileUploadUrl(uuid).then((url) =>
                    axios
                        .post(
                            url,
                            { files: file },
                            {
                                signal: controller.signal,
                                headers: { 'Content-Type': 'multipart/form-data' },
                                params: { directory },
                                onUploadProgress: (data) => onUploadProgress(data, file.name),
                            }
                        )
                        .then(() => timeouts.value.push(setTimeout(() => removeFileUpload(file.name), 500)))
                );
        });

        Promise.all(uploads.map((fn) => fn()))
            .then(() => mutate())
            .catch((error) => {
                clearFileUploads();
                clearAndAddHttpError(error);
            });
    };

    const onFileSubmission = (files: FileList) => {
        clearAndAddHttpError();
        const list = Array.from(files);
        if (list.some((file) => !file.type && (!file.size || file.size === 4096))) {
            return addError('Folder uploads are not supported.', 'Error');
        }

        // Check against a fresh listing so a file created since the page loaded is not silently replaced.
        mutate()
            .catch(() => undefined)
            .then((fresh) => {
                const existing = fresh || listed || [];
                const byName = new Map(existing.map((f) => [f.name, f]));
                const conflicts = list
                    .filter((file) => byName.has(file.name))
                    .map((file) => ({ file, existing: byName.get(file.name)! }));

                if (!conflicts.length) {
                    startUpload(list);
                } else {
                    setPending({ files: list, conflicts, existing });
                }
            });
    };

    const onConflictChoice = (choice: ConflictChoice) => {
        if (!pending) return;

        const clashing = new Map(pending.conflicts.map((c) => [c.file.name, c.existing]));
        const taken = new Set([...pending.existing.map((f) => f.name), ...pending.files.map((f) => f.name)]);
        const files = pending.files.map((file) => {
            const existing = clashing.get(file.name);
            // A folder can never be replaced by a file, so those are renamed even when overwriting.
            if (!existing || (choice === 'overwrite' && existing.isFile)) return file;

            const name = availableName(file.name, taken);
            taken.add(name);

            return new File([file], name, { type: file.type, lastModified: file.lastModified });
        });

        setPending(null);
        startUpload(files);
    };

    const exampleName = (() => {
        if (!pending) return undefined;
        const taken = new Set([...pending.existing.map((f) => f.name), ...pending.files.map((f) => f.name)]);

        return availableName(pending.conflicts[0].file.name, taken);
    })();

    return (
        <>
            <Portal>
                <Fade appear in={visible.value} timeout={75} key={'upload_modal_mask'} unmountOnExit>
                    <ModalMask
                        onClick={() => (visible.value = false)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            visible.value = false;
                            if (!e.dataTransfer?.files.length) return;

                            onFileSubmission(e.dataTransfer.files);
                        }}
                    >
                        <div className={'w-full flex items-center justify-center pointer-events-none'}>
                            <div
                                className={
                                    'flex items-center space-x-4 bg-black w-full ring-4 ring-blue-200 ring-opacity-60 rounded p-6 mx-10 max-w-sm'
                                }
                            >
                                <CloudUploadIcon className={'w-10 h-10 flex-shrink-0'} />
                                <p className={'font-header flex-1 text-lg text-neutral-100 text-center'}>
                                    {__('Drag and drop files to upload.')}
                                </p>
                            </div>
                        </div>
                    </ModalMask>
                </Fade>
            </Portal>
            <UploadConflictDialog
                open={!!pending}
                conflicts={pending?.conflicts || []}
                others={pending ? pending.files.length - pending.conflicts.length : 0}
                example={exampleName}
                onCancel={() => setPending(null)}
                onChoose={onConflictChoice}
            />
            <input
                type={'file'}
                ref={fileUploadInput}
                css={tw`hidden`}
                onChange={(e) => {
                    if (!e.currentTarget.files) return;

                    onFileSubmission(e.currentTarget.files);
                    // Clear the picker so choosing the same file again (e.g. after cancelling) fires onChange.
                    e.currentTarget.value = '';
                }}
                multiple
            />
            <Button className={className} onClick={() => fileUploadInput.current && fileUploadInput.current.click()}>
                {__('Upload')}
            </Button>
        </>
    );
};
