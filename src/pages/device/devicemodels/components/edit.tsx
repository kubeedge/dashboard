import React, { useEffect } from 'react';
import { ProFormText, ProFormSelect } from '@ant-design/pro-form';
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
      title='添加模型'
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
              label='名称'
              width="xl"
              placeholder="请输入名称"
              rules={[
                {
                  required: false,
                  message: ('请输入名称'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="protocol"
              label='协议'
              width="xl"
              placeholder="请输入协议"
              rules={[
                {
                  required: false,
                  message: ('请输入协议'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="description"
              label='描述'
              width="xl"
              placeholder="请输入描述"
              rules={[
                {
                  required: false,
                  message: ('请输入描述'),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="propertiesName"
              label='属性名'
              width="xl"
              placeholder="请输入属性名"
              rules={[
                {
                  required: false,
                  message: ('请输入属性名'),
                }
              ]}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormSelect
              options={[
                { label: 'Int', value: 'int' },
                { label: 'String', value: 'string' },
                { label: 'Double', value: 'double' },
                { label: 'Float', value: 'float' },
                { label: 'Boolean', value: 'boolean' },
                { label: 'Bytes', value: 'bytes' },
              ]}
              name="type"
              label='属性类型'
              width="xl"
              placeholder="请选择属性类型"
              rules={[
                {
                  required: false,
                  message: ('请选择属性类型'),
                },
              ]}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
