import React from "react";
import { Modal, Descriptions, Button, Table } from "antd";

export type OperlogFormValueType = Record<string, unknown>;

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

  const data = (values.data ? Object.keys(values.data) : values.data)?.map(
    (item, index) => {
      return {
        key: item,
        value: Object.values(values.data)[index],
      };
    }
  );

  const labels = (
    values.metadata?.labels
      ? Object.keys(values.metadata?.labels)
      : values.metadata?.labels
  )?.map((item, index) => {
    return {
      key: item,
      value: Object.values(values.data)[index],
    };
  });

  const dataColumns = [
    {
      title: "data key",
      dataIndex: "key",
      width: "30%",
    },
    {
      title: "data value",
      dataIndex: "value",
    },
  ];
  const labelColumns = [
    {
      title: "label key",
      dataIndex: "key",
      width: "30%",
    },
    {
      title: "label value",
      dataIndex: "value",
    },
  ];

  return (
    <Modal
      width={640}
      title="Configmap Detail"
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
      </Descriptions>
      <Table dataSource={data} columns={dataColumns} pagination={false} />
      <Table dataSource={labels} columns={labelColumns} pagination={false} />
    </Modal>
  );
};

export default detailForm;
