import { ObjectMeta, ResourceList, TypeMeta } from "./common";

export interface Secret extends TypeMeta {
  metadata?: ObjectMeta;
  data?: Record<string, any>;
  immutable?: boolean;
  stringData?: Record<string, string>;
  type?: string;
}

export interface SecretList extends ResourceList<Secret> {}
