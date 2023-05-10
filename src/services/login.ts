import request from "@/utils/request";

export async function login(
  data: API.LoginParams,
  options?: Record<string, any>
) {
  return request<API.LoginResult>("/v1/nodes", {
    method: "GET",
    headers: {
      Authorization: data.token,
    },
    ...(options || {}),
  });
}
