'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createConfigMap, deleteConfigMap, getConfigMap, useListConfigMaps } from '@/api/configMap';
import { ConciseConfigMap, ConfigMap } from '@/types/configMap';
import { useNamespace } from '@/hook/useNamespace';
import AddConfigMapDialog from '@/component/Form/AddConfigMapDialog';
import ConfigMapDetailDialog from '@/component/Dialog/ConfigMapDetailDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function ConfigMapPage() {
  const { namespace } = useNamespace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc' | string>('');
  const [name, setName] = useState<string>('');
  const params = useMemo(() => ({
    namespace,
    page,
    pageSize,
    sort,
    order,
    filter: [name ? `name:${name}` : undefined].filter(Boolean).join(','),
  }), [namespace, page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListConfigMaps(params);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedConfigMap, setSelectedConfigMap] = useState<ConfigMap | null>(null);
  const { error } = useAlert();
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();

  const columns: ColumnDefinition<ConciseConfigMap>[] = [
    {
      name: t('table.namespace'),
      render: (configMap) => configMap?.namespace,
    },
    {
      key: 'name',
      name: t('table.name'),
      sortable : true,
      render: (configMap) => configMap?.name,
    },
    {
      name: t('table.labels'),
      render: (configMap) => (
        <Box>
          {configMap?.labels && Object.entries(configMap.labels).map(([key, value]) => (
            <Box
              key={key}
              sx={{
                display: 'block', bgcolor: 'grey.200', color: 'text.primary', px: 1,
                py: 0.5, borderRadius: 1, mr: 0.5, mb: 0.5, fontSize: '0.75rem'
              }}
            >
              {key}: {value}
            </Box>
          ))}
        </Box>
      )
    },
    {
      key: 'creationTimestamp',
      name: t('table.creationTime'),
      sortable : true,
      render: (configMap) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatDateTime(configMap?.creationTimestamp, currentLanguage)}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeTime(configMap?.creationTimestamp, currentLanguage)}
          </Box>
        </Box>
      )
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  useEffect(() => {
    mutate();
  }, [namespace, mutate, params]);

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedConfigMap(null);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSort(field);
    setOrder(direction);
  }

  const handleDetailClick = async (_: any, row: ConciseConfigMap) => {
    try {
      const resp = await getConfigMap(row?.namespace || '', row?.name || '');
      setSelectedConfigMap(resp?.data);
      setDetailDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleSubmit = async (record: ConfigMap) => {
    await createConfigMap(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  const handleDelete = (_: any, row: ConciseConfigMap) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.configMap'),
      content: t('messages.deleteConfirm') + ` ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteConfigMap(row?.namespace || '', row?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
    })
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.configMap')}
          addButtonLabel={t('actions.add') + ' ' + t('common.configMap')}
          columns={columns}
          data={data?.items}
          onAddClick={() => setDialogOpen(true)}
          onRefreshClick={() => mutate()}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDelete}
          detailButtonLabel={t('actions.view')}
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
            direction: order as 'asc' | 'desc',
          }}
          onSortChange={handleSortChange}
          filter={(
            <>
              <TextField size='small' label={t('table.name')} value={name || ''} onChange={(e) => setName(e.target.value || '')} placeholder={t('table.textWildcardHelp')} />
            </>
          )}
        />
      </Box>
      <AddConfigMapDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        onCreated={() => setDialogOpen(false)}
      />
      <ConfigMapDetailDialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        data={selectedConfigMap}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
