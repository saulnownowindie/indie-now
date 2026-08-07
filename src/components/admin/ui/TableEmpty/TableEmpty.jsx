import styles from "./TableEmpty.module.css";

export default function TableEmpty({
  title,
  description,
}) {
  return (
    <div className={styles.empty}>
      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
}