import { DataList, ObjectMeta, ResourceList, TypeMeta } from "./common";

export interface RoleRef {
  apiGroup: string;
  kind: string;
  name: string;
}

export interface Subject {
  kind: string;
  name: string;
  apiGroup?: string;
  namespace?: string;
}

export interface RoleBinding extends TypeMeta {
  metadata?: ObjectMeta;
  roleRef: RoleRef;
  subjects?: Subject[];
}

export interface RoleBindingList extends ResourceList<RoleBinding> {
  total?: number;
  page?: number;
  pageSize?: number;
  hasNext?: boolean;
  sort?: string;
  order?: string;
}

export interface ConciseRoleBinding {
  age?: string;
  creationTimestamp?: string;
  labels?: Record<string, string>;
  name?: string;
  namespace?: string;
  role?: string;
}

export interface ConciseRoleBindingList extends DataList<ConciseRoleBinding> {}
