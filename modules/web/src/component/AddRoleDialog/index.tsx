import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, Button, IconButton, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useListNamespaces } from '@/api/namespace';
import { PolicyRule, Role } from '@/types/role';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

interface AddRoleDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: Role) => void;
}

const AddRoleDialog = ({ open, onClose, onSubmit }: AddRoleDialogProps) => {
  const { t } = useI18n();
  const [namespace, setNamespace] = useState<string>('');
  const [name, setName] = useState('');
  const [rules, setRules] = useState<PolicyRule[]>([{ verbs: [''], apiGroups: [''], resources: [''], resourceNames: [''] }]);
  const { data } = useListNamespaces();
  const { setErrorMessage } = useAlert();

  const handleNamespaceChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNamespace(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setName(event.target.value);
  };

  const handleRuleChange = (index: number, field: string, value: string) => {
    const newRules = [...rules];
    (newRules as any)[index][field] = [value];
    setRules(newRules);
  };

  const handleAddRule = () => {
    setRules([...rules, { verbs: [''], apiGroups: [''], resources: [''], resourceNames: [''] }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>,) => {
    try {
      await onSubmit?.(event, {
        apiVersion: 'rbac.authorization.k8s.io/v1',
        kind: 'Role',
        metadata: {
          namespace,
          name,
        },
        rules,
      });
      handleClose(event);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create Role');
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setNamespace('');
    setName('');
    setRules([{ verbs: [''], apiGroups: [''], resources: [''], resourceNames: [''] }]);
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('actions.add')} {t('common.role')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            margin="dense"
            label={t('table.namespace')}
            placeholder={t('form.namespacePlaceholder')}
            variant="outlined"
            select
            value={namespace}
            onChange={handleNamespaceChange}
            required
            sx={{ minWidth: 300 }}
            helperText={!namespace.length && 'Miss namespace'}
          >
            {data?.items?.map(item => (
              <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                {item?.metadata?.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('table.name')}
            placeholder={t('form.namePlaceholder')}
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            required
            helperText={!name && t('table.missingName')}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>{t('table.rules')}</Typography>
            {rules.map((rule, index) => (
              <Box key={index} sx={{ marginBottom: '16px' }}>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <TextField
                    label={t('table.verbs')}
                    placeholder={t('table.pleaseEnterVerbs')}
                    variant="outlined"
                    value={rule.verbs}
                    onChange={(e) => handleRuleChange(index, 'verbs', e.target.value)}
                    required
                    sx={{ flex: 1 }}
                    helperText={!rule.verbs && t('table.verbsCannotBeEmpty')}
                  />
                  <TextField
                    label={t('table.apiGroups')}
                    placeholder={t('table.pleaseEnterApiGroups')}
                    variant="outlined"
                    value={rule.apiGroups}
                    onChange={(e) => handleRuleChange(index, 'apiGroups', e.target.value)}
                    required
                    sx={{ flex: 1 }}
                    helperText={!rule.apiGroups && t('table.apiGroupsCannotBeEmpty')}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                  <TextField
                    label={t('table.resources')}
                    placeholder={t('table.pleaseEnterResources')}
                    variant="outlined"
                    value={rule.resources}
                    onChange={(e) => handleRuleChange(index, 'resources', e.target.value)}
                    required
                    sx={{ flex: 1 }}
                    helperText={!rule.resources && t('table.resourcesCannotBeEmpty')}
                  />
                  <TextField
                    label={t('table.resourceNames')}
                    placeholder={t('table.pleaseEnterResourceNames')}
                    variant="outlined"
                    value={rule.resourceNames}
                    onChange={(e) => handleRuleChange(index, 'resourceNames', e.target.value)}
                    required
                    sx={{ flex: 1 }}
                    helperText={!rule.resourceNames && t('table.resourceNamesCannotBeEmpty')}
                  />
                  {index === rules.length - 1 && (
                    <IconButton onClick={() => handleRemoveRule(index)} color="error">
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddRule}>
              {t('table.addRule')}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
            <Button onClick={handleClose}>{t('actions.cancel')}</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>{t('actions.submit')}</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleDialog;
