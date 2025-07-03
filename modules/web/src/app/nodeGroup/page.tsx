'use client';

import React from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createNodeGroup, deleteNodeGroup, getNodeGroup, useListNodeGroups } from '@/api/nodeGroup';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import AddNodeGroupDialog from '@/component/AddNodeGroupDialog';
import type { NodeGroup } from '@/types/nodeGroup';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<NodeGroup>[] = [
  {
    name: 'Name',
    render: (nodeGroup: NodeGroup) => nodeGroup?.metadata?.name,
  },
  {
    name: 'Creation time',
    render: (nodeGroup: NodeGroup) => nodeGroup?.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];


export default function NodeGroupPage() {
  const [selectedYaml, setSelectedYaml] = React.useState<NodeGroup | null>(null);
  const [openYamlDialog, setOpenYamlDialog] = React.useState(false);
  const [openAddNodeGroupDialog, setOpenAddNodeGroupDialog] = React.useState(false);
  const { data, mutate } = useListNodeGroups();
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  const handleAddClick = () => {
    setOpenAddNodeGroupDialog(true);
  };

  const handleRefreshClick = () => {
    mutate();
  };

  const handleDetailClick = async (_: any, row: NodeGroup) => {
    try {
      const resp = await getNodeGroup(row?.metadata?.name || '');
      setSelectedYaml(resp?.data);
      setOpenYamlDialog(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get NodeGroup');
    }
  };

  const handleDeleteClick = async (_: any, row: NodeGroup) => {
    showConfirmDialog({
      title: 'Delete NodeGroup',
      content: `Are you sure to delete NodeGroup ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteNodeGroup(row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to delete NodeGroup');
        }

      },
      onCancel: () => {},
    })
  };

  const handleCloseYamlDialog = () => {
    setOpenYamlDialog(false);
  };

  const handleCloseAddNodeGroupDialog = () => {
    setOpenAddNodeGroupDialog(false);
  };

  const handleAddNodeGroup = async (_: any, record: NodeGroup) => {
    await createNodeGroup(record);
    mutate();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
        <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
          <TableCard
            title="Node Group"
            addButtonLabel="Add NodeGroup"
            columns={columns}
            data={data?.items}
            onAddClick={handleAddClick}
            onRefreshClick={handleRefreshClick}
            onDetailClick={handleDetailClick}
            onDeleteClick={handleDeleteClick}
            detailButtonLabel="YAML"
            deleteButtonLabel="Delete"
          />
        </Box>
        <YAMLViewerDialog
          open={openYamlDialog}
          onClose={handleCloseYamlDialog}
          content={selectedYaml}
        />
        <AddNodeGroupDialog
          open={openAddNodeGroupDialog}
          onClose={handleCloseAddNodeGroupDialog}
          onSubmit={handleAddNodeGroup}
        />
        {ConfirmDialogComponent}
      </Box>
    </LocalizationProvider>
  );
}
