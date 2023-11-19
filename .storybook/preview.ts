import type { Preview } from '@storybook/svelte';
import '../src/app.css'
const preview: Preview = {
	parameters: {
    layout: 'centered',
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	}
};

export default preview;
