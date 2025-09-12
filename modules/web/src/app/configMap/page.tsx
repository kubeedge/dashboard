'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { createConfigMap, deleteConfigMap, getConfigMap, useListConfigMaps } from '@/api/configMap';
import { ConfigMap } from '@/types/configMap';
import { useNamespace } from '@/hook/useNamespace';
import AddConfigmapDialog from '@/component/AddConfigmapDialog';
import ConfigmapDetailDialog from '@/component/ConfigmapDetailDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function ConfigmapPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [selectedConfigMap, setSelectedConfigMap] = React.useState<ConfigMap | null>(null);
  const { namespace } = useNamespace();
  const { data, mutate } = useListConfigMaps(namespace);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();
  const { t } = useI18n();

  const columns: ColumnDefinition<ConfigMap>[] = [
    {
      name: t('table.namespace'),
      render: (configMap) => configMap?.metadata?.namespace,
    },
    {
      name: t('table.name'),
      render: (configMap) => configMap?.metadata?.name,
    },
    {
      name: t('form.labels'),
      render: (configMap) => JSON.stringify(configMap.metadata?.labels),
    },
    {
      name: t('table.age'),
      render: (configMap) => configMap.metadata?.creationTimestamp,
    },
    {
      name: t('table.actions'),
      renderOperation: true,
    },
  ];

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
        />
      </Box>
      <AddConfigmapDialog open={dialogOpen} onClose={handleCloseDialog} onSubmit={handleSubmit} />
      <ConfigmapDetailDialog open={detailDialogOpen} onClose={handleCloseDetailDialog} data={selectedConfigMap} />
      {ConfirmDialogComponent}
    </Box>
  );
}
