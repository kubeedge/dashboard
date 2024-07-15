import React from 'react';
import { Modal, Descriptions, Button, Table } from 'antd';
import type { Device, Twin } from '@/models/device';
/**
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 **/

export type OperlogFormValueType = Record<string, unknown> & Partial<Device>;

export type OperlogFormProps = {
  onCancel: (flag?: boolean, formVals?: OperlogFormValueType) => void;
  visible: boolean;
  values: Partial<Device>;
};

const detailForm: React.FC<OperlogFormProps> = (props) => {
  const { values } = props;
  const handleCancel = () => {
    props.onCancel();
  };
  console.log(values);

  const columns = [
    {
      title: '属性名',
      dataIndex: ["propertyName"],
      width: '25%',
    },
    {
      title: '类型',
      dataIndex: ["observedDesired", "metadata", "type"],
      width: '25%',
    },
    {
      title: '属性值',
      dataIndex: ["observedDesired", "metadata", "value"],
      width: '25%',
    },
    {
      title: '上报值',
      dataIndex: ["reported", "value"],
      width: '25%',
    },
  ];

  return (
    <div>
      <Modal
        width={1200}
        title='容器应用详情'
        open={props.visible}
        destroyOnClose
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>关闭</Button>,
        ]}
      >
        <Descriptions column={24}>
          <Descriptions.Item span={8} label='名称'>
            {values?.metadata?.name}
          </Descriptions.Item>
          <Descriptions.Item span={8} label='协议'>
            {values?.spec?.protocol?.protocolName}
          </Descriptions.Item>
          <Descriptions.Item span={8} label='节点'>
            {values?.spec?.nodeName || ''}
          </Descriptions.Item>
          <Descriptions.Item span={8} label='创建时间'>
            {values?.metadata?.creationTimestamp}
          </Descriptions.Item>
          <Descriptions.Item span={8} label='描述'>
            {values?.metadata?.labels?.description}
          </Descriptions.Item>
        </Descriptions>
        <Table
          dataSource={values?.status?.twins}
          columns={columns}
          rowKey={(twin: Twin) => twin.propertyName}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default detailForm;
