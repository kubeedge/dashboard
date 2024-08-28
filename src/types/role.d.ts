import { ObjectMeta, ResourceList, TypeMeta } from "./common";

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

export interface RoleList extends ResourceList<Role> {}
