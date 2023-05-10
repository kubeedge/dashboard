import React, { useEffect, useRef, useState } from "react";
import { Modal, Descriptions, Button, Tabs, message, FormInstance } from "antd";
import type { DeptType, depType } from "../data";
import YamlModal from "./yaml";
import { getDeploymentPodsList } from "../service";
import { ProColumns, ActionType, ProTable } from "@ant-design/pro-table";
import moment from "moment";
import { podListType } from "../data";
import { objectToArray } from "@/utils/utils";

export type OperlogFormValueType = Record<string, unknown> & Partial<depType>;

export type OperlogFormProps = {
  onCancel: (flag?: boolean, formVals?: OperlogFormValueType) => void;
  visible: boolean;
  values: Partial<any>;
};

const detailForm: React.FC<OperlogFormProps> = (props) => {
  const { values } = props;
  const formTableRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const formTableRefLabel = useRef<FormInstance>();
  const actionRefLabel = useRef<ActionType>();
  const [type, setType] = useState<string>("pod"); // 当前tab页
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [labelData, setLabelData] = useState<any>([]);

  const handleCancel = () => {
    props.onCancel();
  };
  const handleYaml = () => {
    setModalVisible(true);
  };
  const handleDetailList = async () => {
    try {
      const res = await getDeploymentPodsList(values.metadata.namespace);
      return res.items.filter((item: any) =>
        item.metadata.name.includes(values.metadata.name)
      );
    } catch (error) {
      message.error("Failed to obtain, please try again!");
      return false;
    }
  };
  const podColumns: ProColumns<podListType>[] = [
    {
      title: "Name/ID",
      dataIndex: "name",
      valueType: "text",
      align: "center",
      render: (_, record) => (
        <div>
          <div style={{ color: "#2f54eb" }}>{record.name}</div>
          <div style={{ fontSize: "12px" }}>{record.uid}</div>
        </div>
      ),
    },
    {
      title: "Node",
      dataIndex: "nodeName",
      valueType: "text",
      width: "180px",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      valueType: "text",
      align: "center",
    },
    {
      title: "Resources",
      dataIndex: "resources",
      valueType: "text",
      width: "150px",
      align: "center",
      render: (a, record) => {
        return (
          <div>
            <div style={{ fontSize: "12px" }}>CPU: {record.resources?.cpu}</div>
            <div style={{ fontSize: "12px" }}>
              Memory: {record.resources?.memory}
            </div>
          </div>
        );
      },
    },
    {
      title: "Loading time",
      dataIndex: "loadingTime",
      valueType: "dateTime",
      align: "center",
    },
    {
      title: "Creation time",
      dataIndex: "creationTimestamp",
      valueType: "dateTime",
      align: "center",
    },
  ];

  const labelColumns: ProColumns<any>[] = [
    {
      title: "Label key",
      dataIndex: "key",
      valueType: "text",
      align: "center",
      width: "50%",
    },
    {
      title: "Label value",
      dataIndex: "value",
      valueType: "text",
      align: "center",
      width: "50%",
    },
  ];

  useEffect(() => {
    if (values?.metadata?.labels) {
      setLabelData(objectToArray(values?.metadata?.labels));
    }
  }, [values]);

  return (
    <div>
      <Modal
        width={1200}
        title={
          <span
            style={{
              color: "rgba(0, 0, 0, 0.88)",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: 1.5,
            }}
          >
            {"Deployment Detail"}
          </span>
        }
        open={props.visible}
        destroyOnClose
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="viewYaml" onClick={handleYaml}>
            YAML
          </Button>,
        ]}
      >
        <Descriptions
          column={24}
          layout="vertical"
          labelStyle={{ color: "rgba(0, 0, 0, 0.45)" }}
        >
          <Descriptions.Item span={8} label="Namespace">
            {values?.metadata?.namespace}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Name">
            {values?.metadata?.name}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="ID">
            {values?.metadata?.uid}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Replicas(available/unavailable)">
            {(values?.status?.availableReplicas ||
              values?.status?.replicas - values?.status?.unavailableReplicas) +
              "/" +
              values?.status?.replicas}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Creation time">
            {values?.metadata?.creationTimestamp &&
              moment(values?.metadata?.creationTimestamp).format(
                "YYYY-MM-DD HH:mm:ss"
              )}
          </Descriptions.Item>
          <Descriptions.Item span={8} label="Description">
            {
              values?.metadata?.annotations?.[
                "kubeedge.dashboard.cn/displayName"
              ]
            }
          </Descriptions.Item>
        </Descriptions>
        <Tabs activeKey={type} onChange={setType}>
          <Tabs.TabPane key="pod" tab="Pod list">
            <ProTable<podListType>
              actionRef={actionRef}
              formRef={formTableRef}
              rowKey="podId"
              key="podList"
              search={false}
              options={false}
              request={async (params) => {
                const res = await handleDetailList();
                if (res) {
                  let podList: any[] = [];
                  res.forEach(
                    (item: { metadata: any; spec: any; status: any }) => {
                      podList.push({
                        name: item.metadata.name,
                        uid: item.metadata.uid,
                        nodeName: item.spec.nodeName,
                        status: item.status.phase,
                        resources:
                          item.spec.containers[0]?.resources?.requests || {},
                        creationTimestamp: item.metadata.creationTimestamp,
                        loadingTime: item.metadata.creationTimestamp,
                      });
                    }
                  );
                  return {
                    data: podList,
                    total: res.length,
                    success: true,
                  };
                } else {
                  return {
                    data: [],
                    total: 0,
                    success: false,
                  };
                }
              }}
              columns={podColumns}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="label" tab="Label">
            <ProTable<any>
              actionRef={actionRefLabel}
              formRef={formTableRefLabel}
              rowKey="labelId"
              key="labelList"
              search={false}
              options={false}
              dataSource={labelData}
              columns={labelColumns}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      <YamlModal
        onSubmit={async (values) => {
          setModalVisible(false);
        }}
        onCancel={(res, isUpdate) => {
          setModalVisible(false);
          props.onCancel(isUpdate, res || undefined);
        }}
        visible={modalVisible}
        values={values || {}}
      ></YamlModal>
    </div>
  );
};

export default detailForm;
