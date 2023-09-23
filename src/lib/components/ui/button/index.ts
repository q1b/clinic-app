import type { Button as ButtonPrimitive } from "bits-ui";
import { tv, type VariantProps } from "tailwind-variants";
import Root from "./button.svelte";

const buttonVariants = tv({
	base: `inline-flex items-center justify-center whitespace-nowrap
				ring-offset-slate-100
				focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2
				disabled:pointer-events-none disabled:opacity-50
				[-webkit-tap-highlight-color:transparent;] select-none
				border 
	`,
	variants: {
		variant: {
			default:
				"bg-white text-slate-900 border-slate-600",
		},
		size: {
			default: "h-9 px-3 py-1 gap-x-2",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
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
