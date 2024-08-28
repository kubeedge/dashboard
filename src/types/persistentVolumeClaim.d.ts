import { LabelSelector, TypedLocalObjectReference } from "./common";

interface ResourceClaim {
  name: string;
}

interface ResourceRequirements {
  claims?: ResourceClaim[];
  limits?: Record<string, string>;
  requests?: Record<string, string>;
}

export interface PersistentVolumeClaimSpec {
  accessModes?: string[];
  selector?: LabelSelector;
  resources?: ResourceRequirements;
  volumeName?: string;
  storageClassName?: string;
  volumeMode?: string;
  dataSource?: TypedLocalObjectReference;
  dataSourceRef?: TypedLocalObjectReference;
}
