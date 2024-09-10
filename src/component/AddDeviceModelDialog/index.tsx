// src/component/AddDeviceModelDialog.js
import React from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DeviceModel } from '@/types/deviceModel';
import { useAlert } from '@/hook/useAlert';

const attributeTypes = ['INT', 'STRING', 'DOUBLE', 'FLOAT', 'BOOLEAN', 'BYTES'];

const typeOptions = {
  int: {
    accessMode: "ReadWrite",
    defaultValue: '1',
    minimum: '1',
    maximum: '5',
    unit: "度",
  },
  string: {
    accessMode: "ReadWrite",
    defaultValue: "default",
  },
  double: {
    accessMode: "ReadWrite",
    defaultValue: "1.0",
    minimum: "1.0",
    maximum: "5.0",
    unit: "度",
  },
  float: {
    accessMode: "ReadWrite",
    defaultValue: "1.0",
    minimum: "1.0",
    maximum: "5.0",
    unit: "度",
  },
  boolean: {
    accessMode: "ReadWrite",
    defaultValue: 'true',
  },
  bytes: {
    accessMode: "ReadWrite",
  },
};

interface AddDeviceModelDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: DeviceModel) => void;
}

const AddDeviceModelDialog = ({ open, onClose, onSubmit }: AddDeviceModelDialogProps) => {
  const [name, setName] = React.useState('');
  const [protocol, setProtocol] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [attributeName, setAttributeName] = React.useState('');
  const [attributeType, setAttributeType] = React.useState('');
  const [errors, setErrors] = React.useState<any>({
    name: '',
    protocol: '',
    description: '',
    attributeName: '',
    attributeType: '',
  });
  const { setErrorMessage } = useAlert();

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newErrors: any = {};
    if (!name) newErrors.name = 'Miss name';
    if (!protocol) newErrors.protocol = 'Miss protocol';
    if (!description) newErrors.description = 'Miss description';
    if (!attributeName) newErrors.attributeName = 'Miss attribute name';
    if (!attributeType) newErrors.attributeType = 'Miss attribute type';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        await onSubmit?.(event, {
          apiVersion: "devices.kubeedge.io/v1beta1",
          kind: "DeviceModel",
          metadata: {
            name: name,
          },
          spec: {
            protocol: protocol,
            properties: [
              {
                name: attributeName,
                description: description,
                type: attributeType,
                ...((typeOptions as any)[attributeType] || {}),
              },
            ],
          },
        });
        handleClose(event);
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create DeviceModel');
      }
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setName('');
    setProtocol('');
    setDescription('');
    setAttributeName('');
    setAttributeType('');
    setErrors({
      name: '',
      protocol: '',
      description: '',
      attributeName: '',
      attributeType: '',
    });
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add DeviceModel</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          <TextField
            label="Protocol"
            variant="outlined"
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
            placeholder="protocol"
            fullWidth
            error={Boolean(errors.protocol)}
            helperText={errors.protocol}
          />

          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description"
            fullWidth
            error={Boolean(errors.description)}
            helperText={errors.description}
          />

          <TextField
            label="Attribute Name"
            variant="outlined"
            value={attributeName}
            onChange={(e) => setAttributeName(e.target.value)}
            placeholder="attribute name"
            fullWidth
            error={Boolean(errors.attributeName)}
            helperText={errors.attributeName}
          />

          <FormControl fullWidth>
            <InputLabel>Attribute Type</InputLabel>
            <Select
              value={attributeType}
              onChange={(e) => setAttributeType(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Attribute Type</MenuItem>
              {attributeTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
            {errors.attributeType && <Box sx={{ color: 'red' }}>{errors.attributeType}</Box>}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDeviceModelDialog;
