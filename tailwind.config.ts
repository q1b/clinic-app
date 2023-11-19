import plugin from 'tailwindcss/plugin';
import { fontFamily, screens } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';
import formsPlugin from "@tailwindcss/forms"

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: { sans: ['Mona Sans', ...fontFamily.sans] },
			screens: {
				xs: '384px', // => @media (min-width: 384px) { ... }
				...screens
			},
			colors: {
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				layer: {
					0: 'hsl(var(--layer-0) / <alpha-value>)',
					1: 'hsl(var(--layer-1) / <alpha-value>)',
					2: 'hsl(var(--layer-2) / <alpha-value>)',
					3: 'hsl(var(--layer-3) / <alpha-value>)',
					4: 'hsl(var(--layer-4) / <alpha-value>)',
					5: 'hsl(var(--layer-5) / <alpha-value>)',
					6: 'hsl(var(--layer-6) / <alpha-value>)',
					7: 'hsl(var(--layer-7) / <alpha-value>)',
					8: 'hsl(var(--layer-8) / <alpha-value>)',
					9: 'hsl(var(--layer-9) / <alpha-value>)',
					10: 'hsl(var(--layer-10) / <alpha-value>)',
					11: 'hsl(var(--layer-11) / <alpha-value>)',
					12: 'hsl(var(--layer-12) / <alpha-value>)',
					13: 'hsl(var(--layer-13) / <alpha-value>)'
				}
			}
		}
	},
	plugins: [
		plugin(function ({ addVariant, addUtilities, addBase }) {
			addUtilities({
				'.tab-highlight-none': {
					'-webkit-tap-highlight-color': 'transparent'
				}
			});
			addVariant(
				'supports-backdrop-blur',
				'@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))'
			);
			addVariant('supports-scrollbars', '@supports selector(::-webkit-scrollbar)');
			addVariant('hover-none', '@media (hover: none)');
			addVariant('children', '& > *');
			addVariant('scrollbar', '&::-webkit-scrollbar');
			addVariant('scrollbar-track', '&::-webkit-scrollbar-track');
			addVariant('scrollbar-thumb', '&::-webkit-scrollbar-thumb');
		}),
		formsPlugin(),
	]
} satisfies Config;
