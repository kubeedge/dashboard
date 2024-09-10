import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, IconButton, Typography, Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ClusterRole, PolicyRule } from '@/types/clusterRole';
import { useAlert } from '@/hook/useAlert';

interface AddClusterRoleDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ClusterRole) => void;
}

const AddClusterRoleDialog = ({ open, onClose, onSubmit }: AddClusterRoleDialogProps) => {
  const [name, setName] = useState<string>('');
  const [rules, setRules] = useState<PolicyRule[]>([]);
  const [selectors, setSelectors] = useState<{id:number, matchLabels: {key: string, value: string}[]}[]>([]);
  const { setErrorMessage } = useAlert();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setName(event.target.value);
  };

  const handleAddRule = () => {
    setRules([...rules, { verbs: [], apiGroups: [], resources: [], resourceNames: [] }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, key: string, value: string[]) => {
    const newRules = [...rules];
    (newRules as any)[index][key] = value;
    setRules(newRules);
  };

  const handleAddSelector = () => {
    setSelectors([...selectors, { id: Date.now(), matchLabels: [] }]);
  };

  const handleAddMatchLabel = (selectorId: number) => {
    const updatedSelectors = selectors.map(selector => {
      if (selector.id === selectorId) {
        return { ...selector, matchLabels: [...selector.matchLabels, { key: '', value: '' }] };
      }
      return selector;
    });
    setSelectors(updatedSelectors);
  };

  const handleMatchLabelChange = (selectorId: number, index: number, key: string, value: string) => {
    const updatedSelectors = selectors.map(selector => {
      if (selector.id === selectorId) {
        const updatedMatchLabels = selector.matchLabels.map((label, i) => {
          if (i === index) {
            return { ...label, [key]: value };
          }
          return label;
        });
        return { ...selector, matchLabels: updatedMatchLabels };
      }
      return selector;
    });
    setSelectors(updatedSelectors);
  };

  const handleRemoveMatchLabel = (selectorId: number, index: number) => {
    const updatedSelectors = selectors.map(selector => {
      if (selector.id === selectorId) {
        return { ...selector, matchLabels: selector.matchLabels.filter((_, i) => i !== index) };
      }
      return selector;
    });
    setSelectors(updatedSelectors);
  };

  const handleRemoveSelector = (selectorId: number) => {
    setSelectors(selectors.filter(selector => selector.id !== selectorId));
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const data: ClusterRole = {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'ClusterRole',
      metadata: {
        name,
      },
      aggregationRule: {
        clusterRoleSelectors: selectors.map(selector => ({
          matchLabels: selector.matchLabels.reduce((acc, label) => {
            acc[label.key] = label.value;
            return acc;
          }, {} as Record<string, string>),
        })),
      },
      rules,
    };

    try {
      await onSubmit?.(event, data);
      handleClose(event);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create ClusterRole');
    }
  }

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setName('');
    setRules([]);
    setSelectors([]);
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Add ClusterRole</DialogTitle>
      <DialogContent>
        <Box sx={{ marginBottom: '16px' }}>
          <TextField
            label="Name"
            placeholder="name"
            fullWidth
            required
            value={name}
            onChange={handleNameChange}
            error={!name}
            helperText={!name && 'Name is required'}
          />
        </Box>

        <Box sx={{ marginBottom: '16px' }}>
          <Typography variant="subtitle1" gutterBottom>Rules</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: '16px' }}
            onClick={handleAddRule}
          >
            Add Rule
          </Button>
          {rules.map((rule, index) => (
            <Box key={index} sx={{ marginBottom: '16px' }}>
              <Autocomplete
                multiple
                freeSolo
                options={rule.verbs}
                renderInput={(params) => <TextField {...params} label="Verbs" placeholder="Please input verbs and enter" />}
                value={rule.verbs}
                onChange={(event, newValue) => handleRuleChange(index, 'verbs', newValue)}
                fullWidth
                // required
                // error={!rule.verbs.length}
                // helperText={!rule.verbs.length && 'Verbs cannot be empty'}
                sx={{ marginBottom: '8px' }}
              />
              <Autocomplete
                multiple
                freeSolo
                options={rule?.apiGroups || []}
                renderInput={(params) => <TextField {...params} label="API Groups" placeholder="Please input apiGroups and enter" />}
                value={rule.apiGroups}
                onChange={(event, newValue) => handleRuleChange(index, 'apiGroups', newValue)}
                fullWidth
                // required
                // error={!(rule?.apiGroups?.length || 0)}
                // helperText={!rule.apiGroups.length && 'API Groups cannot be empty'}
                sx={{ marginBottom: '8px' }}
              />
              <Autocomplete
                multiple
                freeSolo
                options={rule.resources || []}
                renderInput={(params) => <TextField {...params} label="Resources" placeholder="Please input resources and enter" />}
                value={rule.resources}
                onChange={(event, newValue) => handleRuleChange(index, 'resources', newValue)}
                fullWidth
                // required
                // error={!rule.resources.length}
                // helperText={!rule.resources.length && 'Resources cannot be empty'}
                sx={{ marginBottom: '8px' }}
              />
              <Autocomplete
                multiple
                freeSolo
                options={rule.resourceNames || []}
                renderInput={(params) => <TextField {...params} label="Resource Names" placeholder="Please input resourceNames and enter" />}
                value={rule.resourceNames}
                onChange={(event, newValue) => handleRuleChange(index, 'resourceNames', newValue)}
                fullWidth
                // required
                // error={!rule.resourceNames.length}
                // helperText={!rule.resourceNames.length && 'Resource Names cannot be empty'}
                sx={{ marginBottom: '8px' }}
              />
              <IconButton onClick={() => handleRemoveRule(index)}>
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>ClusterRole Selectors</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            fullWidth
            sx={{ marginBottom: '16px' }}
            onClick={handleAddSelector}
          >
            Add ClusterRole Selectors
          </Button>
          {selectors.map((selector) => (
            <Box key={selector.id} sx={{ marginBottom: '16px' }}>
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                sx={{ marginBottom: '16px' }}
                onClick={() => handleAddMatchLabel(selector.id)}
              >
                Add Match Labels
              </Button>
              <IconButton onClick={() => handleRemoveSelector(selector.id)}>
                <RemoveIcon />
              </IconButton>
              {selector.matchLabels.map((label, index) => (
                <Box key={index} sx={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    value={label.key}
                    onChange={(e) => handleMatchLabelChange(selector.id, index, 'key', e.target.value)}
                    required
                    error={!label.key}
                    helperText={!label.key && 'Missing key'}
                    fullWidth
                  />
                  <TextField
                    label="Value"
                    placeholder="Please input value"
                    value={label.value}
                    onChange={(e) => handleMatchLabelChange(selector.id, index, 'value', e.target.value)}
                    required
                    error={!label.value}
                    helperText={!label.value && 'Missing value'}
                    fullWidth
                  />
                  <IconButton onClick={() => handleRemoveMatchLabel(selector.id, index)}>
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddClusterRoleDialog;
