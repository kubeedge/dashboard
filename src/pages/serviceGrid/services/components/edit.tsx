import React, { useEffect } from "react";
import {
  ProFormText,
  ProFormSelect,
  ProFormDependency,
  ProFormDigit,
} from "@ant-design/pro-form";
import { Form, Modal, Row, Col, Button, Radio } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type { listType } from "../data";
import { getNamespaces } from "@/services/kubeedge";
import { FormList } from "@/pages/edgeResource/deployment/components/DeptDrawer/constants";
import { arrayToObject } from "@/utils/utils";

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
      kind: "Service",
      apiVersion: "v1",
      metadata: {
        name: values.name,
        namespace: values.namespace,
        annotations: arrayToObject(values.annotations || []),
        labels: arrayToObject(values.labels || []),
      },
      spec: {
        selector: arrayToObject(values.selector || []),
        publishNotReadyAddresses: values.publishNotReadyAddresses === "true",
        type: values.type,
        ports: values.ports?.map((item: any) => ({
          ...item,
          port: Number(item.port),
          nodePort: Number(item.nodePort),
          targetPort: Number(item.targetPort),
        })),
        externalIPs: values.externalIPs,
        sessionAffinity: values.sessionAffinity,
        sessionAffinityConfig: {
          clientIP: {
            timeoutSeconds: values.timeoutSeconds,
          },
        },
      },
    };
    props.onSubmit(params);
  };

  return (
    <Modal
      width={720}
      title="Add Service"
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
        labelCol={{ span: 7 }}
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
            <Form.Item label="Annotations">
              <FormList name="annotations" formItemKey="key" value="value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Labels">
              <FormList name="labels" formItemKey="key" value="value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Selector">
              <FormList name="selector" formItemKey="key" value="value" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <ProFormSelect
              name={["publishNotReadyAddresses"]}
              label="PublishNotReadyAddresses"
              placeholder="publishNotReadyAddresses"
              allowClear
              options={[
                {
                  label: "True",
                  value: "true",
                },
                {
                  label: "False",
                  value: "false",
                },
              ]}
            />
          </Col>
          <Col span={24}>
            <Form.Item
              label="Type"
              name={["type"]}
              rules={[
                {
                  required: true,
                  message: "Missing type",
                },
              ]}
            >
              <Radio.Group>
                {TypeEnum.map((item) => {
                  return (
                    <Radio.Button value={item.value}>{item.label}</Radio.Button>
                  );
                })}
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <ProFormDependency name={["type"]}>
              {(depend) => {
                switch (depend?.type) {
                  case "Headless":
                    return (
                      <>
                        <Form.Item
                          name={["ports"]}
                          label={"Ports"}
                          rules={[
                            {
                              required: true,
                              message: "Missing ports",
                            },
                          ]}
                        >
                          <Form.List name={["ports"]}>
                            {(fields, { add, remove }) => {
                              return (
                                <Row>
                                  {fields.map((fieldPort, indexPort) => (
                                    <Col span={24}>
                                      <Row gutter={6}>
                                        <Col span={11}>
                                          <ProFormSelect
                                            name={[fieldPort.name, "protocol"]}
                                            placeholder={"protocol"}
                                            rules={[
                                              {
                                                required: true,
                                                message: "Missing protocol",
                                              },
                                            ]}
                                            options={[
                                              {
                                                label: "TCP",
                                                value: "TCP",
                                              },
                                              {
                                                label: "SCTP",
                                                value: "SCTP",
                                              },
                                              {
                                                label: "UDP",
                                                value: "UDP",
                                              },
                                            ]}
                                          />
                                        </Col>
                                        <Col span={11}>
                                          <ProFormText
                                            name={[fieldPort.name, "name"]}
                                            placeholder="name"
                                          />
                                        </Col>
                                        <Col span={11}>
                                          <ProFormText
                                            name={[fieldPort.name, "port"]}
                                            placeholder="port"
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "Missing containerPort",
                                              },
                                            ]}
                                          />
                                        </Col>
                                        <Col span={11}>
                                          <ProFormText
                                            name={[
                                              fieldPort.name,
                                              "targetPort",
                                            ]}
                                            placeholder="targetPort"
                                          />
                                        </Col>
                                        <Col span={2}>
                                          <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => {
                                              remove(fieldPort.name);
                                            }}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  ))}
                                  <Col span={24}>
                                    <Form.Item style={{ marginBottom: 4 }}>
                                      <Button
                                        type="dashed"
                                        onClick={() => {
                                          add();
                                        }}
                                        style={{ width: "100%" }}
                                      >
                                        <PlusOutlined /> add port
                                      </Button>
                                    </Form.Item>
                                  </Col>
                                </Row>
                              );
                            }}
                          </Form.List>
                        </Form.Item>
                      </>
                    );
                  case "ClusterIP":
                    return (
                      <>
                        <Form.Item
                          name={["ports"]}
                          label={"Ports"}
                          rules={[
                            {
                              required: true,
                              message: "Missing ports",
                            },
                          ]}
                        >
                          <Form.List name={["ports"]}>
                            {(fields, { add, remove }) => {
                              return (
                                <Row>
                                  {fields.map((fieldPort, indexPort) => (
                                    <Col span={24}>
                                      <Row gutter={6}>
                                        <Col span={11}>
                                          <ProFormSelect
                                            name={[fieldPort.name, "protocol"]}
                                            placeholder={"protocol"}
                                            rules={[
                                              {
                                                required: true,
                                                message: "Missing protocol",
                                              },
                                            ]}
                                            options={[
                                              {
                                                label: "TCP",
                                                value: "TCP",
                                              },
                                              {
                                                label: "SCTP",
                                                value: "SCTP",
                                              },
                                              {
                                                label: "UDP",
                                                value: "UDP",
                                              },
                                            ]}
                                          />
                                        </Col>
                                        <Col span={11}>
                                          <ProFormText
                                            name={[fieldPort.name, "name"]}
                                            placeholder="name"
                                          />
                                        </Col>
                                        <Col span={11}>
                                          <ProFormText
                                            name={[fieldPort.name, "port"]}
                                            placeholder="port"
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "Missing containerPort",
                                              },
                                            ]}
                                          />
                                        </Col>
                                        <Col span={11}>
                                          <ProFormText
                                            name={[
                                              fieldPort.name,
                                              "targetPort",
                                            ]}
                                            placeholder="targetPort"
                                          />
                                        </Col>
                                        <Col span={2}>
                                          <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => {
                                              remove(fieldPort.name);
                                            }}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  ))}
                                  <Col span={24}>
                                    <Form.Item style={{ marginBottom: 4 }}>
                                      <Button
                                        type="dashed"
                                        onClick={() => {
                                          add();
                                        }}
                                        style={{ width: "100%" }}
                                      >
                                        <PlusOutlined /> add port
                                      </Button>
                                    </Form.Item>
                                  </Col>
                                </Row>
                              );
                            }}
                          </Form.List>
                        </Form.Item>

                        <ProFormSelect
                          name={["externalIPs"]}
                          label="ExternalIPs"
                          placeholder="Please input externalIPs and enter"
                          fieldProps={{
                            mode: "tags",
                          }}
                          options={[]}
                        />
                        <ProFormSelect
                          name={["sessionAffinity"]}
                          label="SessionAffinity"
                          placeholder={"sessionAffinity"}
                          rules={[
                            {
                              required: true,
                              message: "Missing sessionAffinity",
                            },
                          ]}
                          options={[
                            {
                              label: "None",
                              value: "None",
                            },
                            {
                              label: "ClientIP",
                              value: "ClientIP",
                            },
                          ]}
                        />
                        <ProFormDependency name={["sessionAffinity"]}>
                          {(depend) => {
                            switch (depend?.sessionAffinity) {
                              case "ClientIP":
                                return (
                                  <>
                                    <ProFormDigit
                                      name={"timeoutSeconds"}
                                      label="TimeoutSeconds"
                                      placeholder={"Please input number"}
                                      fieldProps={{ addonAfter: "s" }}
                                      initialValue={10800}
                                      min={1}
                                    />
                                  </>
                                );
                              default:
                                return null;
                            }
                          }}
                        </ProFormDependency>
                      </>
                    );
                  case "NodePort":
                    return (
                      <>
                        <Form.Item
                          name={["ports"]}
                          label={"Ports"}
                          rules={[
                            {
                              required: true,
                              message: "Missing ports",
                            },
                          ]}
                        >
                          <Form.List name={["ports"]}>
                            {(fields, { add, remove }) => {
                              return (
                                <Row>
                                  {fields.map((fieldPort, indexPort) => (
                                    <Col span={24}>
                                      <Row gutter={6}>
                                        <Col span={11}>
                                          <ProFormSelect
                                            name={[fieldPort.name, "protocol"]}
                                            placeholder={"protocol"}
                                            rules={[
                                              {
                                                required: true,
                                                message: "Missing protocol",
                                              },
                                            ]}
                                            options={[
                                              {
                                                label: "TCP",
                                                value: "TCP",
                                              },
                                              {
                                                label: "SCTP",
                                                value: "SCTP",
                                              },
                                              {
                                                label: "UDP",
                                                value: "UDP",
                                              },
                                            ]}
                                          />
                                        </Col>
                                        <Col span={11}>
                                          <ProFormText
                                            name={[fieldPort.name, "name"]}
                                            placeholder="name"
                                          />
                                        </Col>
                                        <Col span={11}>
                                          <ProFormText
                                            name={[fieldPort.name, "port"]}
                                            placeholder="port"
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "Missing containerPort",
                                              },
                                            ]}
                                          />
                                        </Col>
                                        <Col span={11}>
                                          <ProFormText
                                            name={[fieldPort.name, "nodePort"]}
                                            placeholder="nodePort"
                                          />
                                        </Col>
                                        <Col span={11}>
                                          <ProFormText
                                            name={[
                                              fieldPort.name,
                                              "targetPort",
                                            ]}
                                            placeholder="targetPort"
                                          />
                                        </Col>
                                        <Col span={2}>
                                          <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => {
                                              remove(fieldPort.name);
                                            }}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  ))}
                                  <Col span={24}>
                                    <Form.Item style={{ marginBottom: 4 }}>
                                      <Button
                                        type="dashed"
                                        onClick={() => {
                                          add();
                                        }}
                                        style={{ width: "100%" }}
                                      >
                                        <PlusOutlined /> add port
                                      </Button>
                                    </Form.Item>
                                  </Col>
                                </Row>
                              );
                            }}
                          </Form.List>
                        </Form.Item>

                        <ProFormSelect
                          name={["externalIPs"]}
                          label="ExternalIPs"
                          placeholder="Please input externalIPs and enter"
                          fieldProps={{
                            mode: "tags",
                          }}
                          options={[]}
                        />
                        <ProFormSelect
                          name={["sessionAffinity"]}
                          label="SessionAffinity"
                          placeholder={"sessionAffinity"}
                          rules={[
                            {
                              required: true,
                              message: "Missing sessionAffinity",
                            },
                          ]}
                          options={[
                            {
                              label: "None",
                              value: "None",
                            },
                            {
                              label: "ClientIP",
                              value: "ClientIP",
                            },
                          ]}
                        />
                        <ProFormDependency name={["sessionAffinity"]}>
                          {(depend) => {
                            switch (depend?.sessionAffinity) {
                              case "ClientIP":
                                return (
                                  <>
                                    <ProFormDigit
                                      name={"timeoutSeconds"}
                                      label="TimeoutSeconds"
                                      placeholder={"Please input number"}
                                      fieldProps={{ addonAfter: "s" }}
                                      initialValue={10800}
                                      min={1}
                                    />
                                  </>
                                );
                              default:
                                return null;
                            }
                          }}
                        </ProFormDependency>
                      </>
                    );
                  default:
                    return null;
                }
              }}
            </ProFormDependency>
          </Col>
          {/* <Col span={24}>
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
          </Col> */}
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;

const TypeEnum = [
  { label: "ClusterIP", value: "ClusterIP" },
  {
    label: "NodePort",
    value: "NodePort",
  },
  {
    label: "Headless",
    value: "Headless",
  },
];
