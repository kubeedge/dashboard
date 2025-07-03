import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { CustomResourceDefinition, CustomResourceDefinitionList } from '@/types/customResourceDefinition';

export function useListCustomResourceDefinitions() {
  return useQuery<CustomResourceDefinitionList>('listCustomResourceDefinitions', '/crd', {
    method: 'GET',
  });
}

export function getCustomResourceDefinition(name: string) {
  return request<CustomResourceDefinition>(`/crd/${name}`, {
    method: 'GET',
  });
}
