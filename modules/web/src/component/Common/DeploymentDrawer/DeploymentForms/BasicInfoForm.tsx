import React from 'react';
import { Box, TextField, Button, MenuItem, Typography } from '@mui/material';
import { useListNamespaces } from '@/api/namespace';
import { Namespace } from '@/types/namespace';
import { useI18n } from '@/hook/useI18n';

interface KVPair {
  key: string;
  value: string;
}

interface BasicInfoFormProps {
  data: {
    name?: string;
    namespace?: string;
    description?: string;
    annotations?: KVPair[];
    labels?: KVPair[];
    replicas?: number;
  };
  onChange: (field: string, value: any) => void;
  namespaces?: Namespace[];
  showValidation?: boolean; // Add validation control property
  onClearValidation?: () => void; // New
}

export default function BasicInfoForm({ data, onChange, namespaces, showValidation = false, onClearValidation }: BasicInfoFormProps) {
  const { t } = useI18n();
  const handleAddAnnotation = () => {
    onChange('annotations', [...(data?.annotations || []), { key: '', value: '' }]);
    onClearValidation?.();
  };

  const handleAddLabel = () => {
    onChange('labels', [...(data?.labels || []), { key: '', value: '' }]);
    onClearValidation?.();
  };

  const handleAnnotationChange = (index: number, field: string, value: string) => {
    const updatedAnnotations = [...(data?.annotations || [])];
    (updatedAnnotations as any)[index][field] = value;
    onChange('annotations', updatedAnnotations);
  };

  const handleLabelChange = (index: number, field: string, value: string) => {
    const updatedLabels = [...(data?.labels || [])];
    (updatedLabels as any)[index][field] = value;
    onChange('labels', updatedLabels);
  };

  const handleRemoveAnnotation = (index: number) => {
    const updatedAnnotations = (data?.annotations || []).filter((_, i) => i !== index);
    onChange('annotations', updatedAnnotations);
  };

  const handleRemoveLabel = (index: number) => {
    const updatedLabels = (data?.labels || []).filter((_, i) => i !== index);
    onChange('labels', updatedLabels);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        label={t('table.namespace')}
        select
        required
        fullWidth
        value={data?.namespace || ''}
        onChange={(e) => {
          onChange('namespace', e.target.value);
        }}
        error={showValidation && !data?.namespace}
        placeholder={t('form.namespacePlaceholder')}
        margin="normal"
        helperText={showValidation && !data?.namespace ? 'Missing namespace' : ''}
      >
        {namespaces?.map((item) => (
          <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
            {item?.metadata?.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label={t('table.name')}
        required
        fullWidth
        value={data?.name || ''}
        onChange={(e) => onChange('name', e.target.value)}
        error={showValidation && !data?.name}
        placeholder={t('form.namePlaceholder')}
        margin="normal"
        helperText={showValidation && !data?.name ? 'Missing name' : ''}
      />

      <TextField
        label={t('table.description')}
        fullWidth
        value={data?.description || ''}
        onChange={(e) => {
          onChange('description', e.target.value);
        }}
        placeholder={t('table.description')}
        margin="normal"
      />

      <Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">{t('form.annotations')}:</Typography>
          <Button onClick={handleAddAnnotation} variant="contained" color="primary" fullWidth>
            + {t('table.addAnnotation')}
          </Button>
        </Box>
        {(data?.annotations || []).map((annotation, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, marginBottom: 1 }}>
            <TextField
              placeholder={t('table.pleaseEnterKey')}
              value={annotation.key}
              onChange={(e) => handleAnnotationChange(index, 'key', e.target.value)}
              error={showValidation && !annotation.key}
              helperText={showValidation && !annotation.key && t('table.missingKey')}
              fullWidth
            />
            <TextField
              placeholder={t('table.pleaseEnterValue')}
              value={annotation.value}
              onChange={(e) => handleAnnotationChange(index, 'value', e.target.value)}
              helperText={showValidation && !annotation.value && t('table.missingValue')}
              error={showValidation && !annotation.value}
              fullWidth
            />
            <Button onClick={() => handleRemoveAnnotation(index)}>-</Button>
          </Box>
        ))}
      </Box>

      <Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">{t('form.labels')}:</Typography>
          <Button onClick={handleAddLabel} variant="contained" color="primary" fullWidth>
            + {t('table.addLabel')}
          </Button>
        </Box>
        {data?.labels?.map((label, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, marginBottom: 1 }}>
            <TextField
              placeholder={t('table.pleaseEnterKey')}
              value={label.key}
              onChange={(e) => handleLabelChange(index, 'key', e.target.value)}
              error={showValidation && !label.key}
              helperText={showValidation && !label.key && t('table.missingKey')}
              fullWidth
            />
            <TextField
              placeholder={t('table.pleaseEnterValue')}
              value={label.value}
              onChange={(e) => handleLabelChange(index, 'value', e.target.value)}
              helperText={showValidation && !label.value && t('table.missingValue')}
              error={showValidation && !label.value}
              fullWidth
            />
            <Button onClick={() => handleRemoveLabel(index)}>-</Button>
          </Box>
        ))}
      </Box>

      <TextField
        label={t('table.replicas')}
        required
        type="number"
        fullWidth
        value={data?.replicas || 1}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10);
          onChange('replicas', num);
        }}
        placeholder={t('table.replicas')}
        error={showValidation && !(data?.replicas || 1)}
        margin="normal"
        inputProps={{ min: 1 }}
        helperText={showValidation && !(data?.replicas || 1) ? 'Missing replicas' : ''}
      />
    </Box>
  );
}
