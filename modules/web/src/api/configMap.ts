import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ConfigMap } from '@/types/configMap';

export function useListConfigMaps(params?: Record<string, string | number | undefined>) {
  let path = '/configmap';
  // Optional namespace path parameter for compatibility
  const namespace = params?.namespace as string | undefined;
  if (namespace) {
    path = `/configmap/${namespace}`;
  }
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}` !== '' && k !== 'namespace') {
      search.set(k, String(v));
    }
  });
  const qs = search.toString();
  if (qs) path += `?${qs}`;
  return useQuery<any>(`listConfigMaps:${path}`, path, { method: 'GET' });
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
