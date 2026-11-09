import React from 'react';
import classNames from 'classnames';
import styles from '@/components/server/console/style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ChartBlockProps {
    title: string;
    legend?: React.ReactNode;
    icon?: IconDefinition;
    color?: string;
    children: React.ReactNode;
}

export default ({ title, legend, icon, color, children }: ChartBlockProps) => (
    <div className={classNames(styles.chart_container, 'glass group')}>
        {icon && <FontAwesomeIcon icon={icon} className={'watermark'} style={{ color }} />}
        <div className={'relative flex items-center justify-between px-5 pt-4 pb-2'}>
            <h3 className={'font-header font-bold text-neutral-100 transition-colors duration-100 group-hover:text-white'}>
                {title}
            </h3>
            {legend && <p className={'text-sm flex items-center'}>{legend}</p>}
        </div>
        <div className={'relative z-10 px-3 pb-3'}>{children}</div>
    </div>
);
