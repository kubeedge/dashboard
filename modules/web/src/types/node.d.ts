import type { Condition, Resource, ResourceList } from "./common";

interface ConfigMapNodeConfigSource {
  namespace: string;
  name: string;
  uid?: string;
  resourceVersion?: string;
  kubeletConfigKey: string;
}

interface NodeConfigSource {
  configMap?: ConfigMapNodeConfigSource;
}

interface Taint {
  key: string;
  value?: string;
  effect: string;
  timeAdded?: string;
}

interface NodeSpec {
  podCIDRs?: string[];
  providerId?: string;
  unschedulable?: boolean;
  taints?: Taint[];
  configSource?: NodeConfigSource;

  /**
   * @todo
   */
  podCIDR?: string;
  /**
   * @deprecated
   */
  externalID?: string;
}

interface NodeAddress {
  type: string;
  address: string;
}

interface NodeCondition extends Condition {
  lastHeartbeatTime?: string;
}

interface NodeConfigStatus {
  assigned?: NodeConfigSource;
  active?: NodeConfigSource;
  lastKnownGood?: NodeConfigSource;
  error?: string;
}

interface DaemonEndpoint {
  Port?: number;
}

interface NodeDaemonEndpoints {
  kubeletEndpoint?: DaemonEndpoint;
}

interface ContainerImage {
  names?: string[];
  sizeBytes?: number;
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

interface AttachedVolume {
  name: string;
  devicePath: string;
}

interface NodeStatus {
  capacity?: Record<string, string>;
  allocatable?: Record<string, string>;
  phase?: string;
  conditions?: NodeCondition[];
  addresses?: NodeAddress[];
  daemonEndpoints?: NodeDaemonEndpoints;
  nodeInfo?: NodeSystemInfo;
  images?: ContainerImage[];
  volumesInUse?: string[];
  volumesAttached?: AttachedVolume[];
  config?: NodeConfigStatus;
}

export interface Node extends Resource<NodeSpec, NodeStatus> {}

export interface NodeList extends ResourceList<Node> {}
