import type { FormSchema } from '@/component/FormView';
import { listNamespaces } from '@/api/namespace';

export const addRoleBindingSchema: FormSchema = {
  submitText: 'SUBMIT',
  fields: [
    {
      name: 'namespace',
      label: 'table.namespace',
      type: 'select',
      fullWidth: true,
      grid: { md: 12 },
      rules: [{ type: 'required' }],
      options: async () => {
        const res = await listNamespaces();
        const items = res?.data?.items ?? [];
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
      grid: { md: 12 },
      rules: [{ type: 'required' }],
    },
    {
      name: 'roleRefKind',
      label: 'table.kind',
      type: 'select',
      options: [
        { label: 'table.role', value: 'Role' },
        { label: 'table.clusterRole', value: 'ClusterRole' },
      ],
      rules: [{ type: 'required' }],
      grid: { md: 4 },
    },
    {
      name: 'roleRefName',
      label: 'table.name',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 4 },
    },
    {
      name: 'roleRefApiGroup',
      label: 'table.apiGroup',
      type: 'text',
      grid: { md: 4 },
      defaultValue: ' ',
    },
    {
      name: 'subjects',
      label: 'table.subjects',
      type: 'array',
      addText: 'table.addSubject',
      inlineRemove: true,
      itemSchema: [
        {
          name: 'kind',
          label: 'table.kind',
          type: 'select',
          options: [
            { label: 'table.user', value: 'User' },
            { label: 'table.group', value: 'Group' },
            { label: 'table.serviceAccount', value: 'ServiceAccount' },
          ],
          rules: [{ type: 'required' }],
          grid: { md: 4 },
        },
        {
          name: 'name',
          label: 'table.name',
          type: 'text',
          rules: [{ type: 'required' }],
          grid: { md: 4 },
        },
        {
          name: 'apiGroup',
          label: 'table.apiGroup',
          type: 'text',
          grid: { md: 4 },
        },
      ],
    },
  ],
};
