'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { createServiceAccount, deleteServiceAccount, getServiceAccount, useListServiceAccounts } from '@/api/serviceAccount';
import YAMLViewerDialog from '@/components/Dialog/YAMLViewerDialog';
import { ServiceAccount } from '@/types/serviceAccount';
import AddServiceAccountDialog from '@/components/Form/AddServiceAccountDialog';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<ServiceAccount>[] = [
  {
    name: 'Namespace',
    render: (account) => account?.metadata?.namespace,
  },
  {
    name: 'Name',
    render: (account) => account?.metadata?.name,
  },
  {
    name: 'Secrets',
    render: (account) => account.secrets?.map(secret => secret.name)?.join(', ') || '-',
  },
  {
    name: 'Creation time',
    render: (account) => account.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function ServiceAccountsPage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListServiceAccounts(namespace);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();


  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleQueryClick = () => {
    mutate();
  };

  const handleYamlClick = async (_: any, row: ServiceAccount) => {
    try {
      const resp = await getServiceAccount(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentYamlContent(resp.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      Error(error?.response?.data?.message || error?.message || 'Failed to get ServiceAccount');
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleDeleteClick = (_: any, row: ServiceAccount) => {
    showConfirmDialog({
      title: 'Delete ServiceAccount',
      content: `Are you sure to delete ServiceAccount ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteServiceAccount(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          Error(error?.response?.data?.message || error?.message || 'Failed to create ServiceAccount');
        }
      },
      onCancel: () => {},
    })
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleAddFormSubmit = async (_: any, record: ServiceAccount) => {
    await createServiceAccount(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title="ServiceAccounts"
          addButtonLabel="Add ServiceAccounts"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onQueryClick={handleQueryClick}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel="Delete"
        />
      </Box>
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={handleYamlDialogClose}
        content={currentYamlContent}
      />
      <AddServiceAccountDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        />
      {ConfirmDialogComponent}
    </Box>
  );
}
