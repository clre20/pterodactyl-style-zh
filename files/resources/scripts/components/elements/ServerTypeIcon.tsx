import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { ServerIconStyle } from '@/lib/serverIcon';

/**
 * Draws a server's type icon: the bundled SVG icon picked automatically, or the
 * Font Awesome glyph the panel owner chose for the egg (drawn with the icon font,
 * so any free icon works without shipping every icon in the bundle).
 */
export default ({ look, size = 20, className }: { look: ServerIconStyle; size?: number; className?: string }) =>
    look.glyph ? (
        <span aria-hidden className={classNames('egg-glyph', look.glyph.style, className)} style={{ fontSize: size }}>
            {look.glyph.char}
        </span>
    ) : (
        <FontAwesomeIcon icon={look.icon} className={className} style={{ width: size, height: size }} />
    );
