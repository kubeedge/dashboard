import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Rule, ConciseRuleList } from '@/types/rule';

export function useListRules(namespace?: string, params?: Record<string, string | number | undefined>) {
  const path = namespace ? `/rule/${namespace}` : '/rule';

  return useQuery<ConciseRuleList>(
    'listRules',
    path,
    { method: 'GET', params },
  );
}

export function getRule(namespace: string, name: string) {
  return request<Rule>(`/rule/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createRule(namespace: string, data: Rule) {
  return request<Rule>(`/rule/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateRule(namespace: string, name: string, data: Rule) {
  return request<Rule>(`/rule/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteRule(namespace: string, name: string) {
  return request<Status>(`/rule/${namespace}/${name}`, {
    method: 'DELETE',
  });
}
