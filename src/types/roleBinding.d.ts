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

export interface RoleBinding extends TypeMeta {
  metadata?: ObjectMeta;
  roleRef: RoleRef;
  subjects?: Subject[];
}

export interface RoleBindingList extends ResourceList<RoleBinding> {}
