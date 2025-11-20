import { DataList, LabelSelector, ObjectMeta, ResourceList, TypeMeta } from "./common";

interface AggregationRule {
  clusterRoleSelectors?: LabelSelector[];
}

export interface PolicyRule {
  apiGroups?: string[];
  resources?: string[];
  verbs: string[];
  resourceNames?: string[];
  nonResourceURLs?: string[];
}

export interface ClusterRole extends TypeMeta {
  metadata?: ObjectMeta;
  aggregationRule?: AggregationRule;
  rules?: PolicyRule[];
}

export interface ClusterRoleList extends ResourceList<ClusterRole> {
  total?: number;
  page?: number;
  pageSize?: number;
  hasNext?: boolean;
  sort?: string;
  order?: string;
}

export interface ConciseClusterRole {
  age: string;
  creationTimestamp: string;
  name: string;
  labels?: Record<string, string>;
}

export interface ConciseClusterRoleList extends DataList<ConciseClusterRole> {}
