import { forwardRef, memo } from "react";
import styles from "./Input.module.css";

const Input = forwardRef(
  (
    {
      label,
      icon = null,
      rightElement = null,
      error = "",
      helperText = "",
      fullWidth = false,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const wrapperClasses = [
      styles.wrapper,
      fullWidth && styles.fullWidth,
      error && styles.error,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        {label && <label className={styles.label}>{label}</label>}

        <div className={styles.inputContainer}>
          {icon && <span className={styles.icon}>{icon}</span>}

          <input ref={ref} className={styles.input} {...rest} />

          {rightElement && (
            <div className={styles.rightElement}>{rightElement}</div>
          )}
        </div>

        {error ? (
          <p className={styles.errorText}>{error}</p>
        ) : (
          helperText && <p className={styles.helperText}>{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default memo(Input);
