import React, { useEffect } from "react";
import { ProFormText, ProFormSelect } from "@ant-design/pro-form";
import { Form, Modal, Row, Col } from "antd";
import type { DeviceModel } from "@/models/devicemodel";

export type DeptFormValueType = Record<string, unknown> & Partial<DeviceModel>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<DeviceModel>;
};

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      name: props.values?.metadata?.name,
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
    props.onSubmit(values as DeptFormValueType);
  };

  return (
    <Modal
      width={640}
      title="添加模型"
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
              label="名称"
              placeholder="请输入名称"
              rules={[
                {
                  required: false,
                  message: "请输入名称",
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="protocol"
              label="协议"
              placeholder="请输入协议"
              rules={[
                {
                  required: false,
                  message: "请输入协议",
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="description"
              label="描述"
              placeholder="请输入描述"
              rules={[
                {
                  required: false,
                  message: "请输入描述",
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="propertiesName"
              label="属性名"
              placeholder="请输入属性名"
              rules={[
                {
                  required: false,
                  message: "请输入属性名",
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              options={[
                { label: "Int", value: "INT" },
                { label: "String", value: "STRING" },
                { label: "Double", value: "DOUBLE" },
                { label: "Float", value: "FLOAT" },
                { label: "Boolean", value: "BOOLEAN" },
                { label: "Bytes", value: "BYTES" },
                { label: "Stream", value: "STREAM" },
              ]}
              name="type"
              label="属性类型"
              placeholder="请选择属性类型"
              rules={[
                {
                  required: false,
                  message: "请选择属性类型",
                },
              ]}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
