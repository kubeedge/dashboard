'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { getCustomResourceDefinition, useListCustomResourceDefinitions } from '@/api/customResourceDefinition';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import { CustomResourceDefinition } from '@/types/customResourceDefinition';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<CustomResourceDefinition | any>[] = [{
  name: 'Name',
  render: (row) => row?.metadata?.name || row?.name,
}, {
  name: 'Group',
  render: (row) => row?.spec?.group || row?.group,
}, {
  name: 'Kind',
  render: (row) => row?.spec?.names?.kind || row?.kind,
}, {
  name: 'Scope',
  render: (row) => row?.spec?.scope || row?.scope,
}, {
  name: 'Creation time',
  render: (row) => row?.metadata?.creationTimestamp || row?.creationTimestamp,
}, {
  name: 'Operation',
  renderOperation: true,
}];

export default function CrdPage() {
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
  const { setErrorMessage } = useAlert();

  useEffect(() => {
    mutate();
  }, [params, mutate]);

  const handleYamlClick = async (_: any, row: CustomResourceDefinition) => {
    try {
      const resp = await getCustomResourceDefinition(row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get CustomResourceDefinition');
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title="Custom Resource Definitions"
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
