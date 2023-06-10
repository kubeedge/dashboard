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
        <div>{node.text}{node.url}{node.text1? node.text1 : ''}</div>
      </div>
    )}
  </div>
);

export default CountNum;
