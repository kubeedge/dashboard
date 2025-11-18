import type { DataList, ObjectMeta, ResourceList, TypeMeta } from "./common";

interface RuleSpec {
  source: string;
  sourceResource: Record<string, string>;
  target: string;
  targetResource: Record<string, string>;
}

interface RuleStatus {
  errors: string[];
  failMessage: number;
  successMessage: number;
}

export interface Rule extends TypeMeta {
  metadata?: ObjectMeta;
  spec: RuleSpec;
  status?: RuleStatus;
}

export interface RuleList extends ResourceList<Rule> {}

export interface ConciseRule {
  creationTimestamp: string;
  labels?: Record<string, string>;
  name: string;
  namespace: string;
  source: string;
  sourceResource: Record<string, string>;
  target: string;
  targetResource: Record<string, string>;
}

export interface ConciseRuleList extends DataList<ConciseRule> {}
