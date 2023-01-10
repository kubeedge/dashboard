import React, { useEffect } from 'react';
import { ProFormDigit, ProFormText, ProFormRadio, ProFormTreeSelect, ProFormSelect } from '@ant-design/pro-form';
import { Form, Modal, Row, Col } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import type { DeptType, listType } from '../data';
import { getSecretsList } from '../service';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 * 
 * */

export type AccountFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: AccountFormValueType) => void;
  onSubmit: (values: AccountFormValueType) => Promise<void>;
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

  const intl = useIntl();
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
  };
  const handleFinish = async (values: Record<string, any>) => {
    const params = {
      kind: 'ServiceAccount',
      apiVersion: 'v1',
      metadata: {
        name: values.name,
        namespace: sessionStorage.getItem("nameSpace"),
      },
      secrets:[{
        name: values.secret
      }]
    }
    props.onSubmit(params as AccountFormValueType);
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
              label='名称'
              width="xl"
              placeholder="请输入名称"
              rules={[{ required: false, message: "请输入名称" }]}
            />
            <ProFormSelect
              name="secret"
              label="秘钥"
              request={async () => {
                const res = await getSecretsList(sessionStorage.getItem("nameSpace"))
                return res.items.map(item => {
                  return {
                    label: item.metadata.name,
                    value: item.metadata.name
                  }
                })
              }}
              placeholder="请选择秘钥"
              rules={[{ required: false, message: '请选择秘钥' }]}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
