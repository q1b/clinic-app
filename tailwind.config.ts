import plugin from 'tailwindcss/plugin';
import { fontFamily, screens } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: { sans: ['Mona Sans', ...fontFamily.sans] },
			screens: {
				xs: '384px', // => @media (min-width: 384px) { ... }
				...screens
			},
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
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
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
		typographyPlugin()
	]
} satisfies Config;
