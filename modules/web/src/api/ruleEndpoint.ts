import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { RuleEndpoint, ConciseRuleEndpointList } from '@/types/ruleEndpoint';

export function useListRuleEndpoints(namespace?: string, params?: Record<string, string | number | undefined>) {
  const path = namespace ? `/ruleendpoint/${namespace}` : '/ruleendpoint';

  return useQuery<ConciseRuleEndpointList>(
    'listRuleEndpoints',
    path,
    { method: 'GET', params, },
  );
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
  const url = namespace ? `/ruleendpoint/${namespace}` : '/ruleendpoint';
  return request<ConciseRuleEndpointList>(url, { method: 'GET' });
}
