import { forwardRef, memo } from "react";
import styles from "./Card.module.css";

const paddingMap = {
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

const shadowMap = {
  none: styles.shadowNone,
  sm: styles.shadowSm,
  md: styles.shadowMd,
  lg: styles.shadowLg,
};

const Card = forwardRef(
  (
    {
      children,

      padding = "md",
      shadow = "md",

      bordered = true,

      className = "",

      ...rest
    },
    ref
  ) => {
    const classes = [
      styles.card,

      paddingMap[padding],

      shadowMap[shadow],

      bordered && styles.bordered,

      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <section
        ref={ref}
        className={classes}
        {...rest}
      >
        {children}
      </section>
    );
  }
);

Card.displayName = "Card";

export default memo(Card);