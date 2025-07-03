'use client';

import React from 'react';
import { Box } from '@mui/material';
import { createSecret, deleteSecret, getSecret, useListSecrets } from '@/api/secret';
import { Secret } from '@/types/secret';
import { useNamespace } from '@/hook/useNamespace';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import AddSecretDialog from '@/component/AddSecretDialog';
import SecretDetailDialog from '@/component/SecretDetailDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<Secret>[] = [
  {
    name: 'Namespace',
    render: (secret) => secret?.metadata?.namespace,
  },
  {
    name: 'Name',
    render: (secret) => secret?.metadata?.name,
  },
  {
    name: 'Type',
    render: (secret) => secret.type,
  },
  {
    name: 'Creation time',
    render: (secret) => secret.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function SecretPage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListSecrets(namespace);

  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
  const [selectedSecret, setSelectedSecret] = React.useState<Secret | null>(null);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  React.useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleAddClick = async () => {
    setOpenAddDialog(true);
  };

  const handleRefreshClick = () => {
    mutate();
  };

  const handleDetailClick = async (_: any, row: Secret) => {
    try {
      const resp = await getSecret(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setSelectedSecret(resp?.data);
      setOpenDetailDialog(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get Secret');
    }
  };

  const handleOnSubmit = async (_: any, record: Secret) => {
    await createSecret(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  }

  const handleDeleteClick = (_: any, row: Secret) => {
    showConfirmDialog({
      title: 'Delete Secret',
      content: `Are you sure to delete Secret ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteSecret(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to delete Secret');
        }
      },
      onCancel: () => {},
    })
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title="Secret"
          addButtonLabel="Add Secret"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="Details"
          deleteButtonLabel="Delete"
        />
      </Box>
      <AddSecretDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onSubmit={handleOnSubmit} />
      <SecretDetailDialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} data={selectedSecret} />
      {ConfirmDialogComponent}
    </Box>
  );
}
