'use client';

import React, { useEffect, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, Button } from '@mui/material';
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
  const { namespace } = useNamespace();
  const { data, mutate } = useListDeployments(namespace);
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();

  const columns: ColumnDefinition<Deployment>[] = [
    {
      name: t('table.namespace'),
      render: (deployment) => deployment?.metadata?.namespace || '-',
    },
    {
      name: t('table.name'),
      render: (deployment) => deployment?.metadata?.name || '-',
    },
    {
      name: t('table.status') + ` (${currentLanguage.startsWith('zh') ? '可用/总数' : 'Available/Total'})`,
      render: (deployment) => {
        const availableReplicas = deployment.status?.availableReplicas
          || ((deployment.status?.replicas || 0) - (deployment.status?.unavailableReplicas || 0));
        const totalReplicas = deployment.status?.replicas || 0;
        return `${formatNumber(availableReplicas, currentLanguage)}/${formatNumber(totalReplicas, currentLanguage)}`;
      },
    },
    {
      name: t('table.age'),
      render: (deployment) => formatRelativeTime(deployment.metadata?.creationTimestamp, currentLanguage),
    },
    {
      name: t('table.actions'),
      renderOperation: true,
    },
  ];
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
        />
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
