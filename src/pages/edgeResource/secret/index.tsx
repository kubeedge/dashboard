import { PlusOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { Button, message, Modal, Select, Input, DatePicker } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { useModel, FormattedMessage } from "umi";
import WrapContent from "@/components/WrapContent";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { SecretType, listType } from "./data";
import { getList, removeItem, addSecret, getInfo } from "./service";
import AddForm from "./components/add";
import DetailForm from "./components/detail";
import { getNamespaces } from "@/services/kubeedge";

const { RangePicker } = DatePicker;

const handleAdd = async (fields: SecretType) => {
  const hide = message.loading("Adding...");
  try {
    const resp = await addSecret(fields.metadata.namespace, {
      ...fields,
    });
    hide();
    if (resp.metadata.creationTimestamp) {
      message.success("Added successfully");
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error("Failed, please try again!");
    return false;
  }
};

const handleDetail = async (namespace: string, name: string) => {
  try {
    const res = await getInfo(namespace, name);
    return res;
  } catch (error) {
    message.error("Failed, please try again!");
    return false;
  }
};

const handleRemoveOne = async (selectedRow: listType) => {
  const hide = message.loading("Deleting...");
  if (!selectedRow) return true;
  try {
    const resp = await removeItem(selectedRow.namespace, selectedRow.name);
    hide();
    if (resp.code === 200) {
      message.success("Successfully deleted, about to refresh");
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error("Deletion failed, please try again");
    return false;
  }
};

const DeptTableList: React.FC = () => {
  const { initialState } = useModel("@@initialState");
  const formTableRef = useRef<FormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<listType>();
  const [namespacesList, setNamespacesList] = React.useState<any[]>([]);

  const initNamespacesList = async () => {
    const namespacesListRes = await getNamespaces();
    setNamespacesList([
      {
        label: "All namespaces",
        value: "",
      },
      ...(namespacesListRes?.items || []).map((item: any) => {
        return { label: item.metadata.name, value: item.metadata.name };
      }),
    ]);
  };

  useEffect(() => {
    if (initialState?.namespace === "") {
      initNamespacesList();
    } else {
      setNamespacesList([
        {
          label: initialState.namespace,
          value: initialState.namespace,
        },
      ]);
    }
    formTableRef.current?.resetFields();
  }, [initialState]);

  const columns: ProColumns<listType>[] = [
    {
      title: "Namespace",
      dataIndex: "namespace",
      valueType: "text",
      align: "center",
      formItemProps: {
        labelCol: { span: 8 },
      },
      renderFormItem: () => (
        <Select
          id={`${initialState.namespace}-select`}
          placeholder={"Please select namespace"}
          mode="multiple"
          allowClear
          options={namespacesList}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      valueType: "text",
      width: 220,
      align: "center",
      renderFormItem: () => (
        <Input allowClear placeholder="Please enter name" />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      valueType: "text",
      search: false,
    },
    {
      title: "Creation time",
      dataIndex: "creationTimestamp",
      valueType: "dateTime",
      width: 220,
      align: "center",
      formItemProps: {
        labelCol: { span: 8 },
      },
      renderFormItem: () => (
        <RangePicker
          allowClear
          placeholder={["Start Time", "End Time"]}
          showTime={{ format: "HH:mm:ss" }}
          format="YYYY-MM-DD HH:mm:ss"
        />
      ),
    },
    {
      title: "Operation",
      dataIndex: "option",
      width: "220px",
      valueType: "option",
      search: false,
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="runOnce"
          onClick={async () => {
            const res = await handleDetail(record.namespace, record.name);
            setDetailModalVisible(true);
            setCurrentRow(res);
          }}
        >
          Detail
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          onClick={async () => {
            Modal.confirm({
              title: "Delete",
              content: "Are you sure to delete this item?",
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
          Delete
        </Button>,
      ],
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: "100%", float: "right" }}>
        <ProTable<listType>
          headerTitle="Secret"
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="deptId"
          key="deptList"
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
              Add secret
            </Button>,
          ]}
          params={{ namespaceSetting: initialState.namespace }}
          request={(params) =>
            getList(params.namespaceSetting).then((res) => {
              const combinedParams = {
                ...params,
                ...formTableRef?.current?.getFieldsValue?.(),
              };
              let filteredRes = res.items;
              let secretList: any[] = [];
              if (
                combinedParams.namespace?.length ||
                combinedParams.name ||
                combinedParams.creationTimestamp
              ) {
                filteredRes = res.items.filter((item: any) => {
                  let match = true;
                  if (combinedParams.namespace) {
                    match =
                      combinedParams.namespace.includes("") ||
                      combinedParams.namespace.includes(
                        item.metadata.namespace
                      );
                  }
                  if (combinedParams.name) {
                    match = item.metadata.name.includes(combinedParams.name);
                  }
                  if (combinedParams.creationTimestamp) {
                    const start = new Date(combinedParams.creationTimestamp[0]);
                    const end = new Date(combinedParams.creationTimestamp[1]);
                    const creationTimestamp = new Date(
                      item.metadata.creationTimestamp
                    );
                    match =
                      creationTimestamp >= start && creationTimestamp <= end;
                  }
                  return match;
                });
              }
              filteredRes.forEach(
                (item: {
                  metadata: any;
                  spec: any;
                  status: any;
                  type: string;
                }) => {
                  secretList.push({
                    name: item.metadata.name,
                    namespace: item.metadata.namespace,
                    uid: item.metadata.uid,
                    creationTimestamp: item.metadata.creationTimestamp,
                    type: item.type,
                  });
                }
              );
              return {
                data: secretList,
                total: secretList.length,
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
          success = await handleAdd({ ...values } as SecretType);
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
