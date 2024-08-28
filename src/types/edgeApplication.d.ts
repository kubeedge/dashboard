
import type { Resource, ResourceList } from './common';

interface CommandArgsOverrider {
  containerName: string;
  operator: string;
  value?: string[];
}

interface ConfigMapKeySelector {
  key: string;
  name?: string;
  optional?: boolean;
}

interface ObjectFieldSelector {
  fieldPath: string;
  apiVersion?: string;
}

interface ResourceFieldSelector {
  resource: string;
  containerName?: string;
  divisor?: any;
}

interface SecretKeySelector {
  key: string;
  name?: string;
  optional?: boolean;
}

interface EnvVarSource {
  configMapKeyRef?: ConfigMapKeySelector;
  fieldRef?: ObjectFieldSelector;
  resourceFieldRef?: ResourceFieldSelector;
  secretKeyRef?: SecretKeySelector;
}

interface EnvVar {
  name: string;
  value: string;
  valueFrom?: EnvVarSource;
}

interface EnvOverrider {
  containerName: string;
  operator: string;
  value?: EnvVar[];
}

interface ImagePredicate {
  path: string;
}

interface ImageOverrider {
  component: string;
  operator: string;
  predicate?: ImagePredicate;
  value?: string;
}

interface ResourceClaim {
  name: string;
  limits?: Record<string, any>;
  requests?: Record<string, any>;
}

interface ResourceRequirements {
  claims?: ResourceClaim[];
}

interface ResourcesOverrider {
  containerName: string;
  value?: ResourceRequirements;
}

interface Overriders {
  argsOverriders?: CommandArgsOverrider[];
  commandOverriders?: CommandArgsOverrider[];
  envOverriders?: EnvOverrider[];
  imageOverriders?: ImageOverrider[];
  replicas?: number;
  resourcesOverriders?: ResourcesOverrider[];
}

interface TargetNodeGroup {
  name: string;
  overriders?: Overriders[];
}

interface ResourceTemplate {
  manifests?: any;
}

interface WorkloadScope {
  targetNodeGroups?: TargetNodeGroup[];
}

interface ResourceIdentifier {
  ordinal: number;
  group?: string;
  kind?: string;
  name?: string;
  namespace?: string;
  resource?: string;
  version?: string;
}

interface ManifestStatus {
  identifier: ResourceIdentifier;
  conditions?: string;
}

interface EdgeApplicationSpec {
  workloadScope: WorkloadScope;
  workloadTemplate?: ResourceTemplate;
}

interface EdgeApplicationStatus {
  workloadStatus?: ManifestStatus[];
}

export interface EdgeApplication extends Resource<EdgeApplicationSpec, EdgeApplicationStatus> {};

export interface EdgeApplicationList extends ResourceList<EdgeApplication> {}
