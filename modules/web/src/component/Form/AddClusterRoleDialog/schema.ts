import type { FormSchema } from '@/component/FormView';

export const addClusterRoleSchema: FormSchema = {
  fields: [
    {
      name: 'name',
      label: 'table.name',
      type: 'text',
      fullWidth: true,
      rules: [{ type: 'required' }],
      grid: { md: 12 },
    },
    {
      name: 'rules',
      label: 'table.rules',
      type: 'array',
      addText: 'table.addRule',
      fullWidth: true,
      itemSchema: [
        {
          name: 'verbs',
          label: 'table.verbs',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'apiGroups',
          label: 'table.apiGroups',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'resources',
          label: 'table.resources',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'resourceNames',
          label: 'table.resourceNames',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        }
      ],
    },
    {
      name: 'matchLabels',
      label: 'table.clusterRoleSelectors',
      type: 'array',
      addText: 'table.addMatchLabels',
      itemSchema: [
        {
          name: 'key',
          label: 'table.key',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          name: 'value',
          label: 'table.value',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 6, md: 6 },
        }
      ],
      inlineRemove: true,
    }
  ],
};
