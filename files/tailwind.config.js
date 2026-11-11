const colors = require('tailwindcss/colors');

const gray = {
    50: 'hsl(225, 40%, 97%)',
    100: 'hsl(225, 26%, 91%)',
    200: 'hsl(224, 22%, 83%)',
    300: 'hsl(224, 17%, 70%)',
    400: 'hsl(224, 13%, 57%)',
    500: 'hsl(224, 14%, 44%)',
    600: 'hsl(226, 20%, 24%)',
    700: 'hsl(227, 26%, 16%)',
    800: 'hsl(229, 34%, 10%)',
    900: 'hsl(230, 42%, 6%)',
};

// The accent ("primary") palette comes from CSS variables so it can be changed from
// Admin → Settings → Appearance without rebuilding the frontend.
const themed = (name) => ({ opacityValue }) =>
    opacityValue === undefined ? `rgb(var(${name}))` : `rgb(var(${name}) / ${opacityValue})`;
const primary = Object.fromEntries(
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((step) => [step, themed(`--primary-${step}`)])
);

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', '"Noto Sans TC"', '"PingFang TC"', '"Microsoft JhengHei"', 'system-ui', 'sans-serif'],
                header: ['"Inter"', '"Noto Sans TC"', '"PingFang TC"', '"Microsoft JhengHei"', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
            },
            colors: {
                black: '#05080f',
                // "primary" and "neutral" are deprecated, prefer the use of "blue" and "gray"
                // in new code.
                primary: primary,
                gray: gray,
                neutral: gray,
                cyan: colors.cyan,
            },
            fontSize: {
                '2xs': '0.625rem',
            },
            transitionDuration: {
                250: '250ms',
            },
            borderColor: theme => ({
                default: theme('colors.neutral.400', 'currentColor'),
            }),
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ]
};
