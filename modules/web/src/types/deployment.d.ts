import type { Condition, LabelSelector, Resource, ResourceList } from "./common";
import { PodTemplateSpec } from "./podTemplate";

interface RollingUpdateDeployment {
  maxSurge?: number | string;
  maxUnavailable?: number | string;
}

interface DeploymentStrategy {
  type?: string;
  rollingUpdate?: RollingUpdateDeployment;
}

interface DeploymentCondition extends Condition {
  lastUpdateTime?: string;
}

interface DeploymentSpec {
  selector: LabelSelector;
  template: PodTemplateSpec;
  replicas?: number;
  minReadySeconds?: number;
  strategy?: DeploymentStrategy;
  revisionHistoryLimit?: number;
  progressDeadlineSeconds?: number;
  paused?: boolean;
}

interface DeploymentStatus {
  replicas?: number;
  availableReplicas?: number;
  readyReplicas?: number;
  unavailableReplicas?: number;
  updatedReplicas?: number;
  collisionCount?: number;
  conditions?: DeploymentCondition[];
  observedGeneration: number;
}

export interface Deployment extends Resource<DeploymentSpec, DeploymentStatus> {}

export interface DeploymentList extends ResourceList<Deployment> {}
