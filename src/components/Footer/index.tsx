import { GithubOutlined } from "@ant-design/icons";
import { DefaultFooter } from "@ant-design/pro-layout";

export default () => {
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} Kubeedge Community`}
      links={[
        {
          key: "kubeedge",
          title: "Kubeedge",
          href: "https://kubeedge.io/en/",
          blankTarget: true,
        },
        {
          key: "github",
          title: <GithubOutlined />,
          href: "https://github.com/kubeedge/kubeedge",
          blankTarget: true,
        },
        {
          key: "dashboard",
          title: "Dashboard",
          href: "https://github.com/kubeedge/dashboard",
          blankTarget: true,
        },
      ]}
    />
  );
};
