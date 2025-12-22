'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { ColumnDefinition, Direction, TableCard } from '@/component/Common/TableCard';
import { createDeviceModel, deleteDeviceModel, getDeviceModel, useListDeviceModels } from '@/api/deviceModel';
import AddDeviceModelDialog from '@/component/Form/AddDeviceModelDialog';
import DeviceModelDetailDialog from '@/component/Dialog/DeviceModelDetailDialog';
import { ConciseDeviceModel, DeviceModel } from '@/types/deviceModel';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function DeviceModelPage() {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDeviceModel, setSelectedDeviceModel] = useState<DeviceModel | null>(null);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();
  const { namespace } = useNamespace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<Direction | ''>('');
  const [name, setName] = useState<string | undefined>('');
  const params = useMemo(() => ({
    page,
    pageSize,
    sort,
    order,
    filter: [name ? `name:${name}` : undefined].filter(Boolean).join(','),
  }), [page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListDeviceModels(namespace, params);

  const columns: ColumnDefinition<ConciseDeviceModel>[] = [
    {
      key: 'name',
      name: t('table.name'),
      sortable: true,
      render: (deviceModel) => deviceModel?.name,
    },
    {
      name: t('table.protocol'),
      render: (deviceModel) => deviceModel?.protocol,
    },
    {
      key: 'creationTimestamp',
      name: t('table.creationTime'),
      sortable: true,
      render: (deviceModel) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatDateTime(deviceModel?.creationTimestamp, currentLanguage)}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeTime(deviceModel?.creationTimestamp, currentLanguage)}
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

  const handleDetailClick = async (_: any, row: ConciseDeviceModel) => {
    try {
      const resp = await getDeviceModel(row?.namespace || '', row?.name || '');
      setSelectedDeviceModel(resp?.data);
      setDetailDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleDeleteClick = (_: any, row: ConciseDeviceModel) => {
    showConfirmDialog({
      title: `${t('actions.delete')} ${t('common.deviceModel')}`,
      content: `${t('messages.deleteConfirm')} ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteDeviceModel(row?.namespace || '', row?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    })
  };

  const handleAddDeviceModel = async (record: DeviceModel) => {
    await createDeviceModel(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.deviceModel')}
          addButtonLabel={t('actions.add') + ' ' + t('common.deviceModel')}
          columns={columns}
          data={data?.items}
          onAddClick={() => setAddDialogOpen(true)}
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
      <AddDeviceModelDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddDeviceModel}
        onCreated={() => setAddDialogOpen(false)}
      />
      <DeviceModelDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        data={selectedDeviceModel}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
