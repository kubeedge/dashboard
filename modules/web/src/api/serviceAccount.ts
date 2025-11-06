import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { ServiceAccount, ServiceAccountList } from '@/types/serviceAccount';

export function useListServiceAccounts(params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  let url = '/serviceaccount';

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && key !== 'namespace') {
        searchParams.append(key, String(value));
      }
    });

    if (params.namespace) {
      url = `/serviceaccount/${params.namespace}`;
    }
  }

  const finalUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  return useQuery<ServiceAccountList>('listServiceAccounts', finalUrl, {
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
