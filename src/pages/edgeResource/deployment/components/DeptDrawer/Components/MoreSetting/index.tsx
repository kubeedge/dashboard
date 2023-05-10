import React, { useImperativeHandle, useState, useEffect } from "react";
import {
  Space,
  Button,
  Card,
  Form,
  Slider,
  Input,
  Radio,
  Row,
  Col,
  Checkbox,
} from "antd";
import {
  ProFormSelect,
  ProFormDigit,
  ProFormText,
  ProFormDependency,
} from "@ant-design/pro-form";
import {
  MinusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getNamespaces } from "@/services/kubeedge";
import { FormList } from "../../constants";
import styles from "./index.less";

const MoreSetting = React.forwardRef((props: any, ref) => {
  const { initialValues } = props;
  const form = Form.useForm()[0];
  const [strategyCheck, setStrategyCheck] = useState(undefined);
  const [nodeAffinityCheck, setNodeAffinityCheck] = useState(undefined);
  const [podAffinityCheck, setPodAffinityCheck] = useState(undefined);
  const [podAntiAffinityCheck, setPodAntiAffinityCheck] = useState(undefined);

  const [namespacesList, setNamespacesList] = React.useState<any[]>([]);
  const initNamespacesList = async () => {
    const namespacesListRes = await getNamespaces();
    setNamespacesList(
      (namespacesListRes?.items || []).map((item: any) => {
        return { label: item.metadata.name, value: item.metadata.name };
      })
    );
  };
  useEffect(() => {
    initNamespacesList();
  }, []);

  useImperativeHandle(ref, () => ({
    form,
    getControlState: () => ({
      strategyCheck,
      nodeAffinityCheck,
      podAffinityCheck,
      podAntiAffinityCheck,
    }),
  }));

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setStrategyCheck(
        initialValues.settingControlState?.strategyCheck || false
      );
      setNodeAffinityCheck(
        initialValues.settingControlState?.nodeAffinityCheck || false
      );
      setPodAffinityCheck(
        initialValues.settingControlState?.podAffinityCheck || false
      );
      setPodAntiAffinityCheck(
        initialValues.settingControlState?.podAntiAffinityCheck || false
      );
    }
  }, [initialValues]);

  useEffect(() => {
    if (strategyCheck === false) {
      form.setFieldValue(["strategy"], undefined);
    }
  }, [strategyCheck]);
  useEffect(() => {
    if (nodeAffinityCheck === false) {
      form.setFieldValue(["nodeAffinity"], undefined);
    }
  }, [nodeAffinityCheck]);
  useEffect(() => {
    if (podAffinityCheck === false) {
      form.setFieldValue(["podAffinity"], undefined);
    }
  }, [podAffinityCheck]);
  useEffect(() => {
    if (podAntiAffinityCheck === false) {
      form.setFieldValue(["podAntiAffinity"], undefined);
    }
  }, [podAntiAffinityCheck]);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        labelWrap
        style={{ padding: "68px 0", flex: 1 }}
        labelAlign="left"
      >
        <ProFormText name={["nodeNameForm"]} label="nodeName" />
        <Form.Item label="nodeSelector" className={styles.formItem}>
          <FormList name="nodeSelector" formItemKey="key" value="value" />
        </Form.Item>
        <Form.Item
          className={styles.formItem}
          key={"strategyCheck"}
          label={
            <>
              <Checkbox
                style={{ marginRight: 8 }}
                checked={strategyCheck}
                defaultChecked={strategyCheck}
                onChange={(e) => {
                  setStrategyCheck(e.target.checked);
                }}
              />
              Strategy
            </>
          }
          name={["strategy"]}
          fieldKey={["strategy"]}
        >
          {strategyCheck ? (
            <>
              <ProFormDigit
                name={["minReadySeconds"]}
                label="minReadySeconds"
                placeholder={"Please input number"}
                fieldProps={{ addonAfter: "s" }}
                min={1}
              />

              <ProFormDigit
                name={["progressDeadlineSeconds"]}
                label="progressDeadlineSeconds"
                placeholder={"Please input number"}
                fieldProps={{ addonAfter: "s" }}
                min={1}
              />
              <ProFormDigit
                name={["revisionHistoryLimit"]}
                placeholder={"Please input number"}
                label="revisionHistoryLimit"
                min={1}
              />
              <Form.Item
                label="strategy type"
                name={["strategy", "type"]}
                rules={[
                  {
                    required: true,
                    message: "Missing strategy type",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio.Button value={"RollingUpdate"}>
                    {"RollingUpdate"}
                  </Radio.Button>
                  <Radio.Button value={"Recreate"}>{"Recreate"}</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <ProFormDependency name={[["strategy", "type"]]}>
                {(depend) => {
                  switch (depend?.strategy?.type) {
                    case "RollingUpdate":
                      return (
                        <>
                          <ProFormText
                            name={[
                              "strategy",
                              "rollingUpdate",
                              "maxUnavailable",
                            ]}
                            label="maxUnavailable"
                          />
                          <ProFormText
                            name={["strategy", "rollingUpdate", "maxSurge"]}
                            label="maxSurge"
                          />
                        </>
                      );
                    default:
                      return null;
                  }
                }}
              </ProFormDependency>
            </>
          ) : (
            <div>Set update strategy</div>
          )}
        </Form.Item>

        <Form.Item
          className={styles.formItem}
          key={"nodeAffinityCheck"}
          label={
            <>
              <Checkbox
                style={{ marginRight: 8 }}
                checked={nodeAffinityCheck}
                defaultChecked={nodeAffinityCheck}
                onChange={(e) => {
                  setNodeAffinityCheck(e.target.checked);
                }}
              />
              NodeAffinity
            </>
          }
          name={["nodeAffinity"]}
          fieldKey={["nodeAffinity"]}
        >
          {nodeAffinityCheck ? (
            <>
              <Form.List
                name={[
                  "nodeAffinity",
                  "requiredDuringSchedulingIgnoredDuringExecution",
                ]}
              >
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map((fieldRequired, indexRequired) => (
                        <Form.Item
                          name={[indexRequired, "nodeSelectorTerms"]}
                          rules={[
                            {
                              validator: async (_, names) => {
                                if (
                                  !names?.matchExpressions?.[0]?.key &&
                                  !names?.matchFields?.[0]?.key
                                ) {
                                  return Promise.reject(
                                    new Error("Condition cannot be empty")
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          <Input hidden />
                          <Card
                            title={`Required Condition ${indexRequired + 1}`}
                            extra={
                              <DeleteOutlined
                                className="dynamic-delete-button"
                                style={{ fontSize: 20 }}
                                onClick={() => {
                                  remove(fieldRequired.name);
                                }}
                              />
                            }
                            style={{
                              marginBottom: 16,
                            }}
                            headStyle={{ backgroundColor: "#BFC8D8" }}
                            bodyStyle={{ backgroundColor: "#EAEDF2" }}
                          >
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldRequired.name,
                                  "nodeSelectorTerms",
                                  "matchExpressions",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map(
                                        (
                                          fieldMatchExpressions,
                                          indexMatchExpressions
                                        ) => (
                                          <Row gutter={6}>
                                            <Col span={11}>
                                              <ProFormText
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "key",
                                                ]}
                                                placeholder={"key"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: "Please input key",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <Col span={11}>
                                              <ProFormSelect
                                                colSize={11}
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ]}
                                                placeholder={"operator"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Please select operator",
                                                  },
                                                ]}
                                                options={[
                                                  { label: "In", value: "In" },
                                                  {
                                                    label: "NotIn",
                                                    value: "NotIn",
                                                  },
                                                  {
                                                    label: "Greater than",
                                                    value: "Gt",
                                                  },
                                                  {
                                                    label: "Less than",
                                                    value: "Lt",
                                                  },
                                                  {
                                                    label: "Exists",
                                                    value: "Exists",
                                                  },
                                                  {
                                                    label: "DoesNotExist",
                                                    value: "DoesNotExist",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <ProFormDependency
                                              name={[
                                                [
                                                  "nodeAffinity",
                                                  "requiredDuringSchedulingIgnoredDuringExecution",
                                                  fieldRequired.name,
                                                  "nodeSelectorTerms",
                                                  "matchExpressions",
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ],
                                              ]}
                                            >
                                              {(depend) => {
                                                const operator =
                                                  depend?.nodeAffinity
                                                    ?.requiredDuringSchedulingIgnoredDuringExecution?.[
                                                    fieldRequired.name
                                                  ]?.nodeSelectorTerms
                                                    ?.matchExpressions?.[
                                                    fieldMatchExpressions.name
                                                  ]?.operator;
                                                switch (operator) {
                                                  case "In":
                                                  case "NotIn":
                                                  case "Gt":
                                                  case "Lt":
                                                    return (
                                                      <ProFormSelect
                                                        name={[
                                                          fieldMatchExpressions.name,
                                                          "values",
                                                        ]}
                                                        placeholder="Please input values and enter"
                                                        fieldProps={{
                                                          mode: "tags",
                                                        }}
                                                        style={{
                                                          width: "319px",
                                                          padding: "0 3px",
                                                        }}
                                                        options={[]}
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message:
                                                              "Please input values and enter",
                                                          },
                                                        ]}
                                                      />
                                                    );
                                                  case "Exists":
                                                  case "DoesNotExist":
                                                  default:
                                                    form.setFieldValue(
                                                      [
                                                        "nodeAffinity",
                                                        "requiredDuringSchedulingIgnoredDuringExecution",
                                                        fieldRequired.name,
                                                        "nodeSelectorTerms",
                                                        "matchExpressions",
                                                        fieldMatchExpressions.name,
                                                        "values",
                                                      ],
                                                      undefined
                                                    );
                                                    return null;
                                                }
                                              }}
                                            </ProFormDependency>
                                            <Col span={2}>
                                              <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                  remove(
                                                    fieldMatchExpressions.name
                                                  );
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchExpressions
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldRequired.name,
                                  "nodeSelectorTerms",
                                  "matchFields",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map(
                                        (
                                          fieldMatchFields,
                                          indexMatchFields
                                        ) => (
                                          <Row gutter={6}>
                                            <Col span={11}>
                                              <ProFormText
                                                name={[
                                                  fieldMatchFields.name,
                                                  "key",
                                                ]}
                                                placeholder={"key"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: "Please input key",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <Col span={11}>
                                              <ProFormSelect
                                                colSize={11}
                                                name={[
                                                  fieldMatchFields.name,
                                                  "operator",
                                                ]}
                                                placeholder={"operator"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Please select operator",
                                                  },
                                                ]}
                                                options={[
                                                  { label: "In", value: "In" },
                                                  {
                                                    label: "NotIn",
                                                    value: "NotIn",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <Col span={11}>
                                              <ProFormSelect
                                                name={[
                                                  fieldMatchFields.name,
                                                  "values",
                                                ]}
                                                placeholder="Please input values and enter"
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Please input values and enter",
                                                  },
                                                ]}
                                                fieldProps={{
                                                  mode: "tags",
                                                }}
                                                options={[]}
                                              />
                                            </Col>
                                            <Col span={2}>
                                              <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                  remove(fieldMatchFields.name);
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchFields
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                          </Card>
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{
                            width: "100%",
                            fontSize: 16,
                            color: "#1890ff",
                          }}
                        >
                          <PlusOutlined /> add condition which is required
                          during scheduling and ignored during execution
                        </Button>
                      </Form.Item>
                    </>
                  );
                }}
              </Form.List>
              <Form.List
                name={[
                  "nodeAffinity",
                  "preferredDuringSchedulingIgnoredDuringExecution",
                ]}
              >
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map((fieldPreferred, indexPreferred) => (
                        <Form.Item
                          name={[indexPreferred, "preference"]}
                          rules={[
                            {
                              validator: async (_, names) => {
                                if (
                                  !names?.matchExpressions?.[0]?.key &&
                                  !names?.matchFields?.[0]?.key
                                ) {
                                  return Promise.reject(
                                    new Error("Condition cannot be empty")
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          <Input hidden />
                          <Card
                            title={`Preferred Condition ${indexPreferred + 1}`}
                            extra={
                              <DeleteOutlined
                                className="dynamic-delete-button"
                                style={{ fontSize: 20 }}
                                onClick={() => {
                                  remove(fieldPreferred.name);
                                }}
                              />
                            }
                            style={{
                              marginBottom: 16,
                            }}
                            headStyle={{ backgroundColor: "#BFC8D8" }}
                            bodyStyle={{ backgroundColor: "#EAEDF2" }}
                          >
                            <Form.Item
                              name={[fieldPreferred.name, "weight"]}
                              label="Weight"
                              initialValue={50}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing weight",
                                },
                              ]}
                            >
                              <Slider min={1} max={100} defaultValue={50} />
                            </Form.Item>
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldPreferred.name,
                                  "preference",
                                  "matchExpressions",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map(
                                        (
                                          fieldMatchExpressions,
                                          indexMatchExpressions
                                        ) => (
                                          <Row gutter={6}>
                                            <Col span={11}>
                                              <ProFormText
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "key",
                                                ]}
                                                placeholder={"key"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: "Please input key",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <Col span={11}>
                                              <ProFormSelect
                                                colSize={11}
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ]}
                                                placeholder={"operator"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Please select operator",
                                                  },
                                                ]}
                                                options={[
                                                  { label: "In", value: "In" },
                                                  {
                                                    label: "NotIn",
                                                    value: "NotIn",
                                                  },
                                                  {
                                                    label: "Greater than",
                                                    value: "Gt",
                                                  },
                                                  {
                                                    label: "Less than",
                                                    value: "Lt",
                                                  },
                                                  {
                                                    label: "Exists",
                                                    value: "Exists",
                                                  },
                                                  {
                                                    label: "DoesNotExist",
                                                    value: "DoesNotExist",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <ProFormDependency
                                              name={[
                                                [
                                                  "nodeAffinity",
                                                  "preferredDuringSchedulingIgnoredDuringExecution",
                                                  fieldPreferred.name,
                                                  "preference",
                                                  "matchExpressions",
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ],
                                              ]}
                                            >
                                              {(depend) => {
                                                const operator =
                                                  depend?.nodeAffinity
                                                    ?.preferredDuringSchedulingIgnoredDuringExecution?.[
                                                    fieldPreferred.name
                                                  ]?.preference
                                                    ?.matchExpressions?.[
                                                    fieldMatchExpressions.name
                                                  ]?.operator;
                                                switch (operator) {
                                                  case "In":
                                                  case "NotIn":
                                                  case "Gt":
                                                  case "Lt":
                                                    return (
                                                      <ProFormSelect
                                                        name={[
                                                          fieldMatchExpressions.name,
                                                          "values",
                                                        ]}
                                                        placeholder="Please input values and enter"
                                                        fieldProps={{
                                                          mode: "tags",
                                                        }}
                                                        style={{
                                                          width: "319px",
                                                          padding: "0 3px",
                                                        }}
                                                        options={[]}
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message:
                                                              "Please input values and enter",
                                                          },
                                                        ]}
                                                      />
                                                    );
                                                  case "Exists":
                                                  case "DoesNotExist":
                                                  default:
                                                    form.setFieldValue(
                                                      [
                                                        "nodeAffinity",
                                                        "preferredDuringSchedulingIgnoredDuringExecution",
                                                        fieldPreferred.name,
                                                        "preference",
                                                        "matchExpressions",
                                                        fieldMatchExpressions.name,
                                                        "values",
                                                      ],
                                                      undefined
                                                    );
                                                    return null;
                                                }
                                              }}
                                            </ProFormDependency>
                                            <Col span={2}>
                                              <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                  remove(
                                                    fieldMatchExpressions.name
                                                  );
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchExpressions
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldPreferred.name,
                                  "preference",
                                  "matchFields",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map(
                                        (
                                          fieldMatchFields,
                                          indexMatchFields
                                        ) => (
                                          <Row gutter={6}>
                                            <Col span={11}>
                                              <ProFormText
                                                name={[
                                                  fieldMatchFields.name,
                                                  "key",
                                                ]}
                                                placeholder={"key"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: "Please input key",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <Col span={11}>
                                              <ProFormSelect
                                                colSize={11}
                                                name={[
                                                  fieldMatchFields.name,
                                                  "operator",
                                                ]}
                                                placeholder={"operator"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Please select operator",
                                                  },
                                                ]}
                                                options={[
                                                  { label: "In", value: "In" },
                                                  {
                                                    label: "NotIn",
                                                    value: "NotIn",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <Col span={11}>
                                              <ProFormSelect
                                                name={[
                                                  fieldMatchFields.name,
                                                  "values",
                                                ]}
                                                placeholder="Please input values and enter"
                                                fieldProps={{
                                                  mode: "tags",
                                                }}
                                                options={[]}
                                              />
                                            </Col>
                                            <Col span={2}>
                                              <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                  remove(fieldMatchFields.name);
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchFields
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                          </Card>
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{
                            width: "100%",
                            fontSize: 16,
                            color: "#1890ff",
                          }}
                        >
                          <PlusOutlined /> add condition which is preferred
                          during scheduling and ignored during execution
                        </Button>
                      </Form.Item>
                    </>
                  );
                }}
              </Form.List>
            </>
          ) : (
            <div>Set nodeAffinity</div>
          )}
        </Form.Item>

        <Form.Item
          className={styles.formItem}
          key={"podAffinityCheck"}
          label={
            <>
              <Checkbox
                style={{ marginRight: 8 }}
                checked={podAffinityCheck}
                defaultChecked={podAffinityCheck}
                onChange={(e) => {
                  setPodAffinityCheck(e.target.checked);
                }}
              />
              PodAffinity
            </>
          }
          name={["podAffinity"]}
          fieldKey={["podAffinity"]}
        >
          {podAffinityCheck ? (
            <>
              <Form.List
                name={[
                  "podAffinity",
                  "requiredDuringSchedulingIgnoredDuringExecution",
                ]}
              >
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map((fieldRequired, indexRequired) => (
                        <Form.Item
                          name={[indexRequired, "labelSelector"]}
                          rules={[
                            {
                              validator: async (_, names) => {
                                if (
                                  !names?.matchExpressions?.[0]?.key &&
                                  !names?.matchLabels?.[0]?.key
                                ) {
                                  return Promise.reject(
                                    new Error("Condition cannot be empty")
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          <Input hidden />
                          <Card
                            title={`Required Condition ${indexRequired + 1}`}
                            extra={
                              <DeleteOutlined
                                className="dynamic-delete-button"
                                style={{ fontSize: 20 }}
                                onClick={() => {
                                  remove(fieldRequired.name);
                                }}
                              />
                            }
                            actions={[
                              <Row gutter={6} style={{ margin: "0 4px" }}>
                                <Col span={12}>
                                  <ProFormSelect
                                    name={[fieldRequired.name, "namespaces"]}
                                    options={namespacesList}
                                    label="Namespaces"
                                    placeholder={"Namespaces"}
                                    width="xl"
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
                                <Col span={12}>
                                  <ProFormText
                                    name={[fieldRequired.name, "topologyKey"]}
                                    placeholder={"topologyKey"}
                                    label="TopologyKey"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input topologyKey",
                                      },
                                    ]}
                                  />
                                </Col>
                              </Row>,
                            ]}
                            style={{
                              marginBottom: 16,
                            }}
                            headStyle={{ backgroundColor: "#BFC8D8" }}
                            bodyStyle={{ backgroundColor: "#EAEDF2" }}
                          >
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldRequired.name,
                                  "labelSelector",
                                  "matchLabels",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map((fieldMatchLabels, _) => (
                                        <Row gutter={6}>
                                          <Col span={11}>
                                            <ProFormText
                                              name={[
                                                fieldMatchLabels.name,
                                                "key",
                                              ]}
                                              placeholder={"key"}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Please input key",
                                                },
                                              ]}
                                            />
                                          </Col>
                                          <Col span={11}>
                                            <ProFormText
                                              name={[
                                                fieldMatchLabels.name,
                                                "value",
                                              ]}
                                              placeholder={"value"}
                                            />
                                          </Col>
                                          <Col span={2}>
                                            <MinusCircleOutlined
                                              className="dynamic-delete-button"
                                              onClick={() => {
                                                remove(fieldMatchLabels.name);
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                      ))}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchLabels
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldRequired.name,
                                  "labelSelector",
                                  "matchExpressions",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map(
                                        (
                                          fieldMatchExpressions,
                                          indexMatchExpressions
                                        ) => (
                                          <Row gutter={6}>
                                            <Col span={11}>
                                              <ProFormText
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "key",
                                                ]}
                                                placeholder={"key"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: "Please input key",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <Col span={11}>
                                              <ProFormSelect
                                                colSize={11}
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ]}
                                                placeholder={"operator"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Please select operator",
                                                  },
                                                ]}
                                                options={[
                                                  { label: "In", value: "In" },
                                                  {
                                                    label: "NotIn",
                                                    value: "NotIn",
                                                  },
                                                  {
                                                    label: "Exists",
                                                    value: "Exists",
                                                  },
                                                  {
                                                    label: "DoesNotExist",
                                                    value: "DoesNotExist",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <ProFormDependency
                                              name={[
                                                [
                                                  "podAffinity",
                                                  "requiredDuringSchedulingIgnoredDuringExecution",
                                                  fieldRequired.name,
                                                  "labelSelector",
                                                  "matchExpressions",
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ],
                                              ]}
                                            >
                                              {(depend) => {
                                                const operator =
                                                  depend?.podAffinity
                                                    ?.requiredDuringSchedulingIgnoredDuringExecution?.[
                                                    fieldRequired.name
                                                  ]?.labelSelector
                                                    ?.matchExpressions?.[
                                                    fieldMatchExpressions.name
                                                  ]?.operator;
                                                switch (operator) {
                                                  case "In":
                                                  case "NotIn":
                                                  case "Gt":
                                                  case "Lt":
                                                    return (
                                                      <ProFormSelect
                                                        name={[
                                                          fieldMatchExpressions.name,
                                                          "values",
                                                        ]}
                                                        placeholder="Please input values and enter"
                                                        fieldProps={{
                                                          mode: "tags",
                                                        }}
                                                        style={{
                                                          width: "319px",
                                                          padding: "0 3px",
                                                        }}
                                                        options={[]}
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message:
                                                              "Please input values and enter",
                                                          },
                                                        ]}
                                                      />
                                                    );
                                                  case "Exists":
                                                  case "DoesNotExist":
                                                  default:
                                                    form.setFieldValue(
                                                      [
                                                        "podAffinity",
                                                        "requiredDuringSchedulingIgnoredDuringExecution",
                                                        fieldRequired.name,
                                                        "labelSelector",
                                                        "matchExpressions",
                                                        fieldMatchExpressions.name,
                                                        "values",
                                                      ],
                                                      undefined
                                                    );
                                                    return null;
                                                }
                                              }}
                                            </ProFormDependency>
                                            <Col span={2}>
                                              <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                  remove(
                                                    fieldMatchExpressions.name
                                                  );
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchExpressions
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                          </Card>
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{
                            width: "100%",
                            fontSize: 16,
                            color: "#1890ff",
                          }}
                        >
                          <PlusOutlined /> add condition which is required
                          during scheduling and ignored during execution
                        </Button>
                      </Form.Item>
                    </>
                  );
                }}
              </Form.List>
              <Form.List
                name={[
                  "podAffinity",
                  "preferredDuringSchedulingIgnoredDuringExecution",
                ]}
              >
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map((fieldPreferred, indexPreferred) => (
                        <Form.Item
                          name={[
                            indexPreferred,
                            "podAffinityTerm",
                            "labelSelector",
                          ]}
                          rules={[
                            {
                              validator: async (_, names) => {
                                if (
                                  !names?.matchExpressions?.[0]?.key &&
                                  !names?.matchLabels?.[0]?.key
                                ) {
                                  return Promise.reject(
                                    new Error("Condition cannot be empty")
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          <Input hidden />
                          <Card
                            title={`Preferred Condition ${indexPreferred + 1}`}
                            extra={
                              <DeleteOutlined
                                className="dynamic-delete-button"
                                style={{ fontSize: 20 }}
                                onClick={() => {
                                  remove(fieldPreferred.name);
                                }}
                              />
                            }
                            actions={[
                              <Row
                                gutter={6}
                                style={{
                                  margin: "0 4px",
                                }}
                              >
                                <Col span={12}>
                                  <ProFormSelect
                                    name={[
                                      fieldPreferred.name,
                                      "podAffinityTerm",
                                      "namespaces",
                                    ]}
                                    options={namespacesList}
                                    label="Namespaces"
                                    placeholder={"Namespaces"}
                                    width="xl"
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
                                <Col span={12}>
                                  <ProFormText
                                    name={[
                                      fieldPreferred.name,
                                      "podAffinityTerm",
                                      "topologyKey",
                                    ]}
                                    placeholder={"topologyKey"}
                                    label="TopologyKey"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input topologyKey",
                                      },
                                    ]}
                                  />
                                </Col>
                              </Row>,
                            ]}
                            style={{
                              marginBottom: 16,
                            }}
                            headStyle={{ backgroundColor: "#BFC8D8" }}
                            bodyStyle={{ backgroundColor: "#EAEDF2" }}
                          >
                            <Form.Item
                              name={[fieldPreferred.name, "weight"]}
                              label="Weight"
                              initialValue={50}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing weight",
                                },
                              ]}
                            >
                              <Slider min={1} max={100} defaultValue={50} />
                            </Form.Item>
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldPreferred.name,
                                  "podAffinityTerm",
                                  "labelSelector",
                                  "matchLabels",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map((fieldMatchLabels, _) => (
                                        <Row gutter={6}>
                                          <Col span={11}>
                                            <ProFormText
                                              name={[
                                                fieldMatchLabels.name,
                                                "key",
                                              ]}
                                              placeholder={"key"}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Please input key",
                                                },
                                              ]}
                                            />
                                          </Col>
                                          <Col span={11}>
                                            <ProFormText
                                              name={[
                                                fieldMatchLabels.name,
                                                "value",
                                              ]}
                                              placeholder={"value"}
                                            />
                                          </Col>
                                          <Col span={2}>
                                            <MinusCircleOutlined
                                              className="dynamic-delete-button"
                                              onClick={() => {
                                                remove(fieldMatchLabels.name);
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                      ))}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchLabels
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldPreferred.name,
                                  "podAffinityTerm",
                                  "labelSelector",
                                  "matchExpressions",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map(
                                        (
                                          fieldMatchExpressions,
                                          indexMatchExpressions
                                        ) => (
                                          <Row gutter={6}>
                                            <Col span={11}>
                                              <ProFormText
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "key",
                                                ]}
                                                placeholder={"key"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: "Please input key",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <Col span={11}>
                                              <ProFormSelect
                                                colSize={11}
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ]}
                                                placeholder={"operator"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Please select operator",
                                                  },
                                                ]}
                                                options={[
                                                  { label: "In", value: "In" },
                                                  {
                                                    label: "NotIn",
                                                    value: "NotIn",
                                                  },
                                                  {
                                                    label: "Exists",
                                                    value: "Exists",
                                                  },
                                                  {
                                                    label: "DoesNotExist",
                                                    value: "DoesNotExist",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <ProFormDependency
                                              name={[
                                                [
                                                  "podAffinity",
                                                  "preferredDuringSchedulingIgnoredDuringExecution",
                                                  fieldPreferred.name,
                                                  "podAffinityTerm",
                                                  "labelSelector",
                                                  "matchExpressions",
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ],
                                              ]}
                                            >
                                              {(depend) => {
                                                const operator =
                                                  depend?.podAffinity
                                                    ?.preferredDuringSchedulingIgnoredDuringExecution?.[
                                                    fieldPreferred.name
                                                  ]?.podAffinityTerm
                                                    ?.labelSelector
                                                    ?.matchExpressions?.[
                                                    fieldMatchExpressions.name
                                                  ]?.operator;
                                                switch (operator) {
                                                  case "In":
                                                  case "NotIn":
                                                  case "Gt":
                                                  case "Lt":
                                                    return (
                                                      <ProFormSelect
                                                        name={[
                                                          fieldMatchExpressions.name,
                                                          "values",
                                                        ]}
                                                        placeholder="Please input values and enter"
                                                        fieldProps={{
                                                          mode: "tags",
                                                        }}
                                                        style={{
                                                          width: "319px",
                                                          padding: "0 3px",
                                                        }}
                                                        options={[]}
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message:
                                                              "Please input values and enter",
                                                          },
                                                        ]}
                                                      />
                                                    );
                                                  case "Exists":
                                                  case "DoesNotExist":
                                                  default:
                                                    form.setFieldValue(
                                                      [
                                                        "podAffinity",
                                                        "preferredDuringSchedulingIgnoredDuringExecution",
                                                        fieldPreferred.name,
                                                        "podAffinityTerm",
                                                        "labelSelector",
                                                        "matchExpressions",
                                                        fieldMatchExpressions.name,
                                                        "values",
                                                      ],
                                                      undefined
                                                    );
                                                    return null;
                                                }
                                              }}
                                            </ProFormDependency>
                                            <Col span={2}>
                                              <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                  remove(
                                                    fieldMatchExpressions.name
                                                  );
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchExpressions
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                          </Card>
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{
                            width: "100%",
                            fontSize: 16,
                            color: "#1890ff",
                          }}
                        >
                          <PlusOutlined /> add condition which is preferred
                          during scheduling and ignored during execution
                        </Button>
                      </Form.Item>
                    </>
                  );
                }}
              </Form.List>
            </>
          ) : (
            <div>Set podAffinity</div>
          )}
        </Form.Item>

        <Form.Item
          className={styles.formItem}
          key={"podAntiAffinityCheck"}
          label={
            <>
              <Checkbox
                style={{ marginRight: 8 }}
                checked={podAntiAffinityCheck}
                defaultChecked={podAntiAffinityCheck}
                onChange={(e) => {
                  setPodAntiAffinityCheck(e.target.checked);
                }}
              />
              PodAntiAffinity
            </>
          }
          name={["podAntiAffinity"]}
          fieldKey={["podAntiAffinity"]}
        >
          {podAntiAffinityCheck ? (
            <>
              <Form.List
                name={[
                  "podAntiAffinity",
                  "requiredDuringSchedulingIgnoredDuringExecution",
                ]}
              >
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map((fieldRequired, indexRequired) => (
                        <Form.Item
                          name={[indexRequired, "labelSelector"]}
                          rules={[
                            {
                              validator: async (_, names) => {
                                if (
                                  !names?.matchExpressions?.[0]?.key &&
                                  !names?.matchLabels?.[0]?.key
                                ) {
                                  return Promise.reject(
                                    new Error("Condition cannot be empty")
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          <Input hidden />
                          <Card
                            title={`Required Condition ${indexRequired + 1}`}
                            extra={
                              <DeleteOutlined
                                className="dynamic-delete-button"
                                style={{ fontSize: 20 }}
                                onClick={() => {
                                  remove(fieldRequired.name);
                                }}
                              />
                            }
                            actions={[
                              <Row gutter={6} style={{ margin: "0 4px" }}>
                                <Col span={12}>
                                  <ProFormSelect
                                    name={[fieldRequired.name, "namespaces"]}
                                    options={namespacesList}
                                    label="Namespaces"
                                    placeholder={"Namespaces"}
                                    width="xl"
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
                                <Col span={12}>
                                  <ProFormText
                                    name={[fieldRequired.name, "topologyKey"]}
                                    placeholder={"topologyKey"}
                                    label="TopologyKey"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input topologyKey",
                                      },
                                    ]}
                                  />
                                </Col>
                              </Row>,
                            ]}
                            style={{
                              marginBottom: 16,
                            }}
                            headStyle={{ backgroundColor: "#BFC8D8" }}
                            bodyStyle={{ backgroundColor: "#EAEDF2" }}
                          >
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldRequired.name,
                                  "labelSelector",
                                  "matchLabels",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map((fieldMatchLabels, _) => (
                                        <Row gutter={6}>
                                          <Col span={11}>
                                            <ProFormText
                                              name={[
                                                fieldMatchLabels.name,
                                                "key",
                                              ]}
                                              placeholder={"key"}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Please input key",
                                                },
                                              ]}
                                            />
                                          </Col>
                                          <Col span={11}>
                                            <ProFormText
                                              name={[
                                                fieldMatchLabels.name,
                                                "value",
                                              ]}
                                              placeholder={"value"}
                                            />
                                          </Col>
                                          <Col span={2}>
                                            <MinusCircleOutlined
                                              className="dynamic-delete-button"
                                              onClick={() => {
                                                remove(fieldMatchLabels.name);
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                      ))}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchLabels
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldRequired.name,
                                  "labelSelector",
                                  "matchExpressions",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map(
                                        (
                                          fieldMatchExpressions,
                                          indexMatchExpressions
                                        ) => (
                                          <Row gutter={6}>
                                            <Col span={11}>
                                              <ProFormText
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "key",
                                                ]}
                                                placeholder={"key"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: "Please input key",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <Col span={11}>
                                              <ProFormSelect
                                                colSize={11}
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ]}
                                                placeholder={"operator"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Please select operator",
                                                  },
                                                ]}
                                                options={[
                                                  { label: "In", value: "In" },
                                                  {
                                                    label: "NotIn",
                                                    value: "NotIn",
                                                  },
                                                  {
                                                    label: "Exists",
                                                    value: "Exists",
                                                  },
                                                  {
                                                    label: "DoesNotExist",
                                                    value: "DoesNotExist",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <ProFormDependency
                                              name={[
                                                [
                                                  "podAntiAffinity",
                                                  "requiredDuringSchedulingIgnoredDuringExecution",
                                                  fieldRequired.name,
                                                  "labelSelector",
                                                  "matchExpressions",
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ],
                                              ]}
                                            >
                                              {(depend) => {
                                                const operator =
                                                  depend?.podAntiAffinity
                                                    ?.requiredDuringSchedulingIgnoredDuringExecution?.[
                                                    fieldRequired.name
                                                  ]?.labelSelector
                                                    ?.matchExpressions?.[
                                                    fieldMatchExpressions.name
                                                  ]?.operator;
                                                switch (operator) {
                                                  case "In":
                                                  case "NotIn":
                                                  case "Gt":
                                                  case "Lt":
                                                    return (
                                                      <ProFormSelect
                                                        name={[
                                                          fieldMatchExpressions.name,
                                                          "values",
                                                        ]}
                                                        placeholder="Please input values and enter"
                                                        fieldProps={{
                                                          mode: "tags",
                                                        }}
                                                        style={{
                                                          width: "319px",
                                                          padding: "0 3px",
                                                        }}
                                                        options={[]}
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message:
                                                              "Please input values and enter",
                                                          },
                                                        ]}
                                                      />
                                                    );
                                                  case "Exists":
                                                  case "DoesNotExist":
                                                  default:
                                                    form.setFieldValue(
                                                      [
                                                        "podAntiAffinity",
                                                        "requiredDuringSchedulingIgnoredDuringExecution",
                                                        fieldRequired.name,
                                                        "labelSelector",
                                                        "matchExpressions",
                                                        fieldMatchExpressions.name,
                                                        "values",
                                                      ],
                                                      undefined
                                                    );
                                                    return null;
                                                }
                                              }}
                                            </ProFormDependency>
                                            <Col span={2}>
                                              <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                  remove(
                                                    fieldMatchExpressions.name
                                                  );
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchExpressions
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                          </Card>
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{
                            width: "100%",
                            fontSize: 16,
                            color: "#1890ff",
                          }}
                        >
                          <PlusOutlined /> add condition which is required
                          during scheduling and ignored during execution
                        </Button>
                      </Form.Item>
                    </>
                  );
                }}
              </Form.List>
              <Form.List
                name={[
                  "podAntiAffinity",
                  "preferredDuringSchedulingIgnoredDuringExecution",
                ]}
              >
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map((fieldPreferred, indexPreferred) => (
                        <Form.Item
                          name={[
                            indexPreferred,
                            "podAffinityTerm",
                            "labelSelector",
                          ]}
                          rules={[
                            {
                              validator: async (_, names) => {
                                if (
                                  !names?.matchExpressions?.[0]?.key &&
                                  !names?.matchLabels?.[0]?.key
                                ) {
                                  return Promise.reject(
                                    new Error("Condition cannot be empty")
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          <Input hidden />
                          <Card
                            title={`Preferred Condition ${indexPreferred + 1}`}
                            extra={
                              <DeleteOutlined
                                className="dynamic-delete-button"
                                style={{ fontSize: 20 }}
                                onClick={() => {
                                  remove(fieldPreferred.name);
                                }}
                              />
                            }
                            actions={[
                              <Row
                                gutter={6}
                                style={{
                                  margin: "0 4px",
                                }}
                              >
                                <Col span={12}>
                                  <ProFormSelect
                                    name={[
                                      fieldPreferred.name,
                                      "podAffinityTerm",
                                      "namespaces",
                                    ]}
                                    options={namespacesList}
                                    label="Namespaces"
                                    placeholder={"Namespaces"}
                                    width="xl"
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
                                <Col span={12}>
                                  <ProFormText
                                    name={[
                                      fieldPreferred.name,
                                      "podAffinityTerm",
                                      "topologyKey",
                                    ]}
                                    placeholder={"topologyKey"}
                                    label="TopologyKey"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input topologyKey",
                                      },
                                    ]}
                                  />
                                </Col>
                              </Row>,
                            ]}
                            style={{
                              marginBottom: 16,
                            }}
                            headStyle={{ backgroundColor: "#BFC8D8" }}
                            bodyStyle={{ backgroundColor: "#EAEDF2" }}
                          >
                            <Form.Item
                              name={[fieldPreferred.name, "weight"]}
                              label="Weight"
                              initialValue={50}
                              rules={[
                                {
                                  required: true,
                                  message: "Missing weight",
                                },
                              ]}
                            >
                              <Slider min={1} max={100} defaultValue={50} />
                            </Form.Item>
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldPreferred.name,
                                  "podAffinityTerm",
                                  "labelSelector",
                                  "matchLabels",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map((fieldMatchLabels, _) => (
                                        <Row gutter={6}>
                                          <Col span={11}>
                                            <ProFormText
                                              name={[
                                                fieldMatchLabels.name,
                                                "key",
                                              ]}
                                              placeholder={"key"}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Please input key",
                                                },
                                              ]}
                                            />
                                          </Col>
                                          <Col span={11}>
                                            <ProFormText
                                              name={[
                                                fieldMatchLabels.name,
                                                "value",
                                              ]}
                                              placeholder={"value"}
                                            />
                                          </Col>
                                          <Col span={2}>
                                            <MinusCircleOutlined
                                              className="dynamic-delete-button"
                                              onClick={() => {
                                                remove(fieldMatchLabels.name);
                                              }}
                                            />
                                          </Col>
                                        </Row>
                                      ))}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchLabels
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                            <Card type="inner" style={{ marginBottom: 16 }}>
                              <Form.List
                                name={[
                                  fieldPreferred.name,
                                  "podAffinityTerm",
                                  "labelSelector",
                                  "matchExpressions",
                                ]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <>
                                      {fields.map(
                                        (
                                          fieldMatchExpressions,
                                          indexMatchExpressions
                                        ) => (
                                          <Row gutter={6}>
                                            <Col span={11}>
                                              <ProFormText
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "key",
                                                ]}
                                                placeholder={"key"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: "Please input key",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <Col span={11}>
                                              <ProFormSelect
                                                colSize={11}
                                                name={[
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ]}
                                                placeholder={"operator"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Please select operator",
                                                  },
                                                ]}
                                                options={[
                                                  { label: "In", value: "In" },
                                                  {
                                                    label: "NotIn",
                                                    value: "NotIn",
                                                  },
                                                  {
                                                    label: "Exists",
                                                    value: "Exists",
                                                  },
                                                  {
                                                    label: "DoesNotExist",
                                                    value: "DoesNotExist",
                                                  },
                                                ]}
                                              />
                                            </Col>
                                            <ProFormDependency
                                              name={[
                                                [
                                                  "podAntiAffinity",
                                                  "preferredDuringSchedulingIgnoredDuringExecution",
                                                  fieldPreferred.name,
                                                  "podAffinityTerm",
                                                  "labelSelector",
                                                  "matchExpressions",
                                                  fieldMatchExpressions.name,
                                                  "operator",
                                                ],
                                              ]}
                                            >
                                              {(depend) => {
                                                const operator =
                                                  depend?.podAntiAffinity
                                                    ?.preferredDuringSchedulingIgnoredDuringExecution?.[
                                                    fieldPreferred.name
                                                  ]?.podAffinityTerm
                                                    ?.labelSelector
                                                    ?.matchExpressions?.[
                                                    fieldMatchExpressions.name
                                                  ]?.operator;
                                                switch (operator) {
                                                  case "In":
                                                  case "NotIn":
                                                  case "Gt":
                                                  case "Lt":
                                                    return (
                                                      <ProFormSelect
                                                        name={[
                                                          fieldMatchExpressions.name,
                                                          "values",
                                                        ]}
                                                        placeholder="Please input values and enter"
                                                        fieldProps={{
                                                          mode: "tags",
                                                        }}
                                                        style={{
                                                          width: "319px",
                                                          padding: "0 3px",
                                                        }}
                                                        options={[]}
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message:
                                                              "Please input values and enter",
                                                          },
                                                        ]}
                                                      />
                                                    );
                                                  case "Exists":
                                                  case "DoesNotExist":
                                                  default:
                                                    form.setFieldValue(
                                                      [
                                                        "podAntiAffinity",
                                                        "preferredDuringSchedulingIgnoredDuringExecution",
                                                        fieldPreferred.name,
                                                        "podAffinityTerm",
                                                        "labelSelector",
                                                        "matchExpressions",
                                                        fieldMatchExpressions.name,
                                                        "values",
                                                      ],
                                                      undefined
                                                    );
                                                    return null;
                                                }
                                              }}
                                            </ProFormDependency>
                                            <Col span={2}>
                                              <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                  remove(
                                                    fieldMatchExpressions.name
                                                  );
                                                }}
                                              />
                                            </Col>
                                          </Row>
                                        )
                                      )}
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          onClick={() => {
                                            add();
                                          }}
                                          style={{ width: "100%" }}
                                        >
                                          <PlusOutlined /> add matchExpressions
                                        </Button>
                                      </Form.Item>
                                    </>
                                  );
                                }}
                              </Form.List>
                            </Card>
                          </Card>
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => {
                            add();
                          }}
                          style={{
                            width: "100%",
                            fontSize: 16,
                            color: "#1890ff",
                          }}
                        >
                          <PlusOutlined /> add condition which is preferred
                          during scheduling and ignored during execution
                        </Button>
                      </Form.Item>
                    </>
                  );
                }}
              </Form.List>
            </>
          ) : (
            <div>Set podAntiAffinity</div>
          )}
        </Form.Item>
      </Form>
    </div>
  );
});

export default MoreSetting;
