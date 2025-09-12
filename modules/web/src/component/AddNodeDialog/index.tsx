// src/component/AddNodeDialog.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useI18n } from '@/hook/useI18n';

interface AddNodeDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const AddNodeDialog = ({ open, onClose }: AddNodeDialogProps) => {
  const { t } = useI18n();
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
    if (!formValues.cloudMasterIP) errors.cloudMasterIP = t('messages.pleaseEnterCloudMasterIP');
    if (!formValues.kubeedgeVersion) errors.kubeedgeVersion = t('messages.pleaseEnterKubeEdgeVersion');
    if (!formValues.runtimeType) errors.runtimeType = t('messages.pleaseSelectRuntimeType');
    if (!formValues.token) errors.token = t('messages.pleaseEnterToken');
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
      <DialogTitle>{t('actions.add')} {t('common.node')}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label={t('table.cloudMasterIP')}
            name="cloudMasterIP"
            value={formValues.cloudMasterIP}
            onChange={handleInputChange}
            error={!!formErrors.cloudMasterIP}
            helperText={formErrors.cloudMasterIP}
            placeholder="192.168.30.300:3000"
            margin="dense"
            required
            fullWidth
          />
          <TextField
            label={t('table.kubeedgeVersion')}
            name="kubeedgeVersion"
            value={formValues.kubeedgeVersion}
            onChange={handleInputChange}
            error={!!formErrors.kubeedgeVersion}
            helperText={formErrors.kubeedgeVersion}
            placeholder="1.12.1"
            margin="dense"
            required
            fullWidth
          />
          <FormControl error={!!formErrors.runtimeType} fullWidth required>
            <InputLabel id="runtime-type-select-label">{t('table.runtimeType')}</InputLabel>
            <Select
              labelId="runtime-type-select-label"
              name="runtimeType"
              value={formValues.runtimeType}
              onChange={handleInputChange}
              label={t('table.runtimeType')}
              placeholder="Please select a runtime type"
            >
              <MenuItem value="docker">Docker</MenuItem>
              <MenuItem value="containerd">Containerd</MenuItem>
            </Select>
            {formErrors.runtimeType && <FormHelperText>{formErrors.runtimeType}</FormHelperText>}
          </FormControl>
          <TextField
            label={t('table.token')}
            name="token"
            value={formValues.token}
            onChange={handleInputChange}
            error={!!formErrors.token}
            helperText={formErrors.token}
            placeholder="Please enter Token"
            margin="dense"
            required
            fullWidth
          />
          <TextField
            label={t('table.command')}
            value={formValues.command}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            placeholder="Please enter command"
            margin="dense"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('actions.cancel')}
        </Button>
        <Button onClick={handleGenerateCommand} variant="contained" color="primary">
          {t('actions.generateCommand')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNodeDialog;
