'use client';

import React, { useEffect, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { createDeployment, deleteDeployment, getDeployment, useListDeployments } from '@/api/deployment';
import { Deployment } from '@/types/deployment';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import DeploymentDrawer from '@/components/Common/DeploymentDrawer';
import DeploymentDetailDialog from '@/components/Dialog/DeploymentDetailDialog';
import { useListPods } from '@/api/pod';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<Deployment>[] = [
  {
    name: 'Namespace',
    render: (deployment) => deployment?.metadata?.namespace,
  },
  {
    name: 'Name',
    render: (deployment) => deployment?.metadata?.name,
  },
  {
    name: 'Replicas (available/unavailable)',
    render: (deployment) => {
      const availableReplicas = deployment.status?.availableReplicas
        || ((deployment.status?.replicas || 0) - (deployment.status?.unavailableReplicas || 0));
      return `${availableReplicas}/${deployment.status?.replicas || 0}`;
    },
  },
  {
    name: 'Creation time',
    render: (deployment) => deployment.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function DeploymentPage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListDeployments(namespace);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const [detailOpen, setDetailOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentDeployment, setCurrentDeployment] = useState<Deployment | null>(null);
  const { data: podData, mutate: podMutate } = useListPods(namespace);
  const { error, success } = useAlert();

  useEffect(() => {
    mutate();
    podMutate()
  }, [namespace, mutate, podMutate]);

  const handleAddClick = () => {
    setCurrentDeployment(null);
    setDrawerOpen(true);
  };

  const handleDetailClick = async (_:any, row: Deployment) => {
    try {
      const resp = await getDeployment(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentDeployment(resp?.data);
      setDetailOpen(true);
    } catch (error: any) {
      Error(error?.response?.data?.message || error?.message || 'Failed to get Deployment');
    }

  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDeleteClick = (_: any, row: Deployment) => {
    showConfirmDialog({
      title: 'Delete Deployment',
      content: `Are you sure to delete Deployment ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteDeployment(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          Error(error?.response?.data?.message || error?.message || 'Failed to delete Deployment');
        }
      },
      onCancel: () => {},
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
          title="Deployment"
          addButtonLabel="Add Deployment"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={() => {mutate()}}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="Details"
          deleteButtonLabel="Delete"
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
