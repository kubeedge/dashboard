import { PlusOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { Button, message, Modal } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { useModel, FormattedMessage } from "umi";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { formType } from "./data.d";
import UpdateForm from "./components/edit";
import DetailForm from "./components/detail";
import AddForm from "./components/add";
import WrapContent from "@/components/WrapContent";
import {
  createDeviceModel,
  deleteDeviceModel,
  getDeviceModel,
  listDeviceModels,
} from '@/services/devicemodel';
import type { Status } from "@/models/common";
import type { DeviceModel } from "@/models/devicemodel";

export type DeptFormValueType = Record<string, string> & Partial<formType>;

const typeOptions = {
  INT: {
    accessMode: "ReadWrite",
    minimum: "1",
    maximum: "5",
    unit: "度",
  },
  STRING: { accessMode: "ReadWrite" },
  DOUBLE: {
    accessMode: "ReadWrite",
    minimum: "1.0",
    maximum: "5.0",
    unit: "度",
  },
  FLOAT: {
    accessMode: "ReadWrite",
    minimum: "1.0",
    maximum: "5.0",
    unit: "度",
  },
  BOOLEAN: { accessMode: "ReadWrite" },
  BYTES: { accessMode: "ReadWrite" },
  STREAM: { accessMode: "ReadWrite" },
};

// const handleUpdate = async (data: DeviceModel) => {
//   const hide = message.loading('正在配置');
//   try {
//     const resp = await updateDeviceModel(data.metadata.namespace, data.metadata.name, data) as Status;
//     hide();
//     if(resp.code === 200) {
//       message.success('配置成功');
//     } else {
//       message.error(resp.message);
//     }
//     return true;
//   } catch (error) {
//     hide();
//     message.error('配置失败请重试！');
//     return false;
//   }
// };

const DeviceModelTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const { initialState } = useModel("@@initialState");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModelVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<DeviceModel>();
  useEffect(() => {}, []);

  const handleRemoveOne = async (selectedRow: DeviceModel) => {
    const hide = message.loading("正在删除");
    if (!selectedRow) return true;
    try {
      const resp = await deleteDeviceModel(selectedRow.metadata?.namespace, selectedRow.metadata?.name);
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

  const handleAdd = async (form: DeptFormValueType) => {
    const namespace = initialState.namespace || "default";
    const obj: DeviceModel = {
      apiVersion: "devices.kubeedge.io/v1beta1",
      kind: "DeviceModel",
      metadata: {
        name: form.name,
        namespace: namespace,
      },
      spec: {
        protocol: form.protocol,
        properties: [
          {
            name: form.propertiesName,
            description: form.description,
            type: form.type,
            ...(typeOptions[form.type + ""] || {}),
          },
        ],
      },
    };

    const hide = message.loading("正在添加");

    try {
      hide();
      const resp = await createDeviceModel(namespace, obj) as Status;
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

  const columns: ProColumns<DeviceModel>[] = [
    {
      title: "名称",
      dataIndex: ["metadata", "name"],
      valueType: "text",
    },
    {
      title: "协议",
      dataIndex: ["spec", "protocol"],
      valueType: "text",
      search: false,
    },
    {
      title: "创建时间",
      dataIndex: ["metadata", "creationTimestamp"],
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
        <ProTable<DeviceModel>
          headerTitle="设备模型"
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey={(model: DeviceModel) => model.metadata.uid}
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
              return getDeviceModel(
                initialState.namespace || "default",
                params.name
              ).then((res) => {
                return {
                  data: [res],
                  total: 1,
                  success: true,
                };
              });
            } else {
              return listDeviceModels(initialState.namespace).then((res) => {
                console.log(params);
                return {
                  data: res.items,
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
          console.log(values);
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

export default DeviceModelTableList;
