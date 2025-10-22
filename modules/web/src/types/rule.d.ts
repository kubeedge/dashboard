import type { ObjectMeta, ResourceList, TypeMeta } from "./common";

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

export interface RuleList extends ResourceList<Rule> {
  total?: number;
  page?: number;
  pageSize?: number;
  hasNext?: boolean;
  sort?: string;
  order?: string;
}
