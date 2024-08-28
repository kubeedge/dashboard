import React, { useState } from 'react';
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
import { Container } from '@/types/pod';

type FormData = Record<string, any>;

const ContainerInfoForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});

  const handleFormChange = (containerId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [containerId]: {
        ...prev[containerId],
        [field]: value
      }
    }));
  };

  const handleAddEnvVar = (containerId: string) => {
    const updatedEnvVars = [...((formData[containerId] as any)?.envVars || []), { key: '', valueType: '' }];
    handleFormChange(containerId, 'envVars', updatedEnvVars);
  };

  const handleAddPort = (containerId: string) => {
    const updatedPorts = [...(formData[containerId]?.ports || []), { protocol: '', containerPort: 0 }];
    handleFormChange(containerId, 'ports', updatedPorts);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Button variant="contained" onClick={() => handleFormChange('initial', 'addContainer', true)} sx={{ width: 200, mr: 2 }}>
                Add initial container
              </Button>
              <Button variant="contained" onClick={() => handleFormChange('work', 'addContainer', true)} sx={{ width: 200 }}>
                Add work container
              </Button>
            </Box>

            {/* Initial Container Form */}
            {(formData['initial'] as any)?.addContainer && (
              <Box sx={{ display: 'flex', mt: 2 }}>
                <Box sx={{ width: '30%', backgroundColor: '#0fbe8f', p: 2, mr: 2 }}>
                  <Typography variant="h6">Initial Container</Typography>
                  <IconButton
                    color="error"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => handleFormChange('initial', 'addContainer', false)}
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
                    error={!formData['initial']?.name}
                    helperText={!formData['initial']?.name ? 'Missing name' : ''}
                    value={formData['initial']?.name || ''}
                    onChange={(e) => handleFormChange('initial', 'name', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Image"
                    variant="outlined"
                    fullWidth
                    required
                    placeholder="Please enter image"
                    error={!formData['initial']?.image}
                    helperText={!formData['initial']?.image ? 'Missing image' : ''}
                    value={formData['initial']?.image || ''}
                    onChange={(e) => handleFormChange('initial', 'image', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Method</InputLabel>
                    <Select
                      value={formData['initial']?.method || ''}
                      onChange={(e) => handleFormChange('initial', 'method', e.target.value)}
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
                        checked={Boolean(formData['initial']?.command)}
                        onChange={(e) => handleFormChange('initial', 'command', e.target.checked ? {} : undefined)}
                      />
                    }
                    label="Command"
                  />
                  {formData['initial']?.command && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
                      <TextField
                        label="Working directory"
                        variant="outlined"
                        placeholder="Working directory"
                        value={formData['initial']?.command?.workingDirectory || ''}
                        onChange={(e) => handleFormChange('initial', 'command.workingDirectory', e.target.value)}
                      />
                      <TextField
                        label="Command"
                        variant="outlined"
                        placeholder="Please input Command and enter"
                        value={formData['initial']?.command?.command || ''}
                        onChange={(e) => handleFormChange('initial', 'command.command', e.target.value)}
                      />
                      <TextField
                        label="Args"
                        variant="outlined"
                        placeholder="Please input Args and enter"
                        value={formData['initial']?.command?.args || ''}
                        onChange={(e) => handleFormChange('initial', 'command.args', e.target.value)}
                      />
                    </Box>
                  )}

                  {/* Environment Variables */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(formData['initial']?.envVars)}
                        onChange={(e) => handleFormChange('initial', 'envVars', e.target.checked ? [] : undefined)}
                      />
                    }
                    label="Environment variables"
                  />
                  {formData['initial']?.envVars && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
                      {formData['initial']?.envVars.map((env: any, index: number) => (
                        <Box key={index} sx={{ display: 'flex', gap: '10px' }}>
                          <TextField
                            label="Key"
                            variant="outlined"
                            placeholder="Please enter key"
                            error={!env.key}
                            helperText={!env.key ? 'Missing key' : ''}
                            value={env.key}
                            onChange={(e) => {
                              const updatedEnvVars = [...(formData['initial']?.envVars || [])];
                              updatedEnvVars[index].key = e.target.value;
                              handleFormChange('initial', 'envVars', updatedEnvVars);
                            }}
                          />
                          <FormControl fullWidth>
                            <InputLabel>Key-value pair type</InputLabel>
                            <Select
                              value={env.valueType}
                              onChange={(e) => {
                                const updatedEnvVars = [...(formData['initial']?.envVars || [])];
                                updatedEnvVars[index].valueType = e.target.value;
                                handleFormChange('initial', 'envVars', updatedEnvVars);
                              }}
                            >
                              <MenuItem value="value">value</MenuItem>
                              <MenuItem value="fieldRef">fieldRef</MenuItem>
                              <MenuItem value="resourceFieldRef">resourceFieldRef</MenuItem>
                              <MenuItem value="configMapKeyRef">configMapKeyRef</MenuItem>
                              <MenuItem value="secretKeyRef">secretKeyRef</MenuItem>
                            </Select>
                          </FormControl>
                          <IconButton
                            color="error"
                            onClick={() => {
                              const updatedEnvVars = [...(formData['initial']?.envVars || [])];
                              updatedEnvVars.splice(index, 1);
                              handleFormChange('initial', 'envVars', updatedEnvVars);
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Configuration */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(formData['initial']?.configTypes)}
                        onChange={(e) => handleFormChange('initial', 'configTypes', e.target.checked ? [] : undefined)}
                      />
                    }
                    label="Add configuration"
                  />
                  {formData['initial']?.configTypes && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel>Configuration type</InputLabel>
                        <Select
                          value={formData['initial']?.configTypes[0] || ''}
                          onChange={(e) => handleFormChange('initial', 'configTypes', [e.target.value])}
                        >
                          <MenuItem value="configMapRef">configMapRef</MenuItem>
                          <MenuItem value="secretRef">secretRef</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  )}

                  {/* Resource Requirements */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(formData['initial']?.cpuRequest)}
                        onChange={(e) => handleFormChange('initial', 'cpuRequest', e.target.checked ? '' : undefined)}
                      />
                    }
                    label="Resource requirements"
                  />
                  {formData['initial']?.cpuRequest && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
                      <TextField
                        label="Cpu resource request"
                        variant="outlined"
                        type="number"
                        placeholder="core"
                        value={formData['initial']?.cpuRequest || ''}
                        onChange={(e) => handleFormChange('initial', 'cpuRequest', e.target.value)}
                      />
                      <TextField
                        label="Cpu resource limit"
                        variant="outlined"
                        type="number"
                        placeholder="core"
                        value={formData['initial']?.cpuLimit || ''}
                        onChange={(e) => handleFormChange('initial', 'cpuLimit', e.target.value)}
                      />
                      <TextField
                        label="Memory resource request"
                        variant="outlined"
                        placeholder="10Mi"
                        value={formData['initial']?.memoryRequest || ''}
                        onChange={(e) => handleFormChange('initial', 'memoryRequest', e.target.value)}
                      />
                      <TextField
                        label="Memory resource limit"
                        variant="outlined"
                        placeholder="10Mi"
                        value={formData['initial']?.memoryLimit || ''}
                        onChange={(e) => handleFormChange('initial', 'memoryLimit', e.target.value)}
                      />
                    </Box>
                  )}

                  {/* Container Ports */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(formData['initial']?.ports)}
                        onChange={(e) => handleFormChange('initial', 'ports', e.target.checked ? [] : undefined)}
                      />
                    }
                    label="Container ports"
                  />
                  {formData['initial']?.ports && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mb: 2 }}>
                      {formData['initial']?.ports.map((port: any, index: number) => (
                        <Box key={index} sx={{ display: 'flex', gap: '10px' }}>
                          <FormControl fullWidth>
                            <InputLabel>Protocol</InputLabel>
                            <Select
                              value={port.protocol}
                              onChange={(e) => {
                                const updatedPorts = [...(formData['initial']?.ports || [])];
                                updatedPorts[index].protocol = e.target.value;
                                handleFormChange('initial', 'ports', updatedPorts);
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
                              const updatedPorts = [...(formData['initial']?.ports || [])];
                              updatedPorts[index].name = e.target.value;
                              handleFormChange('initial', 'ports', updatedPorts);
                            }}
                          />
                          <TextField
                            label="Container Port"
                            variant="outlined"
                            type="number"
                            placeholder="port"
                            value={port.containerPort}
                            onChange={(e) => {
                              const updatedPorts = [...(formData['initial']?.ports || [])];
                              updatedPorts[index].containerPort = Number(e.target.value);
                              handleFormChange('initial', 'ports', updatedPorts);
                            }}
                          />
                          <TextField
                            label="Host Port"
                            variant="outlined"
                            type="number"
                            value={port.hostPort || ''}
                            onChange={(e) => {
                              const updatedPorts = [...(formData['initial']?.ports || [])];
                              updatedPorts[index].hostPort = Number(e.target.value);
                              handleFormChange('initial', 'ports', updatedPorts);
                            }}
                          />
                          <IconButton
                            color="error"
                            onClick={() => {
                              const updatedPorts = [...(formData['initial']?.ports || [])];
                              updatedPorts.splice(index, 1);
                              handleFormChange('initial', 'ports', updatedPorts);
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddPort('initial')}
                      >
                        Add Port
                      </Button>
                    </Box>
                  )}

                  {/* Security Context */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(formData['initial']?.securityContext)}
                        onChange={(e) => handleFormChange('initial', 'securityContext', e.target.checked ? {} : undefined)}
                      />
                    }
                    label="Security Context"
                  />
                  {formData['initial']?.securityContext && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <FormControl fullWidth>
                        <InputLabel>Privileged</InputLabel>
                        <Select
                          value={formData['initial']?.securityContext.privileged || ''}
                          onChange={(e) => handleFormChange('initial', 'securityContext.privileged', e.target.value)}
                        >
                          <MenuItem value="True">True</MenuItem>
                          <MenuItem value="False">False</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Allow Privilege Escalation</InputLabel>
                        <Select
                          value={formData['initial']?.securityContext.allowPrivilegeEscalation || ''}
                          onChange={(e) => handleFormChange('initial', 'securityContext.allowPrivilegeEscalation', e.target.value)}
                        >
                          <MenuItem value="True">True</MenuItem>
                          <MenuItem value="False">False</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Read Only Root Filesystem</InputLabel>
                        <Select
                          value={formData['initial']?.securityContext.readOnlyRootFilesystem || ''}
                          onChange={(e) => handleFormChange('initial', 'securityContext.readOnlyRootFilesystem', e.target.value)}
                        >
                          <MenuItem value="True">True</MenuItem>
                          <MenuItem value="False">False</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Run As Non Root</InputLabel>
                        <Select
                          value={formData['initial']?.securityContext.runAsNonRoot || ''}
                          onChange={(e) => handleFormChange('initial', 'securityContext.runAsNonRoot', e.target.value)}
                        >
                          <MenuItem value="True">True</MenuItem>
                          <MenuItem value="False">False</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Run As User"
                        variant="outlined"
                        type="number"
                        value={formData['initial']?.securityContext.runAsUser || ''}
                        onChange={(e) => handleFormChange('initial', 'securityContext.runAsUser', Number(e.target.value))}
                      />
                      <TextField
                        label="Run As Group"
                        variant="outlined"
                        type="number"
                        value={formData['initial']?.securityContext.runAsGroup || ''}
                        onChange={(e) => handleFormChange('initial', 'securityContext.runAsGroup', Number(e.target.value))}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* Work Container Form */}
            {formData['work']?.addContainer && (
              <Box sx={{ display: 'flex', mt: 2 }}>
                <Box sx={{ width: '30%', backgroundColor: '#234883', p: 2, mr: 2 }}>
                  <Typography variant="h6">Work Container</Typography>
                  <IconButton
                    color="error"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => handleFormChange('work', 'addContainer', false)}
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
                    error={!formData['work']?.name}
                    helperText={!formData['work']?.name ? 'Missing name' : ''}
                    value={formData['work']?.name || ''}
                    onChange={(e) => handleFormChange('work', 'name', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Image"
                    variant="outlined"
                    fullWidth
                    required
                    placeholder="Please enter image"
                    error={!formData['work']?.image}
                    helperText={!formData['work']?.image ? 'Missing image' : ''}
                    value={formData['work']?.image || ''}
                    onChange={(e) => handleFormChange('work', 'image', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Image Pull Policy"
                    variant="outlined"
                    fullWidth
                    placeholder="Please select policy"
                    value={formData['work']?.imagePullPolicy || ''}
                    onChange={(e) => handleFormChange('work', 'imagePullPolicy', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Command"
                    variant="outlined"
                    fullWidth
                    placeholder="Please enter command"
                    value={formData['work']?.command || ''}
                    onChange={(e) => handleFormChange('work', 'command', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Args"
                    variant="outlined"
                    fullWidth
                    placeholder="Please enter args"
                    value={formData['work']?.args || ''}
                    onChange={(e) => handleFormChange('work', 'args', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ContainerInfoForm;
