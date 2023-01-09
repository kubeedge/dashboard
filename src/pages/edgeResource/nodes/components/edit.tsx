import React, { useEffect, useState } from 'react';
import { ProFormDigit, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Form, Modal, Row, Col } from 'antd';
import type { DeptType, formType } from '../data';

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<DeptType>;
};

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const [form] = Form.useForm<formType>();



  useEffect(() => {
    form.resetFields();
  }, [form, props]);

  const handleOk = () => {
    // form.submit();
    form.setFieldValue('remark', `keadm join --kubeedge-version=${form.getFieldValue('version')} --cloudcore-ipport=${form.getFieldValue('cloudIP')} --token=${form.getFieldValue('token')}`) 
    
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
      title='注册节点'
      visible={props.visible}
      destroyOnClose
      okText='生成命令'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="cloudIP"
              label='cloudIP'
              width="xl"
              placeholder="请输入cloudIP"
              rules={[
                {
                  required: true,
                  message: ('请输入cloudIP！'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="version"
              label='kubedege版本                '
              width="xl"
              placeholder="请输入kubedege版本                "
              rules={[
                {
                  required: true,
                  message: ("请输入Name！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              options={[{label: 'Docker', value: 'Docker'}, { label: 'ContainD', value: 'ContainD' }]}
              name="noticeType"
              label='Runtime类型'
              width="xl"
              placeholder="请输入Runtime类型              "
              rules={[
                {
                  required: true,
                  message: ("请输入Runtime类型！"),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="token"
              label='token'
              width="xl"
              placeholder="请输入token"
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
            <ProFormTextArea name="remark" label='命令' width="xl" placeholder='' />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
