import { Node } from "@/types/node";
import { Pod } from "@/types/pod";

export const getNodeStatus = (node?: Node) => {
  return node?.status?.conditions?.find(condition => condition.type === 'Ready')?.status === 'True' ? 'Ready' : 'NotReady';
}

export const getPodStatus = (pod?: Pod) => {
  return pod?.status?.conditions?.find((cond) => cond.type === 'Ready')?.status === 'True' ? 'Ready' : 'NotReady'
}
