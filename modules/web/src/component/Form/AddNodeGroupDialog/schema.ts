import type { FormSchema } from '@/component/FormView';
import { listNodes } from '@/api/node';

export const addNodeGroupSchema: FormSchema = {
  fields: [
    {
      name: 'name',
      label: 'table.name',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
    },
    {
      name: 'nodes',
      label: 'table.node',
      type: 'select',
      grid: { md: 12 },
      options: async () => {
        const nodeList = await listNodes();
        return nodeList?.items?.map((node) => ({
          label: node?.name || '',
          value: node?.name || '',
        }))
      }
    },
    {
      name: 'matchLabels',
      label: 'table.matchLabels',
      type: 'array',
      addText: 'table.labelAddMatchLabels',
      itemSchema: [
        { name: 'key', label: 'table.key', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'table.value', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
      grid: { md: 12 },
    },
  ],
};
