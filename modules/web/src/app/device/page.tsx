'use client';

import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { createDevice, deleteDevice, getDevice, useListDevices } from '@/api/device';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Device } from '@/types/device';
import { useNamespace } from '@/hook/useNamespace';
import DeviceDetailDialog from '@/component/DeviceDetailDialog';
import AddDeviceDialog from '@/component/AddDeviceDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function DevicePage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListDevices(namespace);
  const { t } = useI18n();

  const columns: ColumnDefinition<Device>[] = [
    {
      name: t('table.name'),
      render: (device) => device?.metadata?.name,
    },
    {
      name: t('table.protocol'),
      render: (device) => device?.spec?.protocol?.protocolName,
    },
    {
      name: t('table.nodeName'),
      render: (device) => device?.spec?.nodeName,
    },
    {
      name: t('table.creationTime'),
      render: (device) => device.metadata?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = React.useState(false);
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleAddClick = () => {
    setIsAddDeviceDialogOpen(true);
  };

  const handleRefreshClick = () => {
    mutate();
  };
  const handleDetailClick = async (_: any, row: Device) => {
    try {
      const resp = await getDevice(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setSelectedDevice(resp?.data);
      setIsDetailDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
    }
  };

  const handleDeleteClick = (_: any, row: Device) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.device'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteDevice(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    });
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedDevice(null);
  };

  const handleCloseAddDeviceDialog = () => {
    setIsAddDeviceDialogOpen(false);
  };

  const handleSubmit = async (device: Device) => {
    await createDevice(device?.metadata?.namespace || namespace || 'default', device);
    mutate();
  }

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title={t('common.device')}
          addButtonLabel={t('actions.add') + ' ' + t('common.device')}
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
      <DeviceDetailDialog
        open={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
        data={selectedDevice}
      />
      <AddDeviceDialog
        open={isAddDeviceDialogOpen}
        onClose={handleCloseAddDeviceDialog}
        onSubmit={handleSubmit}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
