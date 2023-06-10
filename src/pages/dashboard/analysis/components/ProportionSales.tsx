import { Card, Radio, Typography } from 'antd';
import styles from '../style.less';

const { Text } = Typography;

const ProportionSales = ({
  loading,
}: {
  loading: boolean;
}) => (
  <Card
    loading={loading}
    className={`${styles.salesCard}, ${styles['card-style']}`}
    bordered={false}
    title="存储资源"
    style={{
      height: '100%',
    }}
    extra={
      <div className={styles.salesCardExtra}>
      </div>
    }
  >
    <div>
      <Text>您尚未创建存储类</Text>
    </div>
  </Card>
);

export default ProportionSales;
