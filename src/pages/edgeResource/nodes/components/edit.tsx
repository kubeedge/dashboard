import React, { useEffect } from "react";
import {
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Form, Modal, Row, Col } from "antd";
import type { DeptType, formType } from "../data";

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  visible: boolean;
  values: Partial<DeptType>;
};

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const [form] = Form.useForm<formType>();

  useEffect(() => {
    form.resetFields();
  }, [form, props]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      form.setFieldValue(
        "remark",
        values.runtimeType === "docker"
          ? `keadm join --token=${values.token} --cloudcore-ipport=${values.cloudIP} --kubeedge-version=${values.version} --runtimetype=docker --remote-runtime-endpoint=unix:///var/run/dockershim.sock`
          : `keadm join --token=${values.token} --cloudcore-ipport=${values.cloudIP} --kubeedge-version=${values.version} --runtimetype=remote --remote-runtime-endpoint=unix:///run/containerd/containerd.sock`
      );
    });
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
  };

  return (
    <Modal
      width={640}
      title="Add Node"
      open={props.visible}
      destroyOnClose
      okText="Generate Command"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="cloudIP"
              label="Cloud master node ip:port"
              placeholder="192.168.33.100:10000"
              rules={[
                {
                  required: true,
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="version"
              label="Kubedege version"
              placeholder="1.12.1"
              rules={[
                {
                  required: true,
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              options={[
                { label: "docker", value: "docker" },
                { label: "containerd", value: "containerd" },
              ]}
              name="runtimeType"
              label="Runtime type"
              placeholder="Please select a runtime type"
              rules={[
                {
                  required: true,
                  message: "Please select a runtime type",
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="token"
              label="Token"
              placeholder="Please enter token"
              rules={[
                {
                  required: true,
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormTextArea
              name="remark"
              label="Command"
              // placeholder=""
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
