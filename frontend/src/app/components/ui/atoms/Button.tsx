import React from "react";
import styles from "@/styles/button.module.css";

type Variant = "primary" | "secondary" | "outline" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    // Treat "secondary" as an alias of "outline" if you don't have a .secondary class
    const resolvedVariant: Variant = variant === "secondary" ? "outline" : variant;

    const variantClass =
      styles[resolvedVariant as keyof typeof styles] || styles.primary;
    const sizeClass = styles[size as keyof typeof styles] || styles.md;

    return (
      <button
        ref={ref}
        className={`${styles.button} ${variantClass} ${sizeClass} ${className}`}
        data-variant={variant}   // expose original requested variant for tests
        data-size={size}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
