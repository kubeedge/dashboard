import type {
  Condition,
  LabelSelector,
  LocalObjectReference,
  NodeSelectorRequirement,
  ObjectFieldSelector,
  Resource,
  ResourceFieldSelector,
  ResourceList,
} from './common';
import type { Volume } from './volume';

interface ContainerPort {
  containerPort: number;
  hostIP?: string;
  hostPort?: number;
  name?: string;
  protocol?: string;
}

interface ConfigMapKeySelector {
  key: string;
  name?: string;
  optional?: boolean;
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
  value?: string;
  valueFrom: EnvVarSource;
}

interface EnvSource {
  name?: string;
  optional?: boolean;
}

interface ConfigMapEnvSource extends EnvSource {}

interface SecretEnvSource extends EnvSource {}

interface EnvFromSource {
  configMapRef?: ConfigMapEnvSource;
  prefix?: string;
  secretRef?: SecretEnvSource;
}

interface VolumeMount {
  mountPath: string;
  name: string;
  mountPropagation?: string;
  readOnly?: boolean;
  subPath?: string;
  subPathExpr?: string;
}

interface VolumeDevice {
  devicePath: string;
  name: string;
}

interface ResourceClaim {
  name: string;
}

interface ResourceRequirements {
  claims?: ResourceClaim[];
  limits?: Record<string, string>;
  requests?: Record<string, string>;
}

interface ExecAction {
  command?: string[]
}

interface ContainerResizePolicy {
  resourceName: string;
  restartPolicy: string;
}

interface RequestAction {
  port: number | string;
  host?: string;
}

interface HTTPHeader {
  name: string;
  value: string;
}

interface HTTPGetAction extends RequestAction {
  httpHeaders?: HTTPHeader[];
  path?: string;
  scheme?: string;
}

interface TCPSocketAction extends RequestAction {}

interface LifecycleHandler {
  exec?: ExecAction;
  httpGet?: HTTPGetAction;
  tcpSocket?: TCPSocketAction;
}

interface Lifecycle {
  postStart?: LifecycleHandler;
  preStop?: LifecycleHandler;
}

interface GRPCAction {
  port: number;
  service?: string;
}

interface Probe {
  exec?: ExecAction;
  httpGet?: HTTPGetAction;
  tcpSocket?: TCPSocketAction;
  initialDelaySeconds?: number;
  terminationGracePeriodSeconds?: number;
  periodSeconds?: number;
  timeoutSeconds?: number;
  failureThreshold?: number;
  successThreshold?: number;
  grpc?: GRPCAction;
}

interface Capabilities {
  add?: string[];
  drop?: string[];
}

interface SeccompProfile {
  type: string;
  localhostProfile?: string;
}

interface SELinuxOptions {
  level?: string;
  role?: string;
  type?: string;
  user?: string;
}

interface WindowsSecurityContextOptions {
  gmsaCredentialSpec?: string;
  gmsaCredentialSpecName?: string;
  hostProcess?: boolean;
  runAsUserName?: string;
}

interface SecurityContext {
  runAsUser?: number;
  runAsNonRoot?: boolean;
  runAsGroup?: number;
  readOnlyRootFilesystem?: boolean;
  procMount?: string;
  privileged?: boolean;
  allowPrivilegeEscalation?: boolean;
  capabilities?: Capabilities;
  seccompProfile?: SeccompProfile;
  seLinuxOptions?: SELinuxOptions;
  windowsOptions?: WindowsSecurityContextOptions;
}

export interface Container {
  name: string;
  image?: string;
  imagePullPolicy: string;
  command?: string[];
  args?: string[];
  workingDir?: string;
  ports?: ContainerPort[];
  env?: EnvVar[];
  envFrom?: EnvFromSource[];
  volumeMounts?: VolumeMount[];
  volumeDevices?: VolumeDevice[];
  resources?: ResourceRequirements;
  resizePolicy?: ContainerResizePolicy[];
  lifecycle?: Lifecycle;
  terminationMessagePath?: string;
  terminationMessagePolicy?: string;
  livenessProbe?: Probe;
  readinessProbe?: Probe;
  startupProbe?: Probe;
  restartPolicy?: string;
  securityContext?: SecurityContext;
  stdin?: boolean;
  stdinOnce?: boolean;
  tty?: boolean;
}

interface EphemeralContainer extends Container {
  targetContainerName?: string;
}

interface PodOS {
  name: string;
}

interface NodeSelectorTerm {
  matchExpressions?: NodeSelectorRequirement[];
  matchFields?: NodeSelectorRequirement[];
}

interface PreferredSchedulingTerm {
  preference: NodeSelectorTerm;
  weight: number;
}

interface NodeSelector {
  nodeSelectorTerms: NodeSelectorTerm[];
}

interface NodeAffinity {
  preferredDuringSchedulingIgnoredDuringExecution?: PreferredSchedulingTerm[];
  requiredDuringSchedulingIgnoredDuringExecution?: NodeSelector;
}

interface PodAffinityTerm {
  topologyKey: string;
  labelSelector?: LabelSelector;
  namespaceSelector?: LabelSelector;
  namespaces?: string[];
}

interface WeightedPodAffinityTerm {
  podAffinityTerm: PodAffinityTerm;
  weight: number;
}

interface PodAffinity {
  preferredDuringSchedulingIgnoredDuringExecution?: WeightedPodAffinityTerm[];
  requiredDuringSchedulingIgnoredDuringExecution?: PodAffinityTerm[];
}

interface PodAntiAffinity {
  preferredDuringSchedulingIgnoredDuringExecution?: WeightedPodAffinityTerm[];
  requiredDuringSchedulingIgnoredDuringExecution?: PodAffinityTerm[];
}

interface Affinity {
  nodeAffinity?: NodeAffinity;
  podAffinity?: PodAffinity;
  podAntiAffinity?: PodAntiAffinity;
}

interface Toleration {
  key?: string;
  operator?: string;
  value?: string;
  effect?: string;
  tolerationSeconds?: number;
}

interface TopologySpreadConstraint {
  maxSkew: number;
  topologyKey: string;
  whenUnsatisfiable: string;
  labelSelector?: LabelSelector;
  matchLabelKeys?: string[];
  minDomains?: number;
  nodeAffinityPolicy?: string;
  nodeTaintsPolicy?: string;
}

interface PodReadinessGate {
  conditionType: string;
}

interface HostAlias {
  hostnames?: string[];
  ip?: string;
}

interface PodDNSConfigOption {
  name: string;
  value?: string;
}

interface PodDNSConfig {
  nameservers?: string[];
  options?: PodDNSConfigOption[];
  searches?: string[];
}

interface Sysctl {
  name: string;
  value: string;
}

interface PodSecurityContext {
  runAsUser?: number;
  runAsNonRoot?: boolean;
  runAsGroup?: number;
  supplementalGroups?: number;
  fsGroup?: number;
  fsGroupChangePolicy?: string;
  seccompProfile?: SeccompProfile;
  seLinuxOptions?: SELinuxOptions;
  sysctls?: Sysctl[];
  windowsOptions?: WindowsSecurityContextOptions;
}

interface ClaimSource {
  resourceClaimName?: string;
  resourceClaimTemplateName?: string;
}

interface PodResourceClaim {
  name: string;
  source?: ClaimSource;
}

interface PodSchedulingGate {
  name: string;
}

interface HostIP {
  ip?: string;
}

interface PodIP extends HostIP {}

interface PodCondition extends Condition {
  lastProbeTime?: string;
}

interface ContainerStatus {
  containerID?: string;
  image?: string;
  imageID?: string;
  lastState?: string;
  name?: string;
  ready?: boolean;
  restartCount?: number;
  started?: boolean;
  state?: string;
}

interface PodResourceClaimStatus {
  name: string;
  resourceClaimName?: string;
}

export interface PodSpec {
  volumes?: Volume[];
  initContainers?: Container[];
  containers: Container[];
  ephemeralContainers?: EphemeralContainer[];
  restartPolicy?: string;
  terminationGracePeriodSeconds?: number;
  activeDeadlineSeconds?: number;
  dnsPolicy?: string;
  nodeSelector?: Record<string, string>;
  serviceAccountName?: string;
  automountServiceAccountToken?: boolean;
  nodeName?: string;
  securityContext?: PodSecurityContext;
  imagePullSecrets?: LocalObjectReference[];
  hostname?: string;
  subdomain?: string;
  setHostnameAsFQDN?: boolean;
  affinity?: Affinity;
  schedulerName?: string;
  tolerations?: Toleration[];
  hostAliases?: HostAlias[];
  priorityClassName?: string;
  priority?: number;
  preemptionPolicy?: string;
  dnsConfig?: PodDNSConfig;
  readinessGates?: PodReadinessGate[];
  runtimeClassName?: string;
  overhead?: Record<string, string>;
  enableServiceLinks?: boolean;
  topologySpreadConstraints?: TopologySpreadConstraint[];
  os?: PodOS;
  schedulingGates?: PodSchedulingGate[];
  resourceClaims?: PodResourceClaim[];

  // hostNetwork?: boolean;
  // hostPID?: boolean;
  // hostIPC?: boolean;
  // shareProcessNamespace?: boolean;
  // hostUsers?: boolean;

  /**
   * @deprecated
   */
  serviceAccount?: string;
}

interface PodStatus {
  nominatedNodeName: string;
  hostIP?: string;
  hostIPs?: HostIP[];
  startTime?: string;
  phase?: string;
  message?: string;
  reason?: string;
  podIPs?: PodIP[];
  conditions?: PodCondition[];
  qosClass?: string;
  initContainerStatuses?: ContainerStatus[];
  containerStatuses?: ContainerStatus[];
  ephemeralContainerStatuses?: ContainerStatus[];
  resourceClaimStatuses?: PodResourceClaimStatus[];
  resize?: string;
}

export interface Pod extends Resource<PodSpec, PodStatus> {}

export interface PodList extends ResourceList<Pod> {}
