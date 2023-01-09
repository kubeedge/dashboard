import React, { useEffect, useState } from 'react';
import { ProFormDigit, ProFormText, ProFormRadio, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Form, Modal, Row, Col, Button } from 'antd';
import type { DeptType, listType } from '../data';

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<listType>;
};

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const [form] = Form.useForm();
  const [typeOptions, setTypeOptions] = useState<any>([]);

  // setTypeOptions(
  //   [
  //     { label: 'Development', value: 'Development' }
  //   ]
  // )

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      name: props.values.name,
    });
  }, [form, props]);

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
  };
  const handleFinish = async (values: Record<string, any>) => {
    props.onSubmit(values as DeptFormValueType);
  };

  return (
    <Modal width={640} title='创建容器' visible={props.visible} destroyOnClose onOk={handleOk} onCancel={handleCancel}>
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              valueEnum={typeOptions}
              name="kind"
              label='服务类型'
              width="xl"
              placeholder="请选择服务类型"
              rules={[
                {
                  required: false,
                  message: ("请选择服务类型！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="k8s.kuboard.cn/workload"
              label='服务名称'
              width="xl"
              placeholder="请输入服务名称"
              rules={[
                {
                  required: true,
                  message: ("请输入token！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>注解：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              添加
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>标签：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              添加
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormTextArea
              name="k8s.kuboard.cn/displayName"
              label='服务描述'
              width="xl"
              rules={[
                {
                  required: true,
                  message: ("请输入服务描述！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormDigit
              name="replicas"
              label='副本数量'
              width="xl"
              placeholder="请输入副本数量"
              rules={[
                {
                  required: true,
                  message: ("请输入副本数量！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>数据卷：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              添加
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="k8s.kuboard.cn/workload"
              label='容器名称'
              width="xl"
              placeholder="请输入容器名称"
              rules={[
                {
                  required: true,
                  message: ("请输入容器名称！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="k8s.kuboard.cn/workload"
              label='镜像'
              width="xl"
              placeholder="请输入镜像"
              rules={[
                {
                  required: true,
                  message: ("请输入镜像！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="k8s.kuboard.cn/workload"
              label='抓取策略'
              width="xl"
              placeholder="请输入抓取策略"
              rules={[
                {
                  required: true,
                  message: ("请输入抓取策略！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="k8s.kuboard.cn/workload"
              label='工作目录'
              width="xl"
              placeholder="请输入工作目录"
              rules={[
                {
                  required: true,
                  message: ("请输入工作目录！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>Command：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              添加
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>Args：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              添加
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>Ports</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              添加
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>数据卷：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              添加
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>环境变量：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              名值对
            </Button>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              配置
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>挂载点：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              添加
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>就绪检查：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              编辑
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>存活检查：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              编辑
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>安全设定：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              编辑
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
            <ProFormText
              name="k8s.kuboard.cn/workload"
              label='CPU'
              width="xl"
              placeholder="请输入CPU"
              rules={[
                {
                  required: true,
                  message: ("请输入CPU！"),
                },
              ]}
            />
            </Col>
            <Col span={12} order={2}>
            <ProFormText
              name="k8s.kuboard.cn/workload"
              label='CPU'
              width="xl"
              placeholder="请输入CPU"
              rules={[
                {
                  required: true,
                  message: ("请输入CPU！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12} order={1}>
          <ProFormText
              name="k8s.kuboard.cn/workload"
              label='内存'
              width="xl"
              placeholder="请输入内存"
              rules={[
                {
                  required: true,
                  message: ("请输入内存！"),
                },
              ]}
            />
            </Col>
            <Col span={12} order={2}>
            <ProFormText
              name="k8s.kuboard.cn/workload"
              label=''
              width="xl"
              placeholder="请输入内存"
              rules={[
                {
                  required: true,
                  message: ("请输入内存！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>Docker仓库的用户名密码：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              添加
            </Button>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              创建
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="k8s.kuboard.cn/workload"
              label='ServiceAccount'
              width="xl"
              placeholder="请输入ServiceAccount"
              rules={[
                {
                  required: true,
                  message: ("请输入ServiceAccount！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="k8s.kuboard.cn/workload"
              label='容器组重启策略'
              width="xl"
              placeholder="请输入容器组重启策略"
              rules={[
                {
                  required: true,
                  message: ("请输入容器组重启策略！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="k8s.kuboard.cn/workload"
              label='节点选择'
              width="xl"
              placeholder="请选择节点"
              rules={[
                {
                  required: true,
                  message: ("请选择节点！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <span>亲和性/反亲和性：</span>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              节点亲和性设置
            </Button>
            <Button type="primary"
              onClick={async () => {
                
              }}
            >
              Pod亲和性设置
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
