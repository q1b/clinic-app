import type { Button as ButtonPrimitive } from 'bits-ui';
import { tv, type VariantProps } from 'tailwind-variants';
import Root from './button.svelte';

export const sizes = {
	sm: 'h-8 rounded-md px-3 text-xs',
	default: 'h-9 px-4 py-2',
	lg: 'h-10 rounded-md px-8',
	icon: 'h-9 w-9'
};

export const variants = {
	default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
	destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
	'destructive-subtle':
				"bg-rose-500/10 text-rose-500 bg-rose-700/20 hover:text-rose-600",
	outline:
		'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
	secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
	ghost: 'hover:bg-accent hover:text-accent-foreground',
	link: 'text-primary underline-offset-4 hover:underline'
};
const buttonVariants = tv({
	base: 'inline-flex items-center justify-center gap-x-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap tab-highlight-none select-none',
	variants: {
		variant: variants,
		size: sizes
	},
	defaultVariants: {
		variant: 'default',
		size: 'default'
	}
});

type Variant = VariantProps<typeof buttonVariants>['variant'];
type Size = VariantProps<typeof buttonVariants>['size'];

type Props = ButtonPrimitive.Props & {
	variant?: Variant;
	size?: Size;
	icon?:any;
};

type Events = ButtonPrimitive.Events;

export {
	Root,
	type Props,
	type Events,
	//
	Root as Button,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants
};
