import { PlusOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { Button, message, Modal } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { useModel, FormattedMessage } from "umi";
import { FooterToolbar } from "@ant-design/pro-layout";
import WrapContent from "@/components/WrapContent";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { DeptType, formType, listType } from "./data.d";
import { getList, removeItem, addItem, getListByQuery } from "./service";
import UpdateForm from "./components/edit";
import DetailForm from "./components/detail";
import AddForm from "./components/add";

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;
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

const handleRemoveOne = async (selectedRow: listType) => {
  const hide = message.loading("正在删除");
  if (!selectedRow) return true;
  try {
    const resp = await removeItem("default", selectedRow.name);
    hide();
    if (!resp.code) {
      message.success("删除成功");
    } else {
      message.error("删除失败");
    }
    return true;
  } catch (error) {
    hide();
    message.error("删除失败，请重试");
    return false;
  }
};
const typeOptions = {
  int: {
    accessMode: "ReadWrite",
    defaultValue: 1,
    minimum: 1,
    maximum: 5,
    unit: "度",
  },
  string: { accessMode: "ReadWrite", defaultValue: "default" },
  double: {
    accessMode: "ReadWrite",
    defaultValue: "1.0",
    minimum: "1.0",
    maximum: "5.0",
    unit: "度",
  },
  float: {
    accessMode: "ReadWrite",
    defaultValue: "1.0",
    minimum: "1.0",
    maximum: "5.0",
    unit: "度",
  },
  boolean: { accessMode: "ReadWrite", defaultValue: true },
  bytes: { accessMode: "ReadWrite" },
};
const handleAdd = async (form: DeptFormValueType) => {
  const obj = {
    apiVersion: "devices.kubeedge.io/v1alpha2",
    kind: "DeviceModel",
    metadata: {
      name: form.name,
      namespace: "default",
    },
    spec: {
      protocol: form.protocol,
      properties: [
        {
          name: form.propertiesName,
          description: form.description,
          type: {
            [form.type + ""]: typeOptions[form.type + ""],
          },
        },
      ],
    },
  };
  const hide = message.loading("正在添加");
  try {
    const resp = await addItem("default", obj);
    hide();
    if (!resp.code) {
      message.success("添加成功");
    } else {
      message.error(resp.message);
    }
    return true;
  } catch (error) {
    hide();
    message.error("添加失败请重试！");
    return false;
  }
};

const DeptTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const { initialState } = useModel("@@initialState");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModelVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<listType>();
  useEffect(() => {}, []);
  const columns: ProColumns<listType>[] = [
    {
      title: "名称",
      dataIndex: "name",
      valueType: "text",
    },
    {
      title: "协议",
      dataIndex: "protocol",
      valueType: "text",
      search: false,
    },
    {
      title: "创建时间",
      dataIndex: "creationTimestamp",
      valueType: "dateTime",
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.titleOption"
          defaultMessage="操作"
        />
      ),
      dataIndex: "option",
      width: "220px",
      valueType: "option",
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          onClick={async () => {
            Modal.confirm({
              title: "删除",
              content: "确定删除该项吗？",
              okText: "确认",
              cancelText: "取消",
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
          删除
        </Button>,
        <Button
          type="link"
          size="small"
          key="check"
          onClick={async () => {
            setDetailModalVisible(true);
            setCurrentRow(record);
          }}
        >
          查看
        </Button>,
      ],
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: "100%", float: "right" }}>
        <ProTable<listType>
          headerTitle="设备模型"
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="deptId"
          key="deptList"
          search={{ labelWidth: 80 }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              onClick={async () => {
                setCurrentRow(undefined);
                setModalVisible(true);
              }}
            >
              <PlusOutlined />
              添加模型
            </Button>,
          ]}
          request={(params) => {
            if (params.name) {
              return getListByQuery("default", params.name).then((res) => {
                return {
                  data: [
                    {
                      name: res.metadata.name,
                      uid: res.metadata.uid,
                      creationTimestamp: res.metadata.creationTimestamp,
                      protocol: res?.spec?.protocol,
                      namespace: item.metadata.namespace,
                    },
                  ],
                  total: 1,
                  success: true,
                };
              });
            } else {
              return getList(initialState.namespace).then((res) => {
                console.log(params);
                return {
                  data: res.items.map((item) => {
                    return {
                      name: item.metadata.name,
                      uid: item.metadata.uid,
                      creationTimestamp: item.metadata.creationTimestamp,
                      protocol: item?.spec?.protocol,
                      namespace: item.metadata.namespace,
                    };
                  }),
                  total: res.items.length,
                  success: true,
                };
              });
            }
          }}
          columns={columns}
        />
      </div>
      <UpdateForm
        onSubmit={async (values) => {
          let success = false;
          success = await handleAdd({ ...values } as formType);
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
      <AddForm
        onSubmit={async (values) => {
          let success = false;
          success = await handleAdd({ ...values } as formType);
          if (success) {
            setAddModelVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setAddModelVisible(false);
          setCurrentRow(undefined);
        }}
        visible={addModalVisible}
        values={currentRow || {}}
      />
      <DetailForm
        onSubmit={async (values) => {
          let success = false;
          success = await handleAdd({ ...values } as formType);
          if (success) {
            setDetailModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setDetailModalVisible(false);
          setCurrentRow(undefined);
        }}
        onAdd={() => {
          setAddModelVisible(true);
          setCurrentRow(undefined);
        }}
        visible={detailModalVisible}
        values={currentRow || {}}
      />
    </WrapContent>
  );
};

export default DeptTableList;
