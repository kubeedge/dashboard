import type { FormSchema } from '@/component/FormView';

export const addNodeSchema: FormSchema = {
  fields: [
    {
      name: 'cloudcore',
      label: 'table.labelCloudMasterIP',
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
      label: 'table.labelRuntimeType',
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
      label: 'table.labelToken',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
    },
  ],
};
