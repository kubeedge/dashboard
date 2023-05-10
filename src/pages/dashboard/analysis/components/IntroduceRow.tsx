import { Col, Row } from "antd";
import moment from "moment";
import { ChartCard } from "./Charts";
import styles from "../style.less";
import { getNamespaces } from "@/services/kubeedge";

let namespacesList: any[] = [];
const namespacesList1 = await getNamespaces();

namespacesList = namespacesList1.items;

const IntroduceRow = ({ loading }: { loading: boolean }) => {
  const colItem = namespacesList?.map((item, index) => {
    return (
      <Col span={8} style={{ marginBottom: 24 }} key={index}>
        <ChartCard
          bordered={false}
          title={item.metadata.name}
          action={<img src="/namespace.png" alt="" style={{ width: "50px" }} />}
          time={moment(item.metadata.creationTimestamp).format(
            "YYYY-MM-DD HH:mm:ss"
          )}
          contentHeight={40}
        >
          <span className={styles.trendText}>{item.status.phase}</span>
          <span className={styles.trendText}>
            {moment().diff(moment(item.metadata.creationTimestamp), "day") + 1}
          </span>
          <span className={styles.trendText}>days</span>
        </ChartCard>
      </Col>
    );
  });
  return <Row gutter={24}>{colItem}</Row>;
};

export default IntroduceRow;
