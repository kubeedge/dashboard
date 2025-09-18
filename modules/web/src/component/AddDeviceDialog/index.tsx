// src/components/AddDeviceDialog.js
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useForm, Controller } from 'react-hook-form';
import Select from '@mui/material/Select';
import { Device } from '@/types/device';
import { useListNodes } from '@/api/node';
import { useListDeviceModels } from '@/api/deviceModel';
import { useNamespace } from '@/hook/useNamespace';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

interface AddDeviceDialogProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: Device) => void;
}

const attributeTypes = ['INT', 'STRING', 'DOUBLE', 'FLOAT', 'BOOLEAN', 'BYTES'];

const AddDeviceDialog = ({ open, onClose, onSubmit }: AddDeviceDialogProps) => {
  const { t } = useI18n();
  const { control, handleSubmit, register, formState: { errors }, reset } = useForm();
  const [attributes, setAttributes] = useState<{ attributeName: string, type: string, attributeValue: string }[]>([]);
  const { namespace } = useNamespace();
  const nodeData = useListNodes()?.data;
  const deviceModelData = useListDeviceModels(namespace)?.data;
  const { setErrorMessage } = useAlert();

  const handleAddAttribute = () => {
    setAttributes([...attributes, { attributeName: '', type: '', attributeValue: '' }]);
  };

  const handleAttributeChange = (index: number, field: string, value: string) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = { ...updatedAttributes[index], [field]: value };
    setAttributes(updatedAttributes);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data: any) => {
    const device: Device = {
      apiVersion: "devices.kubeedge.io/v1beta1",
      kind: "Device",
      metadata: {
        labels: {
          description: data.description,
        },
        name: data.name,
        namespace: namespace || 'default',
      },
      spec: {
        deviceModelRef: {
          name: data.deviceType,
        },
        nodeName: data.node,
        protocol: {
          protocolName: data.protocol,
        },
      },
      status: {
        twins: attributes?.map((item: any) => {
          return {
            observedDesired: {
              metadata: {
                type: item.type,
              },
              value: item.attributeValue,
            },
            propertyName: item.attributeName,
            reported: {
              metadata: {
                type: item.type,
              },
              value: item.attributeValue,
            },
          };
        }),
      },
    };

    try {
      await onSubmit?.(device);
      handleClose();
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create Device');
    }
  };

  const handleClose = () => {
    reset();
    setAttributes([]);
    onClose?.();
  }

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{t('actions.add')} {t('common.device')}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Box sx={{ marginBottom: '16px' }}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: t('form.required') }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label={t('table.name')}
                  placeholder={t('form.namePlaceholder')}
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message as string || ''}
                />
              )}
            />
          </Box>
          <Box sx={{ marginBottom: '16px' }}>
            <Controller
              name="deviceType"
              control={control}
              defaultValue=""
              rules={{ required: t('form.required') }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label={t('table.deviceType')}
                  placeholder={t('table.deviceType')}
                  variant="outlined"
                  fullWidth
                  error={!!errors.deviceType}
                  helperText={errors.deviceType?.message as string || ''}
                >
                  {deviceModelData?.items?.map((type) => (
                    <MenuItem key={type?.metadata?.uid} value={type?.metadata?.name}>
                      {type?.metadata?.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
          <Box sx={{ marginBottom: '16px' }}>
            <Controller
              name="protocol"
              control={control}
              defaultValue=""
              rules={{ required: t('form.required') }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('table.protocol')}
                  placeholder={t('table.protocol')}
                  variant="outlined"
                  fullWidth
                  error={!!errors.protocol}
                  helperText={errors.protocol?.message as string || ''}
                />
              )}
            />
          </Box>
          <Box sx={{ marginBottom: '16px' }}>
            <Controller
              name="node"
              control={control}
              defaultValue=""
              rules={{ required: t('form.required') }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label={t('common.node')}
                  placeholder={t('common.node')}
                  variant="outlined"
                  fullWidth
                  error={!!errors.node}
                  helperText={errors.node?.message as string || ''}
                >
                  {nodeData?.items?.map((node) => (
                    <MenuItem key={node?.metadata?.uid} value={node?.metadata?.name}>
                      {node?.metadata?.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
          <Box sx={{ marginBottom: '16px' }}>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: t('form.required') }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('table.description')}
                  placeholder={t('table.description')}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message as string || ''}
                />
              )}
            />
          </Box>
          <Box sx={{ marginBottom: '16px' }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('table.attributeName')}</TableCell>
                    <TableCell>{t('table.type')}</TableCell>
                    <TableCell>{t('table.attributeValue')}</TableCell>
                    <TableCell>{t('table.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attributes.map((attribute, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          value={attribute.attributeName}
                          onChange={(e) => handleAttributeChange(index, 'attributeName', e.target.value)}
                          placeholder={t('table.pleaseEnter')}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={attribute.type}
                          onChange={(e) => handleAttributeChange(index, 'type', e.target.value)}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Type' }}
                        >
                          {attributeTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {t(`dataTypes.${type.toLowerCase()}`) || type}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={attribute.attributeValue}
                          onChange={(e) => handleAttributeChange(index, 'attributeValue', e.target.value)}
                          placeholder={t('table.pleaseEnter')}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleRemoveAttribute(index)}>
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                fullWidth
                sx={{ marginTop: '16px' }}
                onClick={handleAddAttribute}
              >
                {t('actions.add')} {t('table.attributes')}
              </Button>
            </TableContainer>
          </Box>
          <DialogActions>
            <Button onClick={handleClose}>
              {t('actions.cancel')}
            </Button>
            <Button type="submit" variant="contained">
              {t('actions.confirm')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceDialog;
