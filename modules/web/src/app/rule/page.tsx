'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { Box } from '@mui/material';
import { createRule, deleteRule, getRule, useListRules } from '@/api/rule';
import AddRuleDialog from '@/components/Form/AddRuleDialog';
import YAMLViewerDialog from '@/components/Dialog/YAMLViewerDialog';
import { Rule } from '@/types/rule';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<Rule>[] = [
  {
    name: 'Namespace',
    render: (rule) => rule?.metadata?.namespace,
  },
  {
    name: 'Name',
    render: (rule) => rule?.metadata?.name,
  },
  {
    name: 'Source',
    render: (rule) => rule?.spec?.source,
  },
  {
    name: 'SourceResource',
    render: (rule) => rule?.spec?.sourceResource?.path,
  },
  {
    name: 'Target',
    render: (rule) => rule?.spec?.target,
  },
  {
    name: 'TargetResource',
    render: (rule) => rule?.spec?.targetResource?.path,
  },
  {
    name: 'Creation time',
    render: (rule) => rule.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function RulePage() {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const { namespace } = useNamespace();
  const { data, mutate } = useListRules(namespace);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();


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
      Error(error?.response?.data?.message || error?.message || 'Failed to get Rule');
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
      title: 'Delete Rule',
      content: `Are you sure to delete Rule ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRule(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          Error(error?.response?.data?.message || error?.message || 'Failed to delete Rule');
        }
      },
      onCancel: () => {},
    })
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title="Rule"
          addButtonLabel="Add Rule"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onViewOptionsClick={handleViewOptionsClick}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel="Delete"
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
