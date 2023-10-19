import request from '@/utils/request'

// 获取验证码
export async function getCaptchaImage() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}

export async function login(body, options) {
  return request({
    url: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}