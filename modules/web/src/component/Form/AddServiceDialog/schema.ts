import type { FormSchema } from '@/component/FormView';
import { listNamespaces } from '@/api/namespace';

export const addServiceSchema: FormSchema = {
  submitText: 'ADD',
  resetText: 'CANCEL',
  fields: [
    {
      // Namespace
      name: 'namespace',
      label: 'Namespace',
      type: 'select',
      rules: [{ type: 'required', message: 'Miss namespace' }],
      options: async () => {
        const res = await listNamespaces();
        const items = res?.data?.items ?? [];
        return items.map((n: any) => ({
          label: n?.metadata?.name,
          value: n?.metadata?.name,
        }));
      },
    },
    {
      // Name
      name: 'name',
      label: 'Name *',
      type: 'text',
      rules: [{ type: 'required', message: 'Miss name' }],
    },
    {
      // Annotations
      name: 'annotations',
      label: 'Annotations',
      type: 'array',
      addText: 'ADD ANNOTATIONS',
      itemSchema: [
        { name: 'key', label: 'Key *', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'Value *', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
    },
    {
      // Labels
      name: 'labels',
      label: 'Labels',
      type: 'array',
      addText: 'ADD LABELS',
      itemSchema: [
        { name: 'key', label: 'Key *', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'Value *', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
    },
    {
      // Selectors
      name: 'selectors',
      label: 'Selectors',
      type: 'array',
      addText: 'ADD SELECTORS',
      itemSchema: [
        { name: 'key', label: 'Key *', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
        { name: 'value', label: 'Value *', type: 'text', rules: [{ type: 'required' }], grid: { md: 6 } },
      ],
    },
    {
      // PublishNotReadyAddresses
      name: 'publishNotReadyAddresses',
      label: 'PublishNotReadyAddresses',
      type: 'select',
      options: [
        { label: 'None', value: '' },
        { label: 'true', value: 'true' },
        { label: 'false', value: 'false' },
      ],
    },
    {
      // Type Segmented
      name: 'serviceType',
      label: 'Type',
      type: 'select',
      defaultValue: 'ClusterIP',
      options: [
        { label: 'CLUSTERIP', value: 'ClusterIP' },
        { label: 'NODEPORT', value: 'NodePort' },
        { label: 'HEADLESS', value: 'Headless' },
      ],
    },

    {
      name: 'ports',
      label: 'Ports',
      type: 'array',
      addText: 'ADD PORTS',
      itemSchema: [
        { name: 'name', label: 'Name', type: 'text', grid: { md: 3 } },
        { name: 'port', label: 'Port *', type: 'number', rules: [{ type: 'required' }], grid: { md: 3 } },
        { name: 'targetPort', label: 'TargetPort', type: 'text', grid: { md: 3 } },
        {
          name: 'protocol',
          label: 'Protocol',
          type: 'select',
          options: [
            { label: 'TCP', value: 'TCP' },
            { label: 'UDP', value: 'UDP' },
            { label: 'SCTP', value: 'SCTP' },
          ],
          grid: { md: 3 },
        },

        {
          name: 'nodePort',
          label: 'NodePort',
          type: 'number',
          visibleWhen: (form) => form.serviceType === 'NodePort',
          grid: { md: 3 },
        },
      ],
    },
    {
      // ClusterIP / NodePort
      name: 'externalIPs',
      label: 'External IPs',
      type: 'array',
      addText: 'ADD',
      visibleWhen: (values: any) => values?.serviceType === 'ClusterIP' || values?.serviceType === 'NodePort',
      itemSchema: [{ name: 'ip', label: 'External IPs', type: 'text' }],
    },
    {
      name: 'sessionAffinity',
      label: 'Session Affinity',
      type: 'select',
      visibleWhen: (values: any) => values?.serviceType === 'ClusterIP' || values?.serviceType === 'NodePort',
      options: [
        { label: 'None', value: 'None' },
        { label: 'ClientIP', value: 'ClientIP' },
      ],
    },
  ],
};
