import { UserOutlined } from "@ant-design/icons";
import { message } from "antd";
import React from "react";
import { ProFormText, LoginForm } from "@ant-design/pro-form";
import { useIntl, history, SelectLang, useModel } from "umi";
import Footer from "@/components/Footer";
import { login } from "@/services/login";

import styles from "./index.less";

const Login: React.FC = () => {
  const { setInitialState } = useModel("@@initialState");
  const intl = useIntl();

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const response = await login({
        ...values,
      });

      if (response.apiVersion) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: "pages.login.success",
          defaultMessage: "Login successfully!",
        });
        message.success(defaultLoginSuccessMessage);
        setInitialState((prevState) => ({ ...prevState, isLogin: true }));

        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) {
          history.push("/");
          return;
        }

        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || "/");
        return;
      } else {
        message.error(response.msg);
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: "pages.login.failure",
        defaultMessage: "Login failed, please try again!",
      });
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          title="KubeEdge"
          subTitle="Edge Computing Open Platform"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit({
              ...values,
              token: `Bearer ${values.token}`,
            } as API.LoginParams);
          }}
        >
          <ProFormText
            name="token"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder={intl.formatMessage({
              id: "pages.login.resToken.placeholder",
              defaultMessage: "token",
            })}
          />
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
