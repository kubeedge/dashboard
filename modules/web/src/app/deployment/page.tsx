'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createDeployment, deleteDeployment, getDeployment, useListDeployments } from '@/api/deployment';
import { ConciseDeployment, Deployment } from '@/types/deployment';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import DeploymentDrawer from '@/component/Common/DeploymentDrawer';
import DeploymentDetailDialog from '@/component/Dialog/DeploymentDetailDialog';
import { useListPods } from '@/api/pod';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatRelativeTime, formatDateTime } from '@/helper/localization';

export default function DeploymentPage() {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const { namespace } = useNamespace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc' | string>('');
  const [name, setName] = useState<string>('');
  const params = useMemo(() => ({
    page,
    pageSize,
    sort,
    order,
    filter: [name ? `name:${name}` : undefined].filter(Boolean).join(','),
  }), [namespace, page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListDeployments(namespace, params);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const [detailOpen, setDetailOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(null);
  const { data: podData, mutate: podMutate } = useListPods(namespace);
  const { error } = useAlert();

  const columns: ColumnDefinition<ConciseDeployment>[] = [
    {
      name: t('table.namespace'),
      render: (deployment) => deployment?.namespace || '-',
    },
    {
      key: 'name',
      name: t('table.name'),
      sortable : true,
      render: (deployment) => deployment?.name || '-',
    },
    {
      name: `${t('table.status')} (${t('table.deploymentStatusRatio')})`,
      render: (deployment) => {
        return `${deployment.availableReplicas || 0}/${deployment.replicas || 0}`;
      },
    },
    {
      key: 'creationTimestamp',
      name: t('table.creationTime'),
      sortable: true,
      render: (deployment) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatDateTime(deployment?.creationTimestamp, currentLanguage)}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeTime(deployment?.creationTimestamp, currentLanguage)}
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

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSort(field);
    setOrder(direction);
  };

  const handleDetailClick = async (_: any, row: ConciseDeployment) => {
    try {
      const resp = await getDeployment(row?.namespace || '', row?.name || '');
      setCurrentDeployment(resp?.data);
      setDetailOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleDeleteClick = (_: any, row: ConciseDeployment) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.deployment'),
      content: t('messages.deleteConfirm') + ` ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteDeployment(row?.namespace || '', row?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
    });
  };

  const handleSubmit = async (_: any, record: Deployment) => {
    await createDeployment(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.deployment')}
          addButtonLabel={t('actions.add') + ' ' + t('common.deployment')}
          columns={columns}
          data={data?.items}
          onAddClick={() => setDrawerOpen(true)}
          onRefreshClick={() => { mutate() }}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
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
              <TextField
                size="small"
                label={t('table.name')}
                value={name || ''}
                onChange={(e) => setName(e.target.value || '')}
                placeholder={t('table.textWildcardHelp')}
              />
            </>
          )}
        />
        {ConfirmDialogComponent}
      </Box>
      <DeploymentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
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
