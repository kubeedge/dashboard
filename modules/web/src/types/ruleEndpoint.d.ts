import { DataList, ObjectMeta, ResourceList, TypeMeta } from "./common";

interface RuleEndpointSpec {
  properties?: Record<string, string>;
  ruleEndpointType?: string;
}

export interface RuleEndpoint extends TypeMeta {
  metadata?: ObjectMeta;
  spec?: RuleEndpointSpec;
}

export interface RuleEndpointList extends ResourceList<RuleEndpoint> {}

export interface ConciseRuleEndpoint {
  name: string;
  namespace: string;
  ruleEndpointType: string;
  properties?: Record<string, string>;
  creationTimestamp: string;
}

export interface ConciseRuleEndpointList extends DataList<ConciseRuleEndpoint> {}
