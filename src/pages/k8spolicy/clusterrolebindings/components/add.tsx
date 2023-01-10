import React, { useEffect } from 'react';
import ProForm, { ProFormDigit, ProFormText, ProFormRadio, ProFormTreeSelect, ProFormList } from '@ant-design/pro-form';
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

  const intl = useIntl();
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
      width={900}
      title='新建'
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm form={form} submitter={{resetButtonProps: {
      style: {
        // 隐藏重置按钮
        display: 'none',
      },
    },}} onFinish={handleFinish} initialValues={props.values}>
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
              name="subjects"
              label="subjects"
              initialValue={[
                {
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
              <ProFormText width="md" name="kind" placeholder='请输入kind'/>
              <ProFormText width="md" name="apiGroup" placeholder='请输入apiGroup'/>
              <ProFormText width="md" name="name" placeholder='请输入name'/>
            </ProFormList>
          </Col>
          <Col span={12} order={1}>
            <div style={{padding: '0 0 8px'}}>roleRef</div>
            <ProFormText width="md" name="kind" placeholder='请输入kind'/>
            <ProFormText width="md" name="apiGroup" placeholder='请输入apiGroup'/>
            <ProFormText width="md" name="rname" placeholder='请输入name'/>
          </Col>
        </Row>
      </ProForm>
    </Modal>
  );
};

export default DeptForm;
