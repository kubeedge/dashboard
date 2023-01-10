import { Request, Response } from 'express';
import captchapng from 'captchapng3';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req: Request, res: Response) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}


function guid() {
  // return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  //   var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //   return v.toString(16);
  // });
  return 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImJ2N29YSjRMeklRYmM3V0lta3g1WHhHd2N0Q1dnZEMzY0JHRldPaHc2bEkifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLXMyNmwyIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJiODZhYzE0Ny1lNzBjLTRkMDktYWQ3Mi1kN2FjNTgwZjM5M2UiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6YWRtaW4tdXNlciJ9.naG8HfDZ7KYcoDuKpOi5VXGBd__QgLScR_NCSu563USIGYB3a-au1SUxNvHXt4IDwSd4AE1kEI9OFOs6kPoAS6vaaNuJZf7uBttLFPDXm-RGKFcJysJRec15mDzfXXCy2UoaeP8BufNZV6zZus9ueBg4eefcTj4-wJMlASdwqpmYjMRHfiwTZZz6RZNGw7usefm6LGrRAwUplUbwrcDx1b9uz3ZpqisxdQoowaGSyLIBJTVrh_KJRxZ6FX6WaEjU4IchyD6UzApupxOzzuXIF9Y-URIimimpAmlh0QroacXi3g7xoKrOC84avzvlgEUvh6yd16aseIS7hIiscyEX6g'
}

async function getCaptchaImage(req: Request, res: Response) {
  await waitTime(1000);
  let rand = (Math.random() * 9000 + 1000).toFixed();
  var p = new captchapng(100, 30, rand);
  const img = p.getBase64();
  res.status(200).send({
    code: 200,
    msg: 'success',
    img: img,
    uuid: guid()
  });
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return access;
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/getInfo': (req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '请先登录！',
        success: true,
      });
      return;
    }
    res.send({
      msg: "操作成功",
      code: 200,
      permissions: ["*:*:*"],
      roles: ["admin"],
      user: {
        searchValue: null,
        createBy: "admin",
        createTime: "2021-09-09 17:25:28",
        updateBy: null,
        updateTime: null,
        remark: "管理员",
        params: {},
        userId: 1,
        deptId: 103,
        userName: "admin",
        nickName: "若依",
        email: "ry@163.com",
        phonenumber: "15888888888",
        sex: "1",
        avatar: "/static/img/profile.473f5971.jpg",
        status: "0",
        delFlag: "0",
        loginIp: "61.140.198.155",
        loginDate: "2021-11-11T14:03:07.723+0800",
        dept: {
          searchValue: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          remark: null,
          params: {},
          deptId: 103,
          parentId: 101,
          ancestors: null,
          deptName: "研发部门",
          orderNum: "1",
          leader: "若依",
          phone: null,
          email: null,
          status: "0",
          delFlag: null,
          parentName: null,
          children: []
        },
        roles: [
          {
            searchValue: null,
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            params: {},
            roleId: 1,
            roleName: "超级管理员",
            roleKey: "admin",
            roleSort: "1",
            dataScope: "1",
            menuCheckStrictly: false,
            deptCheckStrictly: false,
            status: "0",
            delFlag: null,
            flag: false,
            menuIds: null,
            deptIds: null,
            admin: true
          }
        ],
        roleIds: null,
        postIds: null,
        roleId: null,
        admin: true
      }
    });
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/login': async (req: Request, res: Response) => {
    const { password, username, type } = req.body;
    await waitTime(2000);
    if (password === 'admin123' && username === 'admin') {
      res.send({
        code: 200,
        type,
        currentAuthority: 'admin',
        token: guid()
      });
      access = 'admin';
      return;
    }
    if (password === '123456' && username === 'user') {
      res.send({
        code: 200,
        type,
        currentAuthority: 'user',
        token: guid()
      });
      access = 'user';
      return;
    }
    if (type === 'mobile') {
      res.send({
        code: 200,
        type,
        currentAuthority: 'admin',
        token: guid()
      });
      access = 'admin';
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
    access = 'guest';
  },
  'POST /api/logout': (req: Request, res: Response) => {
    access = '';
    res.send({ data: {}, success: true });
  },

  'GET /api/getRouters': {
    msg: "操作成功",
    code: 200,
    data: [
      {
        name: "edgeResource",
        path: "/edgeResource",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "边缘资源", icon: "", noCache: false },
        children: [
          {
            name: "nodes",
            path: "nodes",
            hidden: false,
            component: "edgeResource/nodes/index",
            meta: { title: "边缘节点", icon: "tree", noCache: false }
          }
        ]
      },
      {
        name: "edgeApp",
        path: "/edgeApp",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "边缘应用", icon: "", noCache: false },
        children: [
          {
            name: "deployment",
            path: "deployment",
            hidden: false,
            component: "edgeApp/deployment/index",
            meta: { title: "容器应用", icon: "tree", noCache: false }
          },
          {
            name: "configmap",
            path: "configmap",
            hidden: false,
            component: "edgeApp/configmap/index",
            meta: { title: "应用配置", icon: "tree", noCache: false }
          },
          {
            name: "secret",
            path: "secret",
            hidden: false,
            component: "edgeApp/secret/index",
            meta: { title: "应用秘钥", icon: "tree", noCache: false }
          },
        ]
      },
      {
        name: "设备管理",
        path: "/device",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "设备管理", icon: "", noCache: false },
        children: [
          {
            name: "devicemodels",
            path: "devicemodels",
            hidden: false,
            component: "device/devicemodels/index",
            meta: { title: "设备模型", icon: "", noCache: false }
          },
          {
            name: "devices",
            path: "devices",
            hidden: false,
            component: "device/devices/index",
            meta: { title: "设备实例", icon: "", noCache: false }
          },
          {
            name: "mapper",
            path: "mapper",
            hidden: false,
            component: "device/mapper/index",
            meta: { title: "mapper", icon: "tree", noCache: false }
          }
        ]
      },
      {
        name: "edgeCloudMessage",
        path: "/edgeCloudMessage",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "边云消息", icon: "", noCache: false },
        children: [
          {
            name: "ruleEndpoint",
            path: "ruleEndpoint",
            hidden: false,
            component: "edgeCloudMessage/ruleEndpoint/index",
            meta: { title: "消息端点", icon: "tree", noCache: false }
          },
          {
            name: "ruleRoute",
            path: "ruleRoute",
            hidden: false,
            component: "edgeCloudMessage/ruleRoute/index",
            meta: { title: "消息路由", icon: "tree", noCache: false }
          },
        ]
      },
      {
        name: "serviceGrid",
        path: "/serviceGrid",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "服务网格", icon: "", noCache: false },
        children: [
          {
            name: "services",
            path: "services",
            hidden: false,
            component: "serviceGrid/nodes/index",
            meta: { title: "services", icon: "tree", noCache: false }
          },
        ]
      },
      {
        name: "k8spolicy",
        path: "/k8spolicy",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "认证策略", icon: "", noCache: false },
        children: [
          {
            name: "serviceaccounts",
            path: "serviceaccounts",
            hidden: false,
            component: "k8spolicy/serviceaccounts/index",
            meta: { title: "serviceaccounts", icon: "tree", noCache: false }
          },
          {
            name: "roles",
            path: "roles",
            hidden: false,
            component: "k8spolicy/roles/index",
            meta: { title: "roles", icon: "tree", noCache: false }
          },
          {
            name: "rolebindings",
            path: "rolebindings",
            hidden: false,
            component: "k8spolicy/rolebindings/index",
            meta: { title: "rolebindings", icon: "tree", noCache: false }
          },
          {
            name: "clusterroles",
            path: "clusterroles",
            hidden: false,
            component: "k8spolicy/clusterroles/index",
            meta: { title: "clusterroles", icon: "tree", noCache: false }
          },
          {
            name: "clusterrolebindings",
            path: "clusterrolebindings",
            hidden: false,
            component: "k8spolicy/clusterrolebindings/index",
            meta: { title: "clusterrolebindings", icon: "tree", noCache: false }
          },
        ]
      },
      {
        name: "customize",
        path: "/customize",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "自定义资源", icon: "", noCache: false },
        children: [
          {
            name: "crd",
            path: "crd",
            hidden: false,
            component: "customize/crd/index",
            meta: { title: "CRD", icon: "tree", noCache: false }
          },
          {
            name: "edgeApplication",
            path: "edgeApplication",
            hidden: false,
            redirect: "noRedirect",
            component: "customize/edgeApplication/index",
            alwaysShow: true,
            meta: { title: "edgeApplication", icon: "", noCache: false },
    
          },
          {
            name: "nodeGroup",
            path: "nodeGroup",
            hidden: false,
            redirect: "noRedirect",
            component: "customize/nodeGroup/index",
            alwaysShow: true,
            meta: { title: "nodeGroup", icon: "", noCache: false },
          }
        ]
      },
    ]
  },
  'POST /api/register': (req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user', success: true });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Forbidden',
      message: 'Forbidden',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,

  'GET  /api/captchaImage': getCaptchaImage,
};
