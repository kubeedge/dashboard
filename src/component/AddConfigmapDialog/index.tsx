// src/components/AddConfigmapDialog.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ConfigMap } from '@/types/configMap';
import { useListNamespaces } from '@/api/namespace';

interface AddConfigmapDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ConfigMap) => void;
}

const AddConfigmapDialog = ({ open, onClose, onSubmit }: AddConfigmapDialogProps) => {
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [labels, setLabels] = useState([{ key: '', value: '' }]);
  const [data, setData] = useState([{ key: '', value: '' }]);
  const namespaceData = useListNamespaces()?.data;

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

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    onSubmit?.(event, body);
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
      <DialogTitle>Add Configmap</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '500px' }}>
          <FormControl fullWidth sx={{ marginBottom: '16px' }}>
            <InputLabel id="namespace-label">Namespace</InputLabel>
            <Select
              labelId="namespace-label"
              value={namespace}
              onChange={(e) => setNamespace(e.target.value)}
              label="Namespace"
              required
            >
              {namespaceData?.items?.map((item) => (
                <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                  {item?.metadata?.name}
                </MenuItem>
              ))}
            </Select>
            {!namespace && <Typography color="error">Miss namespace</Typography>}
          </FormControl>

          {/* Name */}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
            fullWidth
            sx={{ marginBottom: '16px' }}
            required
          />
          {!name && <Typography color="error">Miss name</Typography>}

          {/* Labels */}
          <Box sx={{ marginBottom: '16px' }}>
            <Typography variant="subtitle1">Labels</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddLabel}
              sx={{ width: '100%', marginBottom: '8px' }}
            >
              Add Label
            </Button>
            {labels.map((label, index) => (
              <Box key={index} sx={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <TextField
                  label="Key"
                  value={label.key}
                  onChange={(e) => {
                    const newLabels = [...labels];
                    newLabels[index].key = e.target.value;
                    setLabels(newLabels);
                  }}
                  placeholder="Please input key"
                  required
                />
                <TextField
                  label="Value"
                  value={label.value}
                  onChange={(e) => {
                    const newLabels = [...labels];
                    newLabels[index].value = e.target.value;
                    setLabels(newLabels);
                  }}
                  placeholder="Please input value"
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
            <Typography variant="subtitle1">Data</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddData}
              sx={{ width: '100%', marginBottom: '8px' }}
            >
              Add Data
            </Button>
            {data.map((datum, index) => (
              <Box key={index} sx={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <TextField
                  label="Key"
                  value={datum.key}
                  onChange={(e) => {
                    const newData = [...data];
                    newData[index].key = e.target.value;
                    setData(newData);
                  }}
                  placeholder="Please input key"
                  required
                />
                <TextField
                  label="Value"
                  value={datum.value}
                  onChange={(e) => {
                    const newData = [...data];
                    newData[index].value = e.target.value;
                    setData(newData);
                  }}
                  placeholder="Please input value"
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddConfigmapDialog;
