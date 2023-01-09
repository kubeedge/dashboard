import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Button } from 'antd';
import type { JobType } from '../data';
import YamlModal from './yaml'

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 * 
 * */

export type OperlogFormValueType = Record<string, unknown> & Partial<JobType>;

export type OperlogFormProps = {
  onCancel: (flag?: boolean, formVals?: OperlogFormValueType) => void;
  visible: boolean;
  values: Partial<any>;
};

const detailForm: React.FC<OperlogFormProps> = (props) => {
  const { values } = props;

  useEffect(() => {}, [props]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();


  const handleCancel = () => {
    props.onCancel();
  };
  const handleYaml = () => {
    setModalVisible(true)
  }

  return (
    <div>
      <Modal
        width={800}
        title='节点详情'
        visible={props.visible}
        destroyOnClose
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>关闭</Button>,
          <Button key="viewYaml" onClick={handleYaml}>YAML</Button>,
        ]}
      >
        <Descriptions column={24}>
          <Descriptions.Item span={12} label='名称'>
            {values?.metadata?.name}
          </Descriptions.Item>
          <Descriptions.Item span={12} label='状态'>
            {values?.status?.phase}
          </Descriptions.Item>
          <Descriptions.Item span={12} label='ID'>
            {values?.metadata?.uid}
          </Descriptions.Item>
          <Descriptions.Item span={12} label='节点描述'>
            {values?.metadata?.annotations?.['node.alpha.kubernetes.io/ttl']}
          </Descriptions.Item>
          <Descriptions.Item span={12} label='创建时间'>
            {values?.metadata?.creationTimestamp}
          </Descriptions.Item>
          <Descriptions.Item span={12} label='主机名'>
            {values?.status?.addresses?.[1]?.address}
          </Descriptions.Item>
          <Descriptions.Item span={12} label='操作系统'>
            {values?.status?.nodeInfo?.osImage} | {values?.status?.nodeInfo?.operatingSystem} | {values?.status?.nodeInfo?.architecture} | {values?.status?.nodeInfo?.kernelVersion}
          </Descriptions.Item>
          <Descriptions.Item span={24} label='网络(网卡:IP)'>
            {values?.status?.addresses?.[0]?.address}
          </Descriptions.Item>
          <Descriptions.Item span={24} label='规格'>
            {values?.status?.capacity?.cpu} | {values?.status?.capacity?.memory}
          </Descriptions.Item>
          <Descriptions.Item span={24} label='容器运行时版本'>
            {values?.status?.nodeInfo?.containerRuntimeVersion}
          </Descriptions.Item>
          <Descriptions.Item span={24} label='边缘侧软件版本'>
            {values?.status?.nodeInfo?.kubeletVersion}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <YamlModal
        onSubmit={async (values) => {
          setModalVisible(false);
          setCurrentRow(undefined)
        }}
        onCancel={(res, isUpdate) => {
          setModalVisible(false);
          setCurrentRow(undefined);
          props.onCancel(res || undefined, isUpdate);
        }}
        visible={modalVisible}
        values={values || {}}
      ></YamlModal>
    </div>
  );
};

export default detailForm;
