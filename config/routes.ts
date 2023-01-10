/* *
 *
 * @author WSQ
 * @datetime  2022/12/12
 * 
 * */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/login',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard',
        redirect: '/dashboard/analysis',
      },
      {
        name: 'analysis',
        icon: 'smile',
        path: '/dashboard/analysis',
        component: './dashboard/analysis',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.dashboard.analysis',
        layout: false // 设置导航栏隐藏
      },
      {
        name: 'monitor',
        icon: 'smile',
        path: '/dashboard/monitor',
        component: './dashboard/monitor',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.dashboard.monitor'
      },
      {
        name: 'workplace',
        icon: 'smile',
        path: '/dashboard/workplace',
        component: './dashboard/workplace',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.dashboard.workplace'
      },
    ],
  },
  {
    name: 'account',
    icon: 'user',
    path: '/account',
    // component: '@/layouts/TabsLayout',  // 显示tabs
    routes: [
      {
        path: '/account',
        redirect: '/account/center',
      },
      {
        name: 'center',
        icon: 'smile',
        path: '/account/center',
        component: './account/center',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.account.center'
      },
      {
        name: 'settings',
        icon: 'smile',
        path: '/account/settings',
        component: './account/settings',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: true,
        title: 'menu.account.settings'
      },
    ],
  },
  {
    name: 'edgeResource',
    icon: 'BugOutlined',
    path: '/edgeResource',
    routes: [
      {
        path: '/',
        redirect: '/edgeResource/nodes',
      },
      {
        name: 'nodes',
        icon: 'PartitionOutlined',
        path: '/edgeResource/nodes',
        component: 'edgeResource/nodes/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.nodes'
      },
    ],
  },
  {
    name: 'edgeApp',
    icon: 'BugOutlined',
    path: '/edgeApp',
    routes: [
      {
        path: '/',
        redirect: '/edgeApp/deployment',
      },
      {
        name: 'deployment',
        icon: 'PartitionOutlined',
        path: '/edgeApp/deployment',
        component: 'edgeApp/deployment/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.nodes'
      },
      {
        name: 'configmap',
        icon: 'PartitionOutlined',
        path: '/edgeApp/configmap',
        component: 'edgeApp/configmap/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.nodes'
      },
      {
        name: 'secret',
        icon: 'PartitionOutlined',
        path: '/edgeApp/secret',
        component: 'edgeApp/secret/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.nodes'
      },
    ],
  },
  {
    name: 'device',
    icon: 'BugOutlined',
    path: '/device',
    routes: [
      {
        name: 'devicemodels',
        icon: 'PartitionOutlined',
        path: '/device/devicemodels',
        component: 'device/devicemodels/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.nodes'
      },
      {
        name: 'devices',
        icon: 'PartitionOutlined',
        path: '/device/devices',
        component: 'device/devices/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.deployments',
      },
      {
        name: 'mapper',
        icon: 'PartitionOutlined',
        path: '/device/mapper',
        component: 'device/mapper/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.deployments',
      },
    ],
  },
  {
    name: 'edgeCloudMessage',
    icon: 'BugOutlined',
    path: '/edgeCloudMessage',
    routes: [
      {
        name: 'ruleEndpoint',
        icon: 'PartitionOutlined',
        path: '/edgeCloudMessage/ruleEndpoint',
        component: 'edgeCloudMessage/ruleEndpoint/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.nodes'
      },
      {
        name: 'ruleRoute',
        icon: 'PartitionOutlined',
        path: '/edgeCloudMessage/ruleRoute',
        component: 'edgeCloudMessage/ruleRoute/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.deployments',
      },
    ],
  },
  {
    name: 'serviceGrid',
    icon: 'BugOutlined',
    path: '/serviceGrid',
    routes: [
      {
        name: 'services',
        icon: 'PartitionOutlined',
        path: '/serviceGrid/services',
        component: 'serviceGrid/services/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.nodes'
      },
    ],
  },
  {
    name: 'k8spolicy',
    icon: 'BugOutlined',
    path: '/k8spolicy',
    // component: '@/layouts/TabsLayout',
    routes: [
      {
        path: '/',
        redirect: '/k8spolicy/serviceaccounts',
      },
      {
        name: 'serviceaccounts',
        icon: 'PartitionOutlined',
        path: '/k8spolicy/serviceaccounts',
        component: 'k8spolicy/serviceaccounts/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.nodes'
      },
      {
        name: 'roles',
        icon: 'PartitionOutlined',
        path: '/k8spolicy/roles',
        component: 'k8spolicy/roles/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.deployments'
      },
      {
        name: 'rolebindings',
        icon: 'PartitionOutlined',
        path: '/k8spolicy/rolebindings',
        component: 'k8spolicy/rolebindings/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.deployments'
      },
      {
        name: 'clusterroles',
        icon: 'PartitionOutlined',
        path: '/k8spolicy/clusterroles',
        component: 'k8spolicy/clusterroles/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.deployments'
      },
      {
        name: 'clusterrolebindings',
        icon: 'PartitionOutlined',
        path: '/k8spolicy/clusterrolebindings',
        component: 'k8spolicy/clusterrolebindings/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.deployments'
      },
    ],
  },
  {
    name: 'customize',
    icon: 'BugOutlined',
    path: '/customize',
    routes: [
      {
        name: 'crd',
        icon: 'PartitionOutlined',
        path: '/customize/crd',
        component: 'customize/crd/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.nodes'
      },
      {
        name: 'edgeApplication',
        icon: 'PartitionOutlined',
        path: '/customize/edgeApplication',
        component: 'customize/edgeApplication/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.nodes'
      },
      {
        name: 'nodeGroup',
        icon: 'PartitionOutlined',
        path: '/customize/nodeGroup',
        component: 'customize/nodeGroup/index',
        access: 'authorize',
        wrappers: ['@/components/KeepAlive'],
        KeepAlive: false,
        title: 'menu.title.nodes'
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    component: './404',
  },
];
