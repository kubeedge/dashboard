import type { FormSchema } from '@/components/FormView';
import { listNamespaces } from '@/api/namespace';

export const addRoleBindingSchema: FormSchema = {
  submitText: 'SUBMIT',
  fields: [
    // Namespace
    {
      name: 'namespace',
      label: 'Namespace',
      type: 'select',
      fullWidth: true,
      grid: { md: 12 },
      rules: [{ type: 'required', message: 'Miss namespace' }],
      options: async () => {
        const res = await listNamespaces();
        const items = (res?.data?.items ?? []) as any[];
        return items.map(n => ({
          label: n?.metadata?.name,
          value: n?.metadata?.name,
        }));
      },
    },

    // Name
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      fullWidth: true,
      grid: { md: 12 },
      rules: [{ type: 'required', message: 'Miss name' }],
    },

    // RoleRef
    {
      name: 'roleRefKind',
      label: 'Kind *',
      type: 'text',
      options: [
        { label: 'Role', value: 'Role' },
        { label: 'ClusterRole', value: 'ClusterRole' },
      ],
      rules: [{ type: 'required', message: 'Miss kind' }],
      grid: { md: 4 },
    },
    {
      name: 'roleRefName',
      label: 'Name *',
      type: 'text',
      rules: [{ type: 'required', message: 'Miss name' }],
      grid: { md: 4 },
    },
    {
      name: 'roleRefApiGroup',
      label: 'ApiGroup',
      type: 'text',

      grid: { md: 4 },
      defaultValue: ' ',
    },

    // Subjects
    {
      name: 'subjects',
      label: 'Subjects',
      type: 'array',
      addText: '+ ADD SUBJECT',
      removeText: 'REMOVE',
      inlineRemove: true,
      itemSchema: [
        {
          name: 'kind',
          label: 'Kind *',
          type: 'select',
          options: [
            { label: 'User', value: 'User' },
            { label: 'Group', value: 'Group' },
            { label: 'ServiceAccount', value: 'ServiceAccount' },
          ],
          rules: [{ type: 'required', message: 'Miss kind' }],
          grid: { md: 4 },
        },
        {
          name: 'name',
          label: 'Name *',
          type: 'text',
          rules: [{ type: 'required', message: 'Miss name' }],
          grid: { md: 4 },
        },
        {
          name: 'apiGroup',
          label: 'ApiGroup',
          type: 'text',
          grid: { md: 4 },
        },
      ],
    },
  ],
};
