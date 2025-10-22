'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { createServiceAccount, deleteServiceAccount, getServiceAccount, useListServiceAccounts } from '@/api/serviceAccount';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import { ServiceAccount } from '@/types/serviceAccount';
import AddServiceAccountDialog from '@/component/AddServiceAccountDialog';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function ServiceAccountPage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListServiceAccounts(namespace);
  const { t } = useI18n();

  const columns: ColumnDefinition<ServiceAccount>[] = [
    {
      name: t('table.namespace'),
      render: (account) => account?.metadata?.namespace,
    },
    {
      name: t('table.name'),
      render: (account) => account?.metadata?.name,
    },
    {
      name: t('table.secrets'),
      render: (account) => account.secrets?.map(secret => secret.name)?.join(', ') || '-',
    },
    {
      name: t('table.creationTime'),
      render: (account) => account.metadata?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

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
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get ServiceAccount');
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
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create ServiceAccount');
        }
      },
      onCancel: () => { },
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
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title={t('common.serviceAccount')}
          addButtonLabel={t('actions.add') + ' ' + t('common.serviceAccount')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onQueryClick={handleQueryClick}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel={t('actions.delete')}
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
        onSubmit={handleAddFormSubmit}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
