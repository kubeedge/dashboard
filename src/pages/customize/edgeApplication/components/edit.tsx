import React, { useEffect } from "react";
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-form";
import { Form, Modal, Row, Col, Button, message } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import type { DeptType } from "../data.d";
import { getNamespaces } from "@/services/kubeedge";
import { getList as getNodegroups } from "@/pages/customize/nodeGroup/service";
import yaml from "js-yaml";

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
  values: Partial<DeptType>;
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
    try {
      const params = {
        kind: "EdgeApplication",
        apiVersion: "apps.kubeedge.io/v1alpha1",
        metadata: {
          name: values.name,
          namespace: values.namespace,
        },
        spec: {
          workloadTemplate: {
            manifests: values.workloadTemplate?.map((item: any) => {
              return yaml.load(item.manifests);
            }),
          },
          workloadScope: {
            targetNodeGroups: values.targetNodeGroups?.map((item: any) => {
              return {
                name: item.name,
                overriders: yaml.load(item.overriders),
              };
            }),
          },
        },
      };
      props.onSubmit(params);
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      width={640}
      title="Add EdgeApplication"
      open={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={props.values}
        labelCol={{ span: 5 }}
        labelAlign="left"
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
            <Form.Item
              key={"workloadTemplate"}
              label={"workloadTemplate"}
              colon={false}
            >
              <Form.List name={["workloadTemplate"]}>
                {(fields, { add, remove }) => {
                  return (
                    <Row>
                      {fields.map(
                        (fieldWorkloadTemplate, indexWorkloadTemplate) => (
                          <Col span={24}>
                            <Row gutter={6}>
                              <Col span={22}>
                                <ProFormTextArea
                                  name={[
                                    fieldWorkloadTemplate.name,
                                    "manifests",
                                  ]}
                                  placeholder="manifests yaml"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Missing workloadTemplate manifests yaml",
                                    },
                                  ]}
                                />
                              </Col>
                              <Col span={2}>
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => {
                                    remove(fieldWorkloadTemplate.name);
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
                            <PlusOutlined /> add workloadTemplate
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
              key={"targetNodeGroups"}
              label={"TargetNodeGroups"}
              colon={false}
            >
              <Form.List name={["targetNodeGroups"]}>
                {(fields, { add, remove }) => {
                  return (
                    <Row>
                      {fields.map(
                        (fieldTargetNodeGroup, indexTargetNodeGroup) => (
                          <Col span={24}>
                            <Row gutter={6}>
                              <Col span={22}>
                                <ProFormSelect
                                  name={[fieldTargetNodeGroup.name, "name"]}
                                  placeholder={"name"}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing targetNodeGroups name",
                                    },
                                  ]}
                                  id={`workloadScope-targetNodeGroups-${indexTargetNodeGroup}-name`}
                                  request={(params) =>
                                    getNodegroups().then((res) => {
                                      return (res.items || []).map((item) => ({
                                        label: item.metadata.name,
                                        value: item.metadata.name,
                                      }));
                                    })
                                  }
                                />
                              </Col>
                              <Col span={22}>
                                <ProFormTextArea
                                  name={[
                                    fieldTargetNodeGroup.name,
                                    "overriders",
                                  ]}
                                  placeholder="overriders yaml"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Missing targetNodeGroups overriders yaml",
                                    },
                                  ]}
                                />
                              </Col>
                              <Col span={2}>
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  onClick={() => {
                                    remove(fieldTargetNodeGroup.name);
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
                            <PlusOutlined /> add targetNodeGroups
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
