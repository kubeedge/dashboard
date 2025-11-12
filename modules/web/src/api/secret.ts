import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ConciseSecretList, Secret, SecretList } from '@/types/secret';

export function useListSecrets(params?: Record<string, string | number | undefined>) {
  let path = '/secret';
  // Optional namespace path parameter for compatibility
  const namespace = params?.namespace as string | undefined;
  if (namespace) {
    path = `/secret/${namespace}`;
  }
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}` !== '' && k !== 'namespace') {
      search.set(k, String(v));
    }
  });
  const qs = search.toString();
  if (qs) path += `?${qs}`;
  return useQuery<any>(`listSecrets:${path}`, path, { method: 'GET' });
}

export function getSecret(namespace: string, name: string) {
  return request<Secret>(`/secret/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createSecret(namespace: string, data: Secret) {
  return request<Secret>(`/secret/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateSecret(namespace: string, name: string, data: Secret) {
  return request<Secret>(`/secret/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteSecret(namespace: string, name: string) {
  return request<Status>(`/secret/${namespace}/${name}`, {
    method: 'DELETE',
  });
}

export async function listSecrets(namespace: string) {
  return request<ConciseSecretList>(`/secret/${namespace}`, { method: 'GET' });
}
