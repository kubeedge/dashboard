// src/components/AddConfigmapDialog.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ConfigMap } from '@/types/configMap';
import { useListNamespaces } from '@/api/namespace';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

interface AddConfigmapDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ConfigMap) => void;
}

const AddConfigmapDialog = ({ open, onClose, onSubmit }: AddConfigmapDialogProps) => {
  const { t } = useI18n();
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [labels, setLabels] = useState([{ key: '', value: '' }]);
  const [data, setData] = useState([{ key: '', value: '' }]);
  const namespaceData = useListNamespaces()?.data;
  const { setErrorMessage } = useAlert();

  const handleAddLabel = () => {
    setLabels([...labels, { key: '', value: '' }]);
  };

  const handleRemoveLabel = (index: number) => {
    setLabels(labels.filter((_, i) => i !== index));
  };

  const handleAddData = () => {
    setData([...data, { key: '', value: '' }]);
  };

  const handleRemoveData = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!namespace || !name) {
      return;
    }

    const body: ConfigMap = {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        namespace,
        name,
        labels: labels.reduce((acc: any, label) => {
          if (label.key && label.value) {
            acc[label.key] = label.value;
          }
          return acc;
        }, {}),
      },
      data: data.reduce((acc: any, datum) => {
        if (datum.key && datum.value) {
          acc[datum.key] = datum.value;
        }
        return acc;
      }, {}),
    };

    try {
      await onSubmit?.(event, body);
      handleClose(event);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create ConfigMap');
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setNamespace('');
    setName('');
    setLabels([{ key: '', value: '' }]);
    setData([{ key: '', value: '' }]);
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose}>
      <DialogTitle>{t('table.addConfigmap')}</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '500px', gap: '16px' }}>
          <FormControl fullWidth margin="dense">
            <InputLabel id="namespace-label">{t('table.namespace')}</InputLabel>
            <Select
              labelId="namespace-label"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              label={t('table.namespace')}
              required
            >
              {namespaceData?.items?.map((item) => (
                <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                  {item?.metadata?.name}
                </MenuItem>
              ))}
            </Select>
            {!namespace && <Typography color="error">{t('table.missNamespace')}</Typography>}
          </FormControl>

          {/* Name */}
          <TextField
            label={t('table.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('form.namePlaceholder')}
            fullWidth
            sx={{ marginBottom: '16px' }}
            required
          />
          {!name && <Typography color="error">{t('table.missingName')}</Typography>}

          {/* Labels */}
          <Box sx={{ marginBottom: '16px' }}>
            <Typography variant="subtitle1">{t('form.labels')}</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddLabel}
              sx={{ width: '100%', marginBottom: '8px' }}
            >
              {t('table.addLabel')}
            </Button>
            {labels.map((label, index) => (
              <Box key={index} sx={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <TextField
                  label={t('table.key')}
                  value={label.key}
                  onChange={(e) => {
                    const newLabels = [...labels];
                    newLabels[index].key = e.target.value;
                    setLabels(newLabels);
                  }}
                  placeholder={t('table.pleaseEnterKey')}
                  required
                />
                <TextField
                  label={t('table.value')}
                  value={label.value}
                  onChange={(e) => {
                    const newLabels = [...labels];
                    newLabels[index].value = e.target.value;
                    setLabels(newLabels);
                  }}
                  placeholder={t('table.pleaseEnterValue')}
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

          <Box>
            <Typography variant="subtitle1">{t('table.data')}</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddData}
              sx={{ width: '100%', marginBottom: '8px' }}
            >
              {t('table.addData')}
            </Button>
            {data.map((datum, index) => (
              <Box key={index} sx={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <TextField
                  label={t('table.key')}
                  value={datum.key}
                  onChange={(e) => {
                    const newData = [...data];
                    newData[index].key = e.target.value;
                    setData(newData);
                  }}
                  placeholder={t('table.pleaseEnterKey')}
                  required
                />
                <TextField
                  label={t('table.value')}
                  value={datum.value}
                  onChange={(e) => {
                    const newData = [...data];
                    newData[index].value = e.target.value;
                    setData(newData);
                  }}
                  placeholder={t('table.pleaseEnterValue')}
                  required
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveData(index)}
                >
                  <RemoveIcon />
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('actions.cancel')}</Button>
        <Button variant="contained" onClick={handleSubmit}>{t('actions.submit')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddConfigmapDialog;
