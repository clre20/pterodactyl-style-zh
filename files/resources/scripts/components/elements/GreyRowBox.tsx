import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded-2xl no-underline text-neutral-200 items-center p-4 transition-all duration-200 overflow-hidden relative`};
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    box-shadow: var(--glass-shadow);

    ${(props) =>
        props.$hoverable !== false &&
        `&:hover { background: rgba(255, 255, 255, 0.085); border-color: rgb(var(--ac-a-l) / 0.35); transform: translateY(-1px); }`};

    & .icon {
        ${tw`rounded-xl w-12 h-12 flex items-center justify-center p-3 flex-none`};
        background: rgb(var(--ac-a-l) / 0.16);
        border: 1px solid rgb(var(--ac-a-l) / 0.35);
        color: rgb(var(--primary-300));
    }
`;
