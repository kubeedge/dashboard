import type { FormSchema } from '@/component/FormView';
import { listNamespaces } from '@/api/namespace';
import { useListNodeGroups } from '@/api/nodeGroup';

export const addEdgeAppSchema: FormSchema = {
  submitText: 'SUBMIT',
  resetText: 'CANCEL',
  fields: [
    {
      name: 'namespace',
      label: 'Namespace *',
      type: 'select',
      rules: [{ type: 'required', message: 'Miss namespace' }],
      grid: { md: 12 },
      options: async () => {
        const res = await listNamespaces();
        const items = (res as any)?.items ?? (res as any)?.data?.items ?? [];
        return items.map((n: any) => ({
          label: n?.metadata?.name,
          value: n?.metadata?.name,
        }));
      },
    },
    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      rules: [{ type: 'required', message: 'Miss name' }],
      grid: { md: 12 },
    },
    {
      // workloadTemplate
      name: 'workloadTemplate',
      label: '',
      type: 'array',
      addText: '+ ADD WORKLOADTEMPLATE',
      removeText: '- REMOVE WORKLOADTEMPLATE',
      itemSchema: [{
        name: 'manifests',
        label: 'manifests yaml',
        type: 'textarea',
        rows: 10,
        rules: [{ type: 'required', message: 'Missing workloadTemplate manifests yaml' }],
        grid: { md: 12 },
      }],
      grid: { md: 12 },
    },
    {
      // targetNodeGroups
      name: 'targetNodeGroups',
      label: '',
      type: 'array',
      addText: '+ ADD TARGETNODEGROUP',
      removeText: '- REMOVE TARGETNODEGROUP',
      itemSchema: [{
        name: 'name',
        label: 'Name',
        type: 'select',
        grid: { md: 12 },
        options: async () => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const { data } = useListNodeGroups();
          const items = (data as any)?.items ?? [];
          return items.map((i: any) => ({ label: i?.metadata?.name, value: i?.metadata?.name }));
        },
      },
      {
        name: 'overriders',
        label: 'overriders yaml',
        type: 'textarea',
        rows: 10,
        rules: [{ type: 'required', message: 'Missing targetNodeGroup overriders yaml' }],
        grid: { md: 12 },
      }],
      grid: { md: 12 },
    },
  ],
};
