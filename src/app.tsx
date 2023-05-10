import type { Settings as LayoutSettings } from "@ant-design/pro-layout";
import { PageLoading, SettingDrawer } from "@ant-design/pro-layout";
import type { RunTimeLayoutConfig } from "umi";
import { history } from "umi";
import RightContent from "@/components/RightContent";
import defaultSettings from "../config/defaultSettings";
import { login } from "@/services/login";

const loginPath = "/user/login";

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  isLogin?: boolean;
  loading?: boolean;
  namespace?: string;
}> {
  const response = await login({});
  if (response.apiVersion) {
    return {
      isLogin: true,
      settings: defaultSettings,
      namespace: "",
    };
  }
  return {
    settings: defaultSettings,
    namespace: "",
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    rightContentRender: () => <RightContent />,
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.isLogin && location.pathname !== loginPath) {
        history.push(`${loginPath}?redirect=${location.pathname}`);
      }
      if (location.pathname === loginPath && initialState?.isLogin) {
        history.push("/");
      }
    },
    locale: "en-US",
    menuHeaderRender: undefined,
    // menu: {
    //   // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
    //   params: {
    //     userId: initialState?.currentUser?.userId,
    //   },
    //   request: async () => {
    //     if (!initialState?.currentUser?.userId) {
    //       return [];
    //     }
    //     // initialState.currentUser 中包含了所有用户信息
    //     const menus = await getRoutersInfo();
    //     setInitialState((preInitialState) => ({
    //       ...preInitialState,
    //       menus,
    //     }));
    //     return menus;
    //   },
    // },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    // childrenRender: (children, props) => {
    //   return (
    //     <div>
    //       {children}
    //       {!props.location?.pathname?.includes("/login") && (
    //         <SettingDrawer
    //           enableDarkTheme
    //           settings={initialState?.settings}
    //           onSettingChange={(settings) => {
    //             setInitialState((preInitialState) => ({
    //               ...preInitialState,
    //               settings,
    //             }));
    //           }}
    //         />
    //       )}
    //     </div>
    //   );
    // },
    ...initialState?.settings,
  };
};
