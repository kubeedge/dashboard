import {
  DataList,
  LocalObjectReference,
  ObjectMeta,
  ObjectReference,
  ResourceList,
  TypeMeta,
} from "./common";

export interface ServiceAccount extends TypeMeta {
  metadata?: ObjectMeta;
  automountServiceAccountToken?: boolean;
  imagePullSecrets?: LocalObjectReference[];
  secrets?: ObjectReference[];
}

export interface ServiceAccountList extends ResourceList<ServiceAccount> {}

export interface ConciseServiceAccount {
  age?: string;
  creationTimestamp?: string;
  labels?: Record<string, string>;
  name: string;
  namespace: string;
  secrets?: string[];
}

export interface ConciseServiceAccountList extends DataList<ConciseServiceAccount> {}
