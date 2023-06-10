import { PlusOutlined } from "@ant-design/icons";
import { Descriptions, FormInstance } from "antd";
import { Button, message, Modal } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { useIntl, FormattedMessage } from "umi";
import { FooterToolbar } from "@ant-design/pro-layout";
import WrapContent from "@/components/WrapContent";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { DeptType, listType } from "../data.d";
import { getListByQuery, removeItem, getListByLabel } from "../service";
// import UpdateForm from './components/edit';

/**
 * 添加节点
 * @param fields
 */
// const handleAdd = async (fields: DeptType) => {
//   const hide = message.loading('正在添加');
//   try {
//     const resp = await addDept({ ...fields });
//     hide();
//     if(resp.code === 200) {
//       message.success('添加成功');
//     } else {
//       message.error(resp.msg);
//     }
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };

/**
 * 更新节点
 *
 * @param fields
 */
// const handleUpdate = async (fields: DeptType) => {
//   const hide = message.loading('正在配置');
//   try {
//     const resp = await updateDept(fields);
//     hide();
//     if(resp.code === 200) {
//       message.success('配置成功');
//     } else {
//       message.error(resp.msg);
//     }
//     return true;
//   } catch (error) {
//     hide();
//     message.error('配置失败请重试！');
//     return false;
//   }
// };

/**
 * 删除节点
 *
 * @param selectedRows
 */
// const handleRemove = async (selectedRows: listType[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     const resp = await removeItem(selectedRows.map((row) => row.name).join(','));
//     hide();
//     if(resp.code === 200) {
//       message.success('删除成功，即将刷新');
//     } else {
//       message.error(resp.msg);
//     }
//     return true;
//   } catch (error) {
//     hide();
//     message.error('删除失败，请重试');
//     return false;
//   }
// };
// const handleRemoveOne = async (selectedRow: listType) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRow) return true;
//   try {
//     const resp = await removeItem(selectedRow.name);
//     hide();
//     if(resp.status === 'Success') {
//       message.success('删除成功，即将刷新');
//     } else {
//       message.error('删除失败');
//     }
//     return true;
//   } catch (error) {
//     hide();
//     message.error('删除失败，请重试');
//     return false;
//   }
// };

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  onAdd: () => void;
  visible: boolean;
  values: Partial<listType>;
};

const DeptTableList: React.FC<DeptFormProps> = (props) => {
  const formTableRef = useRef<FormInstance>();
  const { values } = props;
  console.log(values);
  getListByLabel("default", { labelSelector: values.name, limit: 500 }).then(
    (res) => {
      console.log(res);
    }
  );
  const actionRef = useRef<ActionType>();

  const handleAddDevice = () => {
    props.onAdd();
  };
  const columns: ProColumns<listType>[] = [
    {
      title: "属性名",
      dataIndex: "name",
      valueType: "text",
    },
    {
      title: "描述",
      dataIndex: "creationTimestamp",
      valueType: "text",
      search: false,
    },
    {
      title: "类型",
      dataIndex: "creationTimestamp",
      valueType: "text",
      search: false,
    },
    {
      title: "属性详情",
      dataIndex: "creationTimestamp",
      valueType: "text",
      search: false,
    },
    {
      title: "操作",
      dataIndex: "option",
      width: "220px",
      valueType: "option",
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          danger
          key="sss"
          onClick={async () => {
            // handleAdd()
            // Modal.confirm({
            //   title: '删除',
            //   content: '确定删除该项吗？',
            //   okText: '确认',
            //   cancelText: '取消',
            //   onOk: async () => {
            //     const success = await removeItem('default', record);
            //     if (success) {
            //       if (actionRef.current) {
            //         actionRef.current.reload();
            //       }
            //     }
            //   },
            // });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];
  const handleOk = () => {};
  const handleCancel = () => {
    props.onCancel();
  };

  return (
    <Modal
      width={940}
      title="详情"
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <WrapContent>
        <div style={{ width: "100%", float: "right" }}>
          <Descriptions column={24}>
            <Descriptions.Item span={12} label="名称">
              {values?.name}
            </Descriptions.Item>
            <Descriptions.Item span={12} label="命名空间">
              {values?.namespace}
            </Descriptions.Item>
            <Descriptions.Item span={12} label="创建时间">
              {values?.creationTimestamp}
            </Descriptions.Item>
          </Descriptions>
          <ProTable<listType>
            headerTitle="设备孪生"
            actionRef={actionRef}
            formRef={formTableRef}
            rowKey="deptId"
            key="deptList"
            search={{ labelWidth: 80 }}
            toolBarRender={() => [
              <Button
                type="primary"
                key="add"
                onClick={() => {
                  handleAddDevice();
                }}
              >
                <PlusOutlined />
                添加孪生属性
              </Button>,
            ]}
            request={(params) =>
              getListByQuery("default", values.name).then((res) => {
                return {
                  data: res.items.map((item) => {
                    return {
                      name: item.metadata.name,
                      uid: item.metadata.uid,
                      creationTimestamp: item.metadata.creationTimestamp,
                    };
                  }),
                  total: res.items.length,
                  success: true,
                };
              })
            }
            columns={columns}
          />
        </div>
      </WrapContent>
    </Modal>
  );
};

export default DeptTableList;
