import type { Condition, LabelSelector, Resource, ResourceList } from "./common";

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
  template: any;
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

export type Deployment = Resource<DeploymentSpec, DeploymentStatus>;

export type DeploymentList = ResourceList<Deployment>;
