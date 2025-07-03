import { ObjectMeta, ResourceList, TypeMeta } from "./common";

interface RuleEndpointSpec {
  properties?: Record<string, string>;
  ruleEndpointType?: string;
}

export interface RuleEndpoint extends TypeMeta {
  metadata?: ObjectMeta;
  spec?: RuleEndpointSpec;
}

export interface RuleEndpointList extends ResourceList<RuleEndpoint> {}
