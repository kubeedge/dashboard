'use client';

import React from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, Button } from '@mui/material';
import { getCustomResourceDefinition, useListCustomResourceDefinitions } from '@/api/customResourceDefinition';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import { CustomResourceDefinition } from '@/types/customResourceDefinition';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function CrdPage() {
  const [name, setName] = React.useState('');
  const [time, setTime] = React.useState('');
  const { data, mutate } = useListCustomResourceDefinitions();
  const { t } = useI18n();

  const columns: ColumnDefinition<CustomResourceDefinition>[] = [{
    name: t('table.name'),
    render: (row) => row?.metadata?.name,
  }, {
    name: t('table.group'),
    render: (row) => row?.spec?.group,
  }, {
    name: t('table.creationTime'),
    render: (row) => row?.metadata?.creationTimestamp,
  }, {
    name: t('table.operation'),
    renderOperation: true,
  }];
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(undefined);
  const { setErrorMessage } = useAlert();

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
      setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box
        sx={{
          height: '100px',
          width: '100%',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          boxSizing: 'border-box',
          margin: '0 0 20px 0',
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: '32px' }}>
          <TextField
            label={t('table.name')}
            placeholder={t('form.namePlaceholder')}
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            sx={{ flex: 1, maxWidth: '320px' }}
          />
          <TextField
            label={t('table.time')}
            placeholder={t('form.timePlaceholder')}
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
            {t('actions.search')}
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title={t('common.crd')}
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
