'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { createConfigMap, deleteConfigMap, getConfigMap, useListConfigMaps } from '@/api/configMap';
import { ConfigMap } from '@/types/configMap';
import { useNamespace } from '@/hook/useNamespace';
import AddConfigmapDialog from '@/components/Form/AddConfigmapDialog';
import ConfigmapDetailDialog from '@/components/Dialog/ConfigmapDetailDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<ConfigMap>[] = [
  {
    name: 'Namespace',
    render: (configMap) => configMap?.metadata?.namespace,
  },
  {
    name: 'Name',
    render: (configMap) => configMap?.metadata?.name,
  },
  {
    name: 'Labels',
    render: (configMap) => JSON.stringify(configMap.metadata?.labels),
  },
  {
    name: 'Creation time',
    render: (configMap) => configMap.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function ConfigmapPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [selectedConfigMap, setSelectedConfigMap] = React.useState<ConfigMap | null>(null);
  const { namespace } = useNamespace();
  const { data, mutate } = useListConfigMaps(namespace);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();


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
      Error(error?.response?.data?.message || error?.message || 'Failed to get ConfigMap');
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedConfigMap(null);
  };


  const handleSubmit = async (_: any, record: ConfigMap) => {
    try {
      await createConfigMap(record?.metadata?.namespace || namespace || 'default', record);
      success('ConfigMap created');
      setDialogOpen(false);
      mutate();
    } catch (e: any) {
      error(e?.response?.data?.message || e?.message || 'Failed to create ConfigMap');
    }
  };


  const handleRefreshClick = () => {
    mutate();
  };

  const handleDelete = (_: any, row: ConfigMap) => {
    showConfirmDialog({
      title: 'Delete ConfigMap',
      content: `Are you sure to delete ConfigMap ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteConfigMap(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          Error(error?.response?.data?.message || error?.message || 'Failed to delete ConfigMap');
        }
      },
      onCancel: () => {},
    })
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title="Configmap"
          addButtonLabel="Add Configmap"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDelete}
          detailButtonLabel="Details"
          deleteButtonLabel="Delete"
          specialHandling={false}
        />
      </Box>
      <AddConfigmapDialog open={dialogOpen} onClose={handleCloseDialog} onSubmit={handleSubmit}  />

      <ConfigmapDetailDialog open={detailDialogOpen} onClose={handleCloseDetailDialog} data={selectedConfigMap} />
      {ConfirmDialogComponent}
    </Box>
  );
}
