export interface TypeMeta {
  kind?: string;
  apiVersion?: string;
}

interface ManagedFieldsEntry {
  manager?: string;
  operation?: string;
  apiVersion?: string;
  time?: string;
  fieldsType?: string;
  fieldsV1?: any;
  subresource?: string;
}

interface OwnerReference extends TypeMeta {
  name: string;
  uid: string;
  controller?: boolean;
  blockOwnerDeletion?: boolean;
}

export interface ObjectMeta {
  name?: string;
  generateName?: string;
  namespace?: string;
  selfLink?: string;
  uid?: string;
  resourceVersion?: string;
  generation?: number;
  creationTimestamp?: string;
  deletionTimestamp?: string;
  deletionGracePeriodSeconds?: number;
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  ownerReferences?: OwnerReference[];
  finalizers?: string[];
  managedFields?: ManagedFieldsEntry[];
}

export interface ListMeta {
  selfLink?: string;
  resourceVersion?: string;
  continue?: string;
  remainingItemCount?: number;
}

export interface ResourceList<T> extends TypeMeta {
  metadata?: ListMeta;
  items: T[];
}

export interface Resource<SPEC, STATUS> extends TypeMeta {
  metadata?: ObjectMeta;
  spec?: SPEC;
  status?: STATUS;
}

export interface LocalObjectReference {
  name?: string;
}

export interface Condition {
  type: string;
  status: string;
  lastTransitionTime?: string;
  reason?: string;
  message?: string;
}

interface LabelSelectorRequirement {
  key: string;
  operator: string;
  values?: string[];
}

export interface LabelSelector {
  matchLabels?: Record<string, string>;
  matchExpressions?: LabelSelectorRequirement[];
}

interface StatusCause {
  reason?: string;
  message?: string;
  field?: string;
}

interface StatusDetails {
  name?: string;
  group?: string;
  uid?: string;
  kind?: string;
  causes?: StatusCause[];
  retryAfterSeconds?: number;
}

export interface Status extends TypeMeta {
  metadata?: ListMeta;
  status?: string;
  message?: string;
  reason?: string;
  details?: StatusDetails;
  code?: number;
}
