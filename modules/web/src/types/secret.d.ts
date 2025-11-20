import { DataList, ObjectMeta, ResourceList, TypeMeta } from "./common";

export interface Secret extends TypeMeta {
  metadata?: ObjectMeta;
  data?: Record<string, any>;
  immutable?: boolean;
  stringData?: Record<string, string>;
  type?: string;
}

export interface SecretList extends ResourceList<Secret> {}

export interface ConciseSecret {
  creationTimestamp: string;
  name: string;
  namespace: string;
  type: string;
}

export interface ConciseSecretList extends DataList<ConciseSecret> {}
