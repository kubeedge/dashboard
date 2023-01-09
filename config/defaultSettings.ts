import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  tabsLayout?: boolean;
  apiBasePath?: string;
} = {
  navTheme: 'light',
  headerTheme: 'light',
  primaryColor: '#2F54EB',
  layout: 'mix',
  splitMenus: false,
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: 'kubeedge',
  pwa: false,
  logo: 'https://img2.baidu.com/it/u=911759519,344557266&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=316',
  iconfontUrl: '',
  tabsLayout: true,  
  apiBasePath: '/api',
  menu: {
    locale: false
  }
};

export default Settings;