import type {
  LocalObjectReference,
  ObjectFieldSelector,
  ObjectMeta,
  ResourceFieldSelector,
} from './common';
import type { PersistentVolumeClaimSpec } from './persistentVolumeClaim';

interface PersistentVolumeClaimVolumeSource {
  claimName: string;
  readOnly?: boolean;
}

interface KeyToPath {
  key: string;
  path: string;
  mode?: number;
}

interface VolumeSource {
  defaultMode?: number;
}

interface ConfigMapVolumeSource extends VolumeSource {
  name?: string;
  optional?: boolean;
  items?: KeyToPath[];
}

interface SecretVolumeSource extends VolumeSource {
  secretName?: string;
  optional?: boolean;
  items?: KeyToPath[];
}

interface DownwardAPIVolumeFile {
  path: string;
  fieldRef?: ObjectFieldSelector;
  mode?: number;
  resourceFieldRef?: ResourceFieldSelector;
}

interface DownwardAPIVolumeSource extends VolumeSource {
  items?: DownwardAPIVolumeFile[];
}

interface ConfigMapProjection {
  name?: string;
  optional?: boolean;
  items?: KeyToPath[];
}

interface DownwardAPIProjection {
  items?: DownwardAPIVolumeFile;
}

interface SecretProjection {
  name?: string;
  optional?: boolean;
  items?: KeyToPath[];
}

interface ServiceAccountTokenProjection {
  path: string;
  audience?: string;
  expirationSeconds?: number;
}

interface VolumeProjection {
  configMap?: ConfigMapProjection;
  downwardAPI?: DownwardAPIProjection[];
  secret?: SecretProjection;
  serviceAccountToken?: ServiceAccountTokenProjection;
}

interface ProjectedVolumeSource extends VolumeSource {
  sources?: VolumeProjection[];
}

interface EmptyDirVolumeSource {
  medium?: string;
  sizeLimit?: string;
}

interface HostPathVolumeSource {
  path: string;
  type?: string;
}

interface AWSElasticBlockStoreVolumeSource {
  volumeID: string;
  fsType?: string;
  partition?: number;
  readOnly?: boolean;
}

interface AzureDiskVolumeSource {
  diskName: string;
  diskURI: string;
  cachingMode?: string;
  fsType?: string;
  kind?: string;
  readOnly?: boolean;
}

interface AzureFileVolumeSource {
  secretName: string;
  shareName: string;
  readOnly?: boolean;
}

interface CephFSVolumeSource {
  monitors: string[];
  path?: string;
  readOnly?: boolean;
  secretFile?: string;
  secretRef?: LocalObjectReference;
  user?: string;
}

interface CinderVolumeSource {
  volumeID: string;
  fsType?: string;
  readOnly?: boolean;
  secretRef?: LocalObjectReference;
}

interface CSIVolumeSource {
  driver: string;
  fsType?: string;
  nodePublishSecretRef?: LocalObjectReference;
  readOnly?: boolean;
  volumeAttributes?: Record<string, string>;
}

interface PersistentVolumeClaimTemplate {
  spec: PersistentVolumeClaimSpec;
  metadata?: ObjectMeta;
}

interface EphemeralVolumeSource {
  volumeClaimTemplate?: PersistentVolumeClaimTemplate;
}

interface FCVolumeSource {
  fsType?: string;
  lun?: number;
  readOnly?: boolean;
  targetWWNs?: string[];
  wwids?: string[];
}

interface FlexVolumeSource {
  driver: string;
  fsType?: string;
  options?: Record<string, string>;
  readOnly?: boolean;
  secretRef?: LocalObjectReference;
}

interface FlockerVolumeSource {
  datasetName?: string;
  datasetUUID?: string;
}

interface GCEPersistentDiskVolumeSource {
  pdName: string;
  fsType?: string;
  partition?: number;
  readOnly?: boolean;
}

interface GlusterfsVolumeSource {
  endpoints: string;
  path: string;
  readOnly?: boolean;
}

interface ISCSIVolumeSource {
  iqn: string;
  lun: number;
  targetPortal: string;
  chapAuthDiscovery?: boolean;
  chapAuthSession?: boolean;
  fsType?: string;
  initiatorName?: string;
  iscsiInterface?: string;
  portals?: string[];
  readOnly?: boolean;
  secretRef?: LocalObjectReference;
}

interface NFSVolumeSource {
  path: string;
  server: string;
  readOnly?: boolean;
}

interface PhotonPersistentDiskVolumeSource {
  pdID: string;
  fsType?: string;
}

interface PortworxVolumeSource {
  volumeID: string;
  fsType?: string;
  readOnly?: boolean;
}

interface QuobyteVolumeSource {
  registry: string;
  volume: string;
  group?: string;
  readOnly?: boolean;
  tenant?: string;
  user?: string;
}

interface RBDVolumeSource {
  image?: string;
  monitors: string[];
  fsType?: string;
  keyring?: string;
  pool?: string;
  readOnly?: boolean;
  secretRef?: LocalObjectReference;
  user?: string;
}

interface ScaleIOVolumeSource {
  gateway: string;
  secretRef: LocalObjectReference;
  system: string;
  fsType?: string;
  protectionDomain?: string;
  readOnly?: boolean;
  sslEnabled?: boolean;
  storageMode?: string;
  storagePool?: string;
  volumeName?: string;
}

interface StorageOSVolumeSource {
  fsType?: string;
  readOnly?: boolean;
  secretRef?: LocalObjectReference;
  volumeName?: string;
  volumeNamespace?: string;
}

interface VsphereVirtualDiskVolumeSource {
  volumePath: string;
  fsType?: string;
  storagePolicyID?: string;
  storagePolicyName?: string;
}

interface GitRepoVolumeSource {
  repository: string;
  directory?: string;
  revision?: string;
}

export interface Volume {
  name: string;
  persistentVolumeClaim?: PersistentVolumeClaimVolumeSource;
  configMap?: ConfigMapVolumeSource;
  secret?: SecretVolumeSource;
  downwardAPI?: DownwardAPIVolumeSource;
  projected?: ProjectedVolumeSource;
  emptyDir?: EmptyDirVolumeSource;
  hostPath?: HostPathVolumeSource;
  awsElasticBlockStore?: AWSElasticBlockStoreVolumeSource;
  azureDisk?: AzureDiskVolumeSource;
  azureFile?: AzureFileVolumeSource;
  cephfs?: CephFSVolumeSource;
  cinder?: CinderVolumeSource;
  csi?: CSIVolumeSource;
  ephemeral?: EphemeralVolumeSource;
  fc?: FCVolumeSource;
  flexVolume?: FlexVolumeSource;
  flocker?: FlockerVolumeSource;
  gcePersistentDisk?: GCEPersistentDiskVolumeSource;
  glusterfs?: GlusterfsVolumeSource;
  iscsi?: ISCSIVolumeSource;
  nfs?: NFSVolumeSource;
  photonPersistentDisk?: PhotonPersistentDiskVolumeSource;
  portworxVolume?: PortworxVolumeSource;
  quobyte?: QuobyteVolumeSource;
  rbd?: RBDVolumeSource;
  scaleIO?: ScaleIOVolumeSource;
  storageos?: StorageOSVolumeSource;
  vsphereVolume?: VsphereVirtualDiskVolumeSource;

  /**
   * @deprecated
   */
  gitRepo?: GitRepoVolumeSource;
}
