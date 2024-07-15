import type { Condition, Resource, ResourceList } from "./common";

export interface NodeCondition extends Condition {
  lastHeartbeatTime?: string;
}

interface NodeAddress {
  type: string;
  address: string;
}

interface NodeSystemInfo {
  machineID: string;
  systemUUID: string;
  bootID: string;
  kernelVersion: string;
  osImage: string;
  containerRuntimeVersion: string;
  kubeletVersion: string;
  kubeProxyVersion: string;
  operatingSystem: string;
  architecture: string;
}

interface NodeSpec {
  podCIDRs?: string[];
  providerId?: string;
  unschedulable?: boolean;
  // taints?: Taint[];
  // configSource?: NodeConfigSource;
}

interface NodeStatus {
  capacity?: Record<string, string>;
  allocatable?: Record<string, string>;
  phase?: string;
  conditions?: NodeCondition[];
  addresses?: NodeAddress[];
  // daemonEndpoints?: NodeDaemonEndpoints;
  nodeInfo?: NodeSystemInfo;
  // images?: ContainerImage[];
  // volumesInUse?: string[];
  // volumesAttached?: AttachedVolume[];
  // config?: NodeConfigStatus;
}

export type Node = Resource<NodeSpec, NodeStatus>;

export type NodeList = ResourceList<Node>;
