import { Card } from 'antd';
import type { CardProps } from 'antd/es/card';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { history } from 'umi';


type totalType = () => React.ReactNode;

const renderTotal = (time?: number | totalType | React.ReactNode) => {
  if (!time && time !== 0) {
    return null;
  }
  let totalDom;
  switch (typeof time) {
    case 'undefined':
      totalDom = null;
      break;
    case 'function':
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

class ChartCard extends React.Component<ChartCardProps> {
  renderContent = () => {
    const { contentHeight, title, avatar, action, time, footer, children, loading } = this.props;
    if (loading) {
      return false;
    }
    return (
      <div className={styles.chartCard} onClick={() => {
        sessionStorage.setItem("nameSpace", title)
        history.push('/edgeResource/nodes')
      }}>
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
          <div className={styles.content} style={{ height: contentHeight || 'auto' }}>
            <div className={contentHeight && styles.contentFixed}>{children}</div>
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

  render() {
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
    } = this.props;
    return (
      <Card loading={loading} bodyStyle={{ padding: '20px 24px 8px 24px' }} {...rest}>
        {this.renderContent()}
      </Card>
    );
  }
}

export default ChartCard;
