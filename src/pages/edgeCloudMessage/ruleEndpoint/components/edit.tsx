import React, { useEffect } from "react";
import {
  ProFormText,
  ProFormSelect,
  ProFormDependency,
} from "@ant-design/pro-form";
import { Form, Modal, Row, Col } from "antd";
import type { DeptType, listType } from "../data";
import { getNamespaces } from "@/services/kubeedge";

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
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
      kind: "RuleEndpoint",
      apiVersion: "rules.kubeedge.io/v1",
      metadata: {
        name: values.name,
        namespace: values.namespace,
      },
      spec: {
        ruleEndpointType: values.ruleEndpointType,
        properties:
          values.ruleEndpointType === "servicebus"
            ? { service_port: values.service_port }
            : {},
      },
    };
    props.onSubmit(params as DeptFormValueType);
  };

  return (
    <Modal
      width={940}
      title="Add RuleEndpoint"
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
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
              name="ruleEndpointType"
              label="RuleEndpointType"
              placeholder="ruleEndpointType"
              options={[
                {
                  label: "rest",
                  value: "rest",
                },
                {
                  label: "eventbus",
                  value: "eventbus",
                },
                {
                  label: "servicebus",
                  value: "servicebus",
                },
              ]}
              rules={[
                {
                  required: true,
                  message: "Missing ruleEndpointType",
                },
              ]}
            />
          </Col>
          <ProFormDependency name={["ruleEndpointType"]}>
            {(depend) => {
              switch (depend?.ruleEndpointType) {
                case "servicebus":
                  return (
                    <>
                      <ProFormText
                        name={"service_port"}
                        label="Service_port"
                        placeholder={"service_port"}
                        rules={[
                          {
                            required: true,
                            message: "Missing service_port",
                          },
                        ]}
                      />
                    </>
                  );
                default:
                  return null;
              }
            }}
          </ProFormDependency>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
