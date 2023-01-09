import React, { useEffect, useRef, useState } from 'react';
import { Modal, Descriptions, Button, Tabs, message, FormInstance, Table, Card } from 'antd';
import type { SecretType } from '../data';
/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 * 
 * */

export type OperlogFormValueType = Record<string, unknown> & Partial<SecretType>;

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
  
  let dataSource = []
  let info = {
    server: '',
    username: '',
    password: ''
  }
  if (values.type == 'kubernetes.io/dockerconfigjson') {
    const data = JSON.parse(window.atob(values.data['.dockerconfigjson']))
    console.log(data);
    info.server = Object.keys(data)[0]
    info.username = data[info.server].username
    info.password = data[info.server].password
  }
  if (values.type == 'Opaque') {
    dataSource = Object.keys(values.data)?.map((item, index) => {
      return {
        key: item,
        value: Object.values(values.data)[index]
      }
    })
  } 
  
  const columns = [
    {
      title: '属性名',
      dataIndex: 'key',
      width: '30%',
    },
    {
      title: '属性值',
      dataIndex: 'value',
    },
  ]
  return (
    <div>
      <Modal
        width={640}
        title='秘钥详情'
        visible={props.visible}
        destroyOnClose
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>关闭</Button>,
        ]}
      >
        <Descriptions column={24}>
          <Descriptions.Item span={12} label='名称空间'>
            {values?.metadata?.namespace}
          </Descriptions.Item>
          <Descriptions.Item span={12} label='名称'>
            {values?.metadata?.name}
          </Descriptions.Item>
          <Descriptions.Item span={12} label='创建时间'>
            {values?.metadata?.creationTimestamp}
          </Descriptions.Item>
          <Descriptions.Item span={12} label='类型'>
            {values?.type}
          </Descriptions.Item>
        </Descriptions>
        {values.type == 'kubernetes.io/dockerconfigjson' && <Card bodyStyle={{padding: 15}}>
          <Descriptions column={24}>
            <Descriptions.Item span={24} label='docker server'>
              {info?.server}
            </Descriptions.Item>
            <Descriptions.Item span={24} label='docker username'>
            {info?.username}
            </Descriptions.Item>
            <Descriptions.Item span={24} label='docker password'>
            {info?.password}
            </Descriptions.Item>
          </Descriptions>
        </Card>}
        {values.type == 'Opaque' && <Table dataSource={dataSource} columns={columns} pagination={false}/>}
      </Modal>
    </div>
  );
};

export default detailForm;
