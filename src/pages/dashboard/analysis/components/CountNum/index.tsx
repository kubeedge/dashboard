import React from "react";
import styles from "./index.less";

export type CountNumProps = {
  style?: React.CSSProperties;
  name?: string;
  value?: number;
  onClick?: () => void;
};

const CountNum: React.FC<CountNumProps> = ({ name, value, onClick }) => (
  <div className={styles.countNum} onClick={onClick}>
    {name && (
      <div>
        <div className={styles.title}>{value}</div>
        <div>{name}</div>
      </div>
    )}
  </div>
);

export default CountNum;
