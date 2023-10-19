import GridViewIcon from "@mui/icons-material/GridView"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

export const SidebarData = [
  {
    title: '边缘资源',
    path: '/edgeResource/nodes/',
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
    subNav: [
      { title: '边缘节点', path: '/edgeResource/nodes/' }
    ]
  },
  {
    title: '边缘应用',
    path: '/edgeApp/deployment/',
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
    subNav: [
      { title: '容器应用', path: '/edgeApp/deployment/' },
      { title: '应用配置', path: '/edgeApp/configmap/' },
      { title: '应用密钥', path: '/edgeApp/secret/' }
    ]
  },
  {
    title: '设备管理',
    path: '/device/devicemodels/',
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
    subNav: [
      { title: '设备模型', path: '/device/devicemodels/' },
      { title: '设备实例', path: '/device/devices/' },
      { title: 'mapper', path: '/device/mapper/' }
    ]
  },
  {
    title: '边云消息',
    path: '/edgeCloudMessage/ruleEndpoint/',
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
    subNav: [
      { title: '消息端点', path: '/edgeCloudMessage/ruleEndpoint/' },
      { title: '消息路由', path: '/edgeCloudMessage/ruleRoute/' }
    ]
  },
  {
    title: '服务网格',
    path: '/serviceGrid/services/',
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
    subNav: [
      { title: 'services', path: '/serviceGrid/services/' }
    ]
  },
  {
    title: '认证策略',
    path: '/k8spolicy/serviceaccounts/',
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
    subNav: [
      { title: 'serviceaccounts', path: '/k8spolicy/serviceaccounts/' },
      { title: 'roles', path: '/k8spolicy/roles/' },
      { title: 'rolebindings', path: '/k8spolicy/rolebindings/' },
      { title: 'clusterroles', path: '/k8spolicy/clusterroles/' },
      { title: 'clusterrolebindings', path: '/k8spolicy/clusterrolebindings/' },
    ]
  },
  {
    title: '自定义资源',
    path: '/customize/crd/',
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
    subNav: [
      { title: 'CRD', path: '/customize/crd/' },
      { title: 'edgeApplation', path: '/customize/edgeApplation/' },
      { title: 'nodeGroup', path: '/customize/nodeGroup/' },
    ]
  },
]