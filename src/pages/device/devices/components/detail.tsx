import React, { useEffect, useRef, useState } from 'react';
import { Modal, Descriptions, Button, Tabs, message, FormInstance, Table } from 'antd';
import type { DeviceType } from '../data';
import { ProColumns, ActionType, ProTable } from '@ant-design/pro-table';
/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 * 
 * */

export type OperlogFormValueType = Record<string, unknown> & Partial<DeviceType>;

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
  console.log(values);
  
  const dataSource = values.status?.twins?.map(item => {
    return {
      key: item.propertyName,
      type: item.desired?.metadata?.type,
      value: item.desired?.value,
      valueup: item.reported?.value
    }
  })
  const columns = [
    {
      title: '属性名',
      dataIndex: 'key',
      width: '25%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '25%',
    },
    {
      title: '属性值',
      dataIndex: 'value',
      width: '25%',
    },
    {
      title: '上报值',
      dataIndex: 'valueup',
      width: '25%',
    },
  ]
  return (
    <div>
      <Modal
        width={1200}
        title='容器应用详情'
        visible={props.visible}
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
            {values?.spec?.protocol?.customizedProtocol?.protocolName}
          </Descriptions.Item>
          <Descriptions.Item span={8} label='节点'>
            {values?.spec?.nodeSelector?.nodeSelectorTerms[0]?.matchExpressions[0]?.values[0] || ''}
          </Descriptions.Item>
          <Descriptions.Item span={8} label='创建时间'>
            {values?.metadata?.creationTimestamp}
          </Descriptions.Item>
          <Descriptions.Item span={8} label='描述'>
            {values?.metadata?.labels?.description}
          </Descriptions.Item>
        </Descriptions>
        <Table dataSource={dataSource} columns={columns} pagination={false}/>
      </Modal>
    </div>
  );
};

export default detailForm;
