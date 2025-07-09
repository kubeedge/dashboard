import {
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
