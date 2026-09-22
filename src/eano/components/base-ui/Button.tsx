import * as React from "react";

import { Button as ShadcnButton } from "@/eano/design-system/shadcn/button";

export type ButtonProps = React.ComponentProps<typeof ShadcnButton>;

/**
 * Base Button wrapper.
 *
 * Prefer this wrapper in pages/features instead of importing directly from
 * `@/eano/design-system/shadcn/button`.
 */
export function Button(props: ButtonProps) {
	return <ShadcnButton {...props} />;
}