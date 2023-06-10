import React, { useEffect } from "react";
import { ProFormSelect, ProFormText } from "@ant-design/pro-form";
import { Form, Modal, Row, Col } from "antd";
import { FormList } from "@/pages/edgeResource/deployment/components/DeptDrawer/constants";
import type { DeptType, listType } from "../data";
import { getNamespaces } from "@/services/kubeedge";
import { arrayToObject } from "@/utils/utils";

let namespacesList: any[] = [];
const namespacesListRes = await getNamespaces();

namespacesList = namespacesListRes.items.map((item: any) => {
  return { label: item.metadata.name, value: item.metadata.name };
});

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<listType>;
};

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
      kind: "ConfigMap",
      apiVersion: "v1",
      metadata: {
        namespace: values.namespace,
        name: values.name,
        labels: arrayToObject(values.labels),
      },
      data: arrayToObject(values.data),
    };
    props.onSubmit(params as DeptFormValueType);
  };

  return (
    <Modal
      width={720}
      title="Add Configmap"
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
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
            <Form.Item label="Label">
              <FormList name="labels" formItemKey="key" value="value" />
            </Form.Item>
            <Form.Item label="Data">
              <FormList name="data" formItemKey="key" value="value" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
