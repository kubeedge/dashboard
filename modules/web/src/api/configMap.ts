import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ConfigMap } from '@/types/configMap';

export function useListConfigMaps(params?: Record<string, string | number | undefined>) {
  const path = params?.namespace ? `/configmap/${params.namespace}` : '/configmap';

  return useQuery<any>(
    `listConfigMaps:${JSON.stringify(params)}`,
    path,
    { method: 'GET', params },
  );
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
