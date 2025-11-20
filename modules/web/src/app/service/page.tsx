'use client';

import React, { useMemo, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createService, deleteService, getService, useListServices } from '@/api/service';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import AddServiceDialog from '@/component/Form/AddServiceDialog';
import { ConciseService, Service } from '@/types/service';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useNamespace } from '@/hook/useNamespace';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function ServicePage() {
  const { namespace } = useNamespace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  const [name, setName] = useState('');
  const params = useMemo(() => ({
    page,
    pageSize,
    sort,
    order,
    name: name ? `*${name}*` : undefined,
  }), [page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListServices(namespace, params);
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addServiceDialogOpen, setAddServiceDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();

  const columns: ColumnDefinition<ConciseService>[] = [
    {
      name: t('table.namespace'),
      render: (service) => service?.namespace,
    },
    {
      key: 'name',
      name: t('table.name'),
      sortable: true,
      render: (service) => service?.name,
    },
    {
      name: t('table.type'),
      render: (service) => service?.type || service?.type,
    },
    {
      name: t('table.clusterIP'),
      render: (service) => service?.clusterIP || service?.clusterIP,
    },
    {
      name: t('table.externalIP'),
      render: (service) => service?.externalIP || '-',
    },
    {
      name: t('table.ports'),
      render: (service) => {
        if (service?.ports) {
          return service.ports.map((p) => {
            if (p.includes('/')) {
              return p;
            }
            return `${p}/TCP`;
          }).join(', ');
        }
        return '-';
      },
    },
    {
      key: 'creationTimestamp',
      sortable: true,
      name: t('table.creationTime'),
      render: (service) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatDateTime(service?.creationTimestamp, currentLanguage)}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeTime(service?.creationTimestamp, currentLanguage)}
          </Box>
        </Box>
      )
    },
    {
      name: t('table.actions'),
      renderOperation: true,
    },
  ];

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSort(field);
    setOrder(direction);
  }

  const handleYamlClick = async (row: ConciseService) => {
    try {
      const resp = await getService(row?.namespace || '', row?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleSubmit = async (record: Service) => {
    await createService(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  }

  const handleDeleteClick = (row?: ConciseService) => {
    showConfirmDialog({
      title: `${t('actions.delete')} ${t('common.service')}`,
      content: `${t('messages.deleteConfirm')} ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteService(row?.namespace || '', row?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
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
          onAddClick={() => setAddServiceDialogOpen(true)}
          onRefreshClick={() => mutate()}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel={t('actions.yaml')}
          deleteButtonLabel={t('actions.delete')}
          loading={isLoading}
          pagination={{
            current: data?.page || 1,
            pageSize: data?.pageSize || 10,
            total: data?.total || 0,
          }}
          onPaginationChange={handlePaginationChange}
          sort={{
            field: sort,
            direction: order as 'asc' | 'desc',
          }}
          onSortChange={handleSortChange}
          filter={(
            <>
              <TextField size='small' label={t('table.name')} value={name || ''} onChange={(e) => setName(e.target.value || '')} placeholder={t('table.textWildcardHelp')} />
            </>
          )}
        />
      </Box>
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        content={currentYamlContent}
      />
      <AddServiceDialog
        open={addServiceDialogOpen}
        onClose={() => setAddServiceDialogOpen(false)}
        onSubmit={handleSubmit}
        onCreated={() => setAddServiceDialogOpen(false)}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
