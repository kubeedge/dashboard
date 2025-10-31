import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, Button, IconButton, Box, Typography, FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Select } from '@mui/material';
import { useListNodes } from '@/api/node';
import { NodeGroup } from '@/types/nodeGroup';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

interface AddNodeGroupDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: NodeGroup) => void;
}

const AddNodeGroupDialog = ({ open, onClose, onSubmit }: AddNodeGroupDialogProps) => {
  const [name, setName] = useState('');
  const [nodes, setNodes] = useState([]);
  const [matchLabels, setMatchLabels] = useState<Record<string, string>[]>([]);
  const { data } = useListNodes();
  const { setErrorMessage } = useAlert();
  const { t } = useI18n();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(event?.target?.value);

  const handleNodesChange = (event: any) => setNodes(event.target.value);

  const handleMatchLabelChange = (index: number, field: string, value: string) => {
    const newMatchLabels = [...matchLabels];
    newMatchLabels[index][field] = value;
    setMatchLabels(newMatchLabels);
  };

  const handleAddMatchLabel = () => {
    setMatchLabels([...matchLabels, { key: '', value: '' }]);
  };

  const handleRemoveMatchLabel = (index: number) => {
    const newMatchLabels = matchLabels.filter((_, i) => i !== index);
    setMatchLabels(newMatchLabels);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const labels: Record<string, string> = {};
    matchLabels?.forEach((matchLabel) => {
      labels[matchLabel.key] = matchLabel.value;
    });

    try {
      await onSubmit?.(event, {
        apiVersion: 'apps.kubeedge.io/v1alpha1',
        kind: 'NodeGroup',
        metadata: {
          name,
        },
        spec: {
          nodes,
          matchLabels: labels,
        },
      });
      handleClose(event);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setName('');
    setNodes([]);
    setMatchLabels([]);
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('actions.add')} {t('common.nodeGroup')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label={t('form.name')}
            placeholder={t('form.namePlaceholder')}
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            required
            margin="dense"
            helperText={!name && t('form.required')}
          />
          <FormControl fullWidth>
            <InputLabel id="nodes-select-label">{t('form.nodes')}</InputLabel>
            <Select
              multiple
              labelId="nodes-select-label"
              value={nodes}
              onChange={handleNodesChange}
              renderValue={(selected) => selected.join(', ')}
              required
              label={t('form.nodes')}
              placeholder={t('form.nodes')}
              sx={{ minWidth: 300 }}
            >
              {data?.items?.map((node: any) => (
                <MenuItem
                  key={((node?.metadata?.uid ?? node?.uid) ?? '') as string}
                  value={(((node?.metadata?.name ?? node?.name)) ?? '') as string}
                >
                  {(((node?.metadata?.name ?? node?.name)) ?? '') as string}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>{t('form.labels')}</Typography>
            {matchLabels.map((matchLabel, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <TextField
                  label={t('form.labelKey')}
                  placeholder={t('form.labelKey')}
                  variant="outlined"
                  margin="dense"
                  value={matchLabel.key}
                  onChange={(e) => handleMatchLabelChange(index, 'key', e.target.value)}
                  sx={{ flex: 1 }}
                  required
                  helperText={!matchLabel.key && t('form.required')}
                />
                <TextField
                  label={t('form.labelValue')}
                  placeholder={t('form.labelValue')}
                  variant="outlined"
                  margin="dense"
                  value={matchLabel.value}
                  onChange={(e) => handleMatchLabelChange(index, 'value', e.target.value)}
                  sx={{ flex: 1 }}
                  required
                  helperText={!matchLabel.value && t('form.required')}
                />
                <IconButton
                  onClick={() => handleRemoveMatchLabel(index)}
                  sx={{ color: 'red' }}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddMatchLabel}
            >
              {t('actions.add')} {t('form.labels')}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <Button onClick={handleClose}>{t('actions.cancel')}</Button>
            <Button variant="contained" onClick={handleSubmit}>{t('actions.confirm')}</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddNodeGroupDialog;
