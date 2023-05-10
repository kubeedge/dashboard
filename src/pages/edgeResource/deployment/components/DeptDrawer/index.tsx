import React, { useState, useRef, useEffect, useMemo } from "react";
import { useModel } from "umi";
import { Drawer, Space, Button, Steps, Spin, Form, message } from "antd";
import { DEPT_CONFIG } from "./constants";
import ContainerInfo from "./Components/ContainerInfo";
import StorageMount from "./Components/StorageMount";
import MoreSetting from "./Components/MoreSetting";
import { getNamespaces } from "@/services/kubeedge";
import { arrayToObject } from "@/utils/utils";

type DeptDrawerProps = {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onOk: (values) => void;
};

const DeptDrawer: React.FC<DeptDrawerProps> = (props) => {
  const { visible, loading, onClose, onOk } = props;
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState<any>({});
  const formRef = useRef<any>({});
  const containerRef = useRef<any>({});
  const volumeRef = useRef<any>({});
  const settingRef = useRef<any>({});
  const [form] = Form.useForm();

  const [] = useState<any[]>([]);

  const { initialState } = useModel("@@initialState");
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
    form.setFieldsValue({ replicas: 1 });
  }, []);

  const currentFormConfig = useMemo(() => STEPS[step - 1]?.formConfig, [step]);

  const handleClose = () => {
    form.resetFields();
    setStep(1);
    setFormValues({ replicas: 1 });
    onClose();
  };

  const handlePrev = () => {
    if (step === 2) {
      const containerFormValues = containerRef.current?.form?.getFieldsValue();
      const existContainers = containerRef.current?.getExistContainers();
      setFormValues({
        ...formValues,
        containers: containerFormValues.containerList?.map((item, index) => {
          return {
            ...item,
            type: existContainers[index]?.type,
          };
        }),
        ...containerFormValues,
        containerControlState: containerRef?.current?.getControlState?.(),
      });
      setStep(step - 1);
      return;
    }
    if (step === 3) {
      const volumeFormValues = volumeRef.current?.form?.getFieldsValue();
      const existVolumes = volumeRef.current?.getExistVolumes();
      setFormValues({
        ...formValues,
        volumes: volumeFormValues.volumeList?.map((item, index) => {
          return {
            ...item,
            type: existVolumes[index]?.type,
          };
        }),
        ...volumeFormValues,
      });
      setStep(step - 1);
      return;
    }
    if (step === 4) {
      const settingFormValues = settingRef.current?.form?.getFieldsValue();
      setFormValues({
        ...formValues,
        ...settingFormValues,
        settingControlState: settingRef?.current?.getControlState?.(),
      });
      setStep(step - 1);
      return;
    }
    if (step > 1) {
      setStep(step - 1);
      return;
    }
    handleClose();
  };

  const handleNext = () => {
    if (step === 1) {
      form.validateFields().then((values) => {
        setFormValues({ ...formValues, ...values });
        setStep(step + 1);
      });
    }
    if (step === 2) {
      containerRef?.current?.form?.validateFields().then((values) => {
        if (
          containerRef.current
            ?.getExistContainers()
            ?.filter((container) => container.type === "work").length === 0
        ) {
          message.error("Please add at least one work container.");
          return;
        }
        const existContainers = containerRef.current?.getExistContainers();
        setFormValues({
          ...formValues,
          containers: values.containerList?.map((item, index) => {
            return {
              ...item,
              type: existContainers[index].type,
            };
          }),
          ...values,
          containerControlState: containerRef?.current?.getControlState?.(),
        });
        setStep(step + 1);
      });
    }
    if (step === 3) {
      volumeRef?.current?.form?.validateFields().then((values) => {
        const existVolumes = volumeRef.current?.getExistVolumes();
        setFormValues({
          ...formValues,
          volumes: values.volumeList?.map((item, index) => {
            return {
              ...item,
              type: existVolumes[index].type,
            };
          }),
          ...values,
        });
        setStep(step + 1);
      });
    }
    if (step === 4) {
      settingRef?.current?.form?.validateFields().then((values) => {
        setFormValues({
          ...formValues,
          ...values,
          settingControlState: settingRef?.current?.getControlState?.(),
        });
        handleSubmit({
          ...formValues,
          ...values,
          settingControlState: settingRef?.current?.getControlState?.(),
        });
      });
    }
  };

  const handleContainerFormToApiData = (containerFormData, volumeFormData) => {
    const volumeMounts = [];
    volumeFormData?.forEach((itemVolume) => {
      itemVolume.container?.items
        ?.filter(
          (itemContainer) => itemContainer.name === containerFormData.name
        )
        .forEach((itemMount) => {
          volumeMounts.push({
            name: itemVolume.name,
            mountPath: itemMount.mountPath,
          });
        });
    });
    return {
      name: containerFormData.name,
      image: containerFormData.image,
      command: containerFormData.commandParams?.command,
      args: containerFormData.commandParams?.args,
      workingDir: containerFormData.commandParams?.workingDir,
      ports: containerFormData.ports,
      envFrom: containerFormData.envParams?.envFrom?.map((itemEnvFrom) => ({
        prefix: itemEnvFrom.prefix,
        [itemEnvFrom.type]: {
          name: itemEnvFrom.name,
        },
      })),
      env: containerFormData.envParams?.env?.map((itemEnv) => {
        switch (itemEnv.type) {
          case "value":
            return {
              name: itemEnv.key,
              value: itemEnv.value,
            };
          case "fieldRef":
            return {
              name: itemEnv.key,
              valueFrom: {
                fieldRef: {
                  fieldPath: itemEnv.fieldPath,
                },
              },
            };
          case "resourceFieldRef":
            return {
              name: itemEnv.key,
              valueFrom: {
                resourceFieldRef: {
                  resource: itemEnv.resource,
                },
              },
            };
          case "configMapKeyRef":
            return {
              name: itemEnv.key,
              valueFrom: {
                configMapKeyRef: {
                  name: itemEnv.name,
                  key: itemEnv.keyFrom,
                },
              },
            };
          case "secretKeyRef":
            return {
              name: itemEnv.key,
              valueFrom: {
                secretKeyRef: {
                  name: itemEnv.name,
                  key: itemEnv.keyFrom,
                },
              },
            };
          default:
            return {};
        }
      }),
      resources: containerFormData.resources,
      securityContext: containerFormData.securityContext,
      volumeMounts,
    };
  };

  const handleVolumeFormToApiData = (volumeFormData) => {
    return volumeFormData?.map((itemVolume) => {
      switch (itemVolume.type) {
        case "emptyDir":
          return {
            name: itemVolume.name,
            emptyDir: {},
          };
        case "hostPath":
        case "configMap":
        case "secret":
          return {
            name: itemVolume.name,
            [itemVolume.type]: itemVolume.data,
          };
      }
    });
  };

  const handleSubmit = (formValues: any) => {
    const postData: any = {
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: {},
      spec: {
        selector: {},
        template: {
          metadata: {},
          spec: {
            initContainers: [],
            containers: [],
            volumes: [],
            nodeSelector: {},
            securityContext: {},
            affinity: {},
          },
        },
        strategy: {},
      },
    };
    let annotations = formValues.annotations || [];
    if (formValues.description) {
      annotations.push({
        key: "kubeedge.dashboard.cn/displayName",
        value: formValues.description,
      });
    }
    const allLabels = arrayToObject(
      (formValues.labels || []).concat({
        key: "kubeedge.dashboard.cn/name",
        value: formValues.name,
      })
    );
    postData.metadata = {
      name: formValues.name,
      namespace: formValues.namespace,
      annotations: arrayToObject(annotations),
      labels: allLabels,
    };
    postData.spec.selector = {
      matchLabels: allLabels,
    };
    postData.spec.template.metadata = {
      labels: allLabels,
    };
    postData.spec.replicas = formValues.replicas;
    const initContainers = formValues.containers
      ?.filter((item) => item.type === "initial")
      ?.map((itemInitContainer) =>
        handleContainerFormToApiData(itemInitContainer, formValues.volumes)
      );
    const workContainers = formValues.containers
      ?.filter((item) => item.type === "work")
      ?.map((itemWorkContainer) =>
        handleContainerFormToApiData(itemWorkContainer, formValues.volumes)
      );
    postData.spec.template.spec.initContainers = initContainers || [];
    postData.spec.template.spec.containers = workContainers || [];
    postData.spec.template.spec.volumes =
      handleVolumeFormToApiData(formValues.volumes) || [];
    if (formValues.nodeNameForm) {
      postData.spec.template.spec.nodeName = formValues.nodeNameForm;
    }
    if (formValues.nodeSelector?.length) {
      postData.spec.template.spec.nodeSelector = arrayToObject(
        formValues.nodeSelector
      );
    }
    if (formValues.strategy?.type) {
      postData.spec.strategy = formValues.strategy;
    }
    if (formValues.minReadySeconds) {
      postData.spec.minReadySeconds = formValues.minReadySeconds;
    }
    if (formValues.revisionHistoryLimit) {
      postData.spec.revisionHistoryLimit = formValues.revisionHistoryLimit;
    }
    if (formValues.progressDeadlineSeconds) {
      postData.spec.progressDeadlineSeconds =
        formValues.progressDeadlineSeconds;
    }
    const nodeReqExpKey =
      formValues.nodeAffinity
        ?.requiredDuringSchedulingIgnoredDuringExecution?.[0]?.nodeSelectorTerms
        ?.matchExpressions?.[0]?.key;
    const nodeReqFieKey =
      formValues.nodeAffinity
        ?.requiredDuringSchedulingIgnoredDuringExecution?.[0]?.nodeSelectorTerms
        ?.matchFields?.[0]?.key;
    const nodePreExpKey =
      formValues.nodeAffinity
        ?.preferredDuringSchedulingIgnoredDuringExecution?.[0]?.preference
        ?.matchExpressions?.[0]?.key;
    const nodePreFieKey =
      formValues.nodeAffinity
        ?.preferredDuringSchedulingIgnoredDuringExecution?.[0]?.preference
        ?.matchFields?.[0]?.key;
    if (nodeReqExpKey || nodeReqFieKey || nodePreExpKey || nodePreFieKey) {
      postData.spec.template.spec.affinity.nodeAffinity = {};
      if (nodeReqExpKey || nodeReqFieKey) {
        postData.spec.template.spec.affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution =
          formValues.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution.map(
            (item) => ({
              nodeSelectorTerms: {
                matchExpressions: item.nodeSelectorTerms.matchExpressions?.[0]
                  ?.key
                  ? item.nodeSelectorTerms.matchExpressions
                  : null,
                matchFields: item.nodeSelectorTerms.matchFields?.[0]?.key
                  ? item.nodeSelectorTerms.matchFields
                  : null,
              },
            })
          );
      }
      if (nodePreExpKey || nodePreFieKey) {
        postData.spec.template.spec.affinity.nodeAffinity.preferredDuringSchedulingIgnoredDuringExecution =
          formValues.nodeAffinity.preferredDuringSchedulingIgnoredDuringExecution.map(
            (item) => ({
              nodeSelectorTerms: {
                matchExpressions: item.preference.matchExpressions?.[0]?.key
                  ? item.preference.matchExpressions
                  : null,
                matchFields: item.preference.matchFields?.[0]?.key
                  ? item.preference.matchFields
                  : null,
              },
            })
          );
      }
    }
    const podReqExpKey =
      formValues.podAffinity
        ?.requiredDuringSchedulingIgnoredDuringExecution?.[0]?.labelSelector
        ?.matchExpressions?.[0]?.key;
    const podReqLabKey =
      formValues.podAffinity
        ?.requiredDuringSchedulingIgnoredDuringExecution?.[0]?.labelSelector
        ?.matchLabels?.[0]?.key;
    const podPreExpKey =
      formValues.podAffinity
        ?.preferredDuringSchedulingIgnoredDuringExecution?.[0]?.podAffinityTerm
        ?.labelSelector?.matchExpressions?.[0]?.key;
    const podPreLabKey =
      formValues.podAffinity
        ?.preferredDuringSchedulingIgnoredDuringExecution?.[0]?.podAffinityTerm
        ?.labelSelector?.matchLabels?.[0]?.key;
    if (podReqExpKey || podReqLabKey || podPreExpKey || podPreLabKey) {
      postData.spec.template.spec.affinity.podAffinity = {};
      if (podReqExpKey || podReqLabKey) {
        postData.spec.template.spec.affinity.podAffinity.requiredDuringSchedulingIgnoredDuringExecution =
          formValues.podAffinity.requiredDuringSchedulingIgnoredDuringExecution.map(
            (item) => ({
              ...item,
              labelSelector: {
                matchExpressions: item.labelSelector.matchExpressions?.[0]?.key
                  ? item.labelSelector.matchExpressions
                  : null,
                matchLabels: item.labelSelector.matchLabels?.[0]?.key
                  ? arrayToObject(item.labelSelector.matchLabels)
                  : null,
              },
            })
          );
      }
      if (podPreExpKey || podPreLabKey) {
        postData.spec.template.spec.affinity.podAffinity.preferredDuringSchedulingIgnoredDuringExecution =
          formValues.podAffinity.preferredDuringSchedulingIgnoredDuringExecution.map(
            (item) => ({
              ...item,
              podAffinityTerm: {
                ...item.podAffinityTerm,
                labelSelector: {
                  matchExpressions: item.podAffinityTerm?.labelSelector
                    ?.matchExpressions?.[0]?.key
                    ? item.podAffinityTerm.labelSelector.matchExpressions
                    : null,
                  matchLabels: item.podAffinityTerm?.labelSelector
                    ?.matchLabels?.[0]?.key
                    ? arrayToObject(
                        item.podAffinityTerm.labelSelector.matchLabels
                      )
                    : null,
                },
              },
            })
          );
      }
    }
    const podAntiReqExpKey =
      formValues.podAntiAffinity
        ?.requiredDuringSchedulingIgnoredDuringExecution?.[0]?.labelSelector
        ?.matchExpressions?.[0]?.key;
    const podAntiReqLabKey =
      formValues.podAntiAffinity
        ?.requiredDuringSchedulingIgnoredDuringExecution?.[0]?.labelSelector
        ?.matchLabels?.[0]?.key;
    const podAntiPreExpKey =
      formValues.podAntiAffinity
        ?.preferredDuringSchedulingIgnoredDuringExecution?.[0]?.podAffinityTerm
        ?.labelSelector?.matchExpressions?.[0]?.key;
    const podAntiPreLabKey =
      formValues.podAntiAffinity
        ?.preferredDuringSchedulingIgnoredDuringExecution?.[0]?.podAffinityTerm
        ?.labelSelector?.matchLabels?.[0]?.key;
    if (
      podAntiReqExpKey ||
      podAntiReqLabKey ||
      podAntiPreExpKey ||
      podAntiPreLabKey
    ) {
      postData.spec.template.spec.affinity.podAntiAffinity = {};
      if (podAntiReqExpKey || podAntiReqLabKey) {
        postData.spec.template.spec.affinity.podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution =
          formValues.podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution.map(
            (item) => ({
              ...item,
              labelSelector: {
                matchExpressions: item.labelSelector.matchExpressions?.[0]?.key
                  ? item.labelSelector.matchExpressions
                  : null,
                matchLabels: item.labelSelector.matchLabels?.[0]?.key
                  ? arrayToObject(item.labelSelector.matchLabels)
                  : null,
              },
            })
          );
      }
      if (podAntiPreExpKey || podAntiPreLabKey) {
        postData.spec.template.spec.affinity.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution =
          formValues.podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.map(
            (item) => ({
              ...item,
              podAffinityTerm: {
                ...item.podAffinityTerm,
                labelSelector: {
                  matchExpressions: item.podAffinityTerm?.labelSelector
                    ?.matchExpressions?.[0]?.key
                    ? item.podAffinityTerm.labelSelector.matchExpressions
                    : null,
                  matchLabels: item.podAffinityTerm?.labelSelector
                    ?.matchLabels?.[0]?.key
                    ? arrayToObject(
                        item.podAffinityTerm.labelSelector.matchLabels
                      )
                    : null,
                },
              },
            })
          );
      }
    }
    onOk({ namespace: formValues.namespace, data: postData });
  };

  useEffect(() => {
    form.setFieldsValue({ namespace: initialState.namespace });
  }, [initialState.namespace]);

  useEffect(() => {
    form.setFieldsValue(formValues);
  }, [formValues]);

  return (
    <Spin spinning={loading}>
      <Drawer
        width={1060}
        title="Create Container"
        open={visible}
        onClose={handleClose}
        footer={
          <Space>
            <Button onClick={handlePrev}>
              {step > 1 ? "previous" : "Cancel"}
            </Button>
            <Button type="primary" onClick={handleNext}>
              {step < 4 ? "Next" : "Submit"}
            </Button>
          </Space>
        }
      >
        <Steps current={step - 1} direction="horizontal" items={STEPS} />
        <div style={{ display: "flex" }}>
          {step === 1 && (
            <Form
              form={form}
              labelCol={{ span: 4 }}
              style={{ padding: "32px 0", flex: 1 }}
              labelAlign="left"
            >
              {typeof currentFormConfig?.formItems === "function"
                ? currentFormConfig?.formItems(
                    form,
                    { namespace: namespacesList },
                    {},
                    formRef
                  )
                : currentFormConfig?.formItems}
            </Form>
          )}
          {step === 2 && (
            <ContainerInfo ref={containerRef} initialValues={formValues} />
          )}
          {step === 3 && (
            <StorageMount ref={volumeRef} initialValues={formValues} />
          )}
          {step === 4 && (
            <MoreSetting ref={settingRef} initialValues={formValues} />
          )}
        </div>
      </Drawer>
    </Spin>
  );
};

const STEPS = [
  {
    title: "Basic Info",
    key: 1,
    formConfig: DEPT_CONFIG["1"],
  },
  {
    title: "Container Info",
    key: 2,
  },
  {
    title: "Storage Mount",
    key: 3,
  },
  {
    title: "More Setting",
    key: 4,
  },
];
export default DeptDrawer;
