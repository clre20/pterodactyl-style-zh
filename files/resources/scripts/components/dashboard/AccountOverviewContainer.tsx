import * as React from 'react';
import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import PageContentBlock from '@/components/elements/PageContentBlock';
import LanguageSwitcher from '@/components/elements/LanguageSwitcher';
import MessageBox from '@/components/MessageBox';
import { useLocation } from 'react-router-dom';

import { __ } from '@/i18n';
export default () => {
    const { state } = useLocation<undefined | { twoFactorRedirect?: boolean }>();

    return (
        <PageContentBlock title={__('Account Overview')}>
            {state?.twoFactorRedirect && (
                <MessageBox title={__('2-Factor Required')} type={'error'}>
                    {__('Your account must have two-factor authentication enabled in order to continue.')}
                </MessageBox>
            )}

            <h1 className={'text-3xl font-bold text-neutral-50 mt-2'}>{__('Account Settings')}</h1>
            <div className={'grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-10 stagger'}>
                <ContentBox title={__('Language Preference')}>
                    <p className={'text-sm text-neutral-400 mb-4'}>
                        {__('The panel and system emails will use this language.')}
                    </p>
                    <LanguageSwitcher variant={'segmented'} className={'inline-flex'} />
                </ContentBox>
                <ContentBox title={__('Two-Step Verification')}>
                    <ConfigureTwoFactorForm />
                </ContentBox>
                <ContentBox title={__('Update Password')} showFlashes={'account:password'}>
                    <UpdatePasswordForm />
                </ContentBox>
                <ContentBox title={__('Update Email Address')} showFlashes={'account:email'}>
                    <UpdateEmailAddressForm />
                </ContentBox>
            </div>
        </PageContentBlock>
    );
};
