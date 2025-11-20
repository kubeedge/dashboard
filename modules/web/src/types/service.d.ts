import { Condition, DataList, Resource, ResourceList } from "./common";

interface ServicePort {
  port: number;
  targetPort?: number | string;
  protocol?: string;
  name?: string;
  nodePort?: number;
  appProtocol?: string;
}

interface ClientIPConfig {
  timeoutSeconds?: number;
}

interface SessionAffinityConfig {
  clientIP?: ClientIPConfig;
}

interface ServiceCondition extends Condition {
  observedGeneration: number;
}

interface PortStatus {
  port: number;
  protocol: string;
  error?: string;
}

interface LoadBalancerIngress {
  hostname?: string;
  ip?: string;
  ipMode?: string;
  ports?: PortStatus[];
}

interface LoadBalancerStatus {
  ingress?: LoadBalancerIngress[];
}

interface ServiceSpec {
  selector?: Record<string, string>;
  ports?: ServicePort[];
  type?: string;
  ipFamilies?: string[];
  ipFamilyPolicy?: string;
  clusterIP?: string;
  clusterIPs?: string[];
  externalIPs?: string[];
  sessionAffinity?: string;
  loadBalancerIP?: string;
  loadBalancerSourceRanges?: string[];
  loadBalancerClass?: string;
  externalName?: string;
  externalTrafficPolicy?: string;
  internalTrafficPolicy?: string;
  healthCheckNodePort?: number;
  publishNotReadyAddresses?: boolean;
  sessionAffinityConfig?: SessionAffinityConfig;
  allocateLoadBalancerNodePorts?: boolean;
}

interface ServiceStatus {
  conditions?: ServiceCondition[];
  loadBalancer?: LoadBalancerStatus;
}

export interface Service extends Resource<ServiceSpec, ServiceStatus> {}

export interface ServiceList extends ResourceList<Service> {}

export interface ConciseService {
  age?: string;
  clusterIP?: string;
  creationTimestamp?: string;
  externalIP?: string;
  labels?: Record<string, string>;
  name?: string;
  namespace?: string;
  ports?: string[];
  type?: string;
}

export interface ConciseServiceList extends DataList<ConciseService> {}
