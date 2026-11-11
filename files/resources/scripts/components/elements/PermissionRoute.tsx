import React from 'react';
import { Route } from 'react-router-dom';
import { RouteProps } from 'react-router';
import Can from '@/components/elements/Can';
import { ServerError } from '@/components/elements/ScreenBlock';

import { __ } from '@/i18n';
interface Props extends Omit<RouteProps, 'path'> {
    path: string;
    permission: string | string[] | null;
}

export default ({ permission, children, ...props }: Props) => (
    <Route {...props}>
        {!permission ? (
            children
        ) : (
            <Can
                matchAny
                action={permission}
                renderOnError={
                    <ServerError art={'lock'} title={__('Access Denied')} message={__('You do not have permission to access this page.')} />
                }
            >
                {children}
            </Can>
        )}
    </Route>
);
