import React, { useEffect } from "react";
import { ProFormText, ProFormSelect } from "@ant-design/pro-form";
import { Form, Modal, Row, Col, Button } from "antd";
import type { DeptType, listType } from "../data";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
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
      kind: "ClusterRoleBinding",
      apiVersion: "rbac.authorization.k8s.io/v1",
      metadata: {
        name: values.name,
      },
      subjects: values.subjects,
      roleRef: {
        kind: values.kind,
        apiGroup: values.apiGroup,
        name: values.rname,
      },
    };
    props.onSubmit(params as DeptFormValueType);
  };

  return (
    <Modal
      width={900}
      title="Add ClusterRoleBinding"
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
            <Form.Item label={"RoleRef"}>
              <Row gutter={6}>
                <Col span={11}>
                  <ProFormText
                    name="kind"
                    placeholder="kind"
                    rules={[
                      {
                        required: true,
                        message: "Missing roleRef kind",
                      },
                    ]}
                  />
                </Col>
                <Col span={11}>
                  <ProFormText
                    name="rname"
                    placeholder="name"
                    rules={[
                      {
                        required: true,
                        message: "Missing roleRef name",
                      },
                    ]}
                  />
                </Col>
                <Col span={11}>
                  <ProFormText name="apiGroup" placeholder="apiGroup" />
                </Col>
              </Row>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item key={"subjects"} label={"Subjects"} colon={false}>
              <Form.List name={["subjects"]}>
                {(fields, { add, remove }) => {
                  return (
                    <Row>
                      {fields.map((fieldSubjects, indexSubjects) => (
                        <Col span={24}>
                          <Row gutter={6}>
                            <Col span={11}>
                              <ProFormText
                                name={[fieldSubjects.name, "kind"]}
                                placeholder="kind"
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing subject kind",
                                  },
                                ]}
                              />
                            </Col>
                            <Col span={11}>
                              <ProFormText
                                name={[fieldSubjects.name, "name"]}
                                placeholder="name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing subject name",
                                  },
                                ]}
                              />
                            </Col>
                            <Col span={11}>
                              <ProFormSelect
                                name={[fieldSubjects.name, "namespace"]}
                                placeholder="Namespace"
                                options={namespacesList}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing subject namespace",
                                  },
                                ]}
                              />
                            </Col>
                            <Col span={2}>
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => {
                                  remove(fieldSubjects.name);
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
                            <PlusOutlined /> add subjects
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
