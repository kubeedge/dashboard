import { listRuleEndpoints } from '@/api/ruleEndpoint';
import type { FormSchema } from '@/component/FormView';
import { NamespaceList } from '@/types/namespace';
import { ConciseRuleEndpointList } from '@/types/ruleEndpoint';

export const addRuleSchema = (namespaces?: NamespaceList, ruleEndpoints?: ConciseRuleEndpointList): FormSchema => ({
  fields: [
    {
      name: 'namespace',
      label: 'table.namespace',
      type: 'select',
      grid: { md: 12 },
      rules: [{ type: 'required' }],
      options: () => {
        return (namespaces?.items || []).map((e: any) => ({
          label: e?.metadata?.name,
          value: e?.metadata?.name,
        }));
      }
    },
    {
      name: 'name',
      label: 'table.name',
      type: 'text',
      grid: { md: 12 },
      rules: [{ type: 'required' }],
    },
    {
      name: 'source',
      label: 'table.source',
      type: 'select',
      grid: { md: 12 },
      options: () => {
        return (ruleEndpoints?.items || []).map((e) => ({
          label: e?.name,
          value: e?.name,
        }));
      },
    },
    {
      name: 'sourceResource',
      label: 'table.sourceResource',
      type: 'text',
      grid: { md: 12 },
    },
    {
      name: 'target',
      label: 'table.target',
      type: 'select',
      grid: { md: 12 },
      options: () => {
        return (ruleEndpoints?.items || []).map((e) => ({
          label: e?.name,
          value: e?.name,
        }));
      },
    },
    {
      name: 'targetResource',
      label: 'table.targetResource',
      type: 'text',
      grid: { md: 12 },
    },
    {
      name: 'description',
      label: 'table.description',
      type: 'textarea',
      grid: { md: 12 },
      rows: 4,
    }
  ],
});
