import { PlusOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { Button, message, Modal } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { useIntl, FormattedMessage, useModel } from "umi";
import { FooterToolbar } from "@ant-design/pro-layout";
import WrapContent from "@/components/WrapContent";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { listType, DeviceType } from "./data.d";
import { getList, removeItem, addDevice, getInfo } from "./service";
import AddForm from "./components/add";
import DetailForm from "./components/detail";

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: DeviceType) => {
  const hide = message.loading("正在添加");
  try {
    const resp = await addDevice(sessionStorage.getItem("nameSpace"), {
      ...fields,
    });
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

const handleRemoveOne = async (selectedRow: listType) => {
  const hide = message.loading("正在删除");
  if (!selectedRow) return true;
  try {
    const resp = await removeItem(
      sessionStorage.getItem("nameSpace"),
      selectedRow.name
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

const DeptTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const { initialState, setInitialState } = useModel("@@initialState");

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<listType>();
  const [selectedRowsState, setSelectedRows] = useState<listType[]>([]);

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {}, []);
  const handleDetail = async (name: string) => {
    try {
      const res = await getInfo(sessionStorage.getItem("nameSpace"), name);
      return res;
    } catch (error) {
      message.error("获取失败请重试！");
      return false;
    }
  };

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
    },
    {
      title: "节点",
      dataIndex: "node",
      valueType: "text",
    },
    {
      title: "创建时间",
      dataIndex: "creationTimestamp",
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
            const res = await handleDetail(record.name);
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
        <ProTable<listType>
          headerTitle="设备实例"
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="deptId"
          key="deptList"
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
          request={(params) =>
            getList(initialState.namespace).then((res) => {
              return {
                data: res.items.map((item) => {
                  return {
                    name: item.metadata.name,
                    uid: item.metadata.uid,
                    creationTimestamp: item.metadata.creationTimestamp,
                    protocol:
                      item.spec.protocol.customizedProtocol.protocolName,
                    node: item.spec.nodeSelector.nodeSelectorTerms[0]
                      .matchExpressions[0].values[0],
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

      <AddForm
        onSubmit={async (values) => {
          let success = false;
          success = await handleAdd({ ...values } as DeviceType);
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
