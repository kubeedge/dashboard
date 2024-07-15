import request from "@/utils/request";
import type { NodeList } from "@/models/node";

export async function listNodes(options?: Record<string, any>) {
  return request<NodeList>("/api/v1/nodes", {
    method: "GET",
    ...(options || {}),
  });
}
