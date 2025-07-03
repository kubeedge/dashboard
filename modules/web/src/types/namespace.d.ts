import type { Condition, Resource, ResourceList } from './common';

interface NamespaceSpec {
  finalizers?: string[]
}

interface NamespaceCondition extends Condition {}

interface NamespaceStatus {
  phase?: string;
  conditions?: NamespaceCondition[];
}

export interface Namespace extends Resource<NamespaceSpec, NamespaceStatus> {}

export interface NamespaceList extends ResourceList<Namespace> {}
