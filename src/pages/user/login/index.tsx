import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Col, message, Row, Tabs, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { getCaptchaImage, getFakeCaptcha, login } from '@/services/login';

import styles from './index.less';
import { clearSessionToken, setSessionToken } from '@/access';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<any>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');

  const intl = useIntl();
	const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImJ2N29YSjRMeklRYmM3V0lta3g1WHhHd2N0Q1dnZEMzY0JHRldPaHc2bEkifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLXMyNmwyIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJiODZhYzE0Ny1lNzBjLTRkMDktYWQ3Mi1kN2FjNTgwZjM5M2UiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6YWRtaW4tdXNlciJ9.naG8HfDZ7KYcoDuKpOi5VXGBd__QgLScR_NCSu563USIGYB3a-au1SUxNvHXt4IDwSd4AE1kEI9OFOs6kPoAS6vaaNuJZf7uBttLFPDXm-RGKFcJysJRec15mDzfXXCy2UoaeP8BufNZV6zZus9ueBg4eefcTj4-wJMlASdwqpmYjMRHfiwTZZz6RZNGw7usefm6LGrRAwUplUbwrcDx1b9uz3ZpqisxdQoowaGSyLIBJTVrh_KJRxZ6FX6WaEjU4IchyD6UzApupxOzzuXIF9Y-URIimimpAmlh0QroacXi3g7xoKrOC84avzvlgEUvh6yd16aseIS7hIiscyEX6g'
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {      
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  const getCaptchaCode = async () => {
    const response = await getCaptchaImage()
    const imgdata = `data:image/png;base64,${response.img}`;
    setCaptchaCode(imgdata);
    setUuid(response.uuid);
  };
  
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
			const { username, password, autoLogin, code, resToken } = values
      const response = await login({ ...{username, password, autoLogin, code}, uuid });
      if (response.code === 200) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        const current = new Date();
        const expireTime = current.setTime(current.getTime() + 1000 * 12 * 60 * 60);
        // const resToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImJ2N29YSjRMeklRYmM3V0lta3g1WHhHd2N0Q1dnZEMzY0JHRldPaHc2bEkifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLXMyNmwyIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJiODZhYzE0Ny1lNzBjLTRkMDktYWQ3Mi1kN2FjNTgwZjM5M2UiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZXJuZXRlcy1kYXNoYm9hcmQ6YWRtaW4tdXNlciJ9.naG8HfDZ7KYcoDuKpOi5VXGBd__QgLScR_NCSu563USIGYB3a-au1SUxNvHXt4IDwSd4AE1kEI9OFOs6kPoAS6vaaNuJZf7uBttLFPDXm-RGKFcJysJRec15mDzfXXCy2UoaeP8BufNZV6zZus9ueBg4eefcTj4-wJMlASdwqpmYjMRHfiwTZZz6RZNGw7usefm6LGrRAwUplUbwrcDx1b9uz3ZpqisxdQoowaGSyLIBJTVrh_KJRxZ6FX6WaEjU4IchyD6UzApupxOzzuXIF9Y-URIimimpAmlh0QroacXi3g7xoKrOC84avzvlgEUvh6yd16aseIS7hIiscyEX6g'
        // setSessionToken(response.token, response.token, expireTime);
        setSessionToken(resToken, resToken, expireTime);
        message.success(defaultLoginSuccessMessage);

        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) 
          return;
        
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      } else{
        console.log('login failed')
        clearSessionToken();
        // 如果失败去设置用户错误信息
        setUserLoginState({status: 'error', type: 'account', massage: response.msg});
        message.error(response.msg);
        getCaptchaCode();
      }
    } catch (error) {
      clearSessionToken();
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);      
      getCaptchaCode();
    }
  };
  const { status, type: loginType, massage } = userLoginState;

  useEffect(() => {
    getCaptchaCode();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          // logo={<img alt="logo" src="/logo.svg" />}
          title="KubeEdge"
          // subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          subTitle="KubeEdge用于......"
          initialValues={{
            autoLogin: true,
          }}
          // actions={[
          //   <FormattedMessage
          //     key="loginWith"
          //     id="pages.login.loginWith"
          //     defaultMessage="其他登录方式"
          //   />,
          //   <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
          //   <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
          //   <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
          // ]}
          onFinish={async (values) => {
						const params = {username: 'admin', password: 'admin123', autoLogin: true, ...values}
            await handleSubmit(params as API.LoginParams);
          }}
        >
          {/* <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              })}
            />
            <Tabs.TabPane
              key="mobile"
              tab={intl.formatMessage({
                id: 'pages.login.phoneLogin.tab',
                defaultMessage: '手机号登录',
              })}
            />
          </Tabs> */}

          {/* {status === 'error' && loginType === 'account' && (
            <LoginMessage content={massage} />
          )} */}
          {type === 'account' && (
            <>
              {/* <ProFormText
                name="username"
                initialValue="admin"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名: admin',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                initialValue="admin123"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: admin123',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              /> */}
							<ProFormText
                name="resToken"
                initialValue={token}
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.resToken.placeholder',
                  defaultMessage: 'token: token',
                })}
              />
              <Row>
								<Col flex={3}>
									<ProFormText
										style={{
											float: 'right',
										}}
										name="code"
										placeholder={intl.formatMessage({
											id: 'pages.login.code.placeholder',
											defaultMessage: '请输入验证',
										})}
										rules={[
											{
												required: true,
												message: (
													<FormattedMessage
														id="pages.searchTable.updateForm.ruleName.nameRules"
														defaultMessage="请输入验证啊"
													/>
												),
											},
										]}
									/>
								</Col>
								<Col flex={2}>
									<Image
										src={captchaCode}
										alt="验证码"
										style={{
											display: 'inline-block',
											verticalAlign: 'top',
											cursor: 'pointer',
											paddingLeft: '10px',
											width: '100px',
										}}
										preview={false}
										onClick={() => getCaptchaCode()}
									/>
								</Col>
							</Row>
            </>
          )}

          {/* {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (result === false) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div> */}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
