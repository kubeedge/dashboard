import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ServiceAccount, ServiceAccountList } from '@/types/serviceAccount';
import { request } from '@/helper/request';

export function useListServiceAccounts(namespace?: string) {
  const url = namespace ? `/serviceaccount/${namespace}` : '/serviceaccount';
  return useQuery<ServiceAccountList>('listServiceAccounts', url, {
    method: 'GET',
  });
}

export function getServiceAccount(namespace: string, name: string) {
  return request<ServiceAccount>(`/serviceaccount/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createServiceAccount(namespace: string, data: ServiceAccount) {
  return request<ServiceAccount>(`/serviceaccount/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateServiceAccount(namespace: string, name: string, data: ServiceAccount) {
  return request<ServiceAccount>(`/serviceaccount/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteServiceAccount(namespace: string, name: string) {
  return request<Status>(`/serviceaccount/${namespace}/${name}`, {
    method: 'DELETE',
  });
}
