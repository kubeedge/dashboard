import type { FormInstance } from "antd";
import { Button, DatePicker, Input } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { useModel } from "umi";
import WrapContent from "@/components/WrapContent";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { listType } from "./data.d";
import { getList, getYaml } from "./service";
import UpdateForm from "./components/edit";

const { RangePicker } = DatePicker;

const DeptTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const { initialState } = useModel("@@initialState");

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>({});

  useEffect(() => {}, []);

  const columns: ProColumns<listType>[] = [
    {
      title: "Name",
      dataIndex: "name",
      valueType: "text",
      width: 260,
      align: "center",
      renderFormItem: () => (
        <Input
          allowClear
          placeholder="Please enter name"
          style={{ width: 160 }}
        />
      ),
    },
    {
      title: "Group",
      dataIndex: "group",
      valueType: "text",
      width: 220,
      align: "center",
      search: false,
    },
    {
      title: "Creation time",
      dataIndex: "creationTimestamp",
      valueType: "dateTime",
      width: 220,
      align: "center",
      formItemProps: {
        labelCol: { span: 9 },
      },
      renderFormItem: () => (
        <RangePicker
          style={{ width: 220 }}
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
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="batchRemove"
          onClick={async () => {
            const res = await getYaml(record.name);
            setCurrentRow(res);
            setModalVisible(true);
          }}
        >
          YAML
        </Button>,
      ],
    },
  ];

  return (
    <WrapContent>
      <div style={{ width: "100%", float: "right" }}>
        <ProTable<listType>
          headerTitle="Crd"
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="uid"
          key="list"
          search={{ labelWidth: 120 }}
          toolBarRender={() => []}
          request={(params) =>
            getList(initialState.namespace).then((res) => {
              const combinedParams = {
                ...params,
                ...formTableRef?.current?.getFieldsValue?.(),
              };
              let filteredRes = res.items;
              let crdList: any[] = [];
              if (combinedParams.name || combinedParams.creationTimestamp) {
                filteredRes = res.items.filter((item: any) => {
                  let nameMatch = true;
                  let creationTimestampMatch = true;
                  if (combinedParams.name) {
                    nameMatch = item.metadata.name.includes(
                      combinedParams.name
                    );
                  }
                  if (combinedParams.creationTimestamp) {
                    const start = new Date(combinedParams.creationTimestamp[0]);
                    const end = new Date(combinedParams.creationTimestamp[1]);
                    const creationTimestamp = new Date(
                      item.metadata.creationTimestamp
                    );
                    creationTimestampMatch =
                      creationTimestamp >= start && creationTimestamp <= end;
                  }
                  return nameMatch && creationTimestampMatch;
                });
              }
              filteredRes.forEach(
                (item: { metadata: any; spec: any; status: any }) => {
                  crdList.push({
                    name: item.metadata.name,
                    uid: item.metadata.uid,
                    creationTimestamp: item.metadata.creationTimestamp,
                    group: item.spec.group,
                  });
                }
              );
              return {
                data: crdList,
                total: crdList.length,
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
        values={currentRow}
      />
    </WrapContent>
  );
};

export default DeptTableList;
