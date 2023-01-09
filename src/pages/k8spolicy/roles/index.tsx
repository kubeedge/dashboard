import { PlusOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import { FooterToolbar } from '@ant-design/pro-layout';
import WrapContent from '@/components/WrapContent';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { DeptType, listType } from './data.d';
import {
  getList,
  removeItem,
  addRole,
} from './service';
import AddForm from './components/add';

const DeptTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<listType>();
  useEffect(() => {
   
  }, []);
  const handleAdd = async (fields: DeptType) => {
    const hide = message.loading('正在添加');
    try {
      const resp = await addRole(sessionStorage.getItem("nameSpace"), { ...fields });
      hide();
      if(resp.metadata.creationTimestamp) {
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
  
  const handleRemoveOne = async (selectedRow: listType) => {
    const hide = message.loading('正在删除');
    if (!selectedRow) return true;
    try {
      const resp = await removeItem(sessionStorage.getItem("nameSpace"), selectedRow.name);
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

  const columns: ProColumns<listType>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'creationTimestamp',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      width: '220px',
      valueType: 'option',
      render: (_, record) => [
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
          headerTitle='roles'
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
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
            </Button>
          ]}
          request={(params) =>
            getList(sessionStorage.getItem("nameSpace")).then((res) => {
              return {
                data: res.items.map(item => {
                  return { name: item.metadata.name, uid: item.metadata.uid, creationTimestamp: item.metadata.creationTimestamp }
                }),
                total: res.items.length,
                success: true,
              };
            })
          }
          columns={columns}
        />
      </div>
      <AddForm
        onSubmit={async (values) => {
          let success = false;
          success = await handleAdd({ ...values } as DeptType);
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
    </WrapContent>
  );
};

export default DeptTableList;
