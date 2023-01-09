import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';

import WrapContent from '@/components/WrapContent';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { DeptType, listType } from './data.d';
import { getList, getYaml } from './service';
import UpdateForm from './components/edit';



const DeptTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();

  useEffect(() => {
   
  }, []);

  const columns: ProColumns<listType>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '组',
      dataIndex: 'group',
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
            const res = await getYaml(record.name);
            setModalVisible(true);
            setCurrentRow(res);
          }}
        >查看YAML</Button>,
      ],
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<listType>
          headerTitle='CRD'
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="uid"
          key="list"
          search={{ labelWidth: 120, }}
          toolBarRender={() => []}
          request={(params) =>
            getList(sessionStorage.getItem("nameSpace")).then((res) => {
              return {
                data: res.items.map(item => {
                  return { name: item.metadata.name, uid: item.metadata.uid, creationTimestamp: item.metadata.creationTimestamp, group: item.spec.group }
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
          setModalVisible(false);
          setCurrentRow(undefined);
          if (actionRef.current) {
            actionRef.current.reload();
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
