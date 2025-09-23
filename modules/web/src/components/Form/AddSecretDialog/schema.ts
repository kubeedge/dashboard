

import type { FormSchema } from '@/components/FormView';
import { listNamespaces } from '@/api/namespace';

export const secretSchema: FormSchema = {
  submitText: 'Save',
  resetText: 'Reset',
  fields: [
    // Namespace
    {
      name: 'namespace',
      label: 'Namespace *',
      type: 'select',
      rules: [{ type: 'required', message: 'Miss namespace' }],
      grid: { md: 6 },
      options: async () => {
        const res = await listNamespaces();
        const items = (res as any)?.data?.items ?? (res as any)?.items ?? [];
        return items.map((n: any) => ({
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
      rules: [{ type: 'required', message: 'Miss name' }],
      grid: { md: 6 },
    },

    // Secret
    {
      name: 'type',
      label: '',
      type: 'radio',
      defaultValue: 'docker',
      options: [
        { label: 'Docker', value: 'docker' },
        { label: 'Opaque', value: 'opaque' },
      ],
      grid: { md: 12 },
    },

    // Docker
    {
      name: 'dockerServer',
      label: 'Docker server *',
      type: 'text',
      rules: [{ type: 'required', message: 'Miss docker server' }],
      grid: { md: 12 },
      visibleWhen: (v) => v.type === 'docker',
    },
    {
      name: 'dockerUsername',
      label: 'Docker username *',
      type: 'text',
      rules: [{ type: 'required', message: 'Miss docker username' }],
      grid: { md: 12 },
      visibleWhen: (v) => v.type === 'docker',
    },
    {
      name: 'dockerPassword',
      label: 'Docker password *',
      type: 'password',
      rules: [{ type: 'required', message: 'Miss docker password' }],
      grid: { md: 12 },
      visibleWhen: (v) => v.type === 'docker',
    },

    // Opaque
    {
      name: 'data',
      label: 'Data items（Base64）',
      type: 'array',
      addText: 'ADD ONE LINE',
      itemSchema: [
        { name: 'key',   label: 'Key *',   type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'Value *', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
      grid: { md: 12 },
      visibleWhen: (v) => v.type === 'opaque',
    },
  ],
};
