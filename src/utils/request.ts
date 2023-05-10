/* eslint-disable @typescript-eslint/dot-notation */
/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import { extend } from "umi-request";
import { history } from "umi";
import { message, notification } from "antd";
import { LoginPageUrl } from "./utils";
import defaultSettings from "../../config/defaultSettings";

// const codeMessage: Record<number, string> = {
//   10000: "系统未知错误，请反馈给管理员",
//   200: "服务器成功返回请求的数据。",
//   201: "新建或修改数据成功。",
//   202: "一个请求已经进入后台排队（异步任务）。",
//   204: "删除数据成功。",
//   400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
//   401: "用户没有权限（令牌、用户名、密码错误）。",
//   403: "用户访问需要授权，请登录admin账号。",
//   404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
//   406: "请求的格式不可得。",
//   410: "请求的资源被永久删除，且不会再得到的。",
//   422: "当创建一个对象时，发生一个验证错误。",
//   500: "服务器发生错误，请检查服务器。",
//   502: "网关错误。",
//   503: "服务不可用，服务器暂时过载或维护。",
//   504: "网关超时。",
// };

const codeMessage: Record<number, string> = {
  10000: "Unknown system error, please provide feedback to the administrator",
  200: "The server successfully returned the requested data.",
  201: "Successfully created or modified data.",
  202: "A request has entered the backend queue (asynchronous task).",
  204: "Successfully deleted data.",
  400: "There was an error in the request sent, and the server did not perform any new or modified data operations.",
  401: "The user does not have permission (incorrect token, username, password).",
  403: "User access requires authorization, please log in to the admin account.",
  404: "The request was made for a non-existent record and the server did not take any action.",
  406: "The requested format is not available.",
  410: "The requested resource has been permanently deleted and will no longer be obtained.",
  422: "When creating an object, a validation error occurred.",
  500: "The server encountered an error. Please check the server.",
  502: "Gateway error.",
  503: "Service unavailable, server temporarily overloaded or under maintenance.",
  504: "Gateway timeout.",
};

/** 异常处理程序 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description:
        "Your network has encountered an exception and cannot connect to the server",
      message: "Network Error",
    });
  }
  return response;
};

function createClient() {
  /** 配置request请求时的默认参数 */
  return extend({
    errorHandler, // 默认错误处理
    credentials: "include", // 默认请求是否带上cookie
    prefix: defaultSettings.apiBasePath,
  });
}

const request = createClient();

request.interceptors.request.use((url: string, options: any) => {
  const headers = options.headers ? options.headers : [];
  if (headers.Authorization) {
    localStorage.setItem("token", headers.Authorization);
  } else {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = token;
    }
  }
  return {
    url,
    option: { ...options, headers },
  };
});

// 响应拦截器
request.interceptors.response.use(async (response: Response) => {
  const { status } = response;
  if (status === 401 || status === 403) {
    const msg = codeMessage[status] || codeMessage[10000];
    message.warn(`${status} ${msg}`);
  }
  return response;
});

export default request;
