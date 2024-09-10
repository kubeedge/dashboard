'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { createService, deleteService, getService, useListServices } from '@/api/service';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import AddServiceDialog from '@/component/AddServiceDialog';
import { Service } from '@/types/service';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useNamespace } from '@/hook/useNamespace';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<Service>[] = [
  {
    name: 'Namespace',
    render: (service) => service?.metadata?.namespace,
  },
  {
    name: 'Name',
    render: (service) => service?.metadata?.name,
  },
  {
    name: 'Creation time',
    render: (service) => service.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function ServicePage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListServices(namespace);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addServiceDialogOpen, setAddServiceDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  const handleAddClick = () => {
    setAddServiceDialogOpen(true);
  };

  const handleRefreshClick = () => {
    mutate();
  };

  const handleYamlClick = async (_: any, row: Service) => {
    try {
      const resp = await getService(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get Service');
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleAddServiceDialogClose = () => {
    setAddServiceDialogOpen(false);
  };

  const handleSubmit = async (_: any, record: Service) => {
    await createService(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  }

  const handleDeleteClick = (_: any, row: Service) => {
    showConfirmDialog({
      title: 'Delete Service',
      content: `Are you sure to delete Service ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteService(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to delete Service');
        }
      },
      onCancel: () => {},
    })
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title="Service"
          addButtonLabel="Add Service"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
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
      <AddServiceDialog
        open={addServiceDialogOpen}
        onClose={handleAddServiceDialogClose}
        onSubmit={handleSubmit}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
