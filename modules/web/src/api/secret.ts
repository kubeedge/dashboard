import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Secret, SecretList } from '@/types/secret';
import { request } from '@/helper/request';

export function useListSecrets(namespace?: string) {
  const url = namespace ? `/secret/${namespace}` : '/secret';
  return useQuery<SecretList>('listSecrets', url, {
    method: 'GET',
  });
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
  return request<SecretList>(`/secret/${namespace}`, { method: 'GET' });
}
