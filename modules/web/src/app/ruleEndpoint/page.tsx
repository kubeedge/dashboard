'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box } from '@mui/material';
import { createRuleEndpoint, deleteRuleEndpoint, getRuleEndpoint, useListRuleEndpoints } from '@/api/ruleEndpoint';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import { RuleEndpoint } from '@/types/ruleEndpoint';
import AddRuleEndpointDialog from '@/component/AddRuleEndpointDialog';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function RuleEndpointPage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListRuleEndpoints(namespace);
  const { t } = useI18n();

  const columns: ColumnDefinition<RuleEndpoint>[] = [
    {
      name: t('table.namespace'),
      render: (ruleEndpoint) => ruleEndpoint?.metadata?.namespace,
    },
    {
      name: t('table.name'),
      render: (ruleEndpoint) => ruleEndpoint?.metadata?.name,
    },
    {
      name: t('table.creationTime'),
      render: (ruleEndpoint) => ruleEndpoint.metadata?.creationTimestamp,
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

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleFormSubmit = async (_: any, record: RuleEndpoint) => {
    await createRuleEndpoint(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  const handleYamlClick = async (_: any, row: RuleEndpoint) => {
    try {
      const resp = await getRuleEndpoint(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleDeleteClick = (_: any, row: RuleEndpoint) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.ruleEndpoint'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRuleEndpoint(row?.metadata?.namespace || '', row?.metadata?.name || '');
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
          title={t('common.ruleEndpoint')}
          addButtonLabel={t('actions.add') + ' ' + t('common.ruleEndpoint')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={() => mutate()}
          onViewOptionsClick={() => alert('View options button clicked')}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel={t('actions.delete')}
        />
      </Box>
      <AddRuleEndpointDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        onSubmit={handleFormSubmit}
      />
      <YAMLViewerDialog open={yamlDialogOpen} onClose={handleYamlDialogClose} content={currentYamlContent} />
      {ConfirmDialogComponent}
    </Box>
  );
}
