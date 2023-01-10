import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import React from 'react';
import type { DataItem } from '../data.d';
import CountNum from './CountNum';
import CountInfo from './CountInfo';
import styles from '../style.less';
import { getNodes } from '@/services/kubeedge'

const nodesList = await getNodes()
const TopSearch = ({
  visitData1,
  visitData2,
}: {
  visitData1: DataItem[];
  visitData2: DataItem[];
}) => {
  visitData1 = [
    {
      text: '请',
      url: '检查 metrics-server',
      text1: '状态是否正常'
    },
    {
      text: '请',
      url: '检查 ApiService',
      text1: '状态是否正常'
    },
    {
      text: '请参考',
      url: '问题解决办法',
    },
  ]
  visitData2 = nodesList.items
  const cardLeft = visitData1?.map(item => {
    return (
      <CountInfo node={item} />
    )
  })
  const cardRight = visitData2?.map(item => {
    return (
      <CountNum node={item} />
    )
  })
  return (
    <Card
      bordered={false}
      title="计算资源"
      className={styles['card-style']}
      style={{
        height: '100%',
      }}
    >
      <Row gutter={68}>
        <Col sm={10} xs={24} style={{ marginBottom: 24 }}>
          {cardLeft}
        </Col>
        <Col sm={14} xs={24} style={{ marginBottom: 24 }}>
          {cardRight}
        </Col>
      </Row>
    </Card>
  );
}

export default TopSearch;
