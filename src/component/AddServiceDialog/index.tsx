import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, RadioGroup, Box, Typography, MenuItem, Select, InputLabel,
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Service } from '@/types/service';
import { useListNamespaces } from '@/api/namespace';
import { useAlert } from '@/hook/useAlert';

interface AddServiceDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: Service) => void;
}

export default function AddServiceDialog({ open, onClose, onSubmit }: AddServiceDialogProps) {
  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('');
  const [annotations, setAnnotations] = useState<{key: string, value: string}[]>([]);
  const [labels, setLabels] = useState<{key: string, value: string}[]>([]);
  const [selectors, setSelectors] = useState<{key: string, value: string}[]>([]);
  const [ports, setPorts] = useState<{protocol: string, name: string, port: string, nodePort: string, targetPort: string }[]>([]);
  const [externalIPs, setExternalIPs] = useState('');
  const [sessionAffinity, setSessionAffinity] = useState('');
  const [timeoutSeconds, setTimeoutSeconds] = useState('');
  const [publishNotReadyAddresses, setPublishNotReadyAddresses] = useState('');
  const [type, setType] = useState('');
  const [formErrors, setFormErrors] = useState<any>({});
  const namespaceData = useListNamespaces()?.data;
  const { setErrorMessage } = useAlert();

  const handleAddAnnotations = () => {
    setAnnotations([...annotations, { key: '', value: '' }]);
  };

  const handleAddLabels = () => {
    setLabels([...labels, { key: '', value: '' }]);
  };

  const handleAddSelectors = () => {
    setSelectors([...selectors, { key: '', value: '' }]);
  };

  const handleAddPorts = () => {
    if (type === 'ClusterIP' || type === 'NodePort' || type === 'Headless') {
      setPorts([...ports, { protocol: '', name: '', port: '', nodePort: '', targetPort: '' }]);
    }
  };

  const handleRemoveAnnotation = (index: number) => {
    setAnnotations(annotations.filter((_, i) => i !== index));
  };

  const handleRemoveLabel = (index: number) => {
    setLabels(labels.filter((_, i) => i !== index));
  };

  const handleRemoveSelector = (index: number) => {
    setSelectors(selectors.filter((_, i) => i !== index));
  };

  const handleRemovePort = (index: number) => {
    setPorts(ports.filter((_, i) => i !== index));
  };

  const handleAnnotationChange = (index: number, field: string, value: string) => {
    const newAnnotations = [...annotations];
    newAnnotations[index] = { ...newAnnotations[index], [field]: value };
    setAnnotations(newAnnotations);
  };

  const handleLabelChange = (index: number, field: string, value: string) => {
    const newLabels = [...labels];
    newLabels[index] = { ...newLabels[index], [field]: value };
    setLabels(newLabels);
  };

  const handleSelectorChange = (index: number, field: string, value: string) => {
    const newSelectors = [...selectors];
    newSelectors[index] = { ...newSelectors[index], [field]: value };
    setSelectors(newSelectors);
  };

  const handlePortChange = (index: number, field: string, value: string) => {
    const newPorts = [...ports];
    newPorts[index] = { ...newPorts[index], [field]: value };
    setPorts(newPorts);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedType = event.target.value;
    setType(selectedType);
    if (selectedType === 'ClusterIP') {
      setExternalIPs('');
      setSessionAffinity('');
      setTimeoutSeconds('');
    } else if (selectedType === 'NodePort') {
      setExternalIPs('');
      setSessionAffinity('');
    } else if (selectedType === 'Headless') {
      setExternalIPs('');
      setSessionAffinity('');
    }
  };

  const handleSessionAffinityChange = (event: SelectChangeEvent<string>) => {
    setSessionAffinity(event.target.value);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const errors: any = {};
    if (!type) errors.type = 'Missing type';
    // Add additional form validation if needed
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const body: Service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name,
        namespace,
        annotations: annotations.reduce((acc, annotation) => {
          acc[annotation.key] = annotation.value;
          return acc;
        }, {} as any),
        labels: labels.reduce((acc, label) => {
          acc[label.key] = label.value;
          return acc;
        }, {} as any),
      },
      spec: {
        type,
        ports: ports.map((port) => ({
          protocol: port.protocol,
          name: port.name,
          port: Number(port.port),
          nodePort: port.nodePort ? Number(port.nodePort) : undefined,
          targetPort: port.targetPort ? Number(port.targetPort) : undefined,
        })),
        selector: selectors.reduce((acc, selector) => {
          acc[selector.key] = selector.value;
          return acc;
        }, {} as any),
        publishNotReadyAddresses: publishNotReadyAddresses === 'True',
        sessionAffinity: sessionAffinity,
        sessionAffinityConfig: sessionAffinity === 'ClientIP' ? { clientIP: {timeoutSeconds: Number(timeoutSeconds)} } : undefined,
        externalIPs: externalIPs ? externalIPs.split(',') : undefined,
      }
    };

    try {
      await onSubmit?.(event, body);
      handleClose(event);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create Service');
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setNamespace('');
    setName('');
    setAnnotations([]);
    setLabels([]);
    setSelectors([]);
    setPorts([]);
    setExternalIPs('');
    setSessionAffinity('');
    setTimeoutSeconds('');
    setPublishNotReadyAddresses('');
    setType('');
    setFormErrors({});
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Service</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Namespace */}
          <Select
              value={namespace}
              onChange={(event) => setNamespace(event.target.value)}
              placeholder="Namespace"
            >
            {namespaceData?.items?.map((item) => (
              <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                {item?.metadata?.name}
              </MenuItem>
            ))}
          </Select>

          {/* Name */}
          <TextField
            label="Name"
            placeholder="name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />

          {/* Annotations */}
          <Box>
            <Typography variant="subtitle1">Annotations</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddAnnotations}
              sx={{ width: '100%' }}
            >
              Add Annotations
            </Button>
            {annotations.map((annotation, index) => (
              <Box key={index} sx={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <TextField
                  label="Key"
                  placeholder="Please input key"
                  variant="outlined"
                  value={annotation.key}
                  onChange={(e) => handleAnnotationChange(index, 'key', e.target.value)}
                  required
                />
                <TextField
                  label="Value"
                  placeholder="Please input value"
                  variant="outlined"
                  value={annotation.value}
                  onChange={(e) => handleAnnotationChange(index, 'value', e.target.value)}
                  required
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveAnnotation(index)}
                >
                  <RemoveIcon />
                </Button>
              </Box>
            ))}
          </Box>

          {/* Labels */}
          <Box>
            <Typography variant="subtitle1">Labels</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddLabels}
              sx={{ width: '100%' }}
            >
              Add Labels
            </Button>
            {labels.map((label, index) => (
              <Box key={index} sx={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <TextField
                  label="Key"
                  placeholder="Please input key"
                  variant="outlined"
                  value={label.key}
                  onChange={(e) => handleLabelChange(index, 'key', e.target.value)}
                  required
                />
                <TextField
                  label="Value"
                  placeholder="Please input value"
                  variant="outlined"
                  value={label.value}
                  onChange={(e) => handleLabelChange(index, 'value', e.target.value)}
                  required
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveLabel(index)}
                >
                  <RemoveIcon />
                </Button>
              </Box>
            ))}
          </Box>

          {/* Selectors */}
          <Box>
            <Typography variant="subtitle1">Selectors</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddSelectors}
              sx={{ width: '100%' }}
            >
              Add Selectors
            </Button>
            {selectors.map((selector, index) => (
              <Box key={index} sx={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <TextField
                  label="Key"
                  placeholder="Please input key"
                  variant="outlined"
                  value={selector.key}
                  onChange={(e) => handleSelectorChange(index, 'key', e.target.value)}
                  required
                />
                <TextField
                  label="Value"
                  placeholder="Please input value"
                  variant="outlined"
                  value={selector.value}
                  onChange={(e) => handleSelectorChange(index, 'value', e.target.value)}
                  required
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveSelector(index)}
                >
                  <RemoveIcon />
                </Button>
              </Box>
            ))}
          </Box>

          {/* PublishNotReadyAddresses */}
          <Box>
            <Typography variant="subtitle1">PublishNotReadyAddresses</Typography>
            <FormControl fullWidth>
              <InputLabel id="publishNotReadyAddresses-label">PublishNotReadyAddresses</InputLabel>
              <Select
                labelId="publishNotReadyAddresses-label"
                value={publishNotReadyAddresses}
                onChange={(e) => setPublishNotReadyAddresses(e.target.value)}
                label="PublishNotReadyAddresses"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="True">True</MenuItem>
                <MenuItem value="False">False</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Type */}
          <Box>
            <Typography variant="subtitle1">Type</Typography>
            <FormControl component="fieldset" error={!!formErrors.type}>
              <RadioGroup
                aria-label="type"
                name="type"
                value={type}
                onChange={handleTypeChange}
                row
              >
                <Button
                  variant={type === 'ClusterIP' ? 'contained' : 'outlined'}
                  onClick={() => setType('ClusterIP')}
                  sx={{ borderRadius: '0px', marginRight: '4px' }}
                >
                  ClusterIP
                </Button>
                <Button
                  variant={type === 'NodePort' ? 'contained' : 'outlined'}
                  onClick={() => setType('NodePort')}
                  sx={{ borderRadius: '0px', marginRight: '4px' }}
                >
                  NodePort
                </Button>
                <Button
                  variant={type === 'Headless' ? 'contained' : 'outlined'}
                  onClick={() => setType('Headless')}
                  sx={{ borderRadius: '0px', marginRight: '4px' }}
                >
                  Headless
                </Button>
              </RadioGroup>
              {formErrors.type && <Typography color="error">{formErrors.type}</Typography>}
            </FormControl>
          </Box>

          {/* Ports */}
          {(type === 'ClusterIP' || type === 'NodePort' || type === 'Headless') && (
            <Box>
              <Typography variant="subtitle1">Ports</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddPorts}
                sx={{ width: '100%' }}
              >
                Add Ports
              </Button>
              {ports.map((port, index) => (
                <Box key={index} sx={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <TextField
                    label="Protocol"
                    placeholder="Protocol"
                    variant="outlined"
                    value={port.protocol}
                    onChange={(e) => handlePortChange(index, 'protocol', e.target.value)}
                    required
                    select
                  >
                    <MenuItem value="TCP">TCP</MenuItem>
                    <MenuItem value="SCTP">SCTP</MenuItem>
                    <MenuItem value="UDP">UDP</MenuItem>
                  </TextField>
                  <TextField
                    label="Name"
                    placeholder="Name"
                    variant="outlined"
                    value={port.name}
                    onChange={(e) => handlePortChange(index, 'name', e.target.value)}
                  />
                  <TextField
                    label="Port"
                    placeholder="Port"
                    variant="outlined"
                    value={port.port}
                    onChange={(e) => handlePortChange(index, 'port', e.target.value)}
                    required
                  />
                  {type === 'NodePort' && (
                    <TextField
                      label="Node Port"
                      placeholder="Node Port"
                      variant="outlined"
                      value={port.nodePort}
                      onChange={(e) => handlePortChange(index, 'nodePort', e.target.value)}
                      required
                    />
                  )}
                  <TextField
                    label="Target Port"
                    placeholder="Target Port"
                    variant="outlined"
                    value={port.targetPort}
                    onChange={(e) => handlePortChange(index, 'targetPort', e.target.value)}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemovePort(index)}
                  >
                    <RemoveIcon />
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          {/* External IPs */}
          {(type === 'ClusterIP' || type === 'NodePort') && (
            <Box>
              <Typography variant="subtitle1">External IPs</Typography>
              <TextField
                label="External IPs"
                placeholder="Please input external IPs"
                variant="outlined"
                value={externalIPs}
                onChange={(e) => setExternalIPs(e.target.value)}
                fullWidth
              />
            </Box>
          )}

          {/* Session Affinity */}
          {(type === 'ClusterIP' || type === 'NodePort') && (
            <Box>
              <Typography variant="subtitle1">Session Affinity</Typography>
              <FormControl fullWidth>
                <InputLabel id="sessionAffinity-label">Session Affinity</InputLabel>
                <Select
                  labelId="sessionAffinity-label"
                  value={sessionAffinity}
                  onChange={(event) => handleSessionAffinityChange(event)}
                  label="Session Affinity"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="ClientIP">ClientIP</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {/* TimeoutSeconds */}
          {sessionAffinity === 'ClientIP' && (
            <Box>
              <Typography variant="subtitle1">Timeout Seconds</Typography>
              <TextField
                label="Timeout Seconds"
                placeholder="Please input timeout seconds"
                variant="outlined"
                value={timeoutSeconds}
                onChange={(e) => setTimeoutSeconds(e.target.value)}
                fullWidth
                required
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
