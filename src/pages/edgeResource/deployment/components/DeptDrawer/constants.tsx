import { Form, FormInstance, Input, InputNumber, Button, Row, Col } from "antd";
import { ProFormSelect } from "@ant-design/pro-form";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./index.less";

export interface FormConfig {
  formItems:
    | React.ReactElement
    | ((
        form: FormInstance,
        options: any,
        record?: any,
        ref?: any
      ) => React.ReactElement);
  getFormValues?: (values: any, options: any[]) => any;
  getInitialValues?: (record: any, options: any[]) => any;
  handleFormValues?: (values: any) => any;
}

export const DEPT_CONFIG: { [key: string]: FormConfig } = {
  "1": {
    formItems: (form: FormInstance, options: any, record?: any) => {
      return (
        <>
          {/* <Form.Item
            label="workloadType"
            name="workloadType"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio.Button value="1">Deployment</Radio.Button>
              <Radio.Button value="2">StatefulSet</Radio.Button>
            </Radio.Group>
          </Form.Item> */}
          <ProFormSelect
            options={options.namespace || []}
            name="namespace"
            label="Namespace"
            placeholder={"Please select namespace"}
            width="xl"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Please input name" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input placeholder="Please input description" />
          </Form.Item>
          <Form.Item label="Annotations" className={styles.formItem}>
            <FormList name="annotations" formItemKey="key" value="value" />
          </Form.Item>
          <Form.Item
            label="Labels"
            className={styles.formItem}
            rules={[{ required: true }]}
          >
            <FormList name="labels" formItemKey="key" value="value" />
          </Form.Item>
          <Form.Item
            label="Replicas"
            name="replicas"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: 120 }} />
          </Form.Item>
        </>
      );
    },
    getFormValues: (values, options) => {
      return values;
    },
  },
};

export const FormList: React.FC<{
  name: string;
  formItemKey: string;
  value: string;
}> = (props) => {
  const { name, formItemKey: key, value } = props;
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => {
        return (
          <Row>
            {fields.map((field, index) => (
              <Col span={12}>
                <Row>
                  <Col span={10}>
                    <Form.Item
                      {...field}
                      name={[field.name, key]}
                      fieldKey={[field.fieldKey, key]}
                      rules={[{ required: true, message: "Missing key" }]}
                    >
                      <Input
                        placeholder="Please input key"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item
                      {...field}
                      name={[field.name, value]}
                      fieldKey={[field.fieldKey, value]}
                      rules={[
                        {
                          required: true,
                          message: "Missing value",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Please input value"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            ))}
            <Col span={fields.length % 2 === 0 ? 24 : 12}>
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ width: "100%" }}
                >
                  <PlusOutlined /> add {name}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        );
      }}
    </Form.List>
  );
};
