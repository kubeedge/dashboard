import { ObjectMeta, ResourceList, TypeMeta } from "./common";

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

export interface ClusterRoleBinding extends TypeMeta {
  metadata?: ObjectMeta;
  roleRef: RoleRef;
  subjects?: Subject[];
}

export interface ClusterRoleBindingList extends ResourceList<ClusterRoleBinding> {
  total?: number;
  page?: number;
  pageSize?: number;
  hasNext?: boolean;
  sort?: string;
  order?: string;
}
