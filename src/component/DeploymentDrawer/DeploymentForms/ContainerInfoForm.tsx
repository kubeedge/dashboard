import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ConfigMap } from '@/types/configMap';
import { Secret } from '@/types/secret';

interface ContainerInfoFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
  configMaps: ConfigMap[];
  secrets: Secret[];
}

const fieldRefValues = ['meta.name', 'meta.namespace', 'meta.labels', 'meta.annotations', 'spec.nodeName', 'spec.serviceAccountName', 'status.hostIP', 'status.podIP'];
const resourceFieldRefValues = ['limits.cpu', 'limits.memory', 'requests.cpu', 'requests.memory'];

export default function ContainerInfoForm({ data, onChange, configMaps, secrets }: ContainerInfoFormProps) {
  const [refType, setRefType] = React.useState<string>('');
  const [keyRef, setKeyRef] = React.useState<string>('');
  const [keyFrom, setKeyFrom] = React.useState<string[]>([]);

  useEffect(() => {
    if (refType === 'configMapKeyRef') {
      const configMap = configMaps.find((configMap) => configMap.metadata?.name === keyRef);
      setKeyFrom(Object.keys(configMap?.data || {}));
    } else if (refType === 'secretKeyRef') {
      const secret = secrets.find((secret) => secret.metadata?.name === keyRef);
      setKeyFrom(Object.keys(secret?.data || {}));
    }
  }, [refType, keyRef, configMaps, secrets]);

  const handleAddContainer = (type: string) => {
    const updatedData = [...(data.containers || []), { type }];
    onChange('containers', updatedData);
  }

  const handleRemoveContainer = (index: number) => {
    const updatedData = [...(data.containers || [])];
    updatedData.splice(index, 1);
    onChange('containers', updatedData);
  }

  const handleFormChange = (index: number, field: string, value: any) => {
    const newData = [...(data.containers || [])];
    (newData[index] as any)[field] = value;
    onChange('containers', newData);
  };

  const handleAddEnvVar = (index: number) => {
    const newData = [...(data.containers || [])];
    newData[index].envVars = [...(newData[index].envVars || []), {}];
    onChange('containers', newData);
  };

  const handleAddConfig = (index: number) => {
    const newData = [...(data.containers || [])];
    newData[index].configs = [...(newData[index].configs || []), {}];
    onChange('containers', newData);
  };

  const handleAddPort = (index: number) => {
    const newData = [...(data.containers || [])];
    newData[index].ports = [...(newData[index].ports || []), {}];
    onChange('containers', newData);
  };

  const handleRemoveEnvVar = (index: number, envIndex: number) => {
    const updatedEnvVars = [...(data.containers || [{}])];
    updatedEnvVars[index].envVars?.splice(envIndex, 1);
    onChange('containers', updatedEnvVars);
  }

  const handleRemoveConfig = (index: number, configIndex: number) => {
    const updatedConfig = [...(data.containers || [{}])];
    updatedConfig[index].configs?.splice(configIndex, 1);
    onChange('containers', updatedConfig);
  }

  const handleRemovePort = (index: number, portIndex: number) => {
    const updatedPorts = [...(data.containers || [{}])];
    updatedPorts[index].ports?.splice(portIndex, 1);
    onChange('containers', updatedPorts);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Button variant="contained" onClick={() => handleAddContainer('init')} sx={{ width: 200, mr: 2 }}>
                Add initial container
              </Button>
              <Button variant="contained" onClick={() => handleAddContainer('work')} sx={{ width: 200 }}>
                Add work container
              </Button>
            </Box>

            {/* Initial Container Form */}
            {(data?.containers || [])?.map((container: any, index: number) => (
              <Box key={index} sx={{ display: 'flex', mt: 2 }}>
                <Box sx={{
                  width: '30%',
                  backgroundColor: container.type === 'init' ? '#0fbe8f' : '#234883',
                  p: 2,
                  mr: 2,
                  position: 'relative',
                  borderRadius: 1,
                }}>
                  <Typography variant="h6">{container.type === 'init' ? 'Initial Container' : 'Work Container'}</Typography>
                  <Typography variant="subtitle1">{container.name}</Typography>
                  <IconButton
                    color="error"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => handleRemoveContainer(index)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
                <Box sx={{ width: '70%' }}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    required
                    placeholder="Please enter name"
                    error={!container?.name}
                    helperText={!container?.name ? 'Missing name' : ''}
                    value={container?.name || ''}
                    onChange={(e) => handleFormChange(index, 'name', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Image"
                    variant="outlined"
                    fullWidth
                    required
                    placeholder="Please enter image"
                    error={!container?.image}
                    helperText={!container?.image ? 'Missing image' : ''}
                    value={container?.image || ''}
                    onChange={(e) => handleFormChange(index, 'image', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Method</InputLabel>
                    <Select
                      label="Method"
                      value={container?.method || ''}
                      onChange={(e) => handleFormChange(index, 'method', e.target.value)}
                    >
                      <MenuItem value="Always">Always</MenuItem>
                      <MenuItem value="Never">Never</MenuItem>
                      <MenuItem value="IfNotPresent">IfNotPresent</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Command */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(container?.showCommand)}
                        onChange={(e) => handleFormChange(index, 'showCommand', e.target.checked)}
                      />
                    }
                    label="Command"
                  />
                  {container?.showCommand && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
                      <TextField
                        label="Working directory"
                        variant="outlined"
                        placeholder="Working directory"
                        value={container?.workingDirectory || ''}
                        onChange={(e) => handleFormChange(index, 'workingDirectory', e.target.value)}
                      />
                      <TextField
                        label="Command"
                        variant="outlined"
                        placeholder="Please input Command and enter"
                        value={container?.command || ''}
                        onChange={(e) => handleFormChange(index, 'command', e.target.value)}
                      />
                      <TextField
                        label="Args"
                        variant="outlined"
                        placeholder="Please input Args and enter"
                        value={container?.args || ''}
                        onChange={(e) => handleFormChange(index, 'args', e.target.value)}
                      />
                    </Box>
                  )}

                  {/* Environment Variables */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(container?.showEnvVars)}
                        onChange={(e) => handleFormChange(index, 'showEnvVars', e.target.checked)}
                      />
                    }
                    label="Environment variables"
                  />
                  {container?.showEnvVars && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
                      {(container?.envVars || []).map((env: any, envIndex: number) => (
                        <Box key={index} sx={{ display: 'flex', gap: '10px' }}>
                          <TextField
                            label="Key"
                            variant="outlined"
                            placeholder="Please enter key"
                            error={!env.key}
                            helperText={!env.key ? 'Missing key' : ''}
                            value={env.key}
                            onChange={(e) => {
                              const updatedEnvVars = [...(container?.envVars || [{}])];
                              updatedEnvVars[envIndex].key = e.target.value;
                              handleFormChange(index, 'envVars', updatedEnvVars);
                            }}
                          />
                          <FormControl fullWidth>
                            <InputLabel>Key-value pair type</InputLabel>
                            <Select
                              label="Key-value pair type"
                              value={env.valueType}
                              onChange={(e) => {
                                const updatedEnvVars = [...(container?.envVars || [{}])];
                                updatedEnvVars[envIndex].valueType = e.target.value;
                                handleFormChange(index, 'envVars', updatedEnvVars);
                                setRefType(e.target.value);
                              }}
                            >
                              <MenuItem value="value">value</MenuItem>
                              <MenuItem value="fieldRef">fieldRef</MenuItem>
                              <MenuItem value="resourceFieldRef">resourceFieldRef</MenuItem>
                              <MenuItem value="configMapKeyRef">configMapKeyRef</MenuItem>
                              <MenuItem value="secretKeyRef">secretKeyRef</MenuItem>
                            </Select>
                          </FormControl>
                          {env.valueType === 'value' && (
                            <FormControl fullWidth>
                              <InputLabel>Value</InputLabel>
                              <TextField
                                label="Value"
                                variant="outlined"
                                value={env.value}
                                onChange={(e) => {
                                  const updatedEnvVars = [...(container?.envVars || [{}])];
                                  updatedEnvVars[envIndex].value = e.target.value;
                                  handleFormChange(index, 'envVars', updatedEnvVars);
                                }}
                              />
                            </FormControl>
                          )}
                          {(env.valueType === 'fieldRef' || env.valueType === 'resourceFieldRef') && (
                            <FormControl fullWidth>
                              <InputLabel>{env.valueType === 'fieldRef' ? 'field path' : 'resource'}</InputLabel>
                              <Select
                                value={env.value}
                                onChange={(e) => {
                                  const updatedEnvVars = [...(container?.envVars || [{}])];
                                  updatedEnvVars[envIndex].value = e.target.value;
                                  handleFormChange(index, 'envVars', updatedEnvVars);
                                }}
                              >
                                {(env.valueType === 'fieldRef' ? fieldRefValues : resourceFieldRefValues).map((value) => (
                                  <MenuItem key={value} value={value}>{value}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                          {(env.valueType === 'configMapKeyRef' || env.valueType === 'secretKeyRef') && (
                            <>
                              <FormControl fullWidth>
                                <InputLabel>name</InputLabel>
                                <Select
                                  value={env.value}
                                  onChange={(e) => {
                                    const updatedEnvVars = [...(container?.envVars || [{}])];
                                    updatedEnvVars[envIndex].value = e.target.value;
                                    handleFormChange(index, 'envVars', updatedEnvVars);
                                    setKeyRef(e.target.value);
                                  }}
                                >
                                  {(env.valueType === 'configMapKeyRef' ? configMaps : secrets).map((value: ConfigMap) => (
                                    <MenuItem key={value?.metadata?.uid} value={value?.metadata?.name}>{value?.metadata?.name}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormControl fullWidth>
                                <InputLabel>keyFrom</InputLabel>
                                <Select
                                  value={env.refName}
                                  onChange={(e) => {
                                    const updatedEnvVars = [...(container?.envVars || [{}])];
                                    updatedEnvVars[envIndex].refName = e.target.value;
                                    handleFormChange(index, 'envVars', updatedEnvVars);
                                  }}
                                >
                                  {keyFrom.map((value: string) => (
                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </>
                          )}

                          <IconButton
                            color="error"
                            onClick={() => handleRemoveEnvVar(index, envIndex)}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddEnvVar(index)}
                      >
                        Add Environment Variables
                      </Button>
                      {container?.configs?.map((config: any, configIndex: number) => (
                        <Box key={configIndex} sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
                          <FormControl fullWidth>
                            <InputLabel>Configuration type</InputLabel>
                            <Select
                              label="Configuration type"
                              value={config?.configType || ''}
                              onChange={(e) => {
                                const updatedConfigs = [...(container?.configs || [{}])];
                                updatedConfigs[configIndex].configType = e.target.value;
                                handleFormChange(index, 'configs', updatedConfigs);
                              }}
                            >
                              <MenuItem value="configMapRef">configMapRef</MenuItem>
                              <MenuItem value="secretRef">secretRef</MenuItem>
                            </Select>
                          </FormControl>
                          {config?.configType && (
                            <>
                              <FormControl fullWidth>
                                <InputLabel>Name</InputLabel>
                                <Select
                                  value={config?.name || ''}
                                  onChange={(e) => {
                                    const updatedConfigs = [...(container?.configs || [{}])];
                                    updatedConfigs[configIndex].name = e.target.value;
                                    handleFormChange(index, 'configs', updatedConfigs);
                                  }}
                                >
                                  {(config?.configType === 'configMapRef' ? configMaps : secrets)?.map((value: ConfigMap | Secret) => (
                                    <MenuItem key={value?.metadata?.uid} value={value?.metadata?.name}>{value?.metadata?.name}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <TextField
                                label="Prefix"
                                variant="outlined"
                                value={config?.prefix}
                                onChange={(e) => {
                                  const updatedConfigs = [...(container?.configs || [{}])];
                                  updatedConfigs[configIndex].prefix = e.target.value;
                                  handleFormChange(index, 'configs', updatedConfigs);
                                }}
                              />
                            </>
                          )}
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveConfig(index, configIndex)}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddConfig(index)}
                      >
                        Add Configuration
                      </Button>
                    </Box>
                  )}

                  {/* Resource Requirements */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(container?.showResourceRequirements)}
                        onChange={(e) => handleFormChange(index, 'showResourceRequirements', e.target.checked)}
                      />
                    }
                    label="Resource requirements"
                  />
                  {container?.showResourceRequirements && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
                      <TextField
                        label="Cpu resource request"
                        variant="outlined"
                        type="number"
                        placeholder="core"
                        value={container?.cpuRequest || ''}
                        onChange={(e) => handleFormChange(index, 'cpuRequest', e.target.value)}
                      />
                      <TextField
                        label="Cpu resource limit"
                        variant="outlined"
                        type="number"
                        placeholder="core"
                        value={container?.cpuLimit || ''}
                        onChange={(e) => handleFormChange(index, 'cpuLimit', e.target.value)}
                      />
                      <TextField
                        label="Memory resource request"
                        variant="outlined"
                        placeholder="10Mi"
                        value={container?.memoryRequest || ''}
                        onChange={(e) => handleFormChange(index, 'memoryRequest', e.target.value)}
                      />
                      <TextField
                        label="Memory resource limit"
                        variant="outlined"
                        placeholder="10Mi"
                        value={container?.memoryLimit || ''}
                        onChange={(e) => handleFormChange(index, 'memoryLimit', e.target.value)}
                      />
                    </Box>
                  )}

                  {/* Container Ports */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(container?.showPorts)}
                        onChange={(e) => handleFormChange(index, 'showPorts', e.target.checked)}
                      />
                    }
                    label="Container ports"
                  />
                  {container?.showPorts && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
                      {(container?.ports || []).map((port: any, portIndex: number) => (
                        <Box key={portIndex} sx={{ display: 'flex', gap: '10px' }}>
                          <FormControl fullWidth>
                            <InputLabel>Protocol</InputLabel>
                            <Select
                              label="Protocol"
                              value={port.protocol}
                              onChange={(e) => {
                                const updatedPorts = [...(container?.ports || [{}])];
                                updatedPorts[portIndex].protocol = e.target.value;
                                handleFormChange(index, 'ports', updatedPorts);
                              }}
                            >
                              <MenuItem value="TCP">TCP</MenuItem>
                              <MenuItem value="SCTP">SCTP</MenuItem>
                              <MenuItem value="UDP">UDP</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            label="Name"
                            variant="outlined"
                            value={port.name || ''}
                            onChange={(e) => {
                              const updatedPorts = [...(container?.ports || [{}])];
                              updatedPorts[portIndex].name = e.target.value;
                              handleFormChange(index, 'ports', updatedPorts);
                            }}
                          />
                          <TextField
                            label="Container Port"
                            variant="outlined"
                            type="number"
                            placeholder="port"
                            value={port.containerPort}
                            onChange={(e) => {
                              const updatedPorts = [...(container?.ports || [{}])];
                              updatedPorts[portIndex].containerPort = Number(e.target.value);
                              handleFormChange(index, 'ports', updatedPorts);
                            }}
                          />
                          <TextField
                            label="Host Port"
                            variant="outlined"
                            type="number"
                            value={port.hostPort || ''}
                            onChange={(e) => {
                              const updatedPorts = [...(container?.ports || [{}])];
                              updatedPorts[portIndex].hostPort = Number(e.target.value);
                              handleFormChange(index, 'ports', updatedPorts);
                            }}
                          />
                          <IconButton
                            color="error"
                            onClick={() => handleRemovePort(index, portIndex)}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddPort(index)}
                      >
                        Add Port
                      </Button>
                    </Box>
                  )}

                  {/* Security Context */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(container?.showSecurityContext)}
                        onChange={(e) => handleFormChange(index, 'showSecurityContext', e.target.checked)}
                      />
                    }
                    label="Security Context"
                  />
                  {container?.showSecurityContext && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <FormControl fullWidth>
                        <InputLabel>Privileged</InputLabel>
                        <Select
                          label="Privileged"
                          value={container?.privileged || ''}
                          onChange={(e) => handleFormChange(index, 'privileged', e.target.value)}
                        >
                          <MenuItem value="True">True</MenuItem>
                          <MenuItem value="False">False</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Allow Privilege Escalation</InputLabel>
                        <Select
                          label="Allow Privilege Escalation"
                          value={container?.allowPrivilegeEscalation || ''}
                          onChange={(e) => handleFormChange(index, 'allowPrivilegeEscalation', e.target.value)}
                        >
                          <MenuItem value="True">True</MenuItem>
                          <MenuItem value="False">False</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Read Only Root Filesystem</InputLabel>
                        <Select
                          label="Read Only Root Filesystem"
                          value={container?.readOnlyRootFilesystem || ''}
                          onChange={(e) => handleFormChange(index, 'readOnlyRootFilesystem', e.target.value)}
                        >
                          <MenuItem value="True">True</MenuItem>
                          <MenuItem value="False">False</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Run As Non Root</InputLabel>
                        <Select
                          label="Run As Non Root"
                          value={container?.runAsNonRoot || ''}
                          onChange={(e) => handleFormChange(index, 'runAsNonRoot', e.target.value)}
                        >
                          <MenuItem value="True">True</MenuItem>
                          <MenuItem value="False">False</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Run As User"
                        variant="outlined"
                        value={container?.runAsUser || ''}
                        onChange={(e) => handleFormChange(index, 'runAsUser', Number(e.target.value))}
                      />
                      <TextField
                        label="Run As Group"
                        variant="outlined"
                        value={container?.runAsGroup || ''}
                        onChange={(e) => handleFormChange(index, 'runAsGroup', Number(e.target.value))}
                      />
                      <TextField
                        label="ProcMount"
                        variant="outlined"
                        value={container?.procMount || ''}
                        onChange={(e) => handleFormChange(index, 'procMount', e.target.value)}
                      />
                      <TextField
                        label="Capabilities.add"
                        variant="outlined"
                        value={container?.capabilitiesAdd || ''}
                        onChange={(e) => handleFormChange(index, 'capabilitiesAdd', e.target.value)}
                      />
                      <TextField
                        label="Capabilities.drop"
                        variant="outlined"
                        value={container?.capabilitiesDrop || ''}
                        onChange={(e) => handleFormChange(index, 'capabilitiesDrop', e.target.value)}
                      />
                      <TextField
                        label="SELinuxOptions.user"
                        variant="outlined"
                        value={container?.seLinuxUser || ''}
                        onChange={(e) => handleFormChange(index, 'seLinuxUser', e.target.value)}
                      />
                      <TextField
                        label="SELinuxOptions.role"
                        variant="outlined"
                        value={container?.seLinuxRole || ''}
                        onChange={(e) => handleFormChange(index, 'seLinuxRole', e.target.value)}
                      />
                      <TextField
                        label="SELinuxOptions.type"
                        variant="outlined"
                        value={container?.seLinuxType || ''}
                        onChange={(e) => handleFormChange(index, 'seLinuxType', e.target.value)}
                      />
                      <TextField
                        label="SELinuxOptions.level"
                        variant="outlined"
                        value={container?.seLinuxLevel || ''}
                        onChange={(e) => handleFormChange(index, 'seLinuxLevel', e.target.value)}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
