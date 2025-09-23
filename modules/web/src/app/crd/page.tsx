'use client';

import React from 'react';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { getCustomResourceDefinition, useListCustomResourceDefinitions } from '@/api/customResourceDefinition';
import YAMLViewerDialog from '@/components/Dialog/YAMLViewerDialog';
import { CustomResourceDefinition } from '@/types/customResourceDefinition';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<CustomResourceDefinition>[] = [{
  name: 'Name',
  render: (row) => row?.metadata?.name,
}, {
  name: 'Group',
  render: (row) => row?.spec?.group,
}, {
  name: 'Creation time',
  render: (row) => row?.metadata?.creationTimestamp,
}, {
  name: 'Operation',
  renderOperation: true,
}];

export default function CrdPage() {
  const [ name, setName ] = React.useState('');
  const [ time, setTime ] = React.useState('');
  const { data, mutate } = useListCustomResourceDefinitions();
  const [ yamlDialogOpen, setYamlDialogOpen ] = React.useState(false);
  const [ currentYamlContent, setCurrentYamlContent ] = React.useState<any>(undefined);
  const { error, success } = useAlert();


  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleTimeChange = (event: any) => {
    setTime(event.target.value);
  };

  const handleYamlClick = async (_: any, row: CustomResourceDefinition) => {
    try {
      const resp = await getCustomResourceDefinition(row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      Error(error?.response?.data?.message || error?.message || 'Failed to get CustomResourceDefinition');
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box
        sx={{
          height: '100px',
          width: '100%',
          backgroundColor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          boxSizing: 'border-box',
          margin: '0 0 20px 0',
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: '32px' }}>
          <TextField
            label="Name"
            placeholder="Please enter name"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            sx={{ flex: 1, maxWidth: '320px' }}
          />
          <TextField
            label="Time"
            placeholder="Please enter time"
            variant="outlined"
            value={time}
            onChange={handleTimeChange}
            sx={{ flex: 1, maxWidth: '320px' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <Button
            variant="outlined"
            sx={{ color: 'black', borderColor: 'black', width: '100px', height: '40px' }}
          >
            Query
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title="Crd"
          columns={columns}
          data={data?.items}
          onQueryClick={() => mutate()}
          onDetailClick={handleYamlClick}
          detailButtonLabel="YAML"
          specialBtnHandling={true}
        />
      </Box>
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={handleYamlDialogClose}
        content={currentYamlContent}
      />
    </Box>
  );
}
