import { Settings as LayoutSettings } from "@ant-design/pro-layout";

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  tabsLayout?: boolean;
  apiBasePath?: string;
} = {
  navTheme: "light",
  headerTheme: "light",
  primaryColor: "#2F54EB",
  layout: "mix",
  splitMenus: false,
  contentWidth: "Fluid",
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: "kubeedge",
  pwa: false,
  logo: "/favicon.png",
  iconfontUrl: "",
  tabsLayout: true,
  apiBasePath: "/api",
  menu: {
    locale: false,
  },
};

export default Settings;
