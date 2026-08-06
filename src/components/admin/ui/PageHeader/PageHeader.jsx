import { memo } from "react";
import styles from "./PageHeader.module.css";

function PageHeader({
  title,
  description,
  action = null,
  className = "",
}) {
  return (
    <header className={`${styles.pageHeader} ${className}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          {title}
        </h1>

        {description && (
          <p className={styles.description}>
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className={styles.actions}>
          {action}
        </div>
      )}
    </header>
  );
}

export default memo(PageHeader);