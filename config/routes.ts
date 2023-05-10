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
    name: "Edge Resource",
    icon: "ClusterOutlined",
    path: "/edgeResource",
    routes: [
      {
        path: "/",
        redirect: "/edgeResource/nodes",
      },
      {
        name: "nodes",
        icon: "PartitionOutlined",
        path: "/edgeResource/nodes",
        component: "edgeResource/nodes/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "deployment",
        icon: "PartitionOutlined",
        path: "/edgeResource/deployment",
        component: "edgeResource/deployment/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "configmap",
        icon: "PartitionOutlined",
        path: "/edgeResource/configmap",
        component: "edgeResource/configmap/index",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "secret",
        icon: "PartitionOutlined",
        path: "/edgeResource/secret",
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
        // component: "edgeCloudMessage/ruleEndpoint/index",
        component: "404",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "ruleRoute",
        icon: "PartitionOutlined",
        path: "/edgeCloudMessage/ruleRoute",
        // component: "edgeCloudMessage/ruleRoute/index",
        component: "404",

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
        // component: "serviceGrid/services/index",
        component: "404",

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
        // redirect: "/k8spolicy/serviceaccounts",
        component: "404",
      },
      {
        name: "serviceaccounts",
        icon: "PartitionOutlined",
        path: "/k8spolicy/serviceaccounts",
        // component: "k8spolicy/serviceaccounts/index",
        component: "404",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "roles",
        icon: "PartitionOutlined",
        path: "/k8spolicy/roles",
        // component: "k8spolicy/roles/index",
        component: "404",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.deployments",
      },
      {
        name: "rolebindings",
        icon: "PartitionOutlined",
        path: "/k8spolicy/rolebindings",
        // component: "k8spolicy/rolebindings/index",
        component: "404",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.deployments",
      },
      {
        name: "clusterroles",
        icon: "PartitionOutlined",
        path: "/k8spolicy/clusterroles",
        // component: "k8spolicy/clusterroles/index",
        component: "404",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.deployments",
      },
      {
        name: "clusterrolebindings",
        icon: "PartitionOutlined",
        path: "/k8spolicy/clusterrolebindings",
        // component: "k8spolicy/clusterrolebindings/index",
        component: "404",

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
      {
        name: "edgeApplication",
        icon: "PartitionOutlined",
        path: "/customize/edgeApplication",
        // component: "customize/edgeApplication/index",
        component: "404",

        wrappers: ["@/components/KeepAlive"],
        KeepAlive: false,
        title: "menu.title.nodes",
      },
      {
        name: "nodeGroup",
        icon: "PartitionOutlined",
        path: "/customize/nodeGroup",
        // component: "customize/nodeGroup/index",
        component: "404",

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
