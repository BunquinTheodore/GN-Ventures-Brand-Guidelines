import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline";

interface CommonProps {
  readonly variant?: ButtonVariant;
  readonly className?: string;
  readonly children: ReactNode;
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { readonly href?: undefined };
type AnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & { readonly href: string };

const VARIANT_CLASS: Readonly<Record<ButtonVariant, string>> = {
  primary: "gn-btn-primary",
  secondary: "gn-btn-secondary",
  outline: "gn-btn-outline",
};

/**
 * House button. Bright, shiny, tinted by the nearest [data-brand] accent.
 * Renders an <a> when href is given (data-sfx="download" for download links).
 */
export default function Button(props: ButtonProps | AnchorProps) {
  const { variant = "primary", className, children, ...rest } = props;
  const classes = cn("gn-btn gn-shine overflow-hidden", VARIANT_CLASS[variant], className);

  if ("href" in rest && rest.href !== undefined) {
    const anchorRest = rest as Omit<AnchorProps, keyof CommonProps>;
    return (
      <a data-sfx={anchorRest.download !== undefined ? "download" : undefined} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }
  const { href: _unused, type = "button", ...buttonRest } = rest as Omit<ButtonProps, keyof CommonProps>;
  void _unused;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
