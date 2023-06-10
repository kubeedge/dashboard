import React, { useEffect } from "react";
import { useModel } from "umi";
import { Select } from "antd";
import { getNamespaces } from "@/services/kubeedge";

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const NamespaceDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel("@@initialState");
  const [namespacesList, setNamespacesList] = React.useState<any[]>([]);

  const initNamespacesList = async () => {
    const namespacesListRes = await getNamespaces();
    setNamespacesList([
      {
        label: "All namespaces",
        value: "",
      },
      ...(namespacesListRes?.items || []).map((item: any) => {
        return { label: item.metadata.name, value: item.metadata.name };
      }),
    ]);
  };

  useEffect(() => {
    initNamespacesList();
  }, []);

  const onSelect = (value: string) => {
    setInitialState((prevState) => ({
      ...prevState,
      namespace: value,
    }));
  };

  return (
    <Select
      value={initialState.namespace}
      status="warning"
      style={{ width: 150 }}
      onChange={onSelect}
      options={namespacesList}
    />
  );
};

export default NamespaceDropdown;
