'use client';

import React, { useMemo, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { createDevice, deleteDevice, getDevice, useListDevices } from '@/api/device';
import { ColumnDefinition, Direction, TableCard } from '@/component/Common/TableCard';
import { ConciseDevice, Device } from '@/types/device';
import { useNamespace } from '@/hook/useNamespace';
import DeviceDetailDialog from '@/component/Dialog/DeviceDetailDialog';
import AddDeviceDialog from '@/component/Form/AddDeviceDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function DevicePage() {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();
  const { namespace } = useNamespace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<Direction>();
  const [name, setName] = useState<string | undefined>(undefined);
  const params = useMemo(() => ({
    page,
    pageSize,
    sort,
    order,
    filter: [name ? `name:${name}` : undefined].filter(Boolean).join(','),
  }), [page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListDevices(namespace, params);

  const columns: ColumnDefinition<ConciseDevice>[] = [
    {
      key: 'name',
      name: t('table.name'),
      sortable: true,
      render: (device) => device?.name,
    },
    {
      name: t('table.protocol'),
      render: (device) => device?.protocol,
    },
    {
      name: t('table.deviceModel'),
      render: (device) => device?.deviceModelRef,
    },
    {
      name: t('table.nodeName'),
      render: (device) => device.nodeName,
    },
    {
      name: t('table.status'),
      render: (device) => device?.status ?? 'Unknown',
    },
    {
      key: 'creationTimestamp',
      name: t('table.creationTime'),
      sortable: true,
      render: (device) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatDateTime(device?.creationTimestamp, currentLanguage)}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeTime(device?.creationTimestamp, currentLanguage)}
          </Box>
        </Box>
      )
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, direction: Direction) => {
    setSort(field);
    setOrder(direction);
  }

  const handleDetailClick = async (_: any, row: ConciseDevice) => {
    try {
      const resp = await getDevice(row?.namespace || '', row?.name || '');
      setSelectedDevice(resp?.data);
      setIsDetailDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleDeleteClick = (_: any, row: ConciseDevice) => {
    showConfirmDialog({
      title: `${t('actions.delete')} ${t('common.device')}`,
      content: `${t('messages.deleteConfirm')} ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteDevice(row?.namespace || '', row?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
    });
  };

  const handleSubmit = async (device: Device) => {
    await createDevice(device?.metadata?.namespace || namespace || 'default', device);
    mutate();
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.device')}
          addButtonLabel={t('actions.add') + ' ' + t('common.device')}
          columns={columns}
          data={data?.items}
          onAddClick={() => setIsAddDeviceDialogOpen(true)}
          onRefreshClick={() => mutate()}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel={t('actions.detail')}
          deleteButtonLabel={t('actions.delete')}
          loading={isLoading}
          pagination={{
            current: data?.page || 1,
            pageSize: data?.pageSize || 10,
            total: data?.total || 0,
          }}
          onPaginationChange={handlePaginationChange}
          sort={{
            field: sort,
            direction: order as Direction,
          }}
          onSortChange={handleSortChange}
          filter={(
            <>
              <TextField
                size='small'
                label={t('table.name')}
                value={name || ''}
                onChange={(e) => setName(e.target.value || '')}
                placeholder={t('table.textWildcardHelp')}
              />
            </>
          )}
        />
      </Box>
      <DeviceDetailDialog
        open={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        data={selectedDevice}
      />
      <AddDeviceDialog
        open={isAddDeviceDialogOpen}
        onClose={() => setIsAddDeviceDialogOpen(false)}
        onSubmit={handleSubmit}
        onCreated={() => setIsAddDeviceDialogOpen(false)}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
