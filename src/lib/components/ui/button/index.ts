import type { Button as ButtonPrimitive } from "bits-ui";
import { tv, type VariantProps } from "tailwind-variants";
import Root from "./button.svelte";

const buttonVariants = tv({
	base: `
		inline-flex items-center justify-center rounded-md 
		text-sm font-medium 
		whitespace-nowrap tab-highlight-none select-none
		focus-visible:outline-none
		focus-visible:ring-1 focus-visible:ring-layer-10
		disabled:pointer-events-none disabled:opacity-50
		transition-colors duration-300 ease-in
	`,
	variants: {
		variant: {
			default:
				"bg-layer-4 text-layer-12 shadow hover:bg-layer-7",
				'destructive':
				"bg-rose-500 text-rose-50 shadow-sm shadow-rose-300/20 hover:bg-rose-600",
			'destructive-subtle':
				"bg-rose-50 text-rose-500 shadow-sm shadow-rose-300/20 hover:bg-rose-100 hover:text-rose-600",
			outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			link: "text-layer-11 underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	},
});

type Variant = VariantProps<typeof buttonVariants>["variant"];
type Size = VariantProps<typeof buttonVariants>["size"];

type Props = ButtonPrimitive.Props & {
	variant?: Variant;
	size?: Size;
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