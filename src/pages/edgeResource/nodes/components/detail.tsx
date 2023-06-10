import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Button } from "antd";
import moment from "moment";
import YamlModal from "./yaml";
import { convertKiToGTM } from "@/utils/utils";

export type OperlogFormProps = {
  onCancel: (flag?: boolean, formVals?: boolean) => void;
  visible: boolean;
  values: Partial<any>;
};

const detailForm: React.FC<OperlogFormProps> = (props) => {
  const { values } = props;

  useEffect(() => {}, [props]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleCancel = () => {
    props.onCancel();
  };
  const handleYaml = () => {
    setModalVisible(true);
  };

  return (
    <div>
      <Modal
        width={800}
        title="Node Detail"
        open={props.visible}
        destroyOnClose
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="viewYaml" onClick={handleYaml}>
            YAML
          </Button>,
        ]}
      >
        <Descriptions column={24} bordered>
          <Descriptions.Item span={12} label="Name">
            {values?.metadata?.name}
          </Descriptions.Item>
          <Descriptions.Item span={12} label="Status">
            {values?.status?.conditions?.filter(
              (item: any) => item.type == "Ready"
            )[0].status === "True"
              ? "Ready"
              : "NotReady"}
          </Descriptions.Item>
          <Descriptions.Item span={12} label="ID">
            {values?.metadata?.uid}
          </Descriptions.Item>
          <Descriptions.Item span={12} label="Description">
            {values?.metadata?.annotations?.["node.alpha.kubernetes.io/ttl"]}
          </Descriptions.Item>
          <Descriptions.Item span={12} label="Creation time">
            {values?.metadata?.creationTimestamp &&
              moment(values?.metadata?.creationTimestamp).format(
                "YYYY-MM-DD HH:mm:ss"
              )}
          </Descriptions.Item>
          <Descriptions.Item span={12} label="Hostname">
            {values?.status?.addresses?.[1]?.address}
          </Descriptions.Item>
          <Descriptions.Item span={12} label="System">
            {values?.status?.nodeInfo?.osImage} |{" "}
            {values?.status?.nodeInfo?.operatingSystem} |{" "}
            {values?.status?.nodeInfo?.architecture} |{" "}
            {values?.status?.nodeInfo?.kernelVersion}
          </Descriptions.Item>
          <Descriptions.Item span={24} label="IP">
            {values?.status?.addresses?.[0]?.address}
          </Descriptions.Item>
          <Descriptions.Item span={24} label="Configuration">
            {values?.status?.capacity?.cpu}Cpu |{" "}
            {convertKiToGTM(values?.status?.capacity?.memory || "0")}
          </Descriptions.Item>
          <Descriptions.Item span={24} label="Container runtime version">
            {values?.status?.nodeInfo?.containerRuntimeVersion}
          </Descriptions.Item>
          <Descriptions.Item span={24} label="Edge side software version">
            {values?.status?.nodeInfo?.kubeletVersion}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      <YamlModal
        onSubmit={async (values) => {
          setModalVisible(false);
        }}
        onCancel={(res, isUpdate) => {
          setModalVisible(false);
        }}
        visible={modalVisible}
        values={values || {}}
      />
    </div>
  );
};

export default detailForm;
