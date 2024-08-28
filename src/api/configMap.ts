import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ConfigMap, ConfigMapList } from '@/types/configMap';
import { request } from '@/helper/request';


export function useListConfigMaps(namespace?: string) {
  const url = namespace ? `/api/v1/namespaces/${namespace}/configmaps` : '/api/v1/configmaps'
  return useQuery<ConfigMapList>('listConfigMaps', url, {
    method: 'GET',
  });
}

export function getConfigMap(namespace: string, name: string) {
  return request<ConfigMap>(`/api/v1/namespaces/${namespace}/configmaps/${name}`, {
    method: 'GET',
  });
}

export function createConfigMap(namespace: string, data: ConfigMap) {
  return request<ConfigMap>(`/api/v1/namespaces/${namespace}/configmaps`, {
    method: 'POST',
    data,
  });
}

export function updateConfigMap(namespace: string, name: string, data: ConfigMap) {
  return request<ConfigMap>(`/api/v1/namespaces/${namespace}/configmaps/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteConfigMap(namespace: string, name: string) {
  return request<Status>(`/api/v1/namespaces/${namespace}/configmaps/${name}`, {
    method: 'DELETE',
  });
}
