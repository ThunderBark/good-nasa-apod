import styles from "./Loader.module.css";

function Loader() {
  return (
    <div className={styles.container}>
      <div className={styles.ldsDualRing} />
    </div>
  );
}

export default Loader;
