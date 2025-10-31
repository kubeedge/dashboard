'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, Button, MenuItem, Pagination } from '@mui/material';
import { createConfigMap, deleteConfigMap, getConfigMap, useListConfigMaps } from '@/api/configMap';
import { ConfigMap } from '@/types/configMap';
import { useNamespace } from '@/hook/useNamespace';
import AddConfigmapDialog from '@/component/AddConfigmapDialog';
import ConfigmapDetailDialog from '@/component/ConfigmapDetailDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function ConfigmapPage() {
  const { namespace } = useNamespace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string | undefined>('creationTimestamp');
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>('desc');
  const [name, setName] = useState<string | undefined>(undefined);
  const [mock, setMock] = useState<number | undefined>(undefined);
  const params = useMemo(() => ({
    namespace,
    page,
    pageSize,
    sort,
    order,
    filter: [name ? `name:${name}` : undefined].filter(Boolean).join(','),
    mock,
  }), [namespace, page, pageSize, sort, order, name, mock]);
  const { data, mutate } = useListConfigMaps(params);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();
  const { t } = useI18n();

  const columns: ColumnDefinition<ConfigMap | any>[] = [
    {
      name: t('table.namespace'),
      render: (configMap) => (configMap as any)?.metadata?.namespace ?? (configMap as any)?.namespace,
    },
    {
      name: t('table.name'),
      render: (configMap) => (configMap as any)?.metadata?.name ?? (configMap as any)?.name,
    },
    {
      name: t('table.labels'),
      render: (configMap) => JSON.stringify((configMap as any)?.metadata?.labels ?? (configMap as any)?.labels),
    },
    {
      name: t('table.creationTime'),
      render: (configMap) => (configMap as any)?.metadata?.creationTimestamp ?? (configMap as any)?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedConfigMap, setSelectedConfigMap] = useState<ConfigMap | null>(null);

  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleAddClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleDetailClick = async (_: any, row: ConfigMap) => {
    try {
      const resp = await getConfigMap(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setSelectedConfigMap(resp?.data);
      setDetailDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get ConfigMap');
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedConfigMap(null);
  };

  const handleSubmit = async (_: any, record: ConfigMap) => {
    await createConfigMap(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  }

  const handleRefreshClick = () => {
    mutate();
  };

  const handleDelete = (_: any, row: ConfigMap) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.configMap'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteConfigMap(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    })
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title={t('common.configMap')}
          addButtonLabel={t('actions.add') + ' ' + t('common.configMap')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDelete}
          detailButtonLabel={t('actions.view')}
          deleteButtonLabel={t('actions.delete')}
          specialHandling={false}
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
            <MenuItem value="creationTimestamp">creationTimestamp</MenuItem>
          </TextField>
          <TextField size="small" select label="Order" value={order||''} onChange={(e) => setOrder((e.target.value as any)||undefined)} sx={{ minWidth: 140 }}>
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="asc">asc</MenuItem>
            <MenuItem value="desc">desc</MenuItem>
          </TextField>
          <TextField size="small" label="Name" value={name||''} onChange={(e) => setName(e.target.value||undefined)} placeholder="supports * wildcards" />
          {/* mock control removed in PR branch; automatic fetch on change, no apply button */}
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
      <AddConfigmapDialog open={dialogOpen} onClose={handleCloseDialog} onSubmit={handleSubmit} />
      <ConfigmapDetailDialog open={detailDialogOpen} onClose={handleCloseDetailDialog} data={selectedConfigMap} />
      {ConfirmDialogComponent}
    </Box>
  );
}
