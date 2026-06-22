import type { FormSchema } from '@/component/FormView';
import { listNamespaces } from '@/api/namespace';
import { Namespace } from '@/types/namespace';

export const secretSchema: FormSchema = {
  fields: [
    {
      name: 'namespace',
      label: 'table.namespace',
      type: 'select',
      rules: [{ type: 'required' }],
      grid: { md: 6 },
      options: async () => {
        const res = await listNamespaces();
        const items = res?.data?.items;
        return items.map((n: Namespace) => ({
          label: n?.metadata?.name || '',
          value: n?.metadata?.name || '',
        }));
      },
    },
    {
      name: 'name',
      label: 'table.name',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 6 },
    },
    {
      name: 'type',
      label: '',
      type: 'radio',
      defaultValue: 'Docker',
      options: [
        { label: 'table.docker', value: 'Docker' },
        { label: 'table.opaque', value: 'Opaque' },
      ],
      grid: { md: 12 },
    },
    {
      name: 'dockerServer',
      label: 'table.dockerServer',
      type: 'text',
      rules: [{ type: 'required' }],
      ruleIf: { field: 'type', value: 'Docker' },
      grid: { md: 12 },
      visibleWhen: (v) => v.type === 'Docker',
    },
    {
      name: 'dockerUsername',
      label: 'table.dockerUsername',
      type: 'text',
      rules: [{ type: 'required' }],
      ruleIf: { field: 'type', value: 'Docker' },
      grid: { md: 12 },
      visibleWhen: (v) => v.type === 'Docker',
    },
    {
      name: 'dockerPassword',
      label: 'table.dockerPassword',
      type: 'password',
      rules: [{ type: 'required' }],
      ruleIf: { field: 'type', value: 'Docker' },
      grid: { md: 12 },
      visibleWhen: (v) => v.type === 'Docker',
    },
    {
      name: 'data',
      label: 'table.base64DataItems',
      type: 'array',
      addText: 'actions.addOneItem',
      itemSchema: [
        {
          name: 'key',
          label: 'table.key',
          type: 'text',
          rules: [{ type: 'required' }],
          grid: { md: 6 }
        },
        {
          name: 'value',
          label: 'table.value',
          type: 'text',
          rules: [{ type: 'required' }],
          grid: { md: 6 }
        },
      ],
      ruleIf: { field: 'type', value: 'Opaque' },
      inlineRemove: true,
      grid: { md: 12 },
      visibleWhen: (v) => v.type === 'Opaque',
    },
  ],
};
