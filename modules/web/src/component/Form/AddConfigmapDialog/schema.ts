import type { FormSchema } from '@/components/FormView';

import { listNamespaces } from '@/api/namespace';

export const configmapSchema: FormSchema = {
  submitText: 'Save',
  resetText: 'Reset',
  fields: [

    {
      name: 'namespace',
      label: 'Namespace',
      type: 'select',
      rules: [{ type: 'required', message: 'Miss namespace' }],
      grid: { md: 6 },

      options: async () => {
        const res = await listNamespaces();
        const items = res.data?.items ?? [];
        return items.map((n: any) => ({
          label: n.metadata?.name,
          value: n.metadata?.name,
        }));
      }
    },

    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      rules: [{ type: 'required', message: 'Miss name' }],
      grid: { md: 6 },
    },

    // Labels
    {
      name: 'labels',
      label: 'Labels',
      type: 'array',
      addText: '+ ADD LABEL',
      itemSchema: [
        { name: 'key',   label: 'Key *',   type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'Value *', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
      grid: { md: 12 },
    },

    // Data
    {
      name: 'data',
      label: 'Data',
      type: 'array',
      addText: '+ ADD DATA',
      itemSchema: [
        { name: 'key',   label: 'Key *',   type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'Value *', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
      grid: { md: 12 },
    },
  ],
};
