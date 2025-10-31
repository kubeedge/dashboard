'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { createDeviceModel, deleteDeviceModel, getDeviceModel, useListDeviceModels } from '@/api/deviceModel';
import AddDeviceModelDialog from '@/component/AddDeviceModelDialog';
import DeviceModelDetailDialog from '@/component/DeviceModelDetailDialog';
import { DeviceModel } from '@/types/deviceModel';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function DeviceModelPage() {
  const { t } = useI18n();

  const columns: ColumnDefinition<DeviceModel | any>[] = [
    {
      name: t('table.name'),
      render: (deviceModel) => (deviceModel as any)?.metadata?.name ?? (deviceModel as any)?.name,
    },
    {
      name: t('table.protocol'),
      render: (deviceModel) => (deviceModel as any)?.spec?.protocol ?? (deviceModel as any)?.protocol,
    },
    {
      name: t('table.creationTime'),
      render: (deviceModel) => (deviceModel as any)?.metadata?.creationTimestamp ?? (deviceModel as any)?.creationTimestamp,
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
  const { data, mutate } = useListDeviceModels(params);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDeviceModel, setSelectedDeviceModel] = useState<DeviceModel | null>(null);
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
            <MenuItem value="protocol">protocol</MenuItem>
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
