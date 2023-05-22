import React, { useEffect } from "react";
import { ProFormText, ProFormSelect } from "@ant-design/pro-form";
import { Form, Modal, Row, Col } from "antd";
import type { DeptType, listType } from "../data.d";
import { FormList } from "@/pages/edgeResource/deployment/components/DeptDrawer/constants";
import { getNodesList } from "@/pages/edgeResource/nodes/service";
import { arrayToObject } from "@/utils/utils";

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<listType>;
};

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const [form] = Form.useForm();
  const [nodesList, setNodesList] = React.useState<any[]>([]);
  const initNodesList = async () => {
    const nodesListRes = await getNodesList();
    setNodesList(
      (nodesListRes?.items || []).map((item: any) => {
        return { label: item.metadata.name, value: item.metadata.name };
      })
    );
  };
  useEffect(() => {
    initNodesList();
  }, []);

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
      kind: "NodeGroup",
      apiVersion: "apps.kubeedge.io/v1alpha1",
      metadata: {
        name: values.name,
      },
      spec: {
        nodes: values.nodes,
        matchLabels: values.matchLabels
          ? arrayToObject(values.matchLabels)
          : values.matchLabels,
      },
    };
    props.onSubmit(params);
  };

  return (
    <Modal
      width={640}
      title="Add Nodegroup"
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="name"
              label="Name"
              placeholder="Name"
              rules={[
                {
                  required: true,
                  message: "Missing name!",
                },
              ]}
            />
          </Col>
          <Col span={24} order={2}>
            <ProFormSelect
              name={"nodes"}
              options={nodesList}
              label="Nodes"
              placeholder={"Nodes"}
              fieldProps={{
                mode: "multiple",
              }}
              rules={[
                {
                  required: true,
                  message: "Please select namespaces",
                },
              ]}
            />
          </Col>
          <Col span={24} order={3}>
            <Form.Item label="MatchLabels">
              <FormList name="matchLabels" formItemKey="key" value="value" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
