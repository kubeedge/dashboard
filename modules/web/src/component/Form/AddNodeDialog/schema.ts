import type { FormSchema } from '@/component/FormView';

export const addNodeSchema: FormSchema = {
  fields: [
    {
      name: 'cloudcore',
      label: 'table.cloudMasterIP',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
    },
    {
      name: 'version',
      label: 'table.kubeedgeVersion',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
    },
    {
      name: 'runtime',
      label: 'table.runtimeType',
      type: 'select',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
      options: [
        { label: 'Containerd', value: 'containerd' },
        { label: 'Docker', value: 'docker' },
      ],
    },
    {
      name: 'token',
      label: 'table.token',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
    },
  ],
};
