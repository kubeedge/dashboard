import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, Button, IconButton, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Select } from '@mui/material';
import { useListNodes } from '@/api/node';
import { NodeGroup } from '@/types/nodeGroup';

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

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const labels: Record<string, string> = {};
    matchLabels?.forEach((matchLabel) => {
      labels[matchLabel.key] = matchLabel.value;
    });
    onSubmit?.(event, {
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
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setName('');
    setNodes([]);
    setMatchLabels([]);
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Nodegroup</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label="Name"
            placeholder="name"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            required
            helperText={!name && 'Miss name'}
          />
          <Select
            multiple
            value={nodes}
            onChange={handleNodesChange}
            renderValue={(selected) => selected.join(', ')}
            displayEmpty
            required
            placeholder="nodes"
            sx={{ minWidth: 300 }}
          >
            {data?.items?.map((node) => (
              <MenuItem key={node?.metadata?.uid} value={node?.metadata?.name || ''}>
                {node?.metadata?.name || ''}
              </MenuItem>
            ))}
          </Select>
          <Box>
            <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>MatchLabels</Typography>
            {matchLabels.map((matchLabel, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <TextField
                  label="Key"
                  placeholder="Please input key"
                  variant="outlined"
                  value={matchLabel.key}
                  onChange={(e) => handleMatchLabelChange(index, 'key', e.target.value)}
                  sx={{ flex: 1 }}
                  required
                  helperText={!matchLabel.key && 'Miss key'}
                />
                <TextField
                  label="Value"
                  placeholder="Please input value"
                  variant="outlined"
                  value={matchLabel.value}
                  onChange={(e) => handleMatchLabelChange(index, 'value', e.target.value)}
                  sx={{ flex: 1 }}
                  required
                  helperText={!matchLabel.value && 'Miss value'}
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
              Add MatchLabels
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddNodeGroupDialog;
