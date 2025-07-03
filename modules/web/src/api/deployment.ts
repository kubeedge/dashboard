import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Deployment, DeploymentList } from '@/types/deployment';
import { request } from '@/helper/request';


export function useListDeployments(namespace?: string) {
  const url = namespace ? `/deployment/${namespace}` : '/deployment';
  return useQuery<DeploymentList>('listDeployments', url, {
    method: 'GET',
  });
}

export function getDeployment(namespace: string, name: string) {
  return request<Deployment>(`/deployment/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createDeployment(namespace: string, data: Deployment) {
  return request<Deployment>(`/deployment/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateDeployment(namespace: string, name: string, data: Deployment) {
  return request<Deployment>(`/deployment/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteDeployment(namespace: string, name: string) {
  return request<Status>(`/deployment/${namespace}/${name}`, {
    method: 'DELETE',
  });
}
