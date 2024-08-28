// src/component/DeploymentForms/BasicInfoForm
import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem,Typography } from '@mui/material';
import { Deployment } from '@/types/deployment';
import { useListNamespaces } from '@/api/namespace';

export default function BasicInfoForm() {
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [annotations, setAnnotations] = useState<{key:string, value: string}[]>([]);
  const [labels, setLabels] = useState<{key:string, value: string}[]>([]);
  const [replicas, setReplicas] = useState(1);
  const namespaceData = useListNamespaces()?.data;

  const handleAddAnnotation = () => {
    setAnnotations([...annotations, { key: '', value: '' }]);
  };

  const handleAddLabel = () => {
    setLabels([...labels, { key: '', value: '' }]);
  };

  const handleAnnotationChange = (index: number, field: string, value: string) => {
    const updatedAnnotations = [...annotations];
    (updatedAnnotations as any)[index][field] = value;
    setAnnotations(updatedAnnotations);
  };

  const handleLabelChange = (index: number, field: string, value: string) => {
    const updatedLabels = [...labels];
    (updatedLabels as any)[index][field] = value;
    setLabels(updatedLabels);
  };

  const handleRemoveAnnotation = (index: number) => {
    const updatedAnnotations = annotations.filter((_, i) => i !== index);
    setAnnotations(updatedAnnotations);
  };

  const handleRemoveLabel = (index: number) => {
    const updatedLabels = labels.filter((_, i) => i !== index);
    setLabels(updatedLabels);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        label="Namespace"
        select
        required
        fullWidth
        value={namespace}
        onChange={(e) => setNamespace(e.target.value)}
        helperText={!namespace && 'Miss namespace'}
        placeholder="Please select namespace"
        margin="normal"
      >
        {namespaceData?.items?.map((item) => (
          <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
            {item?.metadata?.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Name"
        required
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        helperText={!name && 'Miss name'}
        placeholder="Please enter name"
        margin="normal"
      />

      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
        {annotations.map((annotation, index) => (
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
        {labels.map((label, index) => (
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
        value={replicas}
        onChange={(e) => setReplicas(parseInt(e.target.value, 10))}
        helperText={!replicas && 'Please enter Replicas'}
        placeholder="Please enter Replicas"
        margin="normal"
        inputProps={{ min: 1 }}
      />
    </Box>
  );
}
