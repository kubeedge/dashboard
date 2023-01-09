import { Col, Row } from 'antd';

import { ChartCard } from './Charts';
import type { DataItem } from '../data.d';
import styles from '../style.less';
import { getNamespaces } from '@/services/kubeedge'

let namespacesList: any[] = []
const namespacesList1 = await getNamespaces()

namespacesList = namespacesList1.items

const IntroduceRow = ({ loading, visitData }: { loading: boolean; visitData: DataItem[] }) => {
  const colItem = namespacesList?.map((item, index) => {
    return (
      <Col span={8} style={{marginBottom: 24}} key={index}>
        <ChartCard
          bordered={false}
          title={item.metadata.name}
          action={
            <img src="/namespace.png" alt="" style={{width: '50px'}}/>
          }
          time={item.metadata.creationTimestamp}
          contentHeight={40}
        >
          <span className={styles.trendText}>{item.status.phase}</span>
          <span className={styles.trendText}>10 天</span>
        </ChartCard>
      </Col>
    )
  })
  return (
    <Row gutter={24}>
      {/* <Col {...topColResponsiveProps}> */}
      {colItem}
    </Row>
  )
}

export default IntroduceRow;
