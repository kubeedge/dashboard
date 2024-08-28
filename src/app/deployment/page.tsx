'use client';

import React, { useEffect, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { deleteDeployment, getDeployment, useListDeployments } from '@/api/deployment';
import { Deployment } from '@/types/deployment';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import DeploymentDrawer from '@/component/DeploymentDrawer';
import DeploymentDetailDialog from '@/component/DeploymentDetailDialog';
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
  const { setErrorMessage } = useAlert();

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
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get Deployment');
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
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to delete Deployment');
        }
      },
      onCancel: () => {},
    });
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
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
        data={currentDeployment}
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
