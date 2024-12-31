import styles from "./loading.module.css";

function Loading() {
  return (
    <div className={styles.screen}>
      <div className={styles.circle}></div>
    </div>
  );
}

export default Loading;
