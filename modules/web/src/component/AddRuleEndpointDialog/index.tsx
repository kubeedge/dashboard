// src/component/AddRuleDialog.js
import React, { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { RuleEndpoint } from '@/types/ruleEndpoint';
import { useListNamespaces } from '@/api/namespace';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

interface AddRuleEndpointDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: RuleEndpoint) => void;
}

const AddRuleEndpointDialog = ({ open, onClose, onSubmit }: AddRuleEndpointDialogProps) => {
  const { t } = useI18n();
  const [namespace, setNamespace] = React.useState('');
  const [name, setName] = React.useState('');
  const [endpointType, setEndpointType] = React.useState('');
  const [servicePort, setServicePort] = React.useState('');
  const { data } = useListNamespaces();
  const { setErrorMessage } = useAlert();

  const [errors, setErrors] = useState<any>({
    namespace: '',
    name: '',
    secrets: '',
  });

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newErrors: any = {};
    if (!namespace) newErrors.namespace = 'Missing namespace';
    if (!name) newErrors.name = 'Missing name';
    if (!endpointType) newErrors.source = 'Missing endpointType';
    if (endpointType === 'servicebus' && !servicePort) newErrors.servicePort = 'Missing servicePort';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        await onSubmit?.(event, {
          apiVersion: 'rules.kubeedge.io/v1',
          kind: 'RuleEndpoint',
          metadata: {
            namespace,
            name,
          },
          spec: {
            ruleEndpointType: endpointType,
            ...(endpointType === 'servicebus' && {
              properties: {
                service_port: servicePort,
              },
            }),
          }
        });
        handleClose(event);
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create RuleEndpoint');
      }
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setNamespace('');
    setName('');
    setEndpointType('');
    setServicePort('');
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('actions.add')} {t('common.ruleEndpoint')}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal" error={!!errors.newNamespace}>
          <InputLabel required>{t('table.namespace')}</InputLabel>
          <Select
            label={t('table.namespace')}
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            placeholder="Namespace"
          >
            {data?.items?.map(item => (
              <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                {item?.metadata?.name}
              </MenuItem>
            ))}
          </Select>
          {errors.newNamespace && <FormHelperText>{errors.newNamespace}</FormHelperText>}
        </FormControl>

        <TextField
          label={t('table.name')}
          required
          fullWidth
          margin="normal"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errors.newName}
          helperText={errors.newName}
        />

        <FormControl fullWidth margin="normal" error={!!errors.ruleEndpointType}>
          <InputLabel required>{t('table.ruleEndpointType')}</InputLabel>
          <Select
            label={t('table.ruleEndpointType')}
            value={endpointType}
            onChange={(event) => setEndpointType(event.target.value)}
            placeholder="RuleEndpointType"
          >
            <MenuItem value="rest">{t('ruleEndpointTypes.rest')}</MenuItem>
            <MenuItem value="eventbus">{t('ruleEndpointTypes.eventbus')}</MenuItem>
            <MenuItem value="servicebus">{t('ruleEndpointTypes.servicebus')}</MenuItem>
          </Select>
          {errors.ruleEndpointType && <FormHelperText>{errors.ruleEndpointType}</FormHelperText>}
        </FormControl>

        {endpointType === 'servicebus' && (
          <TextField
            label="Service_port"
            required
            fullWidth
            margin="normal"
            placeholder="Service_port"
            value={servicePort}
            onChange={(e) => setServicePort(e.target.value)}
            error={!!errors.servicePort}
            helperText={errors.servicePort}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('actions.cancel')}
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {t('actions.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRuleEndpointDialog;
