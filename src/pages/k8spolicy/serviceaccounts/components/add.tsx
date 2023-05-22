import React, { useEffect } from "react";
import { ProFormText, ProFormSelect } from "@ant-design/pro-form";
import { Form, Modal, Row, Col } from "antd";
import type { listType } from "../data";
import { getSecretsList } from "../service";
import { getNamespaces } from "@/services/kubeedge";

export type AccountFormValueType = Record<string, unknown>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: AccountFormValueType) => void;
  onSubmit: (values: AccountFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<listType>;
};

let namespacesList: any[] = [];
const namespacesListRes = await getNamespaces();

namespacesList = namespacesListRes.items.map((item: any) => {
  return { label: item.metadata.name, value: item.metadata.name };
});

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      name: props.values.name,
    });
  }, [form, props]);

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
  };
  const handleFinish = async (values: Record<string, any>) => {
    const params = {
      kind: "ServiceAccount",
      apiVersion: "v1",
      metadata: {
        name: values.name,
        namespace: values.namespace,
      },
      secrets: values.secrets?.map((item: any) => {
        return {
          name: item,
        };
      }),
    };
    props.onSubmit(params as AccountFormValueType);
  };

  return (
    <Modal
      width={640}
      title="Add serviceaccount"
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={props.values}
        labelAlign="left"
        labelCol={{ span: 5 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
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
          </Col>
          <Col span={24}>
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
          </Col>
          <Col span={24}>
            <ProFormSelect
              name="secrets"
              label="Secrets"
              fieldProps={{ mode: "multiple" }}
              dependencies={["namespace"]}
              request={(params) =>
                getSecretsList(params.namespace).then((res) => {
                  return (res.items || []).map((item) => ({
                    label: item.metadata.name,
                    value: item.metadata.name,
                  }));
                })
              }
              placeholder="Secrets"
              rules={[{ required: true, message: "Missing secrets" }]}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
