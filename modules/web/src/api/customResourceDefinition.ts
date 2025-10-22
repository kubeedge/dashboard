import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { CustomResourceDefinition, CustomResourceDefinitionList } from '@/types/customResourceDefinition';

export function useListCustomResourceDefinitions(params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  let url = '/crd';
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const finalUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;
  
  return useQuery<CustomResourceDefinitionList>('listCustomResourceDefinitions', finalUrl, {
    method: 'GET',
  });
}

export function getCustomResourceDefinition(name: string) {
  return request<CustomResourceDefinition>(`/crd/${name}`, {
    method: 'GET',
  });
}
