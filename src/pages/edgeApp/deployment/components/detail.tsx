import React, { useEffect, useRef, useState } from 'react';
import { Modal, Descriptions, Button, Tabs, message, FormInstance } from 'antd';
import type { DeptType, depType } from '../data';
import YamlModal from './yaml'
import { getDeploymentPodsList } from '../service'
import { ProColumns, ActionType, ProTable } from '@ant-design/pro-table';
import { podListType } from '../data'
/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 * 
 * */

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
  const [type, setType] = useState<string>('pod'); // 当前tab页
  useEffect(() => { }, [props]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<any>();
  const handleCancel = () => {
    props.onCancel();
  };
  const handleYaml = () => {
    setModalVisible(true)
  }
  const handleDetailList = async () => {
    try {
      const res = await getDeploymentPodsList(sessionStorage.getItem("nameSpace"));
      return res.items
    } catch (error) {
      message.error('获取失败请重试！');
      return false;
    }
  };
  const podColumns: ProColumns<podListType>[] = [
    {
      title: '实例名称/ID',
      dataIndex: 'name',
      valueType: 'text',
      render: (_, record) => {
        return record.name  + '/' + record.uid
      }
    },
    {
      title: '节点',
      dataIndex: 'nodeName',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
    },
    {
      title: '资源用量',
      dataIndex: 'resources',
      valueType: 'text',
    },
    {
      title: '运行时间',
      dataIndex: 'loadingTime',
      valueType: 'dateTime',
    },
    {
      title: '创建时间',
      dataIndex: 'creationTimestamp',
      valueType: 'dateTime',
    },
    {
      title: "操作",
      dataIndex: 'option',
      width: '220px',
      valueType: 'option',
      render: (_, record) => [
        // <Button
        //   type="link"
        //   size="small"
        //   danger
        //   key="batchRemove"
        //   onClick={async () => {
        //     Modal.confirm({
        //       title: '删除',
        //       content: '确定删除该项吗？',
        //       okText: '确认',
        //       cancelText: '取消',
        //       onOk: async () => {
        //         const success = await handleRemoveOne(record);
        //         if (success) {
        //           if (actionRef.current) {
        //             actionRef.current.reload();
        //           }
        //         }
        //       },
        //     });
        //   }}
        // >删除</Button>,
      ],
    },
  ];


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
          <Button key="viewYaml" onClick={handleYaml}>YAML</Button>,
        ]}
      >
        <Descriptions column={24}>
          <Descriptions.Item span={8} label='名称'>
            {values?.metadata?.name}
          </Descriptions.Item>
          <Descriptions.Item span={8} label='ID'>
            {values?.metadata?.uid}
          </Descriptions.Item>
          <Descriptions.Item span={8} label='实例数(正常/全部)'>
            {values?.status?.replicas - values?.status?.unavailableReplicas + '/' + values?.status?.replicas}
          </Descriptions.Item>
          <Descriptions.Item span={8} label='创建时间'>
            {values?.metadata?.creationTimestamp}
          </Descriptions.Item>
          <Descriptions.Item span={8} label='节点描述'>
            {values?.metadata?.annotations?.['k8s.kuboard.cn/displayName']}
          </Descriptions.Item>
        </Descriptions>
        <Tabs activeKey={type} onChange={setType}>
          <Tabs.TabPane
            key="pod"
            tab='实例列表'
          >
        <ProTable<podListType>
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="podId"
          key="podList"
          search={false}
          request={async (params) =>{
            const res = await handleDetailList()
              let nodeList: any[] = []
              res.forEach((item: { metadata: any; spec: any; status: any; }) => {
                nodeList.push({
                  name: item.metadata.name,
                  uid: item.metadata.uid,
                  nodeName: item.spec.nodeName,
                  status: item.status.phase,
                  resources: item.spec.containers[0]?.resources,
                  creationTimestamp: item.metadata.creationTimestamp,
                  loadingTime: item.metadata.creationTimestamp
                }) 
              })
              return {
                data: nodeList,
                total: res.length,
                success: true,
              };
            }
          }
          columns={podColumns}
        />
          </Tabs.TabPane>
          <Tabs.TabPane
            key="edit"
            tab='更新升级'
          ></Tabs.TabPane>
          <Tabs.TabPane
            key="label"
            tab='标签'
          ></Tabs.TabPane>
        </Tabs>
      </Modal>
      <YamlModal
        onSubmit={async (values) => {
          setModalVisible(false);
          setCurrentRow(undefined)
        }}
        onCancel={(res, isUpdate) => {
          setModalVisible(false);
          setCurrentRow(undefined);
          props.onCancel(isUpdate, res || undefined);
        }}
        visible={modalVisible}
        values={values || {}}
      ></YamlModal>
    </div>
  );
};

export default detailForm;
