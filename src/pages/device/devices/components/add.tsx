import React, { useEffect, useState } from "react";
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Form, Modal, Row, Col } from "antd";
import { useModel } from "umi";
import { EditableProTable, type ProColumns } from "@ant-design/pro-table";
import type { Device } from "@/models/device";
import { listDeviceModels } from "@/services/devicemodel";
import { listNodes } from "@/services/node";

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 *
 * */

export type DeviceFormValueType = Record<string, unknown> & Partial<Device>;

export type DeviceFormProps = {
  onCancel: (flag?: boolean, formVals?: DeviceFormValueType) => void;
  onSubmit: (values: DeviceFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<Device>;
};

type DataSourceType = {
  id: React.Key;
  key?: string;
  type?: string;
  value?: string;
};

const DeviceForm: React.FC<DeviceFormProps> = (props) => {
  const { initialState } = useModel("@@initialState");
  const [form] = Form.useForm();
  const twinsList: DataSourceType[] = [
    {
      id: 1,
      key: "",
      type: "",
      value: "",
    },
  ];
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    twinsList.map((item) => item.id)
  );

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      name: props.values.metadata?.name,
    });
  }, [form, props]);

  // const intl = useIntl();
  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
  };

  const handleFinish = async (values: Record<string, any>) => {
    const namespace = initialState.namespace || "default";
    const params = {
      apiVersion: "devices.kubeedge.io/v1beta1",
      kind: "Device",
      metadata: {
        labels: {
          description: values.description,
        },
        name: values.name,
        namespace: namespace,
      },
      spec: {
        deviceModelRef: {
          name: values.model,
        },
        nodeName: values.node,
        protocol: {
          protocolName: values.protocol,
        },
      },
      status: {
        twins: values.dataSource.map((item) => {
          return {
            observedDesired: {
              metadata: {
                type: item.type,
              },
              value: item.value,
            },
            propertyName: item.key,
            reported: {
              metadata: {
                type: item.type,
              },
              value: item.value,
            },
          };
        }),
      },
    };
    props.onSubmit(params as DeviceFormValueType);
  };

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "属性名",
      dataIndex: "key",
      width: "30%",
    },
    {
      title: "类型",
      key: "type",
      dataIndex: "type",
      valueType: "select",
      width: "30%",
      valueEnum: {
        Int: { text: "Int", status: "Int" },
        String: { text: "String", status: "String" },
        Double: { text: "Double", status: "Double" },
        Float: { text: "Float", status: "Float" },
        Boolean: { text: "Boolean", status: "Boolean" },
        Bytes: { text: "Bytes", status: "Bytes" },
      },
    },
    {
      title: "属性值",
      dataIndex: "value",
      width: "30%",
    },
    {
      title: "操作",
      valueType: "option",
    },
  ];

  return (
    <Modal
      width={640}
      title="添加实例"
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="name"
              label="实例名称"
              width="xl"
              placeholder="请输入实例名称"
              rules={[
                { required: false, message: "请输入实例名称！" },
                {
                  pattern:
                    /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/,
                  message:
                    "必须由小写字母数字“-”或“”组成。，并且必须以字母和数字字符开头和结尾",
                },
              ]}
            />
            <ProFormSelect
              name="model"
              label="设备模型"
              request={async () => {
                const res = await listDeviceModels(initialState.namespace);
                return res.items.map((item) => {
                  return {
                    label: item.metadata.name,
                    value: item.metadata.name,
                  };
                });
              }}
              placeholder="请选择设备模型"
              rules={[{ required: false, message: "请选择设备模型！" }]}
            />
            <ProFormText
              name="protocol"
              label="访问协议"
              width="xl"
              placeholder="请输入访问协议"
              rules={[{ required: false, message: "请输入访问协议！" }]}
            />
            <ProFormSelect
              name="node"
              label="节点"
              request={async () => {
                const res = await listNodes();
                return res.items.map((item) => {
                  return {
                    label: item.metadata.name,
                    value: item.metadata.name,
                  };
                });
              }}
              placeholder="请选择节点"
              rules={[{ required: false, message: "请选择节点！" }]}
            />
            <ProFormTextArea
              name="description"
              label="描述"
              width="xl"
              placeholder=""
              rules={[
                {
                  pattern: /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/,
                  message:
                    "必须是空字符串或由字母数字字符“-”、“_”或“.”组成，并且必须以字母数字字符开头和结尾",
                },
              ]}
            />
          </Col>
          <Col span={24} order={1}>
            <ProForm.Item
              label="孪生属性"
              name="dataSource"
              initialValue={twinsList}
              trigger="onValuesChange"
            >
              <EditableProTable<DataSourceType>
                rowKey="id"
                toolBarRender={false}
                columns={columns}
                recordCreatorProps={{
                  newRecordType: "dataSource",
                  position: "top",
                  record: () => ({
                    id: Date.now(),
                    addonBefore: "ccccccc",
                    decs: "testdesc",
                  }),
                }}
                editable={{
                  type: "multiple",
                  editableKeys,
                  onChange: setEditableRowKeys,
                  actionRender: (row, _, dom) => {
                    return [dom.delete];
                  },
                }}
              />
            </ProForm.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeviceForm;
