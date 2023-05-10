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
  const token =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6IlFQTkpEZ2xCc1pTRWd6VmYzeDhCYmx1Mmo5N3FPN1g1ZGJmR0xJb0wyclkifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJjdXJsLXVzZXItdG9rZW4tOTZzcTkiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiY3VybC11c2VyIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMmU2MDNiODEtYzRkMC00ZTRjLTljM2YtMjZjZjk4NjUwODQxIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmN1cmwtdXNlciJ9.w9dCA3YQkHro9eim9VfvSnZHX1o-78RSXGGf7l--ZlnNii0tYkjhqhmI4Mkr5mi4M1Pztp-D11H7WcxKOdN3GbnjUHqc52XAh51t-ZOBtwcJnzQydo-FyLCzwDfP1h9VsJgZr3GIAVc0odqv5iyOIk2G-tjQDKp4TSCLLlYg3odICQcJyID624HscS_pUwlY76UD4r11-1-j3dVSg5IxiM5FpigshlNnnRgpxmWxej_NjPUHQ3CB1G3NARmH2SigUkCVUkQifmAXrkldQ4FDMpdXftwd7V7Nv8fZgmdPl7CgJ1UXp-GBcDbosQj3zloOIE9hci3oTbuRKhmfScxYcw";

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
            initialValue={token}
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
