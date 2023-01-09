import React, { useEffect } from 'react';
import { ProFormDigit, ProFormText, ProFormRadio, ProFormTreeSelect, ProFormTextArea, ProFormSelect } from '@ant-design/pro-form';
import { Form, Modal, Row, Col } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import type { DeptType, listType } from '../data.d';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 * 
 * */

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<listType>;
  nodeOptions: any;
};

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const [form] = Form.useForm();
  const { nodeOptions } = props;

  useEffect(() => {
    form.resetFields();
    // form.setFieldsValue({
    //   name: props.values.name,
    // });
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
    <Modal
      width={640}
      title='新建'
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="name"
              label='消息路由名称'
              width="xl"
              placeholder="请输入消息路由名称"
              rules={[
                {
                  required: false,
                  message: ('请输入消息路由名称'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              options={nodeOptions}
              name="source"
              label='源端点'
              width="xl"
              placeholder="请选择源端点"
              rules={[
                {
                  required: false,
                  message: ('请选择源端点'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="sourceResource"
              label='源端点资源'
              width="xl"
              placeholder="请输入源端点资源"
              rules={[
                {
                  required: false,
                  message: ('请输入源端点资源'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              options={nodeOptions}
              name="target"
              label='目的端点'
              width="xl"
              placeholder="请选择目的端点"
              rules={[
                {
                  required: false,
                  message: ('请选择目的端点'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="targetResource"
              label='目的端点资源'
              width="xl"
              placeholder="请输入目的端点资源"
              rules={[
                {
                  required: false,
                  message: ('请输入目的端点资源'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormTextArea name="description" label='描述' width="xl" placeholder="请输入描述" />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
