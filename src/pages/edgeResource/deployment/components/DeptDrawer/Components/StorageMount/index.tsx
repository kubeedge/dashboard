import React, { useImperativeHandle, useState, useEffect } from "react";
import { Space, Button, Tag, Form, Input, Select, Radio, Row, Col } from "antd";
import classNames from "classnames";
import {
  ProFormSelect,
  ProFormText,
  ProFormRadio,
  ProFormDependency,
} from "@ant-design/pro-form";
import {
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  getList as getConfigmapList,
  getDetail as getConfigmapDetail,
} from "@/pages/edgeResource/configmap/service";
import {
  getList as getSecretList,
  getInfo as getSecretDetail,
} from "@/pages/edgeResource/secret/service";
import styles from "./index.less";

const StorageMount = React.forwardRef((props: any, ref) => {
  const { initialValues } = props;
  const [selected, setSelected] = useState<number>(0);
  const [existVolumes, setExistVolumes] = useState<any[]>([]);
  const [cacheLength, setCacheLength] = useState<number>(0);
  const [containerOptions, setContainerOptions] = useState<any[]>([]);
  const form = Form.useForm()[0];
  const formRef = React.useRef<any>({});

  useImperativeHandle(ref, () => ({
    form,
    getExistVolumes: () => existVolumes,
  }));

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
    setExistVolumes((prev) => prev.filter((_, i) => i !== idx));
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

  const handleAdd = () => {
    formRef.current.add();
    setExistVolumes((prev) => [...prev, {}]);
  };

  const handlerAddContainer = () => {
    if (existVolumes.length) {
      form.validateFields().then(() => {
        handleAdd();
      });
    } else {
      handleAdd();
    }
  };

  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.volumeList.length < existVolumes.length) {
      return;
    }
    const nextExistContainers = existVolumes.map((item, idx) => {
      if (idx === selected) {
        return {
          ...item,
          ...changedValues.volumeList[selected],
        };
      }
      return item;
    });
    setExistVolumes(nextExistContainers);
  };

  useEffect(() => {
    if (existVolumes.length && existVolumes.length > cacheLength) {
      handleSelect(existVolumes.length - 1, true);
      setCacheLength(existVolumes.length);
    }
  }, [existVolumes]);

  useEffect(() => {
    if (initialValues) {
      setExistVolumes(initialValues.volumes || []);
      form.setFieldsValue(initialValues);
      setContainerOptions(
        (initialValues?.containers || []).map((item) => ({
          label: item.name,
          value: item.name,
        }))
      );
    }
  }, [initialValues]);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ width: 260, padding: "32px 16px" }}>
        <Space>
          <Button
            style={{ fontSize: 12 }}
            type="primary"
            onClick={() => handlerAddContainer()}
          >
            Add volume
          </Button>
        </Space>
        <div className={styles.containerListWrapper}>
          {existVolumes.map((item, index) => (
            <VolumeCard
              itemInfo={item}
              type={"initial"}
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
        onValuesChange={handleValuesChange}
        labelAlign="left"
      >
        <Form.List name="volumeList">
          {(fields, { add, remove }) => {
            if (formRef.current) {
              formRef.current.add = add;
              formRef.current.remove = remove;
            }
            if (fields.length === 0) {
              return null;
            }
            const fieldVolume = fields[selected];

            return (
              <React.Fragment key={selected}>
                <Form.Item
                  {...fieldVolume}
                  label="Name"
                  name={[fieldVolume.name, "name"]}
                  fieldKey={[fieldVolume.fieldKey, "name"]}
                  rules={[{ required: true, message: "Missing name" }]}
                >
                  <Input placeholder="Name" />
                </Form.Item>
                <Form.Item
                  label="Type"
                  name={[fieldVolume.name, "type"]}
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
                        <Radio.Button value={item.value}>
                          {item.label}
                        </Radio.Button>
                      );
                    })}
                  </Radio.Group>
                </Form.Item>
                <ProFormDependency
                  name={[["volumeList", fieldVolume.name, "type"]]}
                >
                  {(depend) => {
                    switch (depend?.volumeList?.[fieldVolume.name]?.type) {
                      case "hostPath":
                        return (
                          <>
                            <ProFormText
                              name={[fieldVolume.name, "data", "path"]}
                              label="hostPath.path"
                              rules={[
                                {
                                  required: true,
                                  message: "Missing path",
                                },
                              ]}
                            />
                            <ProFormSelect
                              name={[fieldVolume.name, "data", "type"]}
                              label="hostPath.type"
                              options={[
                                {
                                  label: "EmptyString",
                                  value: "EmptyString",
                                },
                                {
                                  label: "DirectoryOrCreate",
                                  value: "DirectoryOrCreate",
                                },
                                {
                                  label: "Directory",
                                  value: "Directory",
                                },
                                {
                                  label: "FileOrCreate",
                                  value: "FileOrCreate",
                                },
                                {
                                  label: "File",
                                  value: "File",
                                },
                                {
                                  label: "Socket",
                                  value: "Socket",
                                },
                                {
                                  label: "CharDevice",
                                  value: "CharDevice",
                                },
                                {
                                  label: "BlockDevice",
                                  value: "BlockDevice",
                                },
                              ]}
                            />
                          </>
                        );
                      case "configMap":
                        return (
                          <>
                            <ProFormSelect
                              name={[fieldVolume.name, "data", "name"]}
                              dependencies={["namespace"]}
                              label="ConfigMap"
                              rules={[
                                {
                                  required: true,
                                  message: "Missing ConfigMap",
                                },
                              ]}
                              request={(params) =>
                                getConfigmapList(params.namespace).then(
                                  (res) => {
                                    return (res.items || []).map((item) => ({
                                      label: item.metadata.name,
                                      value: item.metadata.name,
                                    }));
                                  }
                                )
                              }
                            />
                            <Form.Item label="KeyToPath">
                              <Form.List
                                name={[fieldVolume.name, "data", "items"]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <Row>
                                      {fields.map(
                                        (fieldKeyToPath, indexContainerEnv) => (
                                          <Col span={24}>
                                            <Row gutter={6}>
                                              <Col span={11}>
                                                <ProFormText
                                                  name={[
                                                    fieldKeyToPath.name,
                                                    "key",
                                                  ]}
                                                  placeholder="Key"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Missing key",
                                                    },
                                                  ]}
                                                />
                                              </Col>
                                              <Col span={11}>
                                                <ProFormText
                                                  name={[
                                                    fieldKeyToPath.name,
                                                    "path",
                                                  ]}
                                                  placeholder="Path"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Missing path",
                                                    },
                                                  ]}
                                                />
                                              </Col>
                                              <Col span={2}>
                                                <MinusCircleOutlined
                                                  className="dynamic-delete-button"
                                                  onClick={() => {
                                                    remove(fieldKeyToPath.name);
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
                                            <PlusOutlined /> add KeyToPath
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
                      case "secret":
                        return (
                          <>
                            <ProFormSelect
                              name={[fieldVolume.name, "data", "secretName"]}
                              dependencies={["namespace"]}
                              label="SecretName"
                              rules={[
                                {
                                  required: true,
                                  message: "Missing SecretName",
                                },
                              ]}
                              request={(params) =>
                                getSecretList(params.namespace).then((res) => {
                                  return (res.items || []).map((item) => ({
                                    label: item.metadata.name,
                                    value: item.metadata.name,
                                  }));
                                })
                              }
                            />
                            <Form.Item label="KeyToPath">
                              <Form.List
                                name={[fieldVolume.name, "data", "items"]}
                              >
                                {(fields, { add, remove }) => {
                                  return (
                                    <Row>
                                      {fields.map(
                                        (fieldKeyToPath, indexContainerEnv) => (
                                          <Col span={24}>
                                            <Row gutter={6}>
                                              <Col span={11}>
                                                <ProFormText
                                                  name={[
                                                    fieldKeyToPath.name,
                                                    "key",
                                                  ]}
                                                  placeholder="Key"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Missing key",
                                                    },
                                                  ]}
                                                />
                                              </Col>
                                              <Col span={11}>
                                                <ProFormText
                                                  name={[
                                                    fieldKeyToPath.name,
                                                    "path",
                                                  ]}
                                                  placeholder="Path"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Missing path",
                                                    },
                                                  ]}
                                                />
                                              </Col>
                                              <Col span={2}>
                                                <MinusCircleOutlined
                                                  className="dynamic-delete-button"
                                                  onClick={() => {
                                                    remove(fieldKeyToPath.name);
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
                                            <PlusOutlined /> add KeyToPath
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
                      default:
                        return null;
                    }
                  }}
                </ProFormDependency>
                <Form.Item label="Mount container">
                  <Form.List name={[fieldVolume.name, "container", "items"]}>
                    {(fields, { add, remove }) => {
                      return (
                        <Row>
                          {fields.map(
                            (fieldMountContainer, indexContainerEnv) => (
                              <Col span={24}>
                                <Row gutter={6}>
                                  <Col span={11}>
                                    <ProFormSelect
                                      name={[fieldMountContainer.name, "name"]}
                                      placeholder="container"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing container",
                                        },
                                      ]}
                                      options={containerOptions}
                                    />
                                  </Col>
                                  <Col span={11}>
                                    <ProFormText
                                      name={[
                                        fieldMountContainer.name,
                                        "mountPath",
                                      ]}
                                      placeholder="mountPath"
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing mountPath",
                                        },
                                      ]}
                                    />
                                  </Col>
                                  <Col span={2}>
                                    <MinusCircleOutlined
                                      className="dynamic-delete-button"
                                      onClick={() => {
                                        remove(fieldMountContainer.name);
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
                                <PlusOutlined /> mount container
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      );
                    }}
                  </Form.List>
                </Form.Item>
              </React.Fragment>
            );
          }}
        </Form.List>
      </Form>
    </div>
  );
});

export default StorageMount;

const VolumeCard: React.FC<{
  itemInfo: any;
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
          volume
        </Tag>
        <CloseCircleOutlined onClick={handleDelete} />
      </div>
      <div>{props?.itemInfo?.name}</div>
    </div>
  );
};

const TypeEnum = [
  { label: "EmptyDir", value: "emptyDir" },
  {
    label: "HostPath",
    value: "hostPath",
  },
  {
    label: "ConfigMap",
    value: "configMap",
  },
  {
    label: "Secret",
    value: "secret",
  },
];
