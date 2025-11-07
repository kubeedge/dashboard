import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Rule, RuleList } from '@/types/rule';

export function useListRules(params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && key !== 'namespace') {
        searchParams.append(key, value.toString());
      }
    });
  }

  const namespace = params?.namespace as string;
  const baseUrl = namespace ? `/rule/${namespace}` : '/rule';
  const url = searchParams.toString() ? `${baseUrl}?${searchParams.toString()}` : baseUrl;

  return useQuery<RuleList>('listRules', url, {
    method: 'GET',
  });
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
