'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
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
  const { t } = useI18n();
  const columns: ColumnDefinition<Device | any>[] = [
    {
      name: t('table.name'),
      render: (device) => (device as any)?.metadata?.name ?? (device as any)?.name,
    },
    {
      name: t('table.protocol'),
      render: (device) => device?.spec?.protocol?.protocolName,
    },
    {
      name: 'DeviceModelRef',
      render: (device) => (device as any)?.spec?.deviceModelRef?.name ?? (device as any)?.deviceModelRef,
    },
    {
      name: t('table.nodeName'),
      render: (device) => (device as any)?.spec?.nodeName ?? (device as any)?.nodeSelector,
    },
    {
      name: 'Status',
      render: (device) => (device as any)?.status ?? 'Unknown',
    },
    {
      name: t('table.creationTime'),
      render: (device) => (device as any)?.metadata?.creationTimestamp ?? (device as any)?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const { namespace } = useNamespace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string | undefined>('creationTimestamp');
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>('desc');
  const [name, setName] = useState<string | undefined>(undefined);
  const params = useMemo(() => ({
    namespace,
    page,
    pageSize,
    sort,
    order,
    filter: [name ? `name:${name}` : undefined].filter(Boolean).join(','),
  }), [namespace, page, pageSize, sort, order, name]);
  const { data, mutate } = useListDevices(params);

  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
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
          noPagination={true}
        />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', marginTop: 2, flexWrap: 'wrap' }}>
          <TextField size="small" select label="Rows per page" value={pageSize}
            onChange={(e) => { const v = Number(e.target.value)||10; setPageSize(v); setPage(1); mutate(); }} sx={{ minWidth: 140 }}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </TextField>
          <TextField size="small" select label="Sort" value={sort||''} onChange={(e) => setSort(e.target.value||undefined)} sx={{ minWidth: 180 }}>
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="name">name</MenuItem>
            <MenuItem value="deviceModelRef">deviceModelRef</MenuItem>
            <MenuItem value="creationTimestamp">creationTimestamp</MenuItem>
          </TextField>
          <TextField size="small" select label="Order" value={order||''} onChange={(e) => setOrder((e.target.value as any)||undefined)} sx={{ minWidth: 140 }}>
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="asc">asc</MenuItem>
            <MenuItem value="desc">desc</MenuItem>
          </TextField>
          <TextField size="small" label="Name" value={name||''} onChange={(e) => setName(e.target.value||undefined)} placeholder="supports * wildcards" />
          <Box sx={{ flexGrow: 1 }} />
          <Pagination
            page={page}
            onChange={(_, value) => { setPage(value); mutate(); }}
            count={Math.max(1, Math.ceil(((data?.total ?? 0) as number) / (pageSize || 1)))}
            size="small"
            color="primary"
          />
        </Box>
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
