'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Pagination, Button } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { getCustomResourceDefinition, useListCustomResourceDefinitions } from '@/api/customResourceDefinition';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import { CustomResourceDefinition } from '@/types/customResourceDefinition';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function CrdPage() {
  const [time, setTime] = React.useState('');
  const { t } = useI18n();

  const columns: ColumnDefinition<CustomResourceDefinition | any>[] = [{
    name: t('table.name'),
    render: (row) => row?.metadata?.name || row?.name,
  }, {
    name: t('table.group'),
    render: (row) => row?.spec?.group || row?.group,
  }, {
    name: 'Kind',
    render: (row) => row?.spec?.names?.kind || row?.kind,
  }, {
    name: 'Scope',
    render: (row) => row?.spec?.scope || row?.scope,
  }, {
    name: t('table.creationTime'),
    render: (row) => row?.metadata?.creationTimestamp || row?.creationTimestamp,
  }, {
    name: t('table.operation'),
    renderOperation: true,
  }];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [name, setName] = useState('');

  const params = useMemo(() => ({
    page,
    pageSize,
    sort,
    order,
    ...(name && { 'name': `*${name}*` }),
  }), [page, pageSize, sort, order, name]);

  const { data, mutate } = useListCustomResourceDefinitions(params);
  const [ yamlDialogOpen, setYamlDialogOpen ] = React.useState(false);
  const [ currentYamlContent, setCurrentYamlContent ] = React.useState<any>(undefined);
  const { error, success } = useAlert();

  useEffect(() => {
    mutate();
  }, [params, mutate]);

  const handleYamlClick = async (_: any, row: CustomResourceDefinition) => {
    try {
      const resp = await getCustomResourceDefinition(row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
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
            label={t('table.name')}
            placeholder={t('form.namePlaceholder')}
            variant="outlined"
            value={name}
            onChange={(event) => setName(event.target.value)}
            sx={{ flex: 1, maxWidth: '320px' }}
          />
          <TextField
            label={t('table.time')}
            placeholder={t('form.timePlaceholder')}
            variant="outlined"
            value={time}
            onChange={(event) => setTime(event.target.value)}
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
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.crd')}
          columns={columns}
          data={data?.items}
          onQueryClick={() => mutate()}
          onDetailClick={handleYamlClick}
          detailButtonLabel="YAML"
          noPagination={true}
        />

        {/* New pagination controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              label="Rows per page"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </TextField>

            <TextField
              select
              label="Sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="group">Group</MenuItem>
              <MenuItem value="kind">Kind</MenuItem>
              <MenuItem value="scope">Scope</MenuItem>
              <MenuItem value="creationTimestamp">Creation Time</MenuItem>
            </TextField>

            <TextField
              select
              label="Order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              size="small"
              sx={{ minWidth: 100 }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>

            <TextField
              label="Name filter"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              placeholder="Search by name..."
              sx={{ minWidth: 150 }}
            />
          </Box>

          <Pagination
            count={data?.total ? Math.ceil(data.total / pageSize) : 1}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={handleYamlDialogClose}
        content={currentYamlContent}
      />
    </Box>
  );
}
