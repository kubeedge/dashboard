import type { FC } from "react";
import { Suspense } from "react";
import { Col, Row } from "antd";
import { GridContent } from "@ant-design/pro-layout";
import IntroduceRow from "./components/IntroduceRow";
import TopSearch from "./components/TopSearch";
import PageLoading from "./components/PageLoading";
import type { AnalysisData } from "./data.d";
import styles from "./style.less";
import WrapContent from "@/components/WrapContent";

type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};

const Analysis: FC<AnalysisProps> = () => {
  return (
    <WrapContent>
      <GridContent className={styles["grid-content-style"]}>
        <div className={styles["grid-content-child"]}>
          <Row gutter={24}>
            <Col span={3}>
              <div className={styles["name"]}>NAMESPACE</div>
            </Col>
            <Col span={21}>
              <Suspense fallback={<PageLoading />}>
                <IntroduceRow loading={false} />
              </Suspense>
            </Col>
          </Row>
          <Row
            gutter={24}
            style={{
              marginTop: 30,
            }}
          >
            <Col span={24}>
              <Suspense fallback={null}>
                <TopSearch loading={false} />
              </Suspense>
            </Col>
          </Row>
        </div>
      </GridContent>
    </WrapContent>
  );
};

export default Analysis;
