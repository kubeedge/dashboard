import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { CustomResourceDefinition, ConciseCustomResourceDefinitionList } from '@/types/customResourceDefinition';

export function useListCustomResourceDefinitions(params?: Record<string, string | number | undefined>) {
  return useQuery<ConciseCustomResourceDefinitionList>(
    `listCustomResourceDefinitions:${JSON.stringify(params)}`,
    '/crd',
    {
      method: 'GET',
      params,
    },
  );
}

export function getCustomResourceDefinition(name: string) {
  return request<CustomResourceDefinition>(`/crd/${name}`, {
    method: 'GET',
  });
}
