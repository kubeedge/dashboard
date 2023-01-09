import React, { useEffect, useState } from 'react';
import { ProFormDigit, ProFormText, ProFormRadio, ProFormSelect } from '@ant-design/pro-form';
import { Form, Modal, Row, Col } from 'antd';
import type { DeptType, listType } from '../data.d';

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<listType>;
};

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const [form] = Form.useForm();
  const [type, setType] = useState<any>('')
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
            <ProFormSelect
              options={[
                { label: 'rest', value: 'rest' },
                { label: 'eventbus', value: 'eventbus' },
                { label: 'servicebus', value: 'servicebus' }
              ]}
              name="type"
              label='消息端点类型'
              width="xl"
              placeholder="请选择消息端点类型"
              fieldProps={{
                onChange: (e) => {
                  setType(e);
                },
              }}
              rules={[
                {
                  required: false,
                  message: ('请选择消息端点类型'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="name"
              label='消息端点名称'
              width="xl"
              placeholder="请输入消息端点名称"
              rules={[
                {
                  required: false,
                  message: ('请输入消息端点名称'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            {form.getFieldValue('type') == 'servicebus' && (<ProFormText
              name="port"
              label='端口'
              width="xl"
              hidden={type != 'servicebus'}
              placeholder="请输入端口"
              dependencies={['type']}
              rules={[
                {
                  required: false,
                  message: ('请输入端口'),
                },
              ]}
            />)}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
