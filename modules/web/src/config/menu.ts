export const menu = [{
  name: 'Home',
  link: '/',
}, {
  name: 'Node',
  items: [{
    name: 'Nodes',
    link: '/node',
  }, {
    name: 'NodeGroups',
    link: '/nodeGroup',
  }],
}, {
  name: 'Application',
  items: [{
    name: 'Deployments',
    link: '/deployment',
  }, {
    name: 'EdgeApplications',
    link: '/edgeApplication',
  }]
}, {
  name: 'Config',
  items: [{
    name: 'ConfigMaps',
    link: '/configMap',
  }, {
    name: 'Secrets',
    link: '/secret',
  }]
}, {
  name: 'Device',
  items: [{
    name: 'DeviceModels',
    link: '/deviceModel',
  }, {
    name: 'Devices',
    link: '/device',
  }],
}, {
  name: 'Edge-Cloud Message',
  items: [{
    name: 'Rule Endpoints',
    link: '/ruleEndpoint',
  }, {
    name: 'Rules',
    link: '/rule',
  }]
}, {
  name: 'Service Grid',
  items: [{
    name: 'Services',
    link: '/service',
  }]
}, {
  name: 'Kubernetes Policy',
  items: [{
    name: 'Service Accounts',
    link: '/serviceAccount',
  }, {
    name: 'Roles',
    link: '/role',
  }, {
    name: 'Role Bindings',
    link: '/roleBinding',
  }, {
    name: 'Cluster Roles',
    link: '/clusterRole',
  }, {
    name: 'Cluster Role Bindings',
    link: '/clusterRoleBinding'
  }],
}, {
  name: 'Customization',
  items: [{
    name: 'CRDs',
    link: '/crd',
  }]
}];
