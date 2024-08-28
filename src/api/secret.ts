import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Secret, SecretList } from '@/types/secret';
import { request } from '@/helper/request';

export function useListSecrets(namespace?: string) {
  const url = namespace ? `/api/v1/namespaces/${namespace}/secrets` : '/api/v1/secrets';
  return useQuery<SecretList>('listSecrets', url, {
    method: 'GET',
  });
}

export function getSecret(namespace: string, name: string) {
  return request<Secret>(`/api/v1/namespaces/${namespace}/secrets/${name}`, {
    method: 'GET',
  });
}

export function createSecret(namespace: string, data: Secret) {
  return request<Secret>(`/api/v1/namespaces/${namespace}/secrets`, {
    method: 'POST',
    data,
  });
}

export function updateSecret(namespace: string, name: string, data: Secret) {
  return request<Secret>(`/api/v1/namespaces/${namespace}/secrets/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteSecret(namespace: string, name: string) {
  return request<Status>(`/api/v1/namespaces/${namespace}/secrets/${name}`, {
    method: 'DELETE',
  });
}
