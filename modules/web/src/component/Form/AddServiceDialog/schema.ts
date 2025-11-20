import type { FormSchema } from '@/component/FormView';
import { NamespaceList } from '@/types/namespace';

export const addServiceSchema = (namespaces?: NamespaceList): FormSchema => ({
  fields: [
    {
      name: 'namespace',
      label: 'table.namespace',
      type: 'select',
      rules: [{ type: 'required' }],
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
    },
    {
      name: 'annotations',
      label: 'table.annotations',
      type: 'array',
      addText: 'table.addAnnotation',
      itemSchema: [
        { name: 'key', label: 'table.key', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'table.value', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
      inlineRemove: true,
    },
    {
      name: 'labels',
      label: 'table.labels',
      type: 'array',
      addText: 'table.addLabel',
      itemSchema: [
        { name: 'key', label: 'table.key', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'table.value', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
      inlineRemove: true,
    },
    {
      name: 'selectors',
      label: 'table.selectors',
      type: 'array',
      addText: 'table.addSelector',
      itemSchema: [
        { name: 'key', label: 'table.key', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'table.value', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
      inlineRemove: true,
    },
    {
      name: 'publishNotReadyAddresses',
      label: 'table.publishNotReadyAddresses',
      type: 'select',
      options: [
        { label: 'common.none', value: '' },
        { label: 'common.true', value: 'true' },
        { label: 'common.false', value: 'false' },
      ],
    },
    {
      name: 'serviceType',
      label: 'table.type',
      type: 'select',
      defaultValue: 'ClusterIP',
      options: [
        { label: 'ClusterIP', value: 'ClusterIP' },
        { label: 'NodePort', value: 'NodePort' },
        { label: 'Headless', value: 'Headless' },
      ],
    },
    {
      name: 'ports',
      label: 'table.ports',
      type: 'array',
      addText: 'table.addPort',
      itemSchema: [
        { name: 'name', label: 'table.name', type: 'text', grid: { md: 4 } },
        { name: 'port', label: 'table.port', type: 'text', rules: [{ type: 'required' }], grid: { md: 4 } },
        { name: 'targetPort', label: 'table.targetPort', type: 'text', grid: { md: 4 } },
        {
          name: 'protocol',
          label: 'table.protocol',
          type: 'select',
          options: [
            { label: 'TCP', value: 'TCP' },
            { label: 'UDP', value: 'UDP' },
            { label: 'SCTP', value: 'SCTP' },
          ],
          grid: { md: 4 },
        },

        {
          name: 'nodePort',
          label: 'table.nodePort',
          type: 'text',
          visibleWhen: (form) => form.serviceType === 'NodePort',
          grid: { md: 4 },
        },
      ],
    },
    {
      name: 'externalIPs',
      label: 'table.externalIP',
      type: 'array',
      addText: 'actions.add',
      visibleWhen: (values: any) => values?.serviceType === 'ClusterIP' || values?.serviceType === 'NodePort',
      itemSchema: [{ name: 'ip', label: 'table.externalIP', type: 'text' }],
      inlineRemove: true,
    },
    {
      name: 'sessionAffinity',
      label: 'table.sessionAffinity',
      type: 'select',
      visibleWhen: (values: any) => values?.serviceType === 'ClusterIP' || values?.serviceType === 'NodePort',
      options: [
        { label: 'None', value: 'None' },
        { label: 'ClientIP', value: 'ClientIP' },
      ],
    },
    {
      name: 'timeoutSeconds',
      label: 'table.timeoutSeconds',
      type: 'text',
      visibleWhen: (values: any) => values?.sessionAffinity === 'ClientIP',
    }
  ],
});
