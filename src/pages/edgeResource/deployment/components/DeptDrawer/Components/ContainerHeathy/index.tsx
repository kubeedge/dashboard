import React, { useState } from "react";
import { Card, Button, Modal, Form } from "antd";

import styles from "./index.less";
import ContainerLifeCircle from "../ContainerLifeCircle";

const ContainerHeathy: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  return (
    <div>
      {config.map((item) => (
        <Card key={item.key} title={item.title} style={{ marginBottom: 16 }}>
          <div className={styles.cardWrapper}>
            <div className={styles.left}>
              <div className={styles.method}>
                <label>探测方式</label>
                <span>未设置</span>
              </div>
              <div>
                <div>{item.subTitle}</div>
                <div>{item.desc}</div>
              </div>
            </div>
            <div>
              <Button
                onClick={() => {
                  setVisible(true);
                  setTitle(item.title);
                }}
                type="link"
              >
                启用
              </Button>
            </div>
          </div>
        </Card>
      ))}
      <Modal title={title} open={visible} onCancel={() => setVisible(false)}>
        <Form form={form}>
          <ContainerLifeCircle showDetail name="heathy" />
        </Form>
      </Modal>
    </div>
  );
};

export default ContainerHeathy;

const config = [
  {
    title: "容器启动检查探针",
    key: "start",
    subTitle: "何时需要 容器启动检查探针",
    desc: "容器启动检查探针对启动时间较长的容器来说非常有用。如果容器的启动时间大于容器存活检查探针的（初始延迟时间 + 不健康阈值 x 执行探测频率），此时应该指定一个容器启动检查探针用于检查与容器存活检查探针相同的端口，并为容器启动检查探针设置一个足够大的不健康阈值以等待容器成功启动。",
  },
  {
    title: "容器存活检查探针",
    key: "running",
    subTitle: "何时需要 容器存活检查探针",
    desc: "容器存活检查探针连续失败次数达到不健康阈值指定的次数时，kubelet 将会停止该容器组，并根据容器组重启策略的参数决定是否重启该容器组.",
  },
  {
    title: "容器就绪检查探针",
    key: "ready",
    subTitle: "何时需要 容器就绪检查探针",
    desc: "当您的容器需要加载比较大的数据、配置文件、或者启动时做一些前期处理时，建议为其指定容器就绪检查探针。容器就绪检查探针的内容可以和容器存活检查探针的内容，但是含义却不相同，如果指定容器就绪检查探针，只有该探针成功以后，服务（Service）才会分发流量到该容器组。如果容器需要自主转入维护状态，可以为其指定一个内容不同于容器存活检查的容器就绪检查探针，这样，在容器就绪检查探针失败但是容器存活检查探针成功时，服务（Service）不会分发流量给该容器且 kubelet 不会重启该容器。",
  },
];
