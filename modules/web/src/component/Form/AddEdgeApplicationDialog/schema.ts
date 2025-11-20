import type { FormSchema } from '@/component/FormView';
import { NamespaceList } from '@/types/namespace';
import { ConciseNodeGroupList } from '@/types/nodeGroup';

export const addEdgeAppSchema = (namespaces?: NamespaceList, nodeGroups?: ConciseNodeGroupList): FormSchema => {
  return ({
  fields: [
    {
      name: 'namespace',
      label: 'table.namespace',
      type: 'select',
      rules: [{ type: 'required' }],
      grid: { md: 12 },
      options: () => {
        return (namespaces?.items || []).map((n: any) => ({
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
      grid: { md: 12 },
    },
    {
      name: 'workloadTemplate',
      label: '',
      type: 'array',
      addText: 'table.addWorkloadTemplate',
      itemSchema: [{
        name: 'manifests',
        label: 'table.manifestsYaml',
        type: 'textarea',
        rows: 10,
        rules: [{ type: 'required' }],
        grid: { md: 12 },
      }],
      inlineRemove: true,
      grid: { md: 12 },
    },
    {
      name: 'targetNodeGroups',
      label: '',
      type: 'array',
      addText: 'table.addTargetNodeGroup',
      inlineRemove: true,
      itemSchema: [{
        name: 'name',
        label: 'table.name',
        type: 'select',
        grid: { md: 12 },
        options: () => {
          return (nodeGroups?.items || []).map((i) => ({
            label: i?.name || '',
            value: i?.name || '',
          }));
        },
      },
      {
        name: 'overriders',
        label: 'table.overridersYaml',
        type: 'textarea',
        rows: 10,
        rules: [{ type: 'required' }],
        grid: { md: 12 },
      }],
      grid: { md: 12 },
    },
  ],
})};
