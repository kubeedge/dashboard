import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from 'umi';
import WrapContent from '@/components/WrapContent';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { DeptType } from './data';
import {
  getNodesList,
  getNodesDetail,
  removeNode,
} from './service';
import UpdateForm from './components/edit';
import DetailForm from './components/detail';



/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 * 
 * */


const handleDetail = async (id: string) => {
  try {
    const res = await getNodesDetail(id);
    return res
  } catch (error) {
    message.error('获取失败请重试！');
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
    const resp = await getNodesDetail('xxx');
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



const handleRemoveOne = async (selectedRow: DeptType) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.name];
    const resp = await removeNode(params.join(','));
    hide();
    if(resp.code === 200) {
      message.success('删除成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};


const DeptTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<DeptType[]>([]);

  const [deptTree, setDeptTree] = useState<any>([]);
  const [statusOptions, setStatusOptions] = useState<any>([]);
 

  /** 国际化配置 */
  const intl = useIntl();

  const access = useAccess();

  useEffect(() => {
   
  }, []);

  const columns: ProColumns<DeptType>[] = [
    {
      title: '名称/ID',
      dataIndex: 'uid',
      key: 'uid',
      valueType: 'text',
      render: (_, row) => (
        <div>
          <div style={{color: '#2f54eb'}}>{row.name}</div>
          <div style={{fontSize: '12px'}}>{row.uid}</div>
        </div>
      )
    },
    {
      title: <FormattedMessage id="state" defaultMessage="状态" />,
      dataIndex: 'state',
      valueType: 'text',
      width: '60px'
    },
    {
      title: <FormattedMessage id="hostname" defaultMessage="主机名/网络" />,
      dataIndex: 'hostname',
      valueType: 'text',
      render:(_, row) => (
        <div>
          <div>{row.hostname}</div>
          <div>{row.ip}</div>
        </div>
      )
    },
    {
      title: <FormattedMessage id="creationTimestamp" defaultMessage="创建时间" />,
      dataIndex: 'creationTimestamp',
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="resourceVersion" defaultMessage="边缘侧软件版本" />,
      dataIndex: 'resourceVersion',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="node" defaultMessage="节点标签" />,
      dataIndex: 'node',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      width: '100px',
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
          hidden={!access.hasPerms('system:dept:remove')}
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
        >
          <FormattedMessage id="pages.searchTable.delete" defaultMessage="删除" />
        </Button>,
      ],
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<DeptType>
          headerTitle='边缘节点'
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="deptId"
          key="deptList"
          search={false}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('system:notice:add')}
              onClick={async () => {
                setCurrentRow(undefined);
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 注册节点
            </Button>,
            // <Button
            //   type="primary"
            //   key="remove"
            //   hidden={selectedRowsState?.length === 0 || !access.hasPerms('system:dept:remove')}
            //   onClick={async () => {
            //     const success = await handleRemove(selectedRowsState);
            //     if (success) {
            //       setSelectedRows([]);
            //       actionRef.current?.reloadAndRest?.();
            //     }
            //   }}
            // >
            //   <DeleteOutlined />
            //   <FormattedMessage id="pages.searchTable.delete" defaultMessage="删除" />
            // </Button>
          ]}
          request={(params) =>
            getNodesList().then((res) => {
              let nodeList: any[] = []
              res.items.forEach((item: { metadata: any; spec: any; status: any; }) => {
                nodeList.push({
                  name: item.metadata.name,
                  uid: item.metadata.uid,
                  creationTimestamp: item.metadata.creationTimestamp,
                  resourceVersion: item.metadata.resourceVersion,
                  state: item.status.phase || '',
                  hostname: item.status.addresses[1].address,
                  ip: item.status.addresses[0].address
                }) 
              })
              return {
                data: nodeList,
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
          success = await handleUpdate({ ...values } as DeptType);
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
        statusOptions={statusOptions}
      />
      <DetailForm
        onCancel={(res, isUpdate) => {
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
