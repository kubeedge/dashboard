import { DataList, ObjectMeta, ResourceList, TypeMeta } from "./common";

export interface PolicyRule {
  apiGroups?: string[];
  resources?: string[];
  verbs?: string[];
  resourceNames?: string[];
  nonResourceURLs?: string[];
}

export interface Role extends TypeMeta {
  metadata?: ObjectMeta;
  rules?: PolicyRule[];
}

export interface RoleList extends ResourceList<Role> {
  total?: number;
  page?: number;
  pageSize?: number;
  hasNext?: boolean;
  sort?: string;
  order?: string;
}

export interface ConciseRole {
  age?: string;
  creationTimestamp?: string;
  labels?: Record<string, string>;
  name?: string;
  namespace?: string;
}

export interface ConciseRoleList extends DataList<ConciseRole> {}
