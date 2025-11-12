import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ConciseSecretList, Secret } from '@/types/secret';

export function useListSecrets(params?: Record<string, string | number | undefined>) {
  const path = params?.namespace ? `/secret/${params.namespace}` : '/secret';

  return useQuery<ConciseSecretList>(
    `listSecrets:${JSON.stringify(params)}`,
    path,
    { method: 'GET', params },
  );
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
