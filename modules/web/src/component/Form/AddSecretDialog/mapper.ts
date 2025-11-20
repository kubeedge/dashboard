import type { Secret } from '@/types/secret';

export function toSecret(values: any): Secret {
  return {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        namespace: values.namespace,
        name: values.name,
      },
      type: values.type === 'Docker' ? 'kubernetes.io/dockerconfigjson' : 'Opaque',
      data: values.type === 'Docker' ? {
        '.dockerconfigjson': btoa(JSON.stringify({
          auths: {
            [values.dockerServer]: {
              username: values.dockerUsername,
              password: values.dockerPassword,
            },
          },
        })),
      } : values.data.reduce((acc: any, cur: any) => ({ ...acc, [cur.key]: cur.value }), {}),
    };;
}
