import { PlusOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { Button, message, Modal } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { FormattedMessage, useModel } from "umi";
import WrapContent from "@/components/WrapContent";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { DeptType, formType, listType } from "./data.d";
import { getList, removeItem, getNodeList, addItem } from "./service";
import UpdateForm from "./components/edit";

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: formType) => {
  const hide = message.loading("正在添加");
  try {
    const obj = {
      apiVersion: "rules.kubeedge.io/v1",
      kind: "Rule",
      metadata: {
        name: fields.name,
        labels: {
          description: fields.description,
        },
      },
      spec: {
        source: fields.source,
        sourceResource: {
          path: fields.sourceResource,
        },
        target: fields.target,
        targetResource: {
          path: fields.targetResource,
        },
      },
    };
    const resp = await addItem("default", obj);
    hide();
    if (!resp.code) {
      message.success("添加成功");
    } else {
      message.error(resp.msg);
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
    const resp = await removeItem("default", selectedRow.name);
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
  const { initialState } = useModel("@@initialState");

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<listType>();
  const [nodeOptions, setNodeOptions] = useState([]);

  useEffect(() => {
    getNodeList("default").then((res) => {
      const nodeList = res.items.map((item) => {
        return { label: item.metadata.name, value: item.metadata.name };
      });
      setNodeOptions(nodeList);
    });
  }, []);

  const columns: ProColumns<listType>[] = [
    {
      title: "名称",
      dataIndex: "name",
      valueType: "text",
    },
    {
      title: "原端点",
      dataIndex: "source",
      valueType: "text",
    },
    {
      title: "原端点资源",
      dataIndex: "sourceResource",
      valueType: "text",
    },
    {
      title: "目标端点",
      dataIndex: "target",
      valueType: "text",
    },
    {
      title: "目的端点资源",
      dataIndex: "targetResource",
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
          headerTitle="消息路由"
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
              <PlusOutlined />{" "}
              <FormattedMessage
                id="pages.searchTable.new"
                defaultMessage="新建"
              />
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
                    source: item.spec.source,
                    sourceResource: item.spec.sourceResource.path,
                    target: item.spec.target,
                    targetResource: item.spec.targetResource.path,
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
        nodeOptions={nodeOptions}
        visible={modalVisible}
        values={currentRow || {}}
      />
    </WrapContent>
  );
};

export default DeptTableList;
