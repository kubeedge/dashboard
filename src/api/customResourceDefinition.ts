import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { CustomResourceDefinition, CustomResourceDefinitionList } from '@/types/customResourceDefinition';

export function useListCustomResourceDefinitions() {
  return useQuery<CustomResourceDefinitionList>('listCustomResourceDefinitions', '/apis/apiextensions.k8s.io/v1/customresourcedefinitions', {
    method: 'GET',
  });
}

export function getCustomResourceDefinition(name: string) {
  return request<CustomResourceDefinition>(`/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${name}`, {
    method: 'GET',
  });
}
