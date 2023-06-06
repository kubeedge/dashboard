import React, { useCallback } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import { Menu, Spin } from "antd";
import { history, useModel } from "umi";
import { stringify } from "querystring";
import HeaderDropdown from "../HeaderDropdown";
import styles from "./index.less";
import type { MenuInfo } from "rc-menu/lib/interface";

const loginOut = async () => {
  localStorage.removeItem("token");
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== "/user/login" && !redirect) {
    window.location.href = `/user/login?${stringify({
      redirect: pathname,
    })}`;
  }
};

const AvatarDropdown: React.FC<{}> = () => {
  const { initialState, setInitialState } = useModel("@@initialState");
  const { dispatch } = useModel("system");

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === "logout") {
        setInitialState((s) => ({
          ...s,
          isLogin: undefined,
          menus: undefined,
        }));
        dispatch({ type: "CHANGESTATE", payload: { tabList: [] } });
        loginOut();
        return;
      }
    },
    [setInitialState]
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { isLogin } = initialState;

  if (!isLogin) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <span className={`${styles.name} anticon`}>admin</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
