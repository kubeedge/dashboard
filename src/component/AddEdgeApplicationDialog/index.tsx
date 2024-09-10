// src/component/AddEdgeApplicationDialog.js
import React, { useState } from 'react';
import { parse } from 'yaml'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, MenuItem } from '@mui/material';
import { useListNamespaces } from '@/api/namespace';
import { useListNodeGroups } from '@/api/nodeGroup';
import { NodeGroup } from '@/types/nodeGroup';
import { EdgeApplication } from '@/types/edgeApplication';
import { useAlert } from '@/hook/useAlert';

interface WorkloadTemplateFieldProps {
  index: number;
  onRemove: (index: number) => void;
  value: string;
  onChange: (value: string, index: number) => void;
}

// Function to create a WorkloadTemplate field
const WorkloadTemplateField = ({ index, onRemove, value, onChange }: WorkloadTemplateFieldProps) => (
  <Box sx={{ marginBottom: '16px' }}>
    <TextField
      fullWidth
      multiline
      rows={4}
      value={value}
      onChange={(event) => onChange(event.target.value, index)}
      placeholder="manifests yaml"
      required
      error={false} // Add validation error if needed
      helperText="Missing workloadTemplate manifests yaml" // Error message if needed
      sx={{ marginBottom: '8px' }}
    />
    <Button variant="outlined" color="error" onClick={() => onRemove(index)}>− Remove WorkloadTemplate</Button>
  </Box>
);

interface TargetNodeGroupFieldProps {
  index: number;
  onRemove: (index: number) => void;
  nodeGroups?: NodeGroup[];
  value: { name: string, overrides: string };
  onChange: (index: number, field: string, value: string) => void;
}

// Function to create a TargetNodeGroup field
const TargetNodeGroupField = ({ index, onRemove, nodeGroups, value, onChange }: TargetNodeGroupFieldProps) => (
  <Box sx={{ marginBottom: '16px' }}>
    <TextField
      fullWidth
      select
      placeholder="name"
      value={value?.name}
      onChange={(event) => onChange(index, 'name', event.target.value)}
      sx={{ marginBottom: '8px' }}
    >
      {nodeGroups?.map((nodeGroup) => (
        <MenuItem key={nodeGroup?.metadata?.uid} value={nodeGroup?.metadata?.name}>{nodeGroup?.metadata?.name}</MenuItem>
      ))}
    </TextField>
    <TextField
      fullWidth
      multiline
      rows={4}
      value={value?.overrides}
      onChange={(event) => onChange(index, 'overrides', event.target.value)}
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
  const [workloadTemplates, setWorkloadTemplates] = useState<string[]>([]);
  const [targetNodeGroups, setTargetNodeGroups] = useState<{name: string, overrides: string}[]>([]);
  const namespaceData = useListNamespaces()?.data;
  const nodeGroupData = useListNodeGroups()?.data;
  const { setErrorMessage } = useAlert();

  const handleAddWorkloadTemplate = () => {
    setWorkloadTemplates([...workloadTemplates, '']);
  };

  const handleChangeWorkloadTemplate = (value: string, index: number) => {
      const templates = [...workloadTemplates];
      (templates as any)[index] = value;
      setWorkloadTemplates(templates);
  }

  const handleRemoveWorkloadTemplate = (index: number) => {
    setWorkloadTemplates(workloadTemplates.filter((_, i) => i !== index));
  };

  const handleAddTargetNodeGroup = () => {
    setTargetNodeGroups([...targetNodeGroups, { name: '', overrides: '' }]);
  };

  const handleUpdateTargetNodeGroup = (index: number, field: string, value: string) => {
    const nodeGroups = [...targetNodeGroups];
    (nodeGroups as any)[index][field] = value;
    setTargetNodeGroups(nodeGroups);
  }

  const handleRemoveTargetNodeGroup = (index: number) => {
    setTargetNodeGroups(targetNodeGroups.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
            targetNodeGroups: targetNodeGroups?.map((nodeGroup) => ({
                name: nodeGroup.name,
                overrides: parse(nodeGroup.overrides),
            })),
          },
          workloadTemplate: {
            manifests: workloadTemplates?.map((template) => parse(template)),
          },
        }
      }
      try {
        await onSubmit?.(event, body);
        handleClose(event);
      } catch (error: any) {
        setErrorMessage(error?.response?.message || error?.message || 'Failed to create EdgeApplication');
      }
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
            {workloadTemplates.map((v, index) => (
              <WorkloadTemplateField
                key={index}
                index={index}
                value={v}
                onChange={handleChangeWorkloadTemplate}
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
            {targetNodeGroups.map((v, index) => (
              <TargetNodeGroupField
                key={index}
                index={index}
                value={v}
                onChange={handleUpdateTargetNodeGroup}
                nodeGroups={nodeGroupData?.items}
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
