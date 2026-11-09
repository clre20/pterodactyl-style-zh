import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';
import classNames from 'classnames';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div css={tw`rounded-2xl relative overflow-hidden`} className={classNames('glass', className)}>
        {icon && <FontAwesomeIcon icon={icon} className={'watermark'} />}
        <div css={tw`px-5 pt-4 pb-3 border-b border-white border-opacity-5`}>
            {typeof title === 'string' ? (
                <p css={tw`text-base font-semibold text-neutral-50 flex items-center`}>
                    {icon && <FontAwesomeIcon icon={icon} css={tw`mr-2 text-primary-300`} />}
                    {title}
                </p>
            ) : (
                title
            )}
        </div>
        <div css={tw`p-5 relative`}>{children}</div>
    </div>
);

export default memo(TitledGreyBox, isEqual);
