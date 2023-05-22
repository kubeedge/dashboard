import React, { useEffect, useState } from "react";
import ProForm, {
  ProFormText,
  ProFormRadio,
  ProFormSelect,
} from "@ant-design/pro-form";
import { Form, Modal, Row, Col, Card } from "antd";
import type { SecretType, listType } from "../data";
import { EditableProTable, ProColumns } from "@ant-design/pro-table";
import { getNamespaces } from "@/services/kubeedge";

export type DeptFormValueType = Record<string, unknown> & Partial<SecretType>;

let namespacesList: any[] = [];
const namespacesListRes = await getNamespaces();

namespacesList = namespacesListRes.items.map((item: any) => {
  return { label: item.metadata.name, value: item.metadata.name };
});

export type SecretFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<listType>;
};
type DataSourceType = {
  id: React.Key;
  key?: string;
  value?: string;
};
const SecretForm: React.FC<SecretFormProps> = (props) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      name: props.values.name,
    });
  }, [form, props]);
  const dataOpaList: DataSourceType[] = [];
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    dataOpaList.map((item) => item.id)
  );
  const [formType, setFormType] = useState("kubernetes.io/dockerconfigjson");
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
    setFormType("kubernetes.io/dockerconfigjson");
  };
  const handleFinish = async (values: Record<string, any>) => {
    const params: any = {
      kind: "Secret",
      apiVersion: "v1",
      type: values.type,
      metadata: {
        namespace: values.namespace,
        name: values.name,
      },
      data: {},
    };
    if (values.type == "kubernetes.io/dockerconfigjson") {
      const auth = window.btoa(`${values.username}: ${values.password}`);
      const info = {};
      info[values.server] = {
        username: values.username,
        password: values.password,
        auth: auth,
      };
      const base64Data = window.btoa(JSON.stringify(info));
      params.data[".dockerconfigjson"] = base64Data;
    } else if (values.type == "Opaque") {
      values.dataSource?.forEach((item) => {
        params.data[item.key] = item.value;
      });
      params.immutable = false;
    }

    props.onSubmit(params as DeptFormValueType);
  };

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "Key",
      dataIndex: "key",
      width: "40%",
    },
    {
      title: "Value",
      dataIndex: "value",
      width: "40%",
    },
    {
      title: "Operation",
      valueType: "option",
    },
  ];

  return (
    <Modal
      width={640}
      title="Add Secret"
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        onChange={(val) => {
          setFormType(form.getFieldValue("type"));
        }}
        initialValues={{
          ...props.values,
          type: "kubernetes.io/dockerconfigjson",
          server: "http://docker",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              name="namespace"
              label="Namespace"
              placeholder="Namespace"
              options={namespacesList}
              rules={[
                {
                  required: true,
                  message: "Missing namespace",
                },
              ]}
            />
            <ProFormText
              name="name"
              label="Name"
              placeholder="Name"
              rules={[
                {
                  required: true,
                  message: "Missing name",
                },
              ]}
            />
            <ProFormRadio.Group
              name="type"
              label="Type"
              options={[
                {
                  label: "Docker",
                  value: "kubernetes.io/dockerconfigjson",
                },
                {
                  label: "Opaque",
                  value: "Opaque",
                },
              ]}
              rules={[
                {
                  required: true,
                  message: "Missing type",
                },
              ]}
            />
            {formType == "kubernetes.io/dockerconfigjson" && (
              <Card bodyStyle={{ padding: 15 }}>
                <ProFormText
                  name="server"
                  label="Docker server"
                  width="xl"
                  placeholder="Docker server"
                  rules={[
                    {
                      required: true,
                      message: "Missing docker server",
                    },
                  ]}
                />
                <ProFormText
                  name="username"
                  label="Docker username"
                  width="xl"
                  placeholder="Docker username"
                  rules={[
                    {
                      required: true,
                      message: "Missing docker username",
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  label="Docker password"
                  width="xl"
                  placeholder="Docker password"
                  rules={[
                    {
                      required: true,
                      message: "Missing docker password",
                    },
                  ]}
                />
              </Card>
            )}
            {formType == "Opaque" && (
              <ProForm.Item
                label="DataSource"
                name="dataSource"
                initialValue={dataOpaList}
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
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default SecretForm;
