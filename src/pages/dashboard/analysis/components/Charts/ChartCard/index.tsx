import { Card } from "antd";
import type { CardProps } from "antd/es/card";
import React from "react";
import classNames from "classnames";
import styles from "./index.less";
import { history, useModel } from "umi";

type totalType = () => React.ReactNode;

const renderTotal = (time?: number | totalType | React.ReactNode) => {
  if (!time && time !== 0) {
    return null;
  }
  let totalDom;
  switch (typeof time) {
    case "undefined":
      totalDom = null;
      break;
    case "function":
      totalDom = <div className={styles.time}>{time()}</div>;
      break;
    default:
      totalDom = <div className={styles.time}>{time}</div>;
  }
  return totalDom;
};

export type ChartCardProps = {
  title: string;
  action?: React.ReactNode;
  time?: React.ReactNode;
  footer?: React.ReactNode;
  contentHeight?: number;
  avatar?: React.ReactNode;
  style?: React.CSSProperties;
} & CardProps;

const ChartCard: React.FC<ChartCardProps> = (props) => {
  const {
    loading = false,
    contentHeight,
    title,
    avatar,
    action,
    time,
    footer,
    children,
    ...rest
  } = props;

  const { setInitialState } = useModel("@@initialState");

  const Content = () => {
    if (loading) {
      return false;
    }
    return (
      <div
        className={styles.chartCard}
        onClick={() => {
          setInitialState((prevState) => ({
            ...prevState,
            namespace: title,
          }));
          history.push("/edgeResource/nodes");
        }}
      >
        <div
          className={classNames(styles.chartTop, {
            [styles.chartTopMargin]: !children && !footer,
          })}
        >
          <div className={styles.avatar}>{avatar}</div>
          <div className={styles.metaWrap}>
            <div className={styles.meta}>
              <span className={styles.title}>{title}</span>
              <span className={styles.action}>{action}</span>
            </div>
            {renderTotal(time)}
          </div>
        </div>
        {children && (
          <div
            className={styles.content}
            style={{ height: contentHeight || "auto" }}
          >
            <div className={contentHeight && styles.contentFixed}>
              {children}
            </div>
          </div>
        )}
        {footer && (
          <div
            className={classNames(styles.footer, {
              [styles.footerMargin]: !children,
            })}
          >
            {footer}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card
      loading={loading}
      bodyStyle={{ padding: "20px 24px 8px 24px" }}
      {...rest}
    >
      {Content()}
    </Card>
  );
};

export default ChartCard;
