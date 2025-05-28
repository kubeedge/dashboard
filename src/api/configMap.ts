import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ConfigMap, ConfigMapList } from '@/types/configMap';
import { request } from '@/helper/request';


export function useListConfigMaps(namespace?: string) {
  const url = namespace ? `/configmap/${namespace}` : '/configmap';
  return useQuery<ConfigMapList>('listConfigMaps', url, {
    method: 'GET',
  });
}

export function getConfigMap(namespace: string, name: string) {
  return request<ConfigMap>(`/configmap/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createConfigMap(namespace: string, data: ConfigMap) {
  return request<ConfigMap>(`/configmap/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateConfigMap(namespace: string, name: string, data: ConfigMap) {
  return request<ConfigMap>(`/configmap/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteConfigMap(namespace: string, name: string) {
  return request<Status>(`/configmap/${namespace}/${name}`, {
    method: 'DELETE',
  });
}
