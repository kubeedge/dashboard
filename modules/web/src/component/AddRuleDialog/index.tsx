// src/component/AddRuleDialog.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useListNamespaces } from '@/api/namespace';
import { Rule } from '@/types/rule';
import { useListRuleEndpoints } from '@/api/ruleEndpoint';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

interface AddRuleDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: Rule) => void;
}

const AddRuleDialog = ({ open, onClose, onSubmit }: AddRuleDialogProps) => {
  const { t } = useI18n();
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [sourceResource, setSourceResource] = useState('');
  const [target, setTarget] = useState('');
  const [targetResource, setTargetResource] = useState('');
  const [description, setDescription] = useState('');
  const { setErrorMessage } = useAlert();

  const namespaceData = useListNamespaces()?.data;
  const { data, mutate } = useListRuleEndpoints(namespace);

  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const [errors, setErrors] = useState<any>({
    namespace: '',
    name: '',
    source: '',
    sourceResource: '',
    target: '',
    targetResource: '',
  });

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newErrors: any = {};
    if (!namespace) newErrors.namespace = 'Missing namespace';
    if (!name) newErrors.name = 'Missing name';
    if (!source) newErrors.source = 'Missing source';
    if (!sourceResource) newErrors.sourceResource = 'Missing sourceResource';
    if (!target) newErrors.target = 'Missing target';
    if (!targetResource) newErrors.targetResource = 'Missing targetResource';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        await onSubmit?.(event, {
          apiVersion: 'rules.kubeedge.io/v1',
          kind: 'Rule',
          metadata: {
            namespace,
            name,
            labels: {
              description: description,
            },
          },
          spec: {
            source: source,
            sourceResource: {
              path: sourceResource,
            },
            target: target,
            targetResource: {
              path: targetResource,
            },
          },
        });
        handleClose(event);
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create Rule');
      }
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setNamespace('');
    setName('');
    setSource('');
    setSourceResource('');
    setTarget('');
    setTargetResource('');
    setDescription('');
    setErrors({
      namespace: '',
      name: '',
      source: '',
      sourceResource: '',
      target: '',
      targetResource: '',
    });
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('actions.add')} {t('common.rule')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormControl fullWidth margin="dense">
            <InputLabel>{t('table.namespace')}</InputLabel>
            <Select
              label={t('table.namespace')}
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
            >
              {namespaceData?.items?.map(item => (
                <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                  {item?.metadata?.name}
                </MenuItem>
              ))}
            </Select>
            {errors.namespace && <Box sx={{ color: 'red' }}>{errors.namespace}</Box>}
          </FormControl>

          <TextField
            label={t('table.name')}
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
            fullWidth
            error={Boolean(errors.name)}
            helperText={errors.name}
          />

          <FormControl fullWidth>
            <InputLabel>{t('table.source')}</InputLabel>
            <Select
              label={t('table.source')}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              displayEmpty
            >
              {data?.items?.map(endpoint => (
                <MenuItem key={endpoint?.metadata?.uid} value={endpoint?.metadata?.name}>
                  {endpoint?.metadata?.name}
                </MenuItem>
              ))}
            </Select>
            {errors.source && <Box sx={{ color: 'red' }}>{errors.source}</Box>}
          </FormControl>

          <TextField
            label={t('table.sourceResource')}
            variant="outlined"
            value={sourceResource}
            onChange={(e) => setSourceResource(e.target.value)}
            placeholder="sourceResource"
            fullWidth
            error={Boolean(errors.sourceResource)}
            helperText={errors.sourceResource}
          />

          <FormControl fullWidth>
            <InputLabel>{t('table.target')}</InputLabel>
            <Select
              label={t('table.target')}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              displayEmpty
            >
              {data?.items?.map(endpoint => (
                <MenuItem key={endpoint?.metadata?.uid} value={endpoint?.metadata?.name}>
                  {endpoint?.metadata?.name}
                </MenuItem>
              ))}
            </Select>
            {errors.target && <Box sx={{ color: 'red' }}>{errors.target}</Box>}
          </FormControl>

          <TextField
            label={t('table.targetResource')}
            variant="outlined"
            value={targetResource}
            onChange={(e) => setTargetResource(e.target.value)}
            placeholder="targetResource"
            fullWidth
            error={Boolean(errors.targetResource)}
            helperText={errors.targetResource}
          />

          <TextField
            label={t('table.description')}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            fullWidth
            multiline
            rows={4}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('actions.cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {t('actions.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRuleDialog;
