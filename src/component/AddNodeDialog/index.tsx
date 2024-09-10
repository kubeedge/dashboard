// src/component/AddRuleDialog.js
import React, { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface AddNodeDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const AddNodeDialog = ({ open, onClose }: AddNodeDialogProps) => {
  const [formValues, setFormValues] = useState({
    cloudMasterIP: '',
    kubeedgeVersion: '',
    runtimeType: '',
    token: '',
    command: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});

  const validateForm = () => {
    const errors: any = {};
    if (!formValues.cloudMasterIP) errors.cloudMasterIP = 'Please enter Cloud master node ip:port';
    if (!formValues.kubeedgeVersion) errors.kubeedgeVersion = 'Please enter KubeEdge version';
    if (!formValues.runtimeType) errors.runtimeType = 'Please select a runtime type';
    if (!formValues.token) errors.token = 'Please enter Token';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerateCommand = () => {
    if (!validateForm()) {
      return;
    }

    let command;
    if (formValues.runtimeType === 'docker') {
      command = `keadm join --token=${formValues.token} --cloudcore-ipport=${formValues.cloudMasterIP} --kubeedge-version=${formValues.kubeedgeVersion} --runtimetype=docker --remote-runtime-endpoint=unix:///var/run/dockershim.sock`;
    } else {
      command = `keadm join --token=${formValues.token} --cloudcore-ipport=${formValues.cloudMasterIP} --kubeedge-version=${formValues.kubeedgeVersion} --runtimetype=remote --remote-runtime-endpoint=unix:///run/containerd/containerd.sock`;
    }
    setFormValues({ ...formValues, command });
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };
  
  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setFormValues({
      cloudMasterIP: '',
      kubeedgeVersion: '',
      runtimeType: '',
      token: '',
      command: '',
    });
    setFormErrors({});
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Add Node</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label="Cloud master node ip:port"
            name="cloudMasterIP"
            value={formValues.cloudMasterIP}
            onChange={handleInputChange}
            error={!!formErrors.cloudMasterIP}
            helperText={formErrors.cloudMasterIP}
            placeholder="192.168.30.300:3000"
            required
            fullWidth
          />
          <TextField
            label="KubeEdge version"
            name="kubeedgeVersion"
            value={formValues.kubeedgeVersion}
            onChange={handleInputChange}
            error={!!formErrors.kubeedgeVersion}
            helperText={formErrors.kubeedgeVersion}
            placeholder="1.12.1"
            required
            fullWidth
          />
          <FormControl error={!!formErrors.runtimeType} fullWidth required>
            <InputLabel>Runtime type</InputLabel>
            <Select
              name="runtimeType"
              value={formValues.runtimeType}
              onChange={handleInputChange}
              placeholder="Please select a runtime type"
            >
              <MenuItem value="docker">Docker</MenuItem>
              <MenuItem value="containerd">Containerd</MenuItem>
            </Select>
            {formErrors.runtimeType && <FormHelperText>{formErrors.runtimeType}</FormHelperText>}
          </FormControl>
          <TextField
            label="Token"
            name="token"
            value={formValues.token}
            onChange={handleInputChange}
            error={!!formErrors.token}
            helperText={formErrors.token}
            placeholder="Please enter Token"
            required
            fullWidth
          />
          <TextField
            label="Command"
            value={formValues.command}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            placeholder="Please enter command"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleGenerateCommand} variant="contained" color="primary">
          Generate Command
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNodeDialog;
