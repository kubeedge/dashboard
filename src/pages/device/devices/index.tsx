import { PlusOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { Button, message, Modal } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { FormattedMessage, useModel } from "umi";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import AddForm from "./components/add";
import DetailForm from "./components/detail";
import WrapContent from "@/components/WrapContent";
import type { Device } from "@/models/device";
import { createDevice, deleteDevice, getDevice, listDevices } from "@/services/device";

const handleAdd = async (device: Device) => {
  const hide = message.loading("正在添加");
  try {
    const resp = await createDevice(
      device.metadata.namespace,
      device,
    );
    hide();
    if (resp.metadata?.creationTimestamp) {
      message.success("添加成功");
    }
    return true;
  } catch (error) {
    hide();
    message.error("添加失败请重试！");
    return false;
  }
};

const handleRemoveOne = async (device: Device) => {
  const hide = message.loading("正在删除");
  if (!device) return true;
  try {
    const resp = await deleteDevice(
      device.metadata.namespace,
      device.metadata.name,
    );
    hide();
    if (resp.status === "Success") {
      message.success("删除成功，即将刷新");
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

const handleDetail = async (namespace: string, name: string) => {
  try {
    const res = await getDevice(
      namespace,
      name,
    );
    return res;
  } catch (error) {
    message.error("获取失败请重试！");
    return null;
  }
};

const DeviceTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const {
    initialState,
    // setInitialState
  } = useModel("@@initialState");

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Device>();
  // const [selectedRowsState, setSelectedRows] = useState<Device[]>([]);

  // const intl = useIntl();

  useEffect(() => {}, []);

  const columns: ProColumns<Device>[] = [
    {
      title: "名称",
      dataIndex: ["metadata", "name"],
      valueType: "text",
    },
    {
      title: "协议",
      dataIndex: ["spec", "protocol", "protocolName"],
      valueType: "text",
    },
    {
      title: "节点",
      dataIndex: ["spec", "nodeName"],
      valueType: "text",
    },
    {
      title: "创建时间",
      dataIndex: ["metadata", "creationTimestamp"],
      valueType: "dateTime",
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
          key="runOnce"
          onClick={async () => {
            const res = await handleDetail(record.metadata.namespace, record.metadata.name);
            setDetailModalVisible(true);
            setCurrentRow(res);
          }}
        >
          详情
        </Button>,
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
      ],
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: "100%", float: "right" }}>
        <ProTable<Device>
          headerTitle="设备实例"
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey={(device: Device) => device.metadata.uid}
          key="deviceList"
          search={{ labelWidth: 120 }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              onClick={async () => {
                setCurrentRow(undefined);
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> 添加实例
            </Button>,
          ]}
          request={() =>
            listDevices(initialState.namespace).then((res) => {
              return {
                data: res.items,
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
          success = await handleAdd({ ...values } as Device);
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

export default DeviceTableList;
