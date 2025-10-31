'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, Button, MenuItem, Pagination } from '@mui/material';
import { createDeployment, deleteDeployment, getDeployment, useListDeployments } from '@/api/deployment';
import { Deployment } from '@/types/deployment';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import DeploymentDrawer from '@/component/DeploymentDrawer';
import DeploymentDetailDialog from '@/component/DeploymentDetailDialog';
import { useListPods } from '@/api/pod';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatRelativeTime, formatNumber } from '@/helper/localization';

export default function DeploymentPage() {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();

  const columns: ColumnDefinition<Deployment | any>[] = [
    {
      name: t('table.namespace'),
      render: (deployment) => (deployment as any)?.metadata?.namespace ?? (deployment as any)?.namespace,
    },
    {
      name: t('table.name'),
      render: (deployment) => (deployment as any)?.metadata?.name ?? (deployment as any)?.name,
    },
    {
      name: t('table.status') + ` (${currentLanguage.startsWith('zh') ? '可用/总数' : 'Available/Total'})`,
      render: (deployment) => {
        const available = (deployment as any)?.status?.availableReplicas
          ?? (deployment as any)?.availableReplicas
          ?? (((deployment as any)?.status?.replicas || 0) - ((deployment as any)?.status?.unavailableReplicas || 0));
        const total = (deployment as any)?.status?.replicas ?? (deployment as any)?.replicas ?? 0;
        return `${available}/${total}`;
      },
    },
    {
      name: t('table.creationTime'),
      render: (deployment) => (deployment as any)?.metadata?.creationTimestamp ?? (deployment as any)?.creationTimestamp,
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
  const { data, mutate } = useListDeployments(params);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const [detailOpen, setDetailOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(null);
  const { data: podData, mutate: podMutate } = useListPods(namespace);
  const { setErrorMessage } = useAlert();

  useEffect(() => {
    mutate();
    podMutate()
  }, [namespace, mutate, podMutate]);

  const handleAddClick = () => {
    setCurrentDeployment(null);
    setDrawerOpen(true);
  };

  const handleDetailClick = async (_: any, row: Deployment) => {
    try {
      const resp = await getDeployment(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentDeployment(resp?.data);
      setDetailOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get Deployment');
    }

  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDeleteClick = (_: any, row: Deployment) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.deployment'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteDeployment(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    });
  };

  const handleSubmit = async (_: any, record: Deployment) => {
    await createDeployment(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  }

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title={t('common.deployment')}
          addButtonLabel={t('actions.add') + ' ' + t('common.deployment')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={() => { mutate() }}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel={t('actions.view')}
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
        {ConfirmDialogComponent}
      </Box>
      <DeploymentDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        onSubmit={handleSubmit}
      />
      <DeploymentDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        data={currentDeployment}
        pods={podData?.items}
      />
    </Box>
  );
}
