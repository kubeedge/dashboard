'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { createDeviceModel, deleteDeviceModel, getDeviceModel, useListDeviceModels } from '@/api/deviceModel';
import AddDeviceModelDialog from '@/component/AddDeviceModelDialog';
import DeviceModelDetailDialog from '@/component/DeviceModelDetailDialog';
import { DeviceModel } from '@/types/deviceModel';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function DeviceModelPage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListDeviceModels(namespace);
  const { t } = useI18n();

  const columns: ColumnDefinition<DeviceModel>[] = [
    {
      name: t('table.name'),
      render: (deviceModel) => deviceModel?.metadata?.name,
    },
    {
      name: t('table.protocol'),
      render: (deviceModel) => deviceModel?.spec?.protocol,
    },
    {
      name: t('table.creationTime'),
      render: (deviceModel) => deviceModel.metadata?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [selectedDeviceModel, setSelectedDeviceModel] = React.useState<DeviceModel | null>(null);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleRefreshClick = () => {
    mutate();
  };

  const handleDetailClick = async (_: any, row: DeviceModel) => {
    try {
      const resp = await getDeviceModel(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setSelectedDeviceModel(resp?.data);
      setDetailDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
    }
  };

  const handleDeleteClick = (_: any, row: DeviceModel) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.deviceModel'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteDeviceModel(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    })
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleAddDeviceModel = async (_: any, record: DeviceModel) => {
    await createDeviceModel(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title={t('common.deviceModel')}
          addButtonLabel={t('actions.add') + ' ' + t('common.deviceModel')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="Details"
          deleteButtonLabel={t('actions.delete')}
        />
      </Box>
      <AddDeviceModelDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        onSubmit={handleAddDeviceModel}
      />
      <DeviceModelDetailDialog
        open={detailDialogOpen}
        onClose={handleDetailDialogClose}
        data={selectedDeviceModel}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
