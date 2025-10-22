import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { RuleEndpoint, RuleEndpointList } from '@/types/ruleEndpoint';
import { request } from '@/helper/request';

export function useListRuleEndpoints(namespace?: string) {
  const url = namespace ? `/ruleendpoint/${namespace}` : '/ruleendpoint';
  return useQuery<RuleEndpointList>('listRuleEndpoints', url, {
    method: 'GET',
  });
}

export function getRuleEndpoint(namespace: string, name: string) {
  return request<RuleEndpoint>(`/ruleendpoint/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createRuleEndpoint(namespace: string, data: RuleEndpoint) {
  return request<RuleEndpoint>(`/ruleendpoint/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateRuleEndpoint(namespace: string, name: string, data: RuleEndpoint) {
  return request<RuleEndpoint>(`/ruleendpoint/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteRuleEndpoint(namespace: string, name: string) {
  return request<Status>(`/ruleendpoint/${namespace}/${name}`, {
    method: 'DELETE',
  });
}


export async function listRuleEndpoints(namespace?: string) {

  const url = namespace ? `/ruleEndpoint/${namespace}` : '/ruleEndpoint';
  return request<RuleEndpointList>(url, { method: 'GET' });
}