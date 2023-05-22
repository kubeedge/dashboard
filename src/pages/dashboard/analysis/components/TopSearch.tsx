import { Card, Col, Row } from "antd";
import React, { useEffect } from "react";
import { history } from "umi";
import CountNum from "./CountNum";
import styles from "../style.less";
import {
  getNodes,
  getDevices,
  getDeployments,
  getRules,
} from "@/services/kubeedge";

const TopSearch = ({ loading }: { loading: boolean }) => {
  const [nodesList, setNodesList] = React.useState<any>({});
  const [devicesList, setDevicesList] = React.useState<any>({});
  const [deploymentsList, setDeploymentsList] = React.useState<any>({});
  const [rulesList, setRulesList] = React.useState<any>({});

  const resources = [
    {
      state: nodesList,
      setState: setNodesList,
      name: "Nodes",
      api: getNodes,
      path: "/edgeResource/nodes",
    },
    {
      state: devicesList,
      setState: setDevicesList,
      name: "Devices",
      api: getDevices,
      path: "/device/devices",
    },
    {
      state: deploymentsList,
      setState: setDeploymentsList,
      name: "Deployments",
      api: getDeployments,
      path: "/edgeResource/deployment",
    },
    {
      state: rulesList,
      setState: setRulesList,
      name: "Rules",
      api: getRules,
      path: "/edgeCloudMessage/rule",
    },
  ];

  useEffect(() => {
    resources.forEach(async (item) => {
      const data = await item.api();
      item.setState(data);
    });
  }, []);

  return (
    <Card
      bordered={false}
      title="Compute Resources"
      className={styles["card-style"]}
      style={{
        height: "100%",
      }}
    >
      <Row gutter={68}>
        {resources.map((item) => {
          return (
            <Col span={6} style={{ marginBottom: 24 }}>
              <CountNum
                name={item.name}
                value={item.state.items?.length}
                onClick={() => {
                  history.push(item.path);
                }}
              />
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default TopSearch;
