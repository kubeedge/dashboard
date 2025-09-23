import type { FormSchema } from '@/components/FormView';

export const addClusterRoleSchema: FormSchema = {

  submitText: undefined,

  fields: [
    // Name *
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      fullWidth: true,
      rules: [{ type: 'required', message: 'Name is required' }],
      grid: { md: 12 },
    },

    // Rules
    {
      name: 'rules',
      label: 'Rules',
      type: 'array',
      addText: 'ADD RULE',
      removeText: 'REMOVE',

      itemSchema: [
        {
          name: 'verbs',
          label: 'Verbs',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'apiGroups',
          label: 'API Groups',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'resources',
          label: 'Resources',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          name: 'resourceNames',
          label: 'Resource Names',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    },

    // Match Labels
    {
      name: 'matchLabels',
      label: 'ClusterRole Selectors',
      type: 'array',
      addText: 'ADD MATCH LABELS',
      removeText: 'REMOVE',

      itemSchema: [
        {
          name: 'key',
          label: 'Key',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          name: 'value',
          label: 'Value',
          type: 'text',
          fullWidth: true,
          grid: { xs: 12, sm: 6, md: 6 },
        },
      ],
    },
  ],

};
