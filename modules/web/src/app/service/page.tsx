'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createService, deleteService, getService, useListServices } from '@/api/service';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import AddServiceDialog from '@/component/Form/AddServiceDialog';
import { Service } from '@/types/service';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useNamespace } from '@/hook/useNamespace';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function ServicePage() {
  const { namespace } = useNamespace();
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
  const { t } = useI18n();

  const columns: ColumnDefinition<Service | any>[] = [
    {
      name: t('table.namespace'),
      render: (service) => service?.metadata?.namespace || service?.namespace,
    },
    {
      name: t('table.name'),
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
      name: t('table.age'),
      render: (service) => service?.age || '-',
    },
    {
      name: 'Creation time',
      render: (service) => service?.metadata?.creationTimestamp || service?.creationTimestamp,
    },
    {
      name: t('table.actions'),
      renderOperation: true,
    },
  ];

  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addServiceDialogOpen, setAddServiceDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();

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
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || 'Failed to get Service');
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
      title: t('actions.delete') + ' ' + t('common.service'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteService(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    })
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.service')}
          addButtonLabel={t('actions.add') + ' ' + t('common.service')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel={t('actions.delete')}
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
      // onSubmit={handleSubmit}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
