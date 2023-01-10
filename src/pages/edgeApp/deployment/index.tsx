import { PlusOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import WrapContent from '@/components/WrapContent';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { DeptType, listType } from './data';
import {
  getList,
  removeItem,
  getDeploymentDetail,
  getDeploymentPodsList,
  addDept,
  updateDept,
} from './service';
import UpdateForm from './components/edit';
import DetailForm from './components/detail';


/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: DeptType) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addDept({ ...fields });
    hide();
    if(resp.code === 200) {
      message.success('添加成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: DeptType) => {
  const hide = message.loading('正在配置');
  try {
    const resp = await updateDept(fields);
    hide();
    if(resp.code === 200) {
      message.success('配置成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};


const handleRemoveOne = async (selectedRow: listType) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const resp = await removeItem(selectedRow.name);
    hide();
    if(resp.status === 'Success') {
      message.success('删除成功，即将刷新');
    } else {
      message.error('删除失败');
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const handleDetail = async (name: string) => {
  try {
    const res = await getDeploymentDetail(sessionStorage.getItem("nameSpace"),name);
    return res
  } catch (error) {
    message.error('获取失败请重试！');
    return false;
  }
};

const DeptTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<listType>();

  const columns: ProColumns<listType>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '实例数(正常/全部)',
      dataIndex: 'name',
      valueType: 'text',
      render: (_, record) => {
        return (record.replicas - record.unavailableReplicas)  + '/' + record.replicas
      }
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
        <Button
          type="link"
          size="small"
          key="runOnce"
          onClick={async () => {
            const res = await handleDetail(record.name)
            setDetailModalVisible(true);
            setCurrentRow(res);
          }}
        >详情</Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          onClick={async () => {
            Modal.confirm({
              title: '删除',
              content: '确定删除该项吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleRemoveOne(record);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              },
            });
          }}
        >删除</Button>,
      ],
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<listType>
          headerTitle='容器应用'
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="deptId"
          key="deptList"
          search={{ labelWidth: 120, }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              onClick={async () => {
                setCurrentRow(undefined);
                setModalVisible(true);
              }}
            >
              <PlusOutlined />创建容器
            </Button>
          ]}
          request={(params) =>
            getList(sessionStorage.getItem("nameSpace")).then((res) => {
              return {
                data: res.items.map(item => {
                  return { name: item.metadata.name, uid: item.metadata.uid, creationTimestamp: item.metadata.creationTimestamp, replicas: item.status.replicas, unavailableReplicas: item.status.unavailableReplicas }
                }),
                total: res.items.length,
                success: true,
              };
            })
          }
          columns={columns}
        />
      </div>
      <UpdateForm
        onSubmit={async (values) => {
          let success = false;
          if (values.deptId) {
            success = await handleUpdate({ ...values } as DeptType);
          } else {
            success = await handleAdd({ ...values } as DeptType);
          }
          if (success) {
            setModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setModalVisible(false);
          setCurrentRow(undefined);
        }}
        visible={modalVisible}
        values={currentRow || {}}
      />
      <DetailForm
        onCancel={(isUpdate, res) => {
          setDetailModalVisible(isUpdate || false);
          setCurrentRow(res || undefined);
        }}
        visible={detailModalVisible}
        values={currentRow || {}}
      />
    </WrapContent>
  );
};

export default DeptTableList;
