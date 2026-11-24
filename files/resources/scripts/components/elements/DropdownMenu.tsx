import React, { createRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import Fade from '@/components/elements/Fade';

interface Props {
    children: React.ReactNode;
    renderToggle: (onClick: (e: React.MouseEvent<any, MouseEvent>) => void) => React.ReactChild;
}

export const DropdownButtonRow = styled.button<{ danger?: boolean }>`
    ${tw`p-2 flex items-center rounded w-full text-neutral-500`};
    transition: 150ms all ease;

    &:hover {
        ${(props) => (props.danger ? tw`text-red-700 bg-red-100` : tw`text-neutral-700 bg-neutral-100`)};
    }
`;

interface State {
    posX: number;
    visible: boolean;
}

// Gap between the menu and the toggle / the edge of the window.
const GAP = 4;
const EDGE = 8;

class DropdownMenu extends React.PureComponent<Props, State> {
    menu = createRef<HTMLDivElement>();
    toggle = createRef<HTMLDivElement>();

    state: State = {
        posX: 0,
        visible: false,
    };

    componentWillUnmount() {
        this.removeListeners();
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        const menu = this.menu.current;

        if (this.state.visible && !prevState.visible && menu) {
            document.addEventListener('click', this.windowListener);
            document.addEventListener('contextmenu', this.contextMenuListener);
            window.addEventListener('scroll', this.close, true);
            window.addEventListener('resize', this.close);
            this.position(menu);
        }

        if (!this.state.visible && prevState.visible) {
            this.removeListeners();
        }
    }

    // The menu is rendered into <body> with fixed positioning so glass cards (backdrop-filter,
    // overflow-hidden) can neither clip it nor paint over it.
    position = (menu: HTMLDivElement) => {
        const anchor = this.toggle.current?.getBoundingClientRect();
        const width = menu.offsetWidth;
        const height = menu.offsetHeight;

        const left = Math.min(Math.max(this.state.posX - width, EDGE), window.innerWidth - width - EDGE);
        let top = anchor ? anchor.bottom + GAP : EDGE;
        if (anchor && top + height > window.innerHeight - EDGE && anchor.top - GAP - height >= EDGE) {
            top = anchor.top - GAP - height;
        }

        menu.style.left = `${Math.round(left)}px`;
        menu.style.top = `${Math.round(top)}px`;
    };

    removeListeners = () => {
        document.removeEventListener('click', this.windowListener);
        document.removeEventListener('contextmenu', this.contextMenuListener);
        window.removeEventListener('scroll', this.close, true);
        window.removeEventListener('resize', this.close);
    };

    onClickHandler = (e: React.MouseEvent<any, MouseEvent>) => {
        e.preventDefault();
        this.triggerMenu(e.clientX);
    };

    contextMenuListener = () => this.setState({ visible: false });

    close = (e?: Event) => {
        // Scrolling inside the menu itself should not close it.
        if (e && e.type === 'scroll' && this.menu.current?.contains(e.target as Node)) return;
        this.setState({ visible: false });
    };

    windowListener = (e: MouseEvent) => {
        const menu = this.menu.current;

        if (e.button === 2 || !this.state.visible || !menu) {
            return;
        }

        if (e.target === menu || menu.contains(e.target as Node)) {
            return;
        }

        if (e.target !== menu && !menu.contains(e.target as Node)) {
            this.setState({ visible: false });
        }
    };

    triggerMenu = (posX: number) =>
        this.setState((s) => ({
            posX: !s.visible ? posX : s.posX,
            visible: !s.visible,
        }));

    render() {
        return (
            <div ref={this.toggle}>
                {this.props.renderToggle(this.onClickHandler)}
                {createPortal(
                    <Fade timeout={150} in={this.state.visible} unmountOnExit>
                        <div
                            ref={this.menu}
                            onClick={(e) => {
                                e.stopPropagation();
                                this.setState({ visible: false });
                            }}
                            onContextMenu={(e) => e.stopPropagation()}
                            style={{ width: '12rem', zIndex: 70 }}
                            css={tw`fixed bg-white p-2 rounded border border-neutral-700 shadow-lg text-neutral-500`}
                        >
                            {this.props.children}
                        </div>
                    </Fade>,
                    document.body
                )}
            </div>
        );
    }
}

export default DropdownMenu;
