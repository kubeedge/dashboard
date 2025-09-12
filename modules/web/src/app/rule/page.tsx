'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box } from '@mui/material';
import { createRule, deleteRule, getRule, useListRules } from '@/api/rule';
import AddRuleDialog from '@/component/AddRuleDialog';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import { Rule } from '@/types/rule';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function RulePage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListRules(namespace);
  const { t } = useI18n();

  const columns: ColumnDefinition<Rule>[] = [
    {
      name: t('table.namespace'),
      render: (rule) => rule?.metadata?.namespace,
    },
    {
      name: t('table.name'),
      render: (rule) => rule?.metadata?.name,
    },
    {
      name: t('table.source'),
      render: (rule) => rule?.spec?.source,
    },
    {
      name: t('table.sourceResource'),
      render: (rule) => rule?.spec?.sourceResource?.path,
    },
    {
      name: t('table.target'),
      render: (rule) => rule?.spec?.target,
    },
    {
      name: t('table.targetResource'),
      render: (rule) => rule?.spec?.targetResource?.path,
    },
    {
      name: t('table.creationTime'),
      render: (rule) => rule.metadata?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleRefreshClick = () => {
    mutate();
  };

  const handleViewOptionsClick = () => {
    alert('View options button clicked');
  };

  const handleYamlClick = async (_: any, row: Rule) => {
    try {
      const resp = await getRule(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
    }

  }

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleAddRule = async (_: any, record: Rule) => {
    await createRule(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  const handleDeleteClick = (_: any, row: Rule) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.rule'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRule(row?.metadata?.namespace || '', row?.metadata?.name || '');
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
          title={t('common.rule')}
          addButtonLabel={t('actions.add') + ' ' + t('common.rule')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onViewOptionsClick={handleViewOptionsClick}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel={t('actions.delete')}
        />
      </Box>
      <AddRuleDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        onSubmit={handleAddRule}
      />
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={handleYamlDialogClose}
        content={currentYamlContent}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
