import type { FormSchema } from '@/component/FormView';
import { listNamespaces } from '@/api/namespace';

export const configMapSchema: FormSchema = {
  submitText: 'Save',
  resetText: 'Reset',
  fields: [
    {
      name: 'namespace',
      label: 'table.namespace',
      type: 'select',
      rules: [{ type: 'required', message: 'Miss namespace' }],
      grid: { md: 6 },
      options: async () => {
        const res = await listNamespaces();
        const items = res.data?.items ?? [];
        return items.map((n) => ({
          label: n.metadata?.name || '',
          value: n.metadata?.name || '',
        }));
      }
    },
    {
      name: 'name',
      label: 'table.name',
      type: 'text',
      rules: [{ type: 'required', message: 'Miss name' }],
      grid: { md: 6 },
    },
    {
      name: 'labels',
      label: 'table.labels',
      type: 'array',
      addText: 'table.addLabel',
      itemSchema: [
        { name: 'key', label: 'table.key', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'table.value', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
      inlineRemove: true,
      grid: { md: 12 },
    },
    {
      name: 'data',
      label: 'table.data',
      type: 'array',
      addText: 'table.addData',
      itemSchema: [
        { name: 'key', label: 'table.key', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'table.value', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
      inlineRemove: true,
      grid: { md: 12 },
    },
  ],
};
