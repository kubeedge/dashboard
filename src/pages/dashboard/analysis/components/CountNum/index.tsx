import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

export type CountNumProps = {
  style?: React.CSSProperties;
  node?: Object
};
const CountNum: React.FC<CountNumProps> = ({
  node
}) => (
  <div className={styles.countNum}>
    {node && (
      <div>
        <div className={styles.title}>{node?.metadata?.name}</div>
        <div>{node?.status?.addresses[0].address}</div>
        <div>
          <span style={{'marginRight': '20px'}}>
            {node?.status?.conditions.filter((item: any) => item.type == 'Ready')[0].type}:
          </span>
          <span>{node?.status?.conditions.filter((item: any) => item.type == 'Ready')[0].status}</span>
        </div>
        <div>
          <span style={{'marginRight': '20px'}}>{node.metadata.creationTimestamp}</span>
          天
        </div>
      </div>
    )}
  </div>
);

export default CountNum;
