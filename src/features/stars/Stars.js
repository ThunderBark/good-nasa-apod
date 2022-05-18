import React from "react";
import styles from "./Stars.module.css";

function Stars() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.stars}></div>
      <div className={styles.stars2}></div>
      <div className={styles.stars3}></div>
    </div>
  );
}

export default Stars;
