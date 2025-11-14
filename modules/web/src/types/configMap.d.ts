import { DataList, ObjectMeta, ResourceList, TypeMeta } from "./common";

export interface ConfigMap extends TypeMeta {
  metadata?: ObjectMeta;
  binaryData?: Record<string, any>;
  data?: Record<string, string>;
  immutable?: boolean;
}

export interface ConfigMapList extends ResourceList<ConfigMap> { }

export interface ConciseConfigMap {
  creationTimestamp: string;
  labels?: Record<string, string>;
  name: string;
  namespace: string;
}

export interface ConciseConfigMapList extends DataList<ConciseConfigMap> { }
