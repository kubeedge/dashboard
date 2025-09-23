
import type { FormSchema } from '@/components/FormView';

export const addNodeSchema: FormSchema = {
  fields: [
    {
      name: 'cloudcore',
      label: 'Cloud master node ip:port *',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
    },
    {
      name: 'version',
      label: 'KubeEdge version *',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
    },
    {
      name: 'runtime',
      label: 'Runtime type *',
      type: 'select',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
      options: [
        { label: 'containerd', value: 'containerd' },
        { label: 'docker', value: 'docker' },
      ],
    },
    {
      name: 'token',
      label: 'Token *',
      type: 'text',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
    },
  ],
};
