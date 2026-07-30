import { memo } from "react";
import styles from "./Badge.module.css";

const variantMap = {
  primary: styles.primary,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  info: styles.info,
  neutral: styles.neutral,
};

function Badge({
  children,
  variant = "primary",
  className = "",
}) {
  const classes = [
    styles.badge,
    variantMap[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {children}
    </span>
  );
}

export default memo(Badge);