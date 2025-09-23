'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { createEdgeApplication, deleteEdgeApplication, getEdgeApplication, useListEdgeApplications } from '@/api/edgeApplication';
import YAMLViewerDialog from '@/components/Dialog/YAMLViewerDialog';
import AddEdgeApplicationDialog from '@/components/Form/AddEdgeApplicationDialog';
import { EdgeApplication } from '@/types/edgeApplication';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<EdgeApplication>[] = [
  {
    name: 'Namespace',
    render: (edgeApplication) => edgeApplication?.metadata?.namespace,
  },
  {
    name: 'Name',
    render: (edgeApplication) => edgeApplication?.metadata?.name,
  },
  {
    name: 'NodeGroups',
    render: (edgeApplication) => edgeApplication?.spec?.workloadScope?.targetNodeGroups?.map(group => group.name).join(', '),
  },
  {
    name: 'Creation time',
    render: (edgeApplication) => edgeApplication.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function EdgeApplicationPage() {
  const [name, setName] = React.useState('');
  const { namespace } = useNamespace();
  const { data, mutate } = useListEdgeApplications(namespace);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();


  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleRefreshClick = () => {
    mutate();
  };

  const handleViewOptionsClick = () => {
    alert('View options button clicked');
  };

  const handleYamlClick = async (_: any, row: EdgeApplication) => {
    try {
      const resp = await getEdgeApplication(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentYamlContent(resp.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      Error(error?.response?.data?.message || error?.message || 'Failed to get EdgeApplication');
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleAddEdgeApplication = async (_: any, record: EdgeApplication) => {
    await createEdgeApplication(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  const handleDeleteClick = (_: any, row: EdgeApplication) => {
    showConfirmDialog({
      title: 'Delete EdgeApplication',
      content: `Are you sure to delete EdgeApplication ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteEdgeApplication(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          Error(error?.response?.message || error?.message || 'Failed to delete EdgeApplication');
        }
      },
      onCancel: () => {},
    })
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title="EdgeApplication"
          addButtonLabel="Add EdgeApplication"
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
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={handleYamlDialogClose}
        content={currentYamlContent}
      />
      <AddEdgeApplicationDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
