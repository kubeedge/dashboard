import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ServiceAccount, ServiceAccountList } from '@/types/serviceAccount';
import { request } from '@/helper/request';

export function useListServiceAccounts(namespace?: string) {
  const url = namespace ? `/api/v1/namespaces/${namespace}/serviceaccounts` : '/api/v1/serviceaccounts';
  return useQuery<ServiceAccountList>('listServiceAccounts', url, {
    method: 'GET',
  });
}

export function getServiceAccount(namespace: string, name: string) {
  return request<ServiceAccount>(`/api/v1/namespaces/${namespace}/serviceaccounts/${name}`, {
    method: 'GET',
  });
}

export function createServiceAccount(namespace: string, data: ServiceAccount) {
  return request<ServiceAccount>(`/api/v1/namespaces/${namespace}/serviceaccounts`, {
    method: 'POST',
    data,
  });
}

export function updateServiceAccount(namespace: string, name: string, data: ServiceAccount) {
  return request<ServiceAccount>(`/api/v1/namespaces/${namespace}/serviceaccounts/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteServiceAccount(namespace: string, name: string) {
  return request<Status>(`/api/v1/namespaces/${namespace}/serviceaccounts/${name}`, {
    method: 'DELETE',
  });
}
