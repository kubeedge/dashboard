import type { FormSchema } from '@/component/FormView';
import { listNamespaces } from '@/api/namespace';

export const addRoleSchema: FormSchema = {
  submitText: 'SUBMIT',
  fields: [
    {
      // Namespace *
      name: 'namespace',
      label: 'Namespace *',
      type: 'select',
      fullWidth: true,
      grid: { xs: 12, md: 12 },
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
    {
      // Name *
      name: 'name',
      label: 'Name *',
      type: 'text',
      fullWidth: true,
      grid: { xs: 12, md: 12 },
      rules: [{ type: 'required', message: 'Miss name' }],
    },
    {
      // Rules
      name: 'rules',
      label: 'Rules',
      type: 'array',
      addText: 'ADD RULE',
      removeText: 'REMOVE',
      itemSchema: [
        {
          name: 'verbs',
          label: 'Verbs *',
          type: 'text',
          rules: [{ type: 'required', message: 'Please input verbs' }],
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'apiGroups',
          label: 'ApiGroups *',
          type: 'text',
          rules: [{ type: 'required', message: 'Please input apiGroups' }],
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'resources',
          label: 'Resources *',
          type: 'text',
          rules: [{ type: 'required', message: 'Please input resources' }],
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'resourceNames',
          label: 'ResourceNames *',
          type: 'text',
          rules: [{ type: 'required', message: 'Please input resourceNames' }],
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    },
  ],
};
