// src/component/AddSecretDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useListNamespaces } from '@/api/namespace';
import { Secret } from '@/types/secret';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

interface AddSecretDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: Secret) => void;
}

const AddSecretDialog = ({ open, onClose, onSubmit }: AddSecretDialogProps) => {
  const { t } = useI18n();
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Docker');
  const [dockerServer, setDockerServer] = useState('');
  const [dockerUsername, setDockerUsername] = useState('');
  const [dockerPassword, setDockerPassword] = useState('');
  const [data, setData] = useState<{ key: string, value: string }[]>([]);
  const namespaceData = useListNamespaces()?.data;
  const { setErrorMessage } = useAlert();

  const handleNamespaceChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNamespace(event.target.value);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(event.target.value);
  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setType(event.target.value);

  const handleDockerServerChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDockerServer(event.target.value);
  const handleDockerUsernameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDockerUsername(event.target.value);
  const handleDockerPasswordChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDockerPassword(event.target.value);

  const handleAddRow = () => setData([...data, { key: '', value: '' }]);

  const handleDeleteRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleSave = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const body: Secret = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        namespace,
        name,
      },
      type: type === 'Docker' ? 'kubernetes.io/dockerconfigjson' : 'Opaque',
      data: type === 'Docker' ? {
        '.dockerconfigjson': btoa(JSON.stringify({
          auths: {
            [dockerServer]: {
              username: dockerUsername,
              password: dockerPassword,
            },
          },
        })),
      } : data.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {}),
    };
    try {
      await onSubmit?.(event, body);
      handleClose(event);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create Secret');
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setNamespace('');
    setName('');
    setType('Docker');
    setDockerServer('');
    setDockerUsername('');
    setDockerPassword('');
    setData([]);
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{t('actions.add')} {t('common.secret')}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            select
            margin="dense"
            label={t('table.namespace')}
            value={namespace}
            onChange={handleNamespaceChange}
            helperText={!namespace ? t('table.missNamespace') : ''}
            error={!namespace}
            required
          >
            {namespaceData?.items?.map((item) => (
              <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                {item?.metadata?.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('table.name')}
            value={name}
            onChange={handleNameChange}
            helperText={!name ? t('table.missingName') : ''}
            error={!name}
            required
          />
          <RadioGroup value={type} onChange={handleTypeChange}>
            <FormControlLabel value="Docker" control={<Radio />} label="Docker" />
            <FormControlLabel value="Opaque" control={<Radio />} label="Opaque" />
          </RadioGroup>

          {type === 'Docker' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TextField
                label={t('table.dockerServer')}
                value={dockerServer}
                onChange={handleDockerServerChange}
                helperText={!dockerServer ? t('table.missDockerServer') : ''}
                error={!dockerServer}
                required
              />
              <TextField
                label={t('table.dockerUsername')}
                value={dockerUsername}
                onChange={handleDockerUsernameChange}
                helperText={!dockerUsername ? t('table.missDockerUsername') : ''}
                error={!dockerUsername}
                required
              />
              <TextField
                label={t('table.dockerPassword')}
                type="password"
                value={dockerPassword}
                onChange={handleDockerPasswordChange}
                helperText={!dockerPassword ? t('table.missDockerPassword') : ''}
                error={!dockerPassword}
                required
              />
            </Box>
          )}

          {type === 'Opaque' && (
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('table.key')}</TableCell>
                    <TableCell>{t('table.value')}</TableCell>
                    <TableCell>{t('table.operation')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          placeholder="Please enter"
                          value={row.key}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].key = e.target.value;
                            setData(newData);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          placeholder="Please enter"
                          value={row.value}
                          onChange={(e) => {
                            const newData = [...data];
                            newData[index].value = e.target.value;
                            setData(newData);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDeleteRow(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Button
                        onClick={handleAddRow}
                        variant="outlined"
                        startIcon={<AddIcon />}
                        fullWidth
                      >
                        {t('table.addRowOfData')}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button onClick={handleClose}>
              {t('actions.cancel')}
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained" sx={{ marginLeft: '16px' }}>
              {t('actions.save')}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddSecretDialog;
