'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { Box } from '@mui/material';
import { createRuleEndpoint, deleteRuleEndpoint, getRuleEndpoint, useListRuleEndpoints } from '@/api/ruleEndpoint';
import YAMLViewerDialog from '@/components/Dialog/YAMLViewerDialog';
import { RuleEndpoint } from '@/types/ruleEndpoint';
import AddRuleEndpointDialog from '@/components/Form/AddRuleEndpointDialog';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<RuleEndpoint>[] = [
  {
    name: 'Namespace',
    render: (ruleEndpoint) => ruleEndpoint?.metadata?.namespace,
  },
  {
    name: 'Name',
    render: (ruleEndpoint) => ruleEndpoint?.metadata?.name,
  },
  {
    name: 'Creation time',
    render: (ruleEndpoint) => ruleEndpoint.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function RuleEndpointPage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListRuleEndpoints(namespace);
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
      Error(error?.response?.data?.message || error?.message || 'Failed to get RuleEndpoint');
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleDeleteClick = (_: any, row: RuleEndpoint) => {
    showConfirmDialog({
      title: 'Delete RuleEndpoint',
      content: `Are you sure to delete RuleEndpoint ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRuleEndpoint(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          Error(error?.response?.data?.message || error?.message || 'Failed to delete RuleEndpoint');
        }
      },
      onCancel: () => {},
    })
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title="RuleEndpoint"
          addButtonLabel="Add RuleEndpoint"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={() => mutate()}
          onViewOptionsClick={() => alert('View options button clicked')}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel="Delete"
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
