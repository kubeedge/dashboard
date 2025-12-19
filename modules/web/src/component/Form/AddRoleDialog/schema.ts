import type { FormSchema } from '@/component/FormView';
import { listNamespaces } from '@/api/namespace';

export const addRoleSchema: FormSchema = {
  fields: [
    {
      name: 'namespace',
      label: 'table.namespace',
      type: 'select',
      fullWidth: true,
      grid: { xs: 12, md: 12 },
      rules: [{ type: 'required' }],
      options: async () => {
        const res = await listNamespaces();
        const items = (res?.data?.items ?? [])
        return items.map(n => ({
          label: n?.metadata?.name || '',
          value: n?.metadata?.name || '',
        }));
      },
    },
    {
      name: 'name',
      label: 'table.name',
      type: 'text',
      fullWidth: true,
      grid: { xs: 12, md: 12 },
      rules: [{ type: 'required' }],
    },
    {
      name: 'rules',
      label: 'table.rules',
      type: 'array',
      addText: 'table.addRule',
      itemSchema: [
        {
          name: 'verbs',
          label: 'table.verbs',
          type: 'text',
          rules: [{ type: 'required' }],
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'apiGroups',
          label: 'table.apiGroups',
          type: 'text',
          rules: [{ type: 'required' }],
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'resources',
          label: 'table.resources',
          type: 'text',
          rules: [{ type: 'required' }],
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'resourceNames',
          label: 'table.resourceNames',
          type: 'text',
          rules: [{ type: 'required' }],
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    },
  ],
};
