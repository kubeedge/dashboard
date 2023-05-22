export default [
  {
    path: "/user",
    layout: false,
    routes: [
      {
        path: "/user",
        redirect: "/user/login",
      },
      {
        path: "/user/login",
        layout: false,
        name: "login",
        component: "./user/login",
      },
      {
        component: "404",
      },
    ],
  },
  {
    path: "/home",
    name: "Home",
    icon: "dashboard",
    component: "./dashboard/analysis",
    wrappers: ["@/components/KeepAlive"],
    KeepAlive: true,
    title: "menu.dashboard.analysis",
  },
  {
    name: "Node",
    icon: "ClusterOutlined",
    path: "/node",
    routes: [
      {
        path: "/",
        redirect: "/node/nodes",
      },
      {
        name: "nodes",
        icon: "PartitionOutlined",
        path: "/node/nodes",
        component: "edgeResource/nodes/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "nodeGroup",
        icon: "PartitionOutlined",
        path: "/node/nodeGroup",
        component: "customize/nodeGroup/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
    ],
  },
  {
    name: "Application",
    icon: "AppstoreOutlined",
    path: "/application",
    routes: [
      {
        path: "/",
        redirect: "/application/deployment",
      },
      {
        name: "deployment",
        icon: "PartitionOutlined",
        path: "/application/deployment",
        component: "edgeResource/deployment/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "edgeApplication",
        icon: "PartitionOutlined",
        path: "/application/edgeApplication",
        component: "customize/edgeApplication/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
    ],
  },
  {
    name: "Config",
    icon: "SettingOutlined",
    path: "/config",
    routes: [
      {
        path: "/",
        redirect: "/config/configmap",
      },
      {
        name: "configmap",
        icon: "PartitionOutlined",
        path: "/config/configmap",
        component: "edgeResource/configmap/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "secret",
        icon: "PartitionOutlined",
        path: "/config/secret",
        component: "edgeResource/secret/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
    ],
  },
  {
    name: "Device",
    icon: "DesktopOutlined",
    path: "/device",
    routes: [
      {
        name: "devicemodels",
        icon: "PartitionOutlined",
        path: "/device/devicemodels",
        // component: "device/devicemodels/index",
        component: "404",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "devices",
        icon: "PartitionOutlined",
        path: "/device/devices",
        // component: "device/devices/index",
        component: "404",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.deployments",
      },
      {
        name: "mapper",
        icon: "PartitionOutlined",
        path: "/device/mapper",
        // component: "device/mapper/index",
        component: "404",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.deployments",
      },
    ],
  },
  {
    name: "Edge-Cloud Message",
    icon: "PullRequestOutlined",
    path: "/edgeCloudMessage",
    routes: [
      {
        name: "ruleEndpoint",
        icon: "PartitionOutlined",
        path: "/edgeCloudMessage/ruleEndpoint",
        component: "edgeCloudMessage/ruleEndpoint/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "rule",
        icon: "PartitionOutlined",
        path: "/edgeCloudMessage/rule",
        component: "edgeCloudMessage/rule/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.deployments",
      },
    ],
  },
  {
    name: "ServiceGrid",
    icon: "NumberOutlined",
    path: "/serviceGrid",
    routes: [
      {
        name: "services",
        icon: "PartitionOutlined",
        path: "/serviceGrid/services",
        component: "serviceGrid/services/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
    ],
  },
  {
    name: "Kubernetes Policy",
    icon: "KeyOutlined",
    path: "/k8spolicy",
    // component: '@/layouts/TabsLayout',
    routes: [
      {
        path: "/",
        redirect: "/k8spolicy/serviceaccounts",
      },
      {
        name: "serviceaccounts",
        icon: "PartitionOutlined",
        path: "/k8spolicy/serviceaccounts",
        component: "k8spolicy/serviceaccounts/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "roles",
        icon: "PartitionOutlined",
        path: "/k8spolicy/roles",
        component: "k8spolicy/roles/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.deployments",
      },
      {
        name: "rolebindings",
        icon: "PartitionOutlined",
        path: "/k8spolicy/rolebindings",
        component: "k8spolicy/rolebindings/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.deployments",
      },
      {
        name: "clusterroles",
        icon: "PartitionOutlined",
        path: "/k8spolicy/clusterroles",
        component: "k8spolicy/clusterroles/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.deployments",
      },
      {
        name: "clusterrolebindings",
        icon: "PartitionOutlined",
        path: "/k8spolicy/clusterrolebindings",
        component: "k8spolicy/clusterrolebindings/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.deployments",
      },
    ],
  },
  {
    name: "Customization",
    icon: "ControlOutlined",
    path: "/customize",
    routes: [
      {
        name: "crd",
        icon: "PartitionOutlined",
        path: "/customize/crd",
        component: "customize/crd/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
    ],
  },
  {
    path: "/",
    redirect: "/home",
  },
  {
    component: "./404",
  },
];
