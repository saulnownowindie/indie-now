import { forwardRef, memo } from "react";
import styles from "./Button.module.css";

const Button = forwardRef(
  (
    {
      children,

      variant = "primary",
      size = "md",

      type = "button",

      loading = false,
      disabled = false,

      fullWidth = false,

      icon = null,
      iconRight = null,

      className = "",

      ...rest
    },
    ref
  ) => {
    const classes = [
      styles.button,
      styles[variant],
      styles[size],

      fullWidth && styles.fullWidth,

      loading && styles.loading,

      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        {...rest}
      >
        {loading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          <>
            {icon && (
              <span className={styles.icon}>
                {icon}
              </span>
            )}
          </>
        )}

        <span className={styles.label}>
          {children}
        </span>

        {!loading && iconRight && (
          <span className={styles.icon}>
            {iconRight}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default memo(Button);