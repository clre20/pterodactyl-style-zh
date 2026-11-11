import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full px-3 sm:px-4 pt-3`};

    & > div {
        ${tw`flex items-center gap-1 text-sm mx-auto p-1.5 rounded-2xl overflow-x-auto`};
        max-width: 1200px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        box-shadow: var(--glass-shadow);
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }

        & > a,
        & > div {
            ${tw`inline-flex items-center h-10 px-4 rounded-xl text-neutral-300 no-underline whitespace-nowrap transition-all duration-200`};

            &:hover {
                ${tw`text-white`};
                background: rgba(255, 255, 255, 0.06);
            }

            &:active,
            &.active {
                ${tw`text-white`};
                background: rgb(var(--ac-a-l) / 0.22);
            }
        }
    }
`;

export default SubNavigation;
