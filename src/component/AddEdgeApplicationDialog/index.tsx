// src/component/AddEdgeApplicationDialog.js
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, MenuItem } from '@mui/material';
import { useListNamespaces } from '@/api/namespace';
import { useListNodeGroups } from '@/api/nodeGroup';
import { NodeGroup } from '@/types/nodeGroup';
import { EdgeApplication } from '@/types/edgeApplication';

// Function to create a WorkloadTemplate field
const WorkloadTemplateField = ({ index, onRemove }: {index: number, onRemove: (index: number) => any}) => (
  <Box sx={{ marginBottom: '16px' }}>
    <TextField
      fullWidth
      multiline
      rows={4}
      placeholder="manifests yaml"
      required
      error={false} // Add validation error if needed
      helperText="Missing workloadTemplate manifests yaml" // Error message if needed
      sx={{ marginBottom: '8px' }}
    />
    <Button variant="outlined" color="error" onClick={() => onRemove(index)}>− Remove WorkloadTemplate</Button>
  </Box>
);

// Function to create a TargetNodeGroup field
const TargetNodeGroupField = ({ index, onRemove, data }: { index: number, data?: NodeGroup[], onRemove: (index: number) => any }) => (
  <Box sx={{ marginBottom: '16px' }}>
    <TextField
      fullWidth
      select
      placeholder="name"
      sx={{ marginBottom: '8px' }}
    >
      {data?.map((nodeGroup) => (
        <MenuItem key={nodeGroup?.metadata?.uid} value={nodeGroup?.metadata?.name}>{nodeGroup?.metadata?.name}</MenuItem>
      ))}
    </TextField>
    <TextField
      fullWidth
      multiline
      rows={4}
      placeholder="overriders yaml"
      required
      error={false} // Add validation error if needed
      helperText="Missing targetNodeGroup overrides yaml" // Error message if needed
    />
    <Button variant="outlined" color="error" onClick={() => onRemove(index)}>− Remove TargetNodeGroup</Button>
  </Box>
);

interface AddEdgeApplicationDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: EdgeApplication) => void;
}

const AddEdgeApplicationDialog = ({ open, onClose, onSubmit }: AddEdgeApplicationDialogProps) => {
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [workloadTemplates, setWorkloadTemplates] = useState<any[]>([]);
  const [targetNodeGroups, setTargetNodeGroups] = useState<any[]>([]);
  const namespaceData = useListNamespaces()?.data;
  const nodeGroupData = useListNodeGroups()?.data;

  const handleAddWorkloadTemplate = () => {
    setWorkloadTemplates([...workloadTemplates, {}]);
  };

  const handleRemoveWorkloadTemplate = (index: number) => {
    setWorkloadTemplates(workloadTemplates.filter((_, i) => i !== index));
  };

  const handleAddTargetNodeGroup = () => {
    setTargetNodeGroups([...targetNodeGroups, {}]);
  };

  const handleRemoveTargetNodeGroup = (index: number) => {
    setTargetNodeGroups(targetNodeGroups.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (namespace && name) {
      const body: EdgeApplication = {
        apiVersion: 'apps.kubeedge.io/v1alpha1',
        kind: 'EdgeApplication',
        metadata: {
          namespace,
          name,
        },
        spec: {
          workloadScope: {
            targetNodeGroups,
          },
          workloadTemplate: {
            manifests: workloadTemplates,
          },
        }
      }
      onSubmit?.(event, body);
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setNamespace('');
    setName('');
    setWorkloadTemplates([]);
    setTargetNodeGroups([]);
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Add EdgeApplication</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            fullWidth
            select
            label="Namespace"
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            required
            placeholder="namespace"
          >
            {namespaceData?.items?.map((item) => (
              <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>{item?.metadata?.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="name"
          />
          <Box>
            <Button
              variant="outlined"
              onClick={handleAddWorkloadTemplate}
              sx={{ width: '100%', marginBottom: '8px' }}
            >
              + Add WorkloadTemplate
            </Button>
            {workloadTemplates.map((_, index) => (
              <WorkloadTemplateField
                key={index}
                index={index}
                onRemove={handleRemoveWorkloadTemplate}
              />
            ))}
          </Box>
          <Box>
            <Button
              variant="outlined"
              onClick={handleAddTargetNodeGroup}
              sx={{ width: '100%', marginBottom: '8px' }}
            >
              + Add TargetNodeGroup
            </Button>
            {targetNodeGroups.map((_, index) => (
              <TargetNodeGroupField
                key={index}
                index={index}
                data={nodeGroupData?.items}
                onRemove={handleRemoveTargetNodeGroup}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEdgeApplicationDialog;
