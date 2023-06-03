import React from "react";
import { Modal, Descriptions, Button, Table, Card } from "antd";
import type { SecretType } from "../data";

export type OperlogFormValueType = Record<string, unknown> &
  Partial<SecretType>;

export type OperlogFormProps = {
  onCancel: (flag?: boolean, formVals?: OperlogFormValueType) => void;
  visible: boolean;
  values: Partial<any>;
};

const detailForm: React.FC<OperlogFormProps> = (props) => {
  const { values } = props;
  const handleCancel = () => {
    props.onCancel();
  };

  let dataSource = [];
  const info = {
    server: "",
    username: "",
    password: "",
  };
  if (values.type == "kubernetes.io/dockerconfigjson") {
    const data = JSON.parse(window.atob(values.data[".dockerconfigjson"]));
    info.server = Object.keys(data)[0];
    info.username = data[info.server].username;
    info.password = data[info.server].password;
  }
  if (values.type == "Opaque") {
    dataSource = (values.data ? Object.keys(values.data) : values.data)?.map(
      (item, index) => {
        return {
          key: item,
          value: Object.values(values.data)[index],
        };
      }
    );
  }

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      width: "30%",
    },
    {
      title: "Value",
      dataIndex: "value",
    },
  ];
  return (
    <Modal
      width={640}
      title="Secret Detail"
      open={props.visible}
      destroyOnClose
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Descriptions column={24}>
        <Descriptions.Item span={12} label="Namespace">
          {values?.metadata?.namespace}
        </Descriptions.Item>
        <Descriptions.Item span={12} label="Name">
          {values?.metadata?.name}
        </Descriptions.Item>
        <Descriptions.Item span={12} label="CreationTime">
          {values?.metadata?.creationTimestamp}
        </Descriptions.Item>
        <Descriptions.Item span={12} label="Type">
          {values?.type}
        </Descriptions.Item>
      </Descriptions>
      {values.type == "kubernetes.io/dockerconfigjson" && (
        <Card bodyStyle={{ padding: 15 }}>
          <Descriptions column={24}>
            <Descriptions.Item span={24} label="docker server">
              {info?.server}
            </Descriptions.Item>
            <Descriptions.Item span={24} label="docker username">
              {info?.username}
            </Descriptions.Item>
            <Descriptions.Item span={24} label="docker password">
              {info?.password}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
      {values.type == "Opaque" && (
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      )}
    </Modal>
  );
};

export default detailForm;
