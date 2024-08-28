import type { Resource, ResourceList } from './common';

interface NodeStatus {
  nodeName: string;
  readyStatus: string;
  selectionStatus: string;
  selectionStatusReason?: string;
}

interface NodeGroupSpec {
  matchLabels?: Record<string, string>;
  nodes?: string[];
}

interface NodeGroupStatus {
  nodeStatuses?: NodeStatus[];
}

export interface NodeGroup extends Resource<NodeGroupSpec, NodeGroupStatus> {}

export interface NodeGroupList extends ResourceList<NodeGroup> {}
