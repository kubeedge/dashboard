import React, { useEffect } from "react";
import { ProFormText, ProFormSelect } from "@ant-design/pro-form";
import { Form, Modal, Row, Col, Button } from "antd";
import type { DeptType, listType } from "../data";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { getNamespaces } from "@/services/kubeedge";
import { FormList } from "@/pages/edgeResource/deployment/components/DeptDrawer/constants";
import { arrayToObject } from "@/utils/utils";

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
      kind: "ClusterRole",
      apiVersion: "rbac.authorization.k8s.io/v1",
      metadata: {
        name: values.name,
      },
      rules: values.rules,
      aggregationRule: {
        clusterRoleSelectors: values.clusterRoleSelectors?.map((item: any) => {
          return {
            matchLabels: item.matchLabels
              ? arrayToObject(item.matchLabels)
              : item.matchLabels,
          };
        }),
      },
    };
    props.onSubmit(params as DeptFormValueType);
  };

  return (
    <Modal
      width={940}
      title="Add Clusterrole"
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
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
            <Form.Item key={"rules"} label={"Rules"} colon={false}>
              <Form.List name={["rules"]}>
                {(fields, { add, remove }) => {
                  return (
                    <Row>
                      {fields.map((fieldRules, indexRules) => (
                        <Col span={24}>
                          <Row gutter={6}>
                            <Col span={11}>
                              <ProFormSelect
                                name={[fieldRules.name, "verbs"]}
                                placeholder="Please input verbs and enter"
                                fieldProps={{
                                  mode: "tags",
                                }}
                                options={[]}
                                rules={[
                                  {
                                    validator: async (_, names) => {
                                      if (!names?.length) {
                                        return Promise.reject(
                                          new Error("Verbs cannot be empty")
                                        );
                                      }
                                    },
                                  },
                                ]}
                              />
                            </Col>
                            <Col span={11}>
                              <ProFormSelect
                                name={[fieldRules.name, "apiGroups"]}
                                placeholder="Please input apiGroups and enter"
                                fieldProps={{
                                  mode: "tags",
                                }}
                                options={[]}
                                rules={[
                                  {
                                    validator: async (_, names) => {
                                      if (!names?.length) {
                                        return Promise.reject(
                                          new Error("ApiGroups cannot be empty")
                                        );
                                      }
                                    },
                                  },
                                ]}
                              />
                            </Col>
                            <Col span={11}>
                              <ProFormSelect
                                name={[fieldRules.name, "resources"]}
                                placeholder="Please input resources and enter"
                                fieldProps={{
                                  mode: "tags",
                                }}
                                options={[]}
                                rules={[
                                  {
                                    validator: async (_, names) => {
                                      if (!names?.length) {
                                        return Promise.reject(
                                          new Error("Resources cannot be empty")
                                        );
                                      }
                                    },
                                  },
                                ]}
                              />
                            </Col>
                            <Col span={11}>
                              <ProFormSelect
                                name={[fieldRules.name, "resourceNames"]}
                                placeholder="Please input resourceNames and enter"
                                fieldProps={{
                                  mode: "tags",
                                }}
                                options={[]}
                                rules={[
                                  {
                                    validator: async (_, names) => {
                                      if (!names?.length) {
                                        return Promise.reject(
                                          new Error(
                                            "ResourceNames cannot be empty"
                                          )
                                        );
                                      }
                                    },
                                  },
                                ]}
                              />
                            </Col>
                            <Col span={2}>
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => {
                                  remove(fieldRules.name);
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                      ))}
                      <Col span={24}>
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => {
                              add();
                            }}
                            style={{ width: "100%" }}
                          >
                            <PlusOutlined /> add rules
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }}
              </Form.List>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              key={"clusterRoleSelectors"}
              label={"ClusterRoleSelectors"}
              colon={false}
            >
              <Form.List name={["clusterRoleSelectors"]}>
                {(fields, { add, remove }) => {
                  return (
                    <Row>
                      {fields.map(
                        (
                          fieldClusterRoleSelectors,
                          indexClusterRoleSelectors
                        ) => (
                          <Col span={24}>
                            <Row gutter={6}>
                              <Col span={22}>
                                <FormList
                                  name={[
                                    fieldClusterRoleSelectors.name,
                                    "matchLabels",
                                  ]}
                                  formItemKey="key"
                                  value="value"
                                  addName="matchLabels"
                                />
                              </Col>
                              <Col span={2}>
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => {
                                    remove(fieldClusterRoleSelectors.name);
                                  }}
                                />
                              </Col>
                            </Row>
                          </Col>
                        )
                      )}
                      <Col span={24}>
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => {
                              add();
                            }}
                            style={{ width: "100%" }}
                          >
                            <PlusOutlined /> add clusterRoleSelectors
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }}
              </Form.List>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
