import React, { useEffect, useState } from 'react';
import ProForm, { ProFormDigit, ProFormText, ProFormRadio, ProFormTreeSelect } from '@ant-design/pro-form';
import { Form, Modal, Row, Col, Card } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import type { SecretType, listType } from '../data';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 * 
 * */

export type DeptFormValueType = Record<string, unknown> & Partial<SecretType>;

export type SecretFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<listType>;
};
type DataSourceType = {
  id: React.Key;
  key?: string;
  value?: string;
};
const SecretForm: React.FC<SecretFormProps> = (props) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      name: props.values.name,
    });
  }, [form, props]);
  const dataOpaList: DataSourceType[] = [
    {
      id: 1,
      key: '',
      value: ''
    }
  ]
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    dataOpaList.map((item) => item.id),
  );
  const [formType, setFormType] = useState('kubernetes.io/dockerconfigjson')
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
    form.resetFields();
  };
  const handleFinish = async (values: Record<string, any>) => {
    const params = {
      kind: 'Secret',
      apiVersion: 'v1',
      type: values.type,
      metadata: {
        namespace: values.namespace,
        name: values.name
      },
      data: {}
    }
    if (values.type == 'kubernetes.io/dockerconfigjson') {
      const auth = window.btoa(`${values.username}: ${values.password}`)
      const info = {}
      info[values.server] = {
        username: values.username,
        password: values.password,
        auth: auth
      }
      const base64Data = window.btoa(JSON.stringify(info))
      params.data['.dockerconfigjson'] = base64Data
    } else if (values.type == 'Opaque') {
      values.dataSource?.forEach(item => {
        params.data[item.key] = item.value
      })
    }
   
    props.onSubmit(params as DeptFormValueType);
  };

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '属性名',
      dataIndex: 'key',
      width: '40%',
    },
    {
      title: '属性值',
      dataIndex: 'value',
      width: '40%',
    },
    {
      title: '操作',
      valueType: 'option',
    },
  ]

  return (
    <Modal
      width={640}
      title='新建'
      visible={props.visible}
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} onFinish={handleFinish} onChange={(val) => {
        setFormType(form.getFieldValue('type'))
      }} initialValues={{...props.values, namespace: sessionStorage.getItem("nameSpace"), type: 'Opaque', server: 'http://doacker'}}>
        <Row gutter={[16, 16]}>
          <Col span={24} order={1}>
            <ProFormText
              name="namespace"
              label='名称空间'
              width="xl"
              disabled
            />
            <ProFormText
              name="name"
              label='名称'
              width="xl"
              placeholder="请输入名称"
              rules={[
                {
                  required: false,
                  message: "请输入名称",
                },
              ]}
            />
            <ProFormRadio.Group
              name="type"
              label="类型"
              options={[
                {
                  label: 'Docker 仓库密码',
                  value: 'kubernetes.io/dockerconfigjson',
                },
                {
                  label: 'Opaque',
                  value: 'Opaque',
                },
                {
                  label: 'TLS',
                  value: 'TLS',
                },
              ]}
            />
            {formType == 'kubernetes.io/dockerconfigjson' && <Card bodyStyle={{padding: 15}}>
              <ProFormText
                name="server"
                label='docker server'
                width="xl"
                placeholder="请输入"
                rules={[
                  {
                    required: false,
                    message: "请输入",
                  },
                ]}
              />
              <ProFormText
                name="username"
                label='docker username'
                width="xl"
                placeholder="请输入"
                rules={[
                  {
                    required: false,
                    message: "请输入",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                label='docker password'
                width="xl"
                placeholder="请输入"
                rules={[
                  {
                    required: false,
                    message: "请输入",
                  },
                ]}
              />
            </Card>}
            {formType == 'Opaque' && <ProForm.Item
              label="孪生属性"
              name="dataSource"
              initialValue={dataOpaList}
              trigger="onValuesChange"
            >
              <EditableProTable<DataSourceType>
                rowKey="id"
                toolBarRender={false}
                columns={columns}
                recordCreatorProps={{
                  newRecordType: 'dataSource',
                  position: 'top',
                  record: () => ({
                    id: Date.now(),
                    addonBefore: 'ccccccc',
                    decs: 'testdesc',
                  }),
                }}
                editable={{
                  type: 'multiple',
                  editableKeys,
                  onChange: setEditableRowKeys,
                  actionRender: (row, _, dom) => {
                    return [dom.delete];
                  },
                }}
              />
            </ProForm.Item>}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default SecretForm;
