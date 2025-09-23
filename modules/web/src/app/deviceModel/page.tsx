'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { createDeviceModel, deleteDeviceModel, getDeviceModel, useListDeviceModels } from '@/api/deviceModel';
import AddDeviceModelDialog from '@/components/Form/AddDeviceModelDialog';
import DeviceModelDetailDialog from '@/components/Dialog/DeviceModelDetailDialog';
import { DeviceModel } from '@/types/deviceModel';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<DeviceModel>[] = [
  {
    name: 'Name',
    render: (deviceModel) => deviceModel?.metadata?.name,
  },
  {
    name: 'Protocol',
    render: (deviceModel) => deviceModel?.spec?.protocol,
  },
  {
    name: 'Creation time',
    render: (deviceModel) => deviceModel.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function DeviceModelPage() {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [selectedDeviceModel, setSelectedDeviceModel] = React.useState<DeviceModel | null>(null);
  const { namespace } = useNamespace();
  const { data, mutate } = useListDeviceModels();
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();



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
      Error(error?.response?.data?.message || error?.message || 'Failed to get DeviceModel');
    }
  };

  const handleDeleteClick = (_: any, row: DeviceModel) => {
    showConfirmDialog({
      title: 'Delete DeviceModel',
      content: `Are you sure to delete DeviceModel ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteDeviceModel(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          Error(error?.response?.data?.message || error?.message || 'Failed to delete DeviceModel');
        }
      },
      onCancel: () => {},
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
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title="DeviceModel"
          addButtonLabel="Add Model"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="Details"
          deleteButtonLabel="Delete"
        />
      </Box>
      <AddDeviceModelDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}

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
