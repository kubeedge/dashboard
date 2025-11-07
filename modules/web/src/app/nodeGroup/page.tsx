'use client';

import React, { useMemo, useState } from 'react';
import { TextField, MenuItem, Button, Pagination } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { deleteNodeGroup, getNodeGroup, useListNodeGroups } from '@/api/nodeGroup';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import AddNodeGroupDialog from '@/component/Form/AddNodeGroupDialog';
import type { NodeGroup } from '@/types/nodeGroup';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function NodeGroupPage() {
  const { t } = useI18n();

  // Compatible with full NodeGroup object and lightweight DTO from server
  const columns: ColumnDefinition<any>[] = [
    {
      name: t('table.name'),
      render: (row: any) => row?.metadata?.name ?? row?.name,
    },
    {
      name: t('table.creationTime'),
      render: (row: any) => row?.metadata?.creationTimestamp ?? row?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string | undefined>('creationTimestamp');
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>('desc');
  const [namespace, setNamespace] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  // No mock controls in PR branch
  const params = useMemo(() => ({
    page, pageSize, sort, order,
    filter: [
      namespace ? `namespace:${namespace}` : undefined,
      name ? `name:${name}` : undefined,
    ].filter(Boolean).join(','),
  }), [page, pageSize, sort, order, namespace, name]);
  const [selectedYaml, setSelectedYaml] = React.useState<NodeGroup | null>(null);
  const [openYamlDialog, setOpenYamlDialog] = React.useState(false);
  const [openAddNodeGroupDialog, setOpenAddNodeGroupDialog] = React.useState(false);
  const { data, mutate } = useListNodeGroups(params);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();

  const handleAddClick = () => setOpenAddNodeGroupDialog(true);
  const handleRefreshClick = () => mutate();

  const handleDetailClick = async (_: any, row: any) => {
    try {
      const resp = await getNodeGroup((row?.metadata?.name ?? row?.name) || '');
      setSelectedYaml(resp?.data);
      setOpenYamlDialog(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleDeleteClick = async (_: any, row: any) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.nodeGroup'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name ?? row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteNodeGroup((row?.metadata?.name ?? row?.name) || '');
          mutate();
        } catch (e: any) {
          error(e?.response?.data?.message || e?.message || 'Failed to delete NodeGroup');
        }
      },
      onCancel: () => { },
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
        <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
          <TableCard
            title={t('common.nodeGroup')}
            addButtonLabel={t('actions.add') + ' ' + t('common.nodeGroup')}
            columns={columns}
            data={data?.items}
            onAddClick={handleAddClick}
            onRefreshClick={handleRefreshClick}
            onDetailClick={handleDetailClick}
            onDeleteClick={handleDeleteClick}
            detailButtonLabel="YAML"
            deleteButtonLabel={t('actions.delete')}
            noPagination
          />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', marginTop: 2, flexWrap: 'wrap' }}>
            <TextField size="small" select label="Rows per page" value={pageSize}
              onChange={(e) => { const v = Number(e.target.value) || 10; setPageSize(v); setPage(1); mutate(); }} sx={{ minWidth: 140 }}>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </TextField>
            <TextField size="small" select label="Sort" value={sort || ''} onChange={(e) => setSort(e.target.value || undefined)} sx={{ minWidth: 180 }}>
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="name">name</MenuItem>
              <MenuItem value="creationTimestamp">creationTimestamp</MenuItem>
            </TextField>
            <TextField size="small" select label="Order" value={order || ''} onChange={(e) => setOrder((e.target.value as any) || undefined)} sx={{ minWidth: 140 }}>
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="asc">asc</MenuItem>
              <MenuItem value="desc">desc</MenuItem>
            </TextField>
            <TextField size="small" label="Namespace" value={namespace || ''} onChange={(e) => setNamespace(e.target.value || undefined)} />
            <TextField size="small" label="Name" value={name || ''} onChange={(e) => setName(e.target.value || undefined)} placeholder="supports * wildcards" />
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

        <YAMLViewerDialog open={openYamlDialog} onClose={() => setOpenYamlDialog(false)} content={selectedYaml} />

        <AddNodeGroupDialog
          open={openAddNodeGroupDialog}
          onClose={() => setOpenAddNodeGroupDialog(false)}
          onCreated={() => mutate()}
        />

        {ConfirmDialogComponent}
      </Box>
    </LocalizationProvider>
  );
}
