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
import { useI18n } from '@/hook/useI18n';

export default function SecretPage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListSecrets(namespace);
  const { t } = useI18n();

  const columns: ColumnDefinition<Secret>[] = [
    {
      name: t('table.namespace'),
      render: (secret) => secret?.metadata?.namespace,
    },
    {
      name: t('table.name'),
      render: (secret) => secret?.metadata?.name,
    },
    {
      name: t('table.type'),
      render: (secret) => secret.type,
    },
    {
      name: t('table.age'),
      render: (secret) => secret.metadata?.creationTimestamp,
    },
    {
      name: t('table.actions'),
      renderOperation: true,
    },
  ];

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
      title: t('actions.delete') + ' ' + t('common.secret'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteSecret(row?.metadata?.namespace || '', row?.metadata?.name || '');
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
          title={t('common.secret')}
          addButtonLabel={t('actions.add') + ' ' + t('common.secret')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel={t('actions.view')}
          deleteButtonLabel={t('actions.delete')}
        />
      </Box>
      <AddSecretDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onSubmit={handleOnSubmit} />
      <SecretDetailDialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} data={selectedSecret} />
      {ConfirmDialogComponent}
    </Box>
  );
}
