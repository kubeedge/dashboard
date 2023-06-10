import React, { useImperativeHandle, useState, useEffect } from "react";
import {
  Space,
  Button,
  Tag,
  Form,
  Input,
  Select,
  Checkbox,
  Row,
  Col,
} from "antd";
import classNames from "classnames";
import { ProFormSelect, ProFormText } from "@ant-design/pro-form";
import {
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import styles from "./index.less";
import {
  getList as getConfigmapList,
  getDetail as getConfigmapDetail,
} from "@/pages/edgeResource/configmap/service";
import {
  getList as getSecretList,
  getInfo as getSecretDetail,
} from "@/pages/edgeResource/secret/service";

const ContainerInfo = React.forwardRef((props: any, ref) => {
  const { initialValues } = props;
  const [selected, setSelected] = useState<number>(0);
  const [existContainers, setExistContainers] = useState<any[]>([]);
  const [cacheLength, setCacheLength] = useState<number>(0);
  const form = Form.useForm()[0];
  const formRef = React.useRef<any>({});
  const [commandCheck, setCommandCheck] = useState<boolean[]>([]);
  const [envCheck, setEnvCheck] = useState<boolean[]>([]);
  const [containerPortCheck, setContainerPortCheck] = useState<boolean[]>([]);
  const [resourceCheck, setResourceCheck] = useState<boolean[]>([]);
  const [securityContextCheck, setSecurityContextCheck] = useState<boolean[]>(
    []
  );

  useImperativeHandle(ref, () => ({
    form,
    getExistContainers: () => existContainers,
    getControlState: () => ({
      commandCheck,
      envCheck,
      containerPortCheck,
      resourceCheck,
      securityContextCheck,
    }),
  }));

  const handlerCommandChange = (e) => {
    setCommandCheck((prevCheck) => {
      const newCheck = [...prevCheck];
      newCheck[selected] = e.target.checked;
      return newCheck;
    });
  };
  const handlerEnvChange = (e) => {
    setEnvCheck((prevCheck) => {
      const newCheck = [...prevCheck];
      newCheck[selected] = e.target.checked;
      return newCheck;
    });
  };
  const handlerResourceChange = (e) => {
    setResourceCheck((prevCheck) => {
      const newCheck = [...prevCheck];
      newCheck[selected] = e.target.checked;
      return newCheck;
    });
  };
  const handlerPortChange = (e) => {
    setContainerPortCheck((prevCheck) => {
      const newCheck = [...prevCheck];
      newCheck[selected] = e.target.checked;
      return newCheck;
    });
  };
  const handlerSecurityContextChange = (e) => {
    setSecurityContextCheck((prevCheck) => {
      const newCheck = [...prevCheck];
      newCheck[selected] = e.target.checked;
      return newCheck;
    });
  };

  const handleSelect = (idx: number, skipVerify?: boolean) => {
    if (skipVerify) {
      setSelected(idx);
      return;
    }
    form.validateFields().then(() => {
      setSelected(idx);
    });
  };

  const handleDelete = (idx: number) => {
    setExistContainers((prev) => {
      console.log(
        "prev.filter((_, i) => i !== idx)",
        prev.filter((_, i) => i !== idx)
      );
      return prev.filter((_, i) => i !== idx);
    });
    setCacheLength((prev) => prev - 1);
    formRef.current.remove(idx);
    setSelected((prev) => {
      if (prev === idx) {
        return 0;
      } else if (prev > idx) {
        return prev - 1;
      } else {
        return prev;
      }
    });
  };

  const handleAdd = (type: "initial" | "work") => {
    formRef.current.add();
    setExistContainers((prev) => [
      ...prev,
      {
        type,
      },
    ]);
  };

  const handlerAddContainer = (type: "initial" | "work") => {
    if (existContainers.length) {
      form.validateFields().then(() => {
        handleAdd(type);
      });
    } else {
      handleAdd(type);
    }
  };

  const handleValueChange = (changedValues, allValues) => {
    if (changedValues.containerList.length < existContainers.length) {
      return;
    }
    const nextExistContainers = existContainers.map((item, idx) => {
      if (idx === selected) {
        return {
          ...item,
          ...changedValues.containerList[selected],
        };
      }
      return item;
    });
    setExistContainers(nextExistContainers);
  };

  useEffect(() => {
    if (existContainers.length && existContainers.length > cacheLength) {
      handleSelect(existContainers.length - 1, true);
      setCacheLength(existContainers.length);
    }
  }, [existContainers]);

  useEffect(() => {
    if (initialValues) {
      setExistContainers(initialValues.containers || []);
      form.setFieldsValue(initialValues);
      setCommandCheck(initialValues.containerControlState?.commandCheck || []);
      setContainerPortCheck(
        initialValues.containerControlState?.containerPortCheck || []
      );
      setEnvCheck(initialValues.containerControlState?.envCheck || []);
      setSecurityContextCheck(
        initialValues.containerControlState?.securityContextCheck || []
      );
      setResourceCheck(
        initialValues.containerControlState?.resourceCheck || []
      );
    }
  }, [initialValues]);

  useEffect(() => {
    commandCheck?.forEach((item, index) => {
      if (!item) {
        form.setFieldValue(
          ["containerList", index, "commandParams"],
          undefined
        );
      }
    });
  }, [commandCheck]);
  useEffect(() => {
    envCheck?.forEach((item, index) => {
      if (!item) {
        form.setFieldValue(["containerList", index, "envParams"], undefined);
      }
    });
  }, [envCheck]);
  useEffect(() => {
    resourceCheck?.forEach((item, index) => {
      if (!item) {
        form.setFieldValue(["containerList", index, "resources"], undefined);
      }
    });
  }, [resourceCheck]);
  useEffect(() => {
    containerPortCheck?.forEach((item, index) => {
      if (!item) {
        form.setFieldValue(["containerList", index, "ports"], undefined);
      }
    });
  }, [containerPortCheck]);
  useEffect(() => {
    securityContextCheck?.forEach((item, index) => {
      if (!item) {
        form.setFieldValue(
          ["containerList", index, "securityContext"],
          undefined
        );
      }
    });
  }, [securityContextCheck]);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ width: 260, padding: "32px 16px" }}>
        <Space>
          <Button
            style={{ fontSize: 12 }}
            type="primary"
            onClick={() => handlerAddContainer("initial")}
          >
            Add initial container
          </Button>
          <Button
            style={{ fontSize: 12 }}
            type="primary"
            onClick={() => handlerAddContainer("work")}
          >
            Add work container
          </Button>
        </Space>
        <div className={styles.containerListWrapper}>
          {existContainers.map((item, index) => (
            <ContainerCard
              formInfo={item}
              type={item?.type as "initial" | "work"}
              selected={selected === index}
              onSelect={() => handleSelect(index)}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      </div>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        labelWrap
        style={{ padding: "68px 0", flex: 1 }}
        onValuesChange={handleValueChange}
        labelAlign="left"
      >
        <Form.List name="containerList">
          {(fields, { add, remove }) => {
            if (formRef.current) {
              formRef.current.add = add;
              formRef.current.remove = remove;
            }
            if (fields.length === 0) {
              return null;
            }
            const fieldContainer = fields[selected];

            return (
              <React.Fragment key={selected}>
                <Form.Item
                  {...fieldContainer}
                  label="name"
                  name={[fieldContainer.name, "name"]}
                  fieldKey={[fieldContainer.fieldKey, "name"]}
                  rules={[{ required: true, message: "Missing name" }]}
                >
                  <Input placeholder="Name" />
                </Form.Item>
                <Form.Item
                  {...fieldContainer}
                  label="image"
                  name={[fieldContainer.name, "image"]}
                  fieldKey={[fieldContainer.fieldKey, "image"]}
                  rules={[{ required: true, message: "Missing image" }]}
                >
                  <Input placeholder="image" />
                </Form.Item>
                <Form.Item
                  {...fieldContainer}
                  label="method"
                  name={[fieldContainer.name, "method"]}
                  fieldKey={[fieldContainer.fieldKey, "method"]}
                >
                  <Select
                    placeholder="method"
                    options={[
                      {
                        label: "Always",
                        value: "Always",
                      },
                      {
                        label: "Never",
                        value: "Never",
                      },
                      {
                        label: "IfNotPresent",
                        value: "IfNotPresent",
                      },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  key={"commandCheck"}
                  {...fieldContainer}
                  label={
                    <>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={commandCheck?.[selected]}
                        defaultChecked={commandCheck?.[selected]}
                        onChange={handlerCommandChange}
                      />
                      Command
                    </>
                  }
                  colon={false}
                  name={[fieldContainer.name, "commandParams"]}
                  fieldKey={[fieldContainer.fieldKey, "commandParams"]}
                >
                  {commandCheck?.[selected] ? (
                    <>
                      <Form.Item
                        label="Working directory"
                        name={[
                          fieldContainer.name,
                          "commandParams",
                          "workingDir",
                        ]}
                      >
                        <Input placeholder="Working directory" />
                      </Form.Item>
                      <ProFormSelect
                        name={[fieldContainer.name, "commandParams", "command"]}
                        label="Command"
                        placeholder="Please input command and enter"
                        fieldProps={{
                          mode: "tags",
                        }}
                        options={[]}
                      />
                      <ProFormSelect
                        name={[fieldContainer.name, "commandParams", "args"]}
                        label="Args"
                        placeholder="Please input args and enter"
                        fieldProps={{
                          mode: "tags",
                        }}
                        options={[]}
                      />
                    </>
                  ) : (
                    <div>
                      If the 'Command' field is filled in, it will replace the
                      default ENTRYPOINT or CMD in the image
                    </div>
                  )}
                </Form.Item>
                <Form.Item
                  className={styles.formItem}
                  key={"envCheck"}
                  {...fieldContainer}
                  label={
                    <>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={envCheck?.[selected]}
                        defaultChecked={envCheck?.[selected]}
                        onChange={handlerEnvChange}
                      />
                      Environment variable
                    </>
                  }
                  colon={false}
                  name={[fieldContainer.name, "envParams"]}
                  fieldKey={[fieldContainer.fieldKey, "envParams"]}
                >
                  {envCheck?.[selected] ? (
                    <>
                      <Form.List
                        name={[fieldContainer.name, "envParams", "env"]}
                      >
                        {(fields, { add, remove }) => {
                          return (
                            <Row>
                              {fields.map(
                                (fieldContainerEnv, indexContainerEnv) => (
                                  <Col span={24}>
                                    <Row gutter={6}>
                                      <Col span={11}>
                                        <Form.Item
                                          {...fieldContainerEnv}
                                          name={[fieldContainerEnv.name, "key"]}
                                          fieldKey={[
                                            fieldContainerEnv.fieldKey,
                                            "key",
                                          ]}
                                          rules={[
                                            {
                                              required: true,
                                              message: "Missing key",
                                            },
                                          ]}
                                        >
                                          <Input
                                            placeholder="key"
                                            style={{ width: "100%" }}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col span={11}>
                                        <ProFormSelect
                                          name={[
                                            fieldContainerEnv.name,
                                            "type",
                                          ]}
                                          options={[
                                            { label: "value", value: "value" },
                                            {
                                              label: "fieldRef",
                                              value: "fieldRef",
                                            },
                                            {
                                              label: "resourceFieldRef",
                                              value: "resourceFieldRef",
                                            },
                                            {
                                              label: "configMapKeyRef",
                                              value: "configMapKeyRef",
                                            },
                                            {
                                              label: "secretKeyRef",
                                              value: "secretKeyRef",
                                            },
                                          ]}
                                          placeholder={"key-value pair type"}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Missing key-value pair type",
                                            },
                                          ]}
                                        />
                                      </Col>

                                      <Form.Item
                                        noStyle
                                        shouldUpdate={(
                                          prevValues,
                                          currentValues
                                        ) => {
                                          const change =
                                            prevValues?.containerList?.[
                                              selected
                                            ]?.envParams?.env?.[
                                              indexContainerEnv
                                            ]?.type !==
                                            currentValues?.containerList?.[
                                              selected
                                            ]?.envParams?.env?.[
                                              indexContainerEnv
                                            ]?.type;
                                          if (change) {
                                            form.setFieldValue(
                                              [
                                                "containerList",
                                                selected,
                                                "envParams",
                                                "env",
                                                indexContainerEnv,
                                                "name",
                                              ],
                                              undefined
                                            );
                                            form.setFieldValue(
                                              [
                                                "containerList",
                                                selected,
                                                "envParams",
                                                "env",
                                                indexContainerEnv,
                                                "keyFrom",
                                              ],
                                              undefined
                                            );
                                          }
                                          return change;
                                        }}
                                      >
                                        {({ getFieldValue }) => {
                                          const type = getFieldValue([
                                            "containerList",
                                            selected,
                                            "envParams",
                                            "env",
                                            indexContainerEnv,
                                            "type",
                                          ]);
                                          if (type === "value") {
                                            return (
                                              <Form.Item
                                                style={{
                                                  width: "270px",
                                                  padding: "0 3px",
                                                }}
                                                {...fieldContainerEnv}
                                                name={[
                                                  fieldContainerEnv.name,
                                                  "value",
                                                ]}
                                                fieldKey={[
                                                  fieldContainerEnv.fieldKey,
                                                  "value",
                                                ]}
                                                id={`env-${indexContainerEnv}-value`}
                                              >
                                                <Input
                                                  placeholder="value"
                                                  style={{ width: "100%" }}
                                                />
                                              </Form.Item>
                                            );
                                          }
                                          if (type === "fieldRef") {
                                            return (
                                              <ProFormSelect
                                                style={{
                                                  width: "270px",
                                                  padding: "0 3px",
                                                }}
                                                name={[
                                                  fieldContainerEnv.name,
                                                  "fieldPath",
                                                ]}
                                                placeholder={"fieldPath"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      "Missing fieldPath",
                                                  },
                                                ]}
                                                id={`env-${indexContainerEnv}-fieldPath`}
                                                options={[
                                                  {
                                                    label: "meta.name",
                                                    value: "meta.name",
                                                  },
                                                  {
                                                    label: "meta.namespace",
                                                    value: "meta.namespace",
                                                  },
                                                  {
                                                    label: "meta.labels",
                                                    value: "meta.labels",
                                                  },
                                                  {
                                                    label: "meta.annotations",
                                                    value: "meta.annotations",
                                                  },
                                                  {
                                                    label: "spec.nodeName",
                                                    value: "spec.nodeNamee",
                                                  },
                                                  {
                                                    label:
                                                      "spec.serviceAccountName",
                                                    value:
                                                      "spec.serviceAccountName",
                                                  },
                                                  {
                                                    label: "status.hostIP",
                                                    value: "status.hostIP",
                                                  },
                                                  {
                                                    label: "status.podIP",
                                                    value: "status.podIP",
                                                  },
                                                ]}
                                              />
                                            );
                                          }
                                          if (type === "resourceFieldRef") {
                                            return (
                                              <ProFormSelect
                                                style={{
                                                  width: "270px",
                                                  padding: "0 3px",
                                                }}
                                                name={[
                                                  fieldContainerEnv.name,
                                                  "resource",
                                                ]}
                                                placeholder={"resource"}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: "Missing resource",
                                                  },
                                                ]}
                                                id={`env-${indexContainerEnv}-resource`}
                                                options={[
                                                  {
                                                    label: "limits.cpu",
                                                    value: "limits.cpu",
                                                  },
                                                  {
                                                    label: "limits.memory",
                                                    value: "limits.memory",
                                                  },
                                                  {
                                                    label: "requests.cpu",
                                                    value: "requests.cpu",
                                                  },
                                                  {
                                                    label: "requests.memory",
                                                    value: "requests.memory",
                                                  },
                                                ]}
                                              />
                                            );
                                          }
                                          if (type === "configMapKeyRef") {
                                            return (
                                              <>
                                                <ProFormSelect
                                                  style={{
                                                    width: "270px",
                                                    padding: "0 3px",
                                                  }}
                                                  name={[
                                                    fieldContainerEnv.name,
                                                    "name",
                                                  ]}
                                                  placeholder={"name"}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Missing name",
                                                    },
                                                  ]}
                                                  id={`env-${indexContainerEnv}-configMap-name`}
                                                  dependencies={["namespace"]}
                                                  request={(params) =>
                                                    getConfigmapList(
                                                      params.namespace
                                                    ).then((res) => {
                                                      return (
                                                        res.items || []
                                                      ).map((item) => ({
                                                        label:
                                                          item.metadata.name,
                                                        value:
                                                          item.metadata.name,
                                                      }));
                                                    })
                                                  }
                                                />
                                                <ProFormSelect
                                                  style={{
                                                    width: "270px",
                                                    padding: "0 3px",
                                                  }}
                                                  name={[
                                                    fieldContainerEnv.name,
                                                    "keyFrom",
                                                  ]}
                                                  placeholder={"keyFrom"}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Missing keyFrom",
                                                    },
                                                  ]}
                                                  id={`env-${indexContainerEnv}-configMap-keyFrom`}
                                                  dependencies={[
                                                    "namespace",
                                                    [
                                                      "containerList",
                                                      selected,
                                                      "envParams",
                                                      "env",
                                                      indexContainerEnv,
                                                      "name",
                                                    ],
                                                  ]}
                                                  request={(params) => {
                                                    const configmapName =
                                                      params?.containerList?.[
                                                        selected
                                                      ]?.envParams?.env?.[
                                                        indexContainerEnv
                                                      ]?.name;
                                                    if (!configmapName)
                                                      return null;
                                                    return getConfigmapDetail(
                                                      params.namespace,
                                                      configmapName
                                                    ).then((res) => {
                                                      return Object.keys(
                                                        res.data || {}
                                                      ).map((item) => ({
                                                        label: item,
                                                        value: item,
                                                      }));
                                                    });
                                                  }}
                                                />
                                              </>
                                            );
                                          }
                                          if (type === "secretKeyRef") {
                                            return (
                                              <div style={{ display: "flex" }}>
                                                <ProFormSelect
                                                  style={{
                                                    width: "270px",
                                                    padding: "0 3px",
                                                  }}
                                                  name={[
                                                    fieldContainerEnv.name,
                                                    "name",
                                                  ]}
                                                  placeholder={"name"}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Missing name",
                                                    },
                                                  ]}
                                                  id={`env-${indexContainerEnv}-secret-name`}
                                                  dependencies={["namespace"]}
                                                  request={(params) =>
                                                    getSecretList(
                                                      params.namespace
                                                    ).then((res) => {
                                                      return (
                                                        res.items || []
                                                      ).map((item) => ({
                                                        label:
                                                          item.metadata.name,
                                                        value:
                                                          item.metadata.name,
                                                      }));
                                                    })
                                                  }
                                                />
                                                <ProFormSelect
                                                  style={{
                                                    width: "270px",
                                                    padding: "0 3px",
                                                  }}
                                                  name={[
                                                    fieldContainerEnv.name,
                                                    "keyFrom",
                                                  ]}
                                                  placeholder={"keyFrom"}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Missing keyFrom",
                                                    },
                                                  ]}
                                                  id={`env-${indexContainerEnv}-secret-keyFrom`}
                                                  dependencies={[
                                                    "namespace",
                                                    [
                                                      "containerList",
                                                      selected,
                                                      "envParams",
                                                      "env",
                                                      indexContainerEnv,
                                                      "name",
                                                    ],
                                                  ]}
                                                  request={(params) => {
                                                    const secretName =
                                                      params?.containerList?.[
                                                        selected
                                                      ]?.envParams?.env?.[
                                                        indexContainerEnv
                                                      ]?.name;
                                                    if (!secretName)
                                                      return null;
                                                    return getSecretDetail(
                                                      params.namespace,
                                                      secretName
                                                    ).then((res) => {
                                                      return Object.keys(
                                                        res.data || {}
                                                      ).map((item) => ({
                                                        label: item,
                                                        value: item,
                                                      }));
                                                    });
                                                  }}
                                                />
                                              </div>
                                            );
                                          }
                                          return null;
                                        }}
                                      </Form.Item>

                                      <Col span={2}>
                                        <MinusCircleOutlined
                                          className="dynamic-delete-button"
                                          onClick={() => {
                                            remove(fieldContainerEnv.name);
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
                                    <PlusOutlined /> add key-value pair
                                  </Button>
                                </Form.Item>
                              </Col>
                            </Row>
                          );
                        }}
                      </Form.List>
                      <Form.List
                        name={[fieldContainer.name, "envParams", "envFrom"]}
                      >
                        {(fields, { add, remove }) => {
                          return (
                            <Row>
                              {fields.map(
                                (
                                  fieldContainerEnvFrom,
                                  indexContainerEnvFrom
                                ) => (
                                  <Col span={24}>
                                    <Row gutter={6}>
                                      <Col span={11}>
                                        <ProFormSelect
                                          name={[
                                            fieldContainerEnvFrom.name,
                                            "type",
                                          ]}
                                          options={[
                                            {
                                              label: "configMapRef",
                                              value: "configMapRef",
                                            },
                                            {
                                              label: "secretRef",
                                              value: "secretRef",
                                            },
                                          ]}
                                          placeholder={"configuration type"}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Missing configuration type",
                                            },
                                          ]}
                                        />
                                      </Col>

                                      <Form.Item
                                        noStyle
                                        shouldUpdate={(
                                          prevValues,
                                          currentValues
                                        ) => {
                                          const change =
                                            prevValues?.containerList?.[
                                              selected
                                            ]?.envParams?.envFrom?.[
                                              indexContainerEnvFrom
                                            ]?.type !==
                                            currentValues?.containerList?.[
                                              selected
                                            ]?.envParams?.envFrom?.[
                                              indexContainerEnvFrom
                                            ]?.type;
                                          if (change) {
                                            form.setFieldValue(
                                              [
                                                "containerList",
                                                selected,
                                                "envParams",
                                                "envFrom",
                                                indexContainerEnvFrom,
                                                "name",
                                              ],
                                              undefined
                                            );
                                            form.setFieldValue(
                                              [
                                                "containerList",
                                                selected,
                                                "envParams",
                                                "envFrom",
                                                indexContainerEnvFrom,
                                                "prefix",
                                              ],
                                              undefined
                                            );
                                          }
                                          return change;
                                        }}
                                      >
                                        {({ getFieldValue }) => {
                                          const type = getFieldValue([
                                            "containerList",
                                            selected,
                                            "envParams",
                                            "envFrom",
                                            indexContainerEnvFrom,
                                            "type",
                                          ]);
                                          if (type === "configMapRef") {
                                            return (
                                              <>
                                                <ProFormSelect
                                                  style={{
                                                    width: "270px",
                                                    padding: "0 3px",
                                                  }}
                                                  name={[
                                                    fieldContainerEnvFrom.name,
                                                    "name",
                                                  ]}
                                                  placeholder={"name"}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Missing name",
                                                    },
                                                  ]}
                                                  dependencies={["namespace"]}
                                                  request={(params) =>
                                                    getConfigmapList(
                                                      params.namespace
                                                    ).then((res) => {
                                                      return (
                                                        res.items || []
                                                      ).map((item) => ({
                                                        label:
                                                          item.metadata.name,
                                                        value:
                                                          item.metadata.name,
                                                      }));
                                                    })
                                                  }
                                                />
                                                <Form.Item
                                                  style={{
                                                    width: "270px",
                                                    padding: "0 3px",
                                                  }}
                                                  {...fieldContainerEnvFrom}
                                                  name={[
                                                    fieldContainerEnvFrom.name,
                                                    "prefix",
                                                  ]}
                                                  fieldKey={[
                                                    fieldContainerEnvFrom.fieldKey,
                                                    "prefix",
                                                  ]}
                                                  id={`env-${fieldContainerEnvFrom}-prefix`}
                                                >
                                                  <Input
                                                    placeholder="prefix"
                                                    style={{ width: "100%" }}
                                                  />
                                                </Form.Item>
                                              </>
                                            );
                                          }
                                          if (type === "secretRef") {
                                            return (
                                              <>
                                                <ProFormSelect
                                                  style={{
                                                    width: "270px",
                                                    padding: "0 3px",
                                                  }}
                                                  name={[
                                                    fieldContainerEnvFrom.name,
                                                    "name",
                                                  ]}
                                                  placeholder={"name"}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Missing name",
                                                    },
                                                  ]}
                                                  dependencies={["namespace"]}
                                                  request={(params) =>
                                                    getSecretList(
                                                      params.namespace
                                                    ).then((res) => {
                                                      return (
                                                        res.items || []
                                                      ).map((item) => ({
                                                        label:
                                                          item.metadata.name,
                                                        value:
                                                          item.metadata.name,
                                                      }));
                                                    })
                                                  }
                                                />
                                                <Form.Item
                                                  style={{
                                                    width: "270px",
                                                    padding: "0 3px",
                                                  }}
                                                  {...fieldContainerEnvFrom}
                                                  name={[
                                                    fieldContainerEnvFrom.name,
                                                    "prefix",
                                                  ]}
                                                  fieldKey={[
                                                    fieldContainerEnvFrom.fieldKey,
                                                    "prefix",
                                                  ]}
                                                  id={`env-${fieldContainerEnvFrom}-prefix`}
                                                >
                                                  <Input
                                                    placeholder="Prefix"
                                                    style={{ width: "100%" }}
                                                  />
                                                </Form.Item>
                                              </>
                                            );
                                          }
                                          return null;
                                        }}
                                      </Form.Item>

                                      <Col span={2}>
                                        <MinusCircleOutlined
                                          className="dynamic-delete-button"
                                          onClick={() => {
                                            remove(fieldContainerEnvFrom.name);
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
                                    <PlusOutlined /> add configuration
                                  </Button>
                                </Form.Item>
                              </Col>
                            </Row>
                          );
                        }}
                      </Form.List>
                    </>
                  ) : (
                    <div>Set environment variables for containers</div>
                  )}
                </Form.Item>
                <Form.Item
                  className={styles.formItem}
                  key={"resourceCheck"}
                  {...fieldContainer}
                  label={
                    <>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={resourceCheck?.[selected]}
                        defaultChecked={resourceCheck?.[selected]}
                        onChange={handlerResourceChange}
                      />
                      Resource requirements
                    </>
                  }
                  colon={false}
                  name={[fieldContainer.name, "resources"]}
                  fieldKey={[fieldContainer.fieldKey, "resources"]}
                >
                  {resourceCheck?.[selected] ? (
                    <>
                      <Form.Item
                        label="Cpu resource request"
                        name={[
                          fieldContainer.name,
                          "resources",
                          "requests",
                          "cpu",
                        ]}
                      >
                        <Input addonAfter="core" />
                      </Form.Item>
                      <Form.Item
                        label="Cpu resource limit"
                        name={[
                          fieldContainer.name,
                          "resources",
                          "limits",
                          "cpu",
                        ]}
                      >
                        <Input addonAfter="core" />
                      </Form.Item>
                      <Form.Item
                        label="Memory resource request"
                        name={[
                          fieldContainer.name,
                          "resources",
                          "requests",
                          "memory",
                        ]}
                      >
                        <Input placeholder="10Mi" />
                      </Form.Item>
                      <Form.Item
                        label="Memory resource limit"
                        name={[
                          fieldContainer.name,
                          "resources",
                          "limits",
                          "memory",
                        ]}
                      >
                        <Input placeholder="10Mi" />
                      </Form.Item>
                    </>
                  ) : (
                    <div>Set resource requirements for containers</div>
                  )}
                </Form.Item>
                <Form.Item
                  className={styles.formItem}
                  key={"containerPortCheck"}
                  {...fieldContainer}
                  label={
                    <>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={containerPortCheck?.[selected]}
                        defaultChecked={containerPortCheck?.[selected]}
                        onChange={handlerPortChange}
                      />
                      Container ports
                    </>
                  }
                  colon={false}
                  name={[fieldContainer.name, "portParams"]}
                  fieldKey={[fieldContainer.fieldKey, "portParams"]}
                >
                  {containerPortCheck?.[selected] ? (
                    <>
                      <Form.List name={[fieldContainer.name, "ports"]}>
                        {(fields, { add, remove }) => {
                          return (
                            <Row>
                              {fields.map(
                                (fieldContainerPort, indexContainerEnv) => (
                                  <Col span={24}>
                                    <Row gutter={6}>
                                      <Col span={11}>
                                        <ProFormSelect
                                          name={[
                                            fieldContainerPort.name,
                                            "protocol",
                                          ]}
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
                                          name={[
                                            fieldContainerPort.name,
                                            "name",
                                          ]}
                                          placeholder="name"
                                        />
                                      </Col>
                                      <Col span={11}>
                                        <ProFormText
                                          name={[
                                            fieldContainerPort.name,
                                            "containerPort",
                                          ]}
                                          placeholder="containerPort"
                                          rules={[
                                            {
                                              required: true,
                                              message: "Missing containerPort",
                                            },
                                          ]}
                                        />
                                      </Col>
                                      <Col span={11}>
                                        <ProFormText
                                          name={[
                                            fieldContainerPort.name,
                                            "hostPort",
                                          ]}
                                          placeholder="hostPort"
                                        />
                                      </Col>
                                      <Col span={2}>
                                        <MinusCircleOutlined
                                          className="dynamic-delete-button"
                                          onClick={() => {
                                            remove(fieldContainerPort.name);
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
                                    <PlusOutlined /> add configuration
                                  </Button>
                                </Form.Item>
                              </Col>
                            </Row>
                          );
                        }}
                      </Form.List>
                    </>
                  ) : (
                    <div>Set ports for container</div>
                  )}
                </Form.Item>

                <Form.Item
                  className={styles.formItem}
                  key={"securityContextCheck"}
                  {...fieldContainer}
                  label={
                    <>
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={securityContextCheck?.[selected]}
                        defaultChecked={securityContextCheck?.[selected]}
                        onChange={handlerSecurityContextChange}
                      />
                      Security Context
                    </>
                  }
                  colon={false}
                  name={[fieldContainer.name, "securityContext"]}
                  fieldKey={[fieldContainer.fieldKey, "securityContext"]}
                >
                  {securityContextCheck?.[selected] ? (
                    <>
                      <Row gutter={6}>
                        <Col span={12}>
                          <ProFormSelect
                            name={[
                              fieldContainer.name,
                              "securityContext",
                              "privileged",
                            ]}
                            label="privileged"
                            placeholder=""
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
                        <Col span={12}>
                          <ProFormSelect
                            name={[
                              fieldContainer.name,
                              "securityContext",
                              "allowPrivilegeEscalation",
                            ]}
                            label="allowPrivilegeEscalation"
                            placeholder=""
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
                          <ProFormSelect
                            name={[
                              fieldContainer.name,
                              "securityContext",
                              "readOnlyRootFilesystem",
                            ]}
                            label="readOnlyRootFilesystem"
                            placeholder=""
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
                        <Col span={12}>
                          <ProFormSelect
                            name={[
                              fieldContainer.name,
                              "securityContext",
                              "runAsNonRoot",
                            ]}
                            label="runAsNonRoot"
                            placeholder=""
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
                        <Col span={12}>
                          <ProFormText
                            name={[
                              fieldContainer.name,
                              "securityContext",
                              "runAsUser",
                            ]}
                            label="runAsUser"
                            placeholder=""
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={[
                              fieldContainer.name,
                              "securityContext",
                              "runAsGroup",
                            ]}
                            label="runAsGroup"
                            placeholder=""
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={[
                              fieldContainer.name,
                              "securityContext",
                              "procMount",
                            ]}
                            label="procMount"
                            placeholder=""
                          />
                        </Col>
                      </Row>
                      <Col span={24}>
                        <ProFormSelect
                          name={[
                            fieldContainer.name,
                            "securityContext",
                            "capabilities",
                            "add",
                          ]}
                          label="capabilities.add"
                          placeholder="Please input values and enter"
                          fieldProps={{
                            mode: "tags",
                          }}
                          options={[]}
                        />
                      </Col>
                      <Col span={24}>
                        <ProFormSelect
                          name={[
                            fieldContainer.name,
                            "securityContext",
                            "capabilities",
                            "drop",
                          ]}
                          label="capabilities.drop"
                          placeholder="Please input values and enter"
                          fieldProps={{
                            mode: "tags",
                          }}
                          options={[]}
                        />
                      </Col>
                      <Row gutter={6}>
                        <Col span={12}>
                          <ProFormText
                            name={[
                              fieldContainer.name,
                              "securityContext",
                              "seLinuxOptions",
                              "user",
                            ]}
                            label="seLinuxOptions.user"
                            placeholder=""
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={[
                              fieldContainer.name,
                              "securityContext",
                              "seLinuxOptions",
                              "role",
                            ]}
                            label="seLinuxOptions.role"
                            placeholder=""
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={[
                              fieldContainer.name,
                              "securityContext",
                              "seLinuxOptions",
                              "type",
                            ]}
                            label="seLinuxOptions.type"
                            placeholder=""
                          />
                        </Col>
                        <Col span={12}>
                          <ProFormText
                            name={[
                              fieldContainer.name,
                              "securityContext",
                              "seLinuxOptions",
                              "level",
                            ]}
                            label="seLinuxOptions.level"
                            placeholder=""
                          />
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <div>
                      Security Context can limit the behavior of untrusted
                      containers and protect the system and other containers
                      from its impact.
                    </div>
                  )}
                </Form.Item>
              </React.Fragment>
            );
          }}
        </Form.List>
      </Form>
    </div>
  );
});

export default ContainerInfo;

const ContainerCard: React.FC<{
  formInfo: any;
  selected: boolean;
  type: "initial" | "work";
  onSelect: () => void;
  onDelete: () => void;
}> = (props) => {
  const cls = classNames({
    [styles.cardWrapper]: true,
    [styles.workContainerSelected]: props.type === "work" && props.selected,
    [styles.initialContainerSelected]:
      props.type === "initial" && props.selected,
    [styles.initialContainer]: props.type === "initial",
    [styles.workContainer]: props.type === "work",
  });
  const color = props.selected
    ? "#fff"
    : props.type === "initial"
    ? "#0fbe8f"
    : "#234883";
  const fontColor = !props.selected
    ? "#fff"
    : props.type === "initial"
    ? "#0fbe8f"
    : "#234883";

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onDelete();
  };

  return (
    <div className={cls} onClick={props.onSelect}>
      <div className={styles.cardHeader}>
        <Tag color={color} style={{ color: fontColor, borderRadius: 4 }}>
          {props.type === "initial" ? "initialContainer" : "workContainer"}
        </Tag>
        <CloseCircleOutlined onClick={handleDelete} />
      </div>
      <div>{props?.formInfo?.name || ""}</div>
    </div>
  );
};
