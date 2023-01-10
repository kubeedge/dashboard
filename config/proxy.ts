/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  
  dev: {
    '/api/apis': {
      target: 'https://192.168.3.240:6443',
      secure: false,   // 代理切换成https添加配置
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/api/api': {
      target: 'https://192.168.3.240:6443',
      secure: false,   // 代理切换成https添加配置
      changeOrigin: true,
      pathRewrite: { '^/api/api': '/api' },
    },
    '/api': {
      target: 'https://192.168.3.240:6443',
      secure: false,   // 代理切换成https添加配置
      changeOrigin: true,
    },
    '/profile/avatar/': {
      target: 'https://192.168.3.240:6443/api/',
      changeOrigin: true,
    }
  },
  test: {
    '/api/': {
      target: 'https://192.168.3.240:6443/api/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
