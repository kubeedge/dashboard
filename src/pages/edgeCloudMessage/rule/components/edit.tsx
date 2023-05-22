import React, { useEffect } from "react";
import {
  ProFormDigit,
  ProFormText,
  ProFormRadio,
  ProFormTreeSelect,
  ProFormTextArea,
  ProFormSelect,
} from "@ant-design/pro-form";
import { Form, Modal, Row, Col } from "antd";
import { getNamespaces } from "@/services/kubeedge";
import type { DeptType, listType } from "../data";

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<listType>;
  ruleEndpoints: any;
};

let namespacesList: any[] = [];
const namespacesListRes = await getNamespaces();

namespacesList = namespacesListRes.items.map((item: any) => {
  return { label: item.metadata.name, value: item.metadata.name };
});

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const [form] = Form.useForm();
  const { ruleEndpoints } = props;

  useEffect(() => {
    form.resetFields();
  }, [form, props]);

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
  };
  const handleFinish = async (values: Record<string, any>) => {
    props.onSubmit(values as DeptFormValueType);
  };

  return (
    <Modal
      width={640}
      title="Add Rule"
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[8, 8]}>
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
              options={ruleEndpoints}
              name="source"
              label="Source"
              placeholder="source"
              rules={[
                {
                  required: true,
                  message: "Missing source",
                },
              ]}
            />
          </Col>
          <Col span={24}>
            <ProFormText
              name="sourceResource"
              label="SourceResource"
              placeholder="sourceResource"
              rules={[
                {
                  required: true,
                  message: "Missing sourceResource",
                },
              ]}
            />
          </Col>
          <Col span={24}>
            <ProFormSelect
              options={ruleEndpoints}
              name="target"
              label="Target"
              placeholder="target"
              rules={[
                {
                  required: true,
                  message: "Missing target",
                },
              ]}
            />
          </Col>
          <Col span={24}>
            <ProFormText
              name="targetResource"
              label="TargetResource"
              placeholder="targetResource"
              rules={[
                {
                  required: true,
                  message: "Missing targetResource",
                },
              ]}
            />
          </Col>
          <Col span={24}>
            <ProFormTextArea
              name="description"
              label="Description"
              width="xl"
              placeholder="description"
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
