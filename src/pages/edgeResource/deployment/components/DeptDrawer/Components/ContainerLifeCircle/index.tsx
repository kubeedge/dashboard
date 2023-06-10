import React, { useEffect, useState } from "react";
import { Form, Select, Input, Row, Col, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

type ContainerLifeCircleProps = {
  showDetail: boolean;
  name: string;
};

const ContainerLifeCircle: React.FC<ContainerLifeCircleProps> = (props) => {
  const form = Form.useFormInstance();
  const [type, setType] = useState("none");
  //   const type = Form.useWatch(props.name, form);
  return (
    <>
      <Form.Item name={props.name}>
        <Select
          value={type}
          onChange={(e) => setType(e)}
          options={[
            {
              label: "不设置",
              value: "none",
            },
            {
              label: "HTTP请求",
              value: "http",
            },
            {
              label: "TCP连接",
              value: "tcp",
            },
            {
              label: "命令行",
              value: "command",
            },
          ]}
        />
      </Form.Item>
      {type === "none" && <div>未配置</div>}
      {type === "http" && (
        <>
          <Form.Item name={[props.name, "portol"]} label="portol">
            <Select
              options={[
                {
                  label: "http",
                  value: "http",
                },
                {
                  label: "https",
                  value: "https",
                },
              ]}
              placeholder="Please select portol"
            />
          </Form.Item>
          <Form.Item name={[props.name, "host"]} label="host">
            <Input placeholder="Please input host" />
          </Form.Item>
          <Form.Item name={[props.name, "port"]} label="port">
            <Input placeholder="Please input port" />
          </Form.Item>
          <Form.Item name={[props.name, "path"]} label="path">
            <Input placeholder="Please input path" />
          </Form.Item>
          <div>
            <p>Pod 所在节点上的 kubelet 将对如下地址执行 httpGet</p>
          </div>
          <Form.List name={[props.name, "http", "Header"]}>
            {(fields, { add, remove }) => {
              return (
                <Row>
                  {fields.map((field, index) => (
                    <Col span={12}>
                      <Row>
                        <Col span={10}>
                          <Form.Item
                            {...field}
                            name={[...[field.name], "key"]}
                            rules={[{ required: true, message: "请输入key" }]}
                          >
                            <Input
                              placeholder="请输入key"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={11} offset={1}>
                          <Form.Item
                            {...field}
                            name={[...[field.name], "value"]}
                            rules={[
                              {
                                required: true,
                                message: "请输入value",
                              },
                            ]}
                          >
                            <Input
                              placeholder="请输入value"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  ))}
                  <Col span={fields.length % 2 === 0 ? 24 : 12}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => {
                          add();
                        }}
                        style={{ width: "100%" }}
                      >
                        <PlusOutlined /> add Http Header
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              );
            }}
          </Form.List>
        </>
      )}
      {type === "tcp" && (
        <Form.Item
          label="port"
          name={[props.name, "port"]}
          rules={[{ required: true }]}
        >
          <Input placeholder="please input port 1-65535" />
        </Form.Item>
      )}
      {type === "command" && (
        <Form.Item label="Command" name={[props.name, "command"]}>
          <Input placeholder="Please input command" />
        </Form.Item>
      )}

      {props.showDetail && type !== "none" && (
        <>
          <Form.Item
            label="初始延迟"
            name={[props.name, "delay"]}
            help="在检查其运行状况之前，容器启动后需要等待多长时间。"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="执行探测频率"
            name={[props.name, , "pin"]}
            help="执行探测的频率（以秒为单位）。默认为10秒。最小值为1。"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="超时时间"
            name={[props.name, "time"]}
            help="等待探针完成多长时间。如果超过时间，则认为探测失败。默认为1秒。最小值为1"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="健康阈值"
            name={[props.name, "helthy"]}
            help="探测失败后，连续最小成功探测为成功。默认值为1。最小值为1。存活探针和启动探针内，健康阈值必须为1"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="不健康阈值"
            name={[props.name, "helthy1"]}
            help="探针进入失败状态时需要连续探测失败的最小次数。"
          >
            <Input />
          </Form.Item>
        </>
      )}
    </>
  );
};

export default ContainerLifeCircle;
