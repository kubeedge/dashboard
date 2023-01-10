import React, { useEffect } from 'react';
import ProForm, { ProFormDigit, ProFormText, ProFormRadio, ProFormTreeSelect, ProFormList, ProFormGroup } from '@ant-design/pro-form';
import { Form, Modal, Row, Col } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import type { DeptType, listType } from '../data';
import { CloseCircleOutlined } from '@ant-design/icons';

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
    const params = {
      kind: 'Role',
      apiVersion: 'rbac.authorization.k8s.io/v1',
      metadata: {
        name: values.name,
        namespace: sessionStorage.getItem("nameSpace")
      },
      rules: [{
        verbs: values.verbs.map(item => item.value),
        apiGroups: values.apiGroups.map(item => item.value),
        resources: values.resources.map(item => item.value),
        resourceNames: values.resourceNames.map(item => item.value),
      }]
    }
    props.onSubmit(params as DeptFormValueType);
  };

  return (
    <Modal
      width={940}
      title='新建'
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm  form={form} onFinish={handleFinish} initialValues={props.values}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="name"
              label='名称'
              width="lg"
              placeholder="请输入名称"
              rules={[
                {
                  required: false,
                  message: "请输入名称"
                },
              ]}
            />
          </Col>
          <Col span={12} order={1}>
            <ProFormList
              name="verbs"
              label="verbs"
              initialValue={[
                {
                  value: '',
                },
              ]}
              creatorButtonProps={{
                creatorButtonText: '新建',
                icon: false,
                type: 'link',
                style: { width: 'unset',float: 'right' },
                position: 'top',
              }}
              deleteIconProps={{
                Icon: CloseCircleOutlined,
                tooltipText: '删除',
              }}
            > 
              <ProFormText width="md" name="value"/>
            </ProFormList>
          </Col>
          <Col span={12} order={1}>
            <ProFormList
              name="apiGroups"
              label="apiGroups"
              initialValue={[
                {
                  value: '',
                },
              ]}
              creatorButtonProps={{
                creatorButtonText: '新建',
                icon: false,
                type: 'link',
                style: { width: 'unset',float: 'right' },
                position: 'top',
              }}
              deleteIconProps={{
                Icon: CloseCircleOutlined,
                tooltipText: '删除',
              }}
            > 
              <ProFormText width="md" name="value"/>
            </ProFormList>
          </Col>
          <Col span={12} order={1}>
            <ProFormList
              name="resources"
              label="resources"
              initialValue={[
                {
                  value: '',
                },
              ]}
              creatorButtonProps={{
                creatorButtonText: '新建',
                icon: false,
                type: 'link',
                style: { width: 'unset',float: 'right' },
                position: 'top',
              }}
              deleteIconProps={{
                Icon: CloseCircleOutlined,
                tooltipText: '删除',
              }}
            > 
              <ProFormText width="md" name="value"/>
            </ProFormList>
          </Col>
          <Col span={12} order={1}>
            <ProFormList
              name="resourceNames"
              label="resourceNames"
              initialValue={[
                {
                  value: '',
                },
              ]}
              creatorButtonProps={{
                creatorButtonText: '新建',
                icon: false,
                type: 'link',
                style: { width: 'unset',float: 'right' },
                position: 'top',
              }}
              deleteIconProps={{
                Icon: CloseCircleOutlined,
                tooltipText: '删除',
              }}
            > 
              <ProFormText width="md" name="value"/>
            </ProFormList>
          </Col>
        </Row>
      </ProForm>
    </Modal>
  );
};

export default DeptForm;
