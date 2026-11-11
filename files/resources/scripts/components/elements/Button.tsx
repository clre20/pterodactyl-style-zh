import React from 'react';
import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';

interface Props {
    isLoading?: boolean;
    size?: 'xsmall' | 'small' | 'large' | 'xlarge';
    color?: 'green' | 'red' | 'primary' | 'grey';
    isSecondary?: boolean;
}

const ButtonStyle = styled.button<Omit<Props, 'isLoading'>>`
    ${tw`relative inline-block rounded-xl p-2 tracking-wide text-sm font-semibold transition-all duration-150 border`};

    ${(props) =>
        ((!props.isSecondary && !props.color) || props.color === 'primary') &&
        css<Props>`
            ${(props) =>
                !props.isSecondary &&
                css`
                    ${tw`border-transparent text-white`};
                    background-image: linear-gradient(135deg, rgb(var(--ac-a)), rgb(var(--ac-b)));
                    box-shadow: 0 6px 20px rgb(var(--ac-a) / 0.3);
                `};

            &:hover:not(:disabled) {
                filter: brightness(1.1);
            }
        `};

    ${(props) =>
        props.color === 'grey' &&
        css`
            ${tw`text-neutral-50`};
            background: rgba(255, 255, 255, 0.07);
            border-color: rgba(255, 255, 255, 0.14);

            &:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.12);
            }
        `};

    ${(props) =>
        props.color === 'green' &&
        css<Props>`
            ${tw`text-green-100`};
            background: rgba(52, 211, 153, 0.18);
            border-color: rgba(52, 211, 153, 0.45);

            &:hover:not(:disabled) {
                ${tw`bg-green-600 border-green-700`};
            }

            ${(props) =>
                props.isSecondary &&
                css`
                    &:active:not(:disabled) {
                        ${tw`bg-green-600 border-green-700`};
                    }
                `};
        `};

    ${(props) =>
        props.color === 'red' &&
        css<Props>`
            ${tw`text-red-100`};
            background: rgba(248, 113, 113, 0.18);
            border-color: rgba(248, 113, 113, 0.5);

            &:hover:not(:disabled) {
                ${tw`bg-red-600 border-red-700`};
            }

            ${(props) =>
                props.isSecondary &&
                css`
                    &:active:not(:disabled) {
                        ${tw`bg-red-600 border-red-700`};
                    }
                `};
        `};

    ${(props) => props.size === 'xsmall' && tw`px-2 py-1 text-xs`};
    ${(props) => (!props.size || props.size === 'small') && tw`px-4 py-2`};
    ${(props) => props.size === 'large' && tw`p-4 text-sm`};
    ${(props) => props.size === 'xlarge' && tw`p-4 w-full`};

    ${(props) =>
        props.isSecondary &&
        css<Props>`
            ${tw`border-neutral-600 bg-transparent text-neutral-200`};

            &:hover:not(:disabled) {
                ${tw`border-neutral-500 text-neutral-100`};
                ${(props) => props.color === 'red' && tw`bg-red-500 border-red-600 text-red-50`};
                ${(props) => props.color === 'primary' && tw`bg-primary-500 border-primary-600 text-primary-50`};
                ${(props) => props.color === 'green' && tw`bg-green-500 border-green-600 text-green-50`};
            }
        `};

    &:disabled {
        opacity: 0.55;
        cursor: default;
    }
`;

type ComponentProps = Omit<JSX.IntrinsicElements['button'], 'ref' | keyof Props> & Props;

const Button: React.FC<ComponentProps> = ({ children, isLoading, ...props }) => (
    <ButtonStyle {...props}>
        {isLoading && (
            <div css={tw`flex absolute justify-center items-center w-full h-full left-0 top-0`}>
                <Spinner size={'small'} />
            </div>
        )}
        <span css={isLoading ? tw`text-transparent` : undefined}>{children}</span>
    </ButtonStyle>
);

type LinkProps = Omit<JSX.IntrinsicElements['a'], 'ref' | keyof Props> & Props;

const LinkButton: React.FC<LinkProps> = (props) => <ButtonStyle as={'a'} {...props} />;

export { LinkButton, ButtonStyle };
export default Button;
