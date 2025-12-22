
'use client';
import React, { useEffect, useState } from 'react';
import { Drawer, Box, Button, Stepper, Step, StepLabel } from '@mui/material';
import BasicInfoForm from './DeploymentForms/BasicInfoForm';
import ContainerInfoForm from './DeploymentForms/ContainerInfoForm';
import StorageMountForm from './DeploymentForms/StorageMountForm';
import MoreSettingForm from './DeploymentForms/MoreSettingForm';
import { Deployment } from '@/types/deployment';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { useListConfigMaps } from '@/api/configMap';
import { useListSecrets } from '@/api/secret';
import { useListNamespaces } from '@/api/namespace';
import { Container, ContainerPort, EnvFromSource, EnvVar, VolumeMount } from '@/types/pod';
import { Volume } from '@/types/volume';

interface DeploymentDrawerProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: Deployment) => void;
  onCreated?: () => void;
}

export default function DeploymentDrawer({ open, onClose, onSubmit, onCreated }: DeploymentDrawerProps) {
  const { t } = useI18n();
  const steps = [t('table.basicInfo'), t('table.containerInfo'), t('table.storageMount'), t('table.moreSetting')];
  const [namespace, setNamespace] = useState<string>('');
  const [activeStep, setActiveStep] = useState(0);
  const { error } = useAlert();

  const [data, setData] = useState<any>({});
  const { data: configMaps } = useListConfigMaps(namespace);
  const { data: secrets } = useListSecrets(namespace);
  const { data: namespaces } = useListNamespaces();
  const [showBasicInfoValidation, setShowBasicInfoValidation] = useState(false);
  // Add below existing state declarations
  const [showContainerInfoValidation, setShowContainerInfoValidation] = useState(false);

  const handleDataChange = (field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    if (field === 'namespace') {
      setNamespace(value);
    }
    // Reset container validation state when container data changes
    if (field === 'containers') {
      setShowContainerInfoValidation(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate Basic Info form required fields
      const hasEmptyFields = !data?.namespace || !data?.name || !(data?.replicas || 1);
      if (hasEmptyFields) {
        setShowBasicInfoValidation(true);
        return; // Prevent continuing to next step
      }
    } else if (activeStep === 1) {
      // Validate Container Info form required fields
      const containers = data?.containers || [];
      const hasContainers = containers.length > 0;
      // Check required fields for each container (name and image)
      const allContainersValid = containers.length > 0 && containers.every((c: any) => c.name && c.image);
      const hasInit = containers.some((c: any) => c.type === 'init');
      const hasWork = containers.some((c: any) => c.type === 'work');
      if (!(hasInit && hasWork && allContainersValid)) {
        setShowContainerInfoValidation(true);
        return; // Prevent continuing to next step
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setData({});
    setShowBasicInfoValidation(false);
    setShowContainerInfoValidation(false); // Add this line to reset container validation state
  };

  const getContainers = () => {
    const containers: Container[] = [];
    const initContainers: Container[] = [];

    data?.containers?.forEach((record: any) => {
      const volumeMounts: VolumeMount[] | undefined = data?.volumes?.mountContainers?.filter((mount: any) => mount.container === record.name)?.map((record: any) => ({
        name: record.volumeName,
        mountPath: record.mountPath,
      }));
      const container: Container = {
        name: record.name,
        image: record.image,
        imagePullPolicy: record.method,
        volumeMounts: volumeMounts,
      }

      if (record.showCommand) {
        container.command = record?.command?.split(' ');
        container.args = record?.args?.split(' ');
        container.workingDir = record.workingDirectory;
      }
      if (record.showEnvVars) {
        const envs: EnvVar[] = [];
        const envFroms: EnvFromSource[] = [];
        record?.envVars?.forEach((envVar: any) => {
          const env: EnvVar = {
            name: envVar.key || '',
            valueFrom: {},
          }
          switch (envVar.valueType) {
            case 'value':
              env.value = envVar.value;
              break;
            case 'fieldRef':
              env.valueFrom.fieldRef = {
                fieldPath: envVar.value,
              };
              break;
            case 'resourceFieldRef':
              env.valueFrom.resourceFieldRef = {
                resource: envVar.value,
              };
            case 'configMapKeyRef':
              env.valueFrom.configMapKeyRef = {
                key: envVar.value,
                name: envVar.refName,
              };
              break;
            case 'secretKeyRef':
              env.valueFrom.secretKeyRef = {
                key: envVar.value,
                name: envVar.refName,
              };
              break;
          }
          envs.push(envVar);
        });
        record?.configs?.forEach((config: any) => {
          switch (config.sourceType) {
            case 'configMapRef':
              envFroms.push({
                configMapRef: {
                  name: config.name,
                },
                prefix: config.prefix,
              });
              break;
            case 'secretRef':
              envFroms.push({
                secretRef: {
                  name: config.sourceName,
                },
                prefix: config.prefix,
              });
              break;
          }
        });
        if (envs.length) {
          container.env = envs;
        }
        if (envFroms.length) {
          container.envFrom = envFroms;
        }
      }
      if (record.showResourceRequirements) {
        container.resources = {
          requests: {
            cpu: record.cpuRequest,
            memory: record.memoryRequest,
          },
          limits: {
            cpu: record.cpuLimit,
            memory: record.memoryLimit,
          },
        };
      }
      if (record.showPorts) {
        const ports: ContainerPort[] = [];
        record?.ports?.forEach((port: any) => {
          ports.push({
            protocol: port.protocol,
            name: port.name,
            containerPort: port.containerPort,
            hostPort: port.hostPort,
          });
        });
        if (ports.length) {
          container.ports = ports;
        }
      }
      if (record.showSecurityContext) {
        container.securityContext = {
          privileged: record.privileged === 'True',
          allowPrivilegeEscalation: record.allowPrivilegeEscalation === 'True',
          readOnlyRootFilesystem: record.readOnlyRootFilesystem === 'True',
          runAsNonRoot: record.runAsNonRoot === 'True',
          runAsUser: record.runAsUser,
          runAsGroup: record.runAsGroup,
          procMount: record.procMount,
          capabilities: {
            add: record.capabilitiesAdd?.split(','),
            drop: record.capabilitiesDrop?.split(','),
          },
          seLinuxOptions: {
            level: record.seLinuxLevel,
            role: record.seLinuxRole,
            type: record.seLinuxType,
            user: record.seLinuxUser,
          },
        };
      }

      switch (record.type) {
        case 'init':
          initContainers.push(container);
          break;
        default:
          containers.push(container);
          break;
      }
    });

    return {
      containers,
      initContainers,
    }
  }

  const getVolumes = () => {
    return data?.volumes?.map((record: any) => {
      const volume: Volume = {
        name: record.name,
      };

      switch (record.type) {
        case 'EmptyDir':
          volume.emptyDir = {};
          break;
        case 'HostPath':
          volume.hostPath = {
            path: record.hostPath,
            type: record.hostPathType,
          };
          break;
        case 'ConfigMap':
          volume.configMap = {
            name: record.configMap,
            items: record?.keyToPaths?.map((keyToPath: any) => ({
              key: keyToPath.key,
              value: keyToPath.path,
            })),
          };
          break;
        case 'Secret':
          volume.secret = {
            secretName: record.secret,
            items: record?.keyToPaths?.map((keyToPath: any) => ({
              key: keyToPath.key,
              value: keyToPath.path,
            })),
          };
          break;
        default:
      }

      return volume;
    })
  }

  const handleFormSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const annotations = data.annotations?.reduce((acc: any, cur: any) => {
      acc[cur.key] = cur.value;
      return acc;
    }, {}) || {};
    if (data.description) {
      annotations['kubeedge.dashboard.cn/displayName'] = data.description;
    }
    const labels = data.labels?.reduce((acc: any, cur: any) => {
      acc[cur.key] = cur.value;
      return acc;
    }, {}) || {};
    labels['kubeedge.dashboard.cn/name'] = data.name;
    const { containers, initContainers } = getContainers();
    const volumes = getVolumes();

    const payload: Deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: data.name,
        namespace: data.namespace,
        labels,
        annotations,
      },
      spec: {
        selector: {
          matchLabels: labels,
        },
        template: {
          metadata: {
            labels,
          },
          spec: {
            containers,
            initContainers,
            volumes,
            nodeName: data.nodeName,
            nodeSelector: data.nodeSelector?.reduce((acc: any, cur: any) => {
              acc[cur.key] = cur.value;
              return acc;
            }, {}),
            affinity: {
              nodeAffinity: {
                requiredDuringSchedulingIgnoredDuringExecution: data.nodeAffinityRequiredConditions?.map((condition: any) => ({
                  matchExpressions: condition.matchExpressions?.map((expression: any) => ({
                    key: expression.key,
                    operator: expression.operator,
                    values: expression.values,
                  })),
                  matchFields: condition.matchFields?.map((field: any) => ({
                    key: field.key,
                    operator: field.operator,
                    values: field.values,
                  })),
                })),
                preferredDuringSchedulingIgnoredDuringExecution: data.nodeAffinityPreferredConditions?.map((condition: any) => ({
                  weight: condition.weight,
                  preference: {
                    matchExpressions: condition.matchExpressions?.map((expression: any) => ({
                      key: expression.key,
                      operator: expression.operator,
                      values: expression.values,
                    })),
                    matchFields: condition.matchFields?.map((field: any) => ({
                      key: field.key,
                      operator: field.operator,
                      values: field.values,
                    })),
                  },
                })),
              },
              podAffinity: {
                requiredDuringSchedulingIgnoredDuringExecution: data.podAffinityRequiredConditions?.map((condition: any) => ({
                  labelSelector: {
                    matchExpressions: condition.matchExpressions?.map((expression: any) => ({
                      key: expression.key,
                      operator: expression.operator,
                      values: expression.values,
                    })),
                    matchLabels: condition.matchLabels?.reduce((acc: any, cur: any) => {
                      acc[cur.key] = cur.value;
                      return acc;
                    }, {}),
                  },
                  namespaces: condition.namespaces,
                  topologyKey: condition.topologyKey,
                })),
                preferredDuringSchedulingIgnoredDuringExecution: data.podAffinityPreferredConditions?.map((condition: any) => ({
                  weight: condition.weight,
                  podAffinityTerm: {
                    labelSelector: {
                      matchExpressions: condition.matchExpressions?.map((expression: any) => ({
                        key: expression.key,
                        operator: expression.operator,
                        values: expression.values,
                      })),
                      matchLabels: condition.matchLabels?.reduce((acc: any, cur: any) => {
                        acc[cur.key] = cur.value;
                        return acc;
                      }, {}),
                    },
                    namespaces: condition.namespaces,
                    topologyKey: condition.topologyKey,
                  },
                })),
              },
              podAntiAffinity: {
                requiredDuringSchedulingIgnoredDuringExecution: data.podAntiAffinityRequiredConditions?.map((condition: any) => ({
                  labelSelector: {
                    matchExpressions: condition.matchExpressions?.map((expression: any) => ({
                      key: expression.key,
                      operator: expression.operator,
                      values: expression.values,
                    })),
                    matchLabels: condition.matchLabels?.reduce((acc: any, cur: any) => {
                      acc[cur.key] = cur.value;
                      return acc;
                    }, {}),
                  },
                  namespaces: condition.namespaces,
                  topologyKey: condition.topologyKey,
                })),
                preferredDuringSchedulingIgnoredDuringExecution: data.podAntiAffinityPreferredConditions?.map((condition: any) => ({
                  weight: condition.weight,
                  podAffinityTerm: {
                    labelSelector: {
                      matchExpressions: condition.matchExpressions?.map((expression: any) => ({
                        key: expression.key,
                        operator: expression.operator,
                        values: expression.values,
                      })),
                      matchLabels: condition.matchLabels?.reduce((acc: any, cur: any) => {
                        acc[cur.key] = cur.value;
                        return acc;
                      }, {}),
                    },
                    namespaces: condition.namespaces,
                    topologyKey: condition.topologyKey,
                  },
                })),
              },
            }
          }
        },
        replicas: data.replicas,
        ...(data.setStrategy ? {
          strategy: {
            type: data?.strategyType || 'RollingUpdate',
            ...(!data?.strategyType || data?.strategyType === 'RollingUpdate' ? {
              rollingUpdate: {
                maxSurge: data?.maxSurge,
                maxUnavailable: data?.maxUnavailable,
              },
            } : {})
          },
        } : {}),
        revisionHistoryLimit: data.revisionHistoryLimit,
        progressDeadlineSeconds: data.progressDeadlineSeconds,
        minReadySeconds: data.minReadySeconds,
      },
    };

    try {
      await onSubmit?.(payload);
      handleClose(event);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    handleReset();
    onClose?.();
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <BasicInfoForm
          data={data}
          onChange={handleDataChange}
          namespaces={namespaces?.items || []}
          showValidation={showBasicInfoValidation}
          onClearValidation={() => setShowBasicInfoValidation(false)}
        />;
      case 1:
        return <ContainerInfoForm
          data={data}
          onChange={handleDataChange}
          configMaps={configMaps?.items || []}
          secrets={secrets?.items || []}
          showValidation={showContainerInfoValidation} // Add this line
        />;
      case 2:
        return <StorageMountForm data={data} onChange={handleDataChange} configMaps={configMaps?.items || []} secrets={secrets?.items || []} />;
      case 3:
        return <MoreSettingForm data={data} onChange={handleDataChange} namespaces={namespaces?.items || []} />;
      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
          maxWidth: 900, // Maximum width 900px
          top: '50px',
          height: 'calc(100% - 50px)',
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
          padding: '20px',
          boxSizing: 'border-box',
          overflowX: 'hidden', // Prevent Drawer itself from overflowing
        },
      }}
    >
      <Box
        sx={{
          padding: '24px',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflowX: 'auto', // Content area horizontal scrolling
        }}
      >
        <Box sx={{ marginBottom: '24px' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          {activeStep === 0 ? (
            <Button onClick={handleClose}>{t('actions.cancel')}</Button>
          ) : (
            <Button onClick={handleBack}>{t('table.previous')}</Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="primary" onClick={handleFormSubmit}>
              {t('actions.confirm')}
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              {t('table.next')}
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
