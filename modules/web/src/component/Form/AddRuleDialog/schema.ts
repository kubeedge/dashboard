import type { FormSchema } from '@/components/FormView';
import { listRuleEndpoints, useListRuleEndpoints } from '@/api/ruleEndpoint';

export const addRuleSchema: FormSchema = {

  submitText: undefined,
  resetText: undefined,

  fields: [
    {
      name: 'namespace',
      label: 'Namespace *',
      type: 'select',
      grid: { md: 12 },
      rules: [{ type: 'required', message: 'Miss namespace' }],

      options: async () => {
        const res = await useListRuleEndpoints();
        const items = res?.data?.items ?? [];
        return items.map((e: any) => ({
          label: e?.metadata?.name,
          value: e?.metadata?.name,
          }));
        }

    },

    {
      name: 'name',
      label: 'Name *',
      type: 'text',
      grid: { md: 12 },
      rules: [{ type: 'required', message: 'Miss name' }],
    },

    // Source & SourceResource
    {
      name: 'source',
      label: 'Source',
      type: 'select',
      grid: { md: 12 },

      options: async () => {
        const res = await listRuleEndpoints();
        const items = (res?.data?.items ?? []);
        return items.map((e: any) => ({
          label: e?.metadata?.name,
          value: e?.metadata?.name,
        }));
      },
    },
    {
      name: 'sourceResource',
      label: 'SourceResource',
      type: 'text',
      grid: { md: 12 },
    },

    // Target & TargetResource & Description
    {
      name: 'target',
      label: 'Target',
      type: 'select',
      grid: { md: 12 },
      options: async () => {
        const res = await listRuleEndpoints();
        const items = (res?.data?.items ?? []);
        return items.map((e: any) => ({
          label: e?.metadata?.name,
          value: e?.metadata?.name,
        }));
      },
    },
    {
      name: 'targetResource',
      label: 'TargetResource',
      type: 'text',
      grid: { md: 12 },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      grid: { md: 12 },
      rows: 4,
    },
  ],
};
