'use client';

import React from 'react';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { deleteNodeGroup, getNodeGroup, useListNodeGroups } from '@/api/nodeGroup';
import YAMLViewerDialog from '@/components/Dialog/YAMLViewerDialog';
import AddNodeGroupDialog from '@/components/Form/AddNodeGroupDialog';
import type { NodeGroup } from '@/types/nodeGroup';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import AddNodegroupDialog from '@/components/Form/AddNodeGroupDialog';

const columns: ColumnDefinition<NodeGroup>[] = [
  { name: 'Name', render: (row) => row?.metadata?.name },
  { name: 'Creation time', render: (row) => row?.metadata?.creationTimestamp },
  { name: 'Operation', renderOperation: true },
];

export default function NodeGroupPage() {
  const [selectedYaml, setSelectedYaml] = React.useState<NodeGroup | null>(null);
  const [openYamlDialog, setOpenYamlDialog] = React.useState(false);
  const [openAddNodeGroupDialog, setOpenAddNodeGroupDialog] = React.useState(false);

  const { data, mutate } = useListNodeGroups();
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();

  const handleAddClick = () => setOpenAddNodeGroupDialog(true);
  const handleRefreshClick = () => mutate();

  const handleDetailClick = async (_: any, row: NodeGroup) => {
    try {
      const resp = await getNodeGroup(row?.metadata?.name || '');
      setSelectedYaml(resp?.data);
      setOpenYamlDialog(true);
    } catch (e: any) {
      error(e?.response?.data?.message || e?.message || 'Failed to get NodeGroup');
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
          } catch (e: any) {
            error(e?.response?.data?.message || e?.message || 'Failed to delete NodeGroup');
          }
      },
      onCancel: () => {},
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
        <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
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

        <YAMLViewerDialog open={openYamlDialog} onClose={() => setOpenYamlDialog(false)} content={selectedYaml} />

        <AddNodegroupDialog
        open={openAddNodeGroupDialog}
        onClose={() => setOpenAddNodeGroupDialog(false)}
        onCreated={() => mutate()}
        />

        {ConfirmDialogComponent}
      </Box>
    </LocalizationProvider>
  );
}
