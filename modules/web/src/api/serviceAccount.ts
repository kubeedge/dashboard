import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ConciseServiceAccountList, ServiceAccount } from '@/types/serviceAccount';

export function useListServiceAccounts(namespace?: string, params?: Record<string, string | number | undefined>) {
  let url = namespace ? `/serviceaccount/${namespace}` : '/serviceaccount';

  return useQuery<ConciseServiceAccountList>(
    'listServiceAccounts',
    url,
    { method: 'GET', params, },
  );
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
