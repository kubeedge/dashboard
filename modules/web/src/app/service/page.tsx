'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { createService, deleteService, getService, useListServices } from '@/api/service';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import AddServiceDialog from '@/component/AddServiceDialog';
import { Service } from '@/types/service';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useNamespace } from '@/hook/useNamespace';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<Service | any>[] = [
  {
    name: 'Namespace',
    render: (service) => service?.metadata?.namespace || service?.namespace,
  },
  {
    name: 'Name',
    render: (service) => service?.metadata?.name || service?.name,
  },
  {
    name: 'Type',
    render: (service) => service?.spec?.type || service?.type,
  },
  {
    name: 'Cluster IP',
    render: (service) => service?.spec?.clusterIP || service?.clusterIP,
  },
  {
    name: 'External IP',
    render: (service) => service?.externalIP || '-',
  },
  {
    name: 'Ports',
    render: (service) => {
      if (service?.ports) {
        return Array.isArray(service.ports) ? service.ports.join(', ') : service.ports;
      }
      if (service?.spec?.ports) {
        return service.spec.ports.map((p: any) => `${p.port}/${p.protocol || 'TCP'}`).join(', ');
      }
      return '-';
    },
  },
  {
    name: 'Age',
    render: (service) => service?.age || '-',
  },
  {
    name: 'Creation time',
    render: (service) => service?.metadata?.creationTimestamp || service?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function ServicePage() {
  const { namespace } = useNamespace();
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addServiceDialogOpen, setAddServiceDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  // New pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [name, setName] = useState('');

  const params = useMemo(() => ({
    namespace,
    page,
    pageSize,
    sort,
    order,
    name: name ? `*${name}*` : undefined,
  }), [namespace, page, pageSize, sort, order, name]);

  const { data, mutate } = useListServices(params);

  useEffect(() => {
    mutate();
  }, [params, mutate]);

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
          noPagination={true}
        />

        {/* New pagination controls */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            size="small"
            label="Rows per page"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="type">Type</MenuItem>
            <MenuItem value="clusterIP">Cluster IP</MenuItem>
            <MenuItem value="creationTimestamp">Creation Time</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </TextField>

          <TextField
            size="small"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Filter by name..."
            sx={{ minWidth: 200 }}
          />

          <Pagination
            count={data?.total ? Math.ceil(data.total / pageSize) : 1}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            sx={{ ml: 'auto' }}
          />
        </Box>
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
