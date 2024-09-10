import React from 'react';
import { Box, TextField, Button, MenuItem,Typography } from '@mui/material';
import { useListNamespaces } from '@/api/namespace';
import { Namespace } from '@/types/namespace';

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
}

export default function BasicInfoForm({ data, onChange, namespaces }: BasicInfoFormProps) {
  const handleAddAnnotation = () => {
    onChange('annotations', [...(data?.annotations || []), { key: '', value: '' }]);
  };

  const handleAddLabel = () => {
    onChange('labels', [...(data?.labels || []), { key: '', value: '' }]);
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
        label="Namespace"
        select
        required
        fullWidth
        value={data?.namespace || ''}
        onChange={(e) => {
          onChange('namespace', e.target.value);
        }}
        error={!data?.namespace}
        placeholder="Please select namespace"
        margin="normal"
      >
        {namespaces?.map((item) => (
          <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
            {item?.metadata?.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Name"
        required
        fullWidth
        value={data?.name || ''}
        onChange={(e) => onChange('name', e.target.value)}
        error={!data?.name}
        placeholder="Please enter name"
        margin="normal"
      />

      <TextField
        label="Description"
        fullWidth
        value={data?.description || ''}
        onChange={(e) => {
          onChange('description', e.target.value);
        }}
        placeholder="Please enter description"
        margin="normal"
      />

      <Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">Annotation:</Typography>
          <Button onClick={handleAddAnnotation} variant="contained" color="primary" fullWidth>
            + Add Annotation
          </Button>
        </Box>
        {(data?.annotations || []).map((annotation, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, marginBottom: 1 }}>
            <TextField
              placeholder="Please enter key"
              value={annotation.key}
              onChange={(e) => handleAnnotationChange(index, 'key', e.target.value)}
              helperText={!annotation.key && 'Missing key'}
              fullWidth
            />
            <TextField
              placeholder="Please enter value"
              value={annotation.value}
              onChange={(e) => handleAnnotationChange(index, 'value', e.target.value)}
              helperText={!annotation.value && 'Missing value'}
              fullWidth
            />
            <Button onClick={() => handleRemoveAnnotation(index)}>-</Button>
          </Box>
        ))}
      </Box>

      <Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="subtitle1">Labels:</Typography>
          <Button onClick={handleAddLabel} variant="contained" color="primary" fullWidth>
            + Add Label
          </Button>
        </Box>
        {data?.labels?.map((label, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, marginBottom: 1 }}>
            <TextField
              placeholder="Please enter key"
              value={label.key}
              onChange={(e) => handleLabelChange(index, 'key', e.target.value)}
              helperText={!label.key && 'Missing key'}
              fullWidth
            />
            <TextField
              placeholder="Please enter value"
              value={label.value}
              onChange={(e) => handleLabelChange(index, 'value', e.target.value)}
              helperText={!label.value && 'Missing value'}
              fullWidth
            />
            <Button onClick={() => handleRemoveLabel(index)}>-</Button>
          </Box>
        ))}
      </Box>

      <TextField
        label="Replicas"
        required
        type="number"
        fullWidth
        value={data?.replicas || 1}
        onChange={(e) => {
          const num = parseInt(e.target.value, 10);
          onChange('replicas', num);
        }}
        error={!(data?.replicas || 1)}
        placeholder="Please enter Replicas"
        margin="normal"
        inputProps={{ min: 1 }}
      />
    </Box>
  );
}
