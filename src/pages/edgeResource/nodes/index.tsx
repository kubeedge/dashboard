import { PlusOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { Button, message, Modal, Select, Input, DatePicker } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { FormattedMessage } from "umi";
import WrapContent from "@/components/WrapContent";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { DeptType } from "./data";
import { getNodesList, getNodesDetail, removeNode } from "./service";
import UpdateForm from "./components/edit";
import DetailForm from "./components/detail";

const { RangePicker } = DatePicker;

const handleDetail = async (id: string) => {
  try {
    const res = await getNodesDetail(id);
    return res;
  } catch (error) {
    message.error("Failed to obtain, please try again!");
    return false;
  }
};

const handleRemoveOne = async (selectedRow: DeptType) => {
  const hide = message.loading("Deleting...");
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.name];
    const resp = await removeNode(params.join(","));
    hide();
    if (resp.status === "Success") {
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
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();

  useEffect(() => {}, []);

  const columns: ProColumns<DeptType>[] = [
    {
      title: "Name/ID",
      dataIndex: "uid",
      key: "uid",
      valueType: "text",
      align: "center",
      render: (_, row) => (
        <div>
          <div style={{ color: "#2f54eb" }}>{row.name}</div>
          <div style={{ fontSize: "12px" }}>{row.uid}</div>
        </div>
      ),
      renderFormItem: () => (
        <Input allowClear placeholder="Please enter name or id" />
      ),
    },
    {
      title: <FormattedMessage id="state" defaultMessage="Status" />,
      dataIndex: "state",
      valueType: "text",
      width: "100px",
      align: "center",
      renderFormItem: () => (
        <Select
          allowClear
          placeholder={"Please select status"}
          options={[
            { label: "Ready", value: "Ready" },
            { label: "NotReady", value: "NotReady" },
          ]}
        />
      ),
    },
    {
      title: <FormattedMessage id="hostname" defaultMessage="Hostname/IP" />,
      dataIndex: "hostname",
      valueType: "text",
      align: "center",
      search: false,
      render: (_, row) => (
        <div>
          <div>{row.hostname}</div>
          <div>{row.ip}</div>
        </div>
      ),
    },
    {
      title: (
        <FormattedMessage
          id="creationTimestamp"
          defaultMessage="Creation time"
        />
      ),
      dataIndex: "creationTimestamp",
      valueType: "dateTime",
      align: "center",
      formItemProps: {
        labelCol: { span: 8 },
      },
      renderFormItem: () => (
        <RangePicker
          placeholder={["Start Time", "End Time"]}
          showTime={{ format: "HH:mm:ss" }}
          format="YYYY-MM-DD HH:mm:ss"
        />
      ),
    },
    {
      title: (
        <FormattedMessage
          id="resourceVersion"
          defaultMessage="Edge side software version"
        />
      ),
      dataIndex: "resourceVersion",
      valueType: "text",
      align: "center",
      search: false,
    },
    {
      title: "Operation",
      dataIndex: "option",
      width: "100px",
      valueType: "option",
      align: "center",
      search: false,
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
          <FormattedMessage id="pages.searchTable.delete" />
        </Button>,
      ],
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: "100%", float: "right" }}>
        <ProTable<DeptType>
          headerTitle="Nodes"
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
              <PlusOutlined /> Add Node
            </Button>,
          ]}
          request={(params) =>
            getNodesList().then((res) => {
              let filteredRes = res.items;
              let nodeList: any[] = [];
              if (params.state || params.uid || params.creationTimestamp) {
                filteredRes = res.items.filter((item: any) => {
                  let stateMatch = true;
                  let uidMatch = true;
                  let creationTimestampMatch = true;
                  if (params.state) {
                    const ready =
                      item.status.conditions.filter(
                        (item: any) => item.type == "Ready"
                      )[0].status === "True";
                    stateMatch = params.state === "Ready" ? ready : !ready;
                  }
                  if (params.uid) {
                    uidMatch =
                      `${item.metadata.uid} ${item.metadata.name}`.includes(
                        params.uid
                      );
                  }
                  if (params.creationTimestamp) {
                    const start = new Date(params.creationTimestamp[0]);
                    const end = new Date(params.creationTimestamp[1]);
                    const creationTimestamp = new Date(
                      item.metadata.creationTimestamp
                    );
                    creationTimestampMatch =
                      creationTimestamp >= start && creationTimestamp <= end;
                  }
                  return stateMatch && uidMatch && creationTimestampMatch;
                });
              }
              filteredRes.forEach(
                (item: { metadata: any; spec: any; status: any }) => {
                  nodeList.push({
                    name: item.metadata.name,
                    uid: item.metadata.uid,
                    creationTimestamp: item.metadata.creationTimestamp,
                    resourceVersion: item.status.nodeInfo.kubeletVersion,
                    state:
                      item.status.conditions.filter(
                        (item: any) => item.type == "Ready"
                      )[0].status === "True"
                        ? "Ready"
                        : "NotReady",
                    hostname: item.status.addresses[1].address,
                    ip: item.status.addresses[0].address,
                  });
                }
              );
              return {
                data: nodeList,
                total: nodeList.length,
                success: true,
              };
            })
          }
          columns={columns}
        />
      </div>

      <UpdateForm
        onCancel={() => {
          setModalVisible(false);
          setCurrentRow(undefined);
        }}
        visible={modalVisible}
        values={currentRow || {}}
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
