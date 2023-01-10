import React, { useEffect, useState } from 'react';
import ProForm, { ProFormDigit, ProFormText, ProFormRadio, ProFormTreeSelect, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Form, Modal, Row, Col, Input } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import type { DeviceType, listType } from '../data';
import { getDevicemodelsList, getNodes } from '../service'
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import { times } from 'lodash';

/* *
 *
 * @author whiteshader@163.com
 * @datetime  2021/09/16
 * 
 * */

export type DeviceFormValueType = Record<string, unknown> & Partial<DeviceType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeviceFormValueType) => void;
  onSubmit: (values: DeviceFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<listType>;
};
type DataSourceType = {
  id: React.Key;
  key?: string;
  type?: string;
  value?: string;
};
const DeptForm: React.FC<DeptFormProps> = (props) => {
  const [form] = Form.useForm();
  const twinsList: DataSourceType[] = [
    {
      id: 1,
      key: '',
      type: '',
      value: ''
    }
  ]
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    twinsList.map((item) => item.id),
  );
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
      apiVersion: 'devices.kubeedge.io/v1alpha2',
      kind: 'Device',
      metadata: {
        labels: {
          description: values.description
        },
        name: values.name,
        namespace: sessionStorage.getItem("nameSpace"),
      },
      spec: {
        deviceModelRef: {
          name: values.model,
        },
        nodeSelector: {
          nodeSelectorTerms: [
            {
              matchExpressions: [
                {
                  key: '',
                  operator: 'In',
                  values: [values.node]
                }
              ]
            }
          ]
        },
        protocol: {
          customizedProtocol: {
            protocolName: values.protocol
          }
        }
      },
      status: {
        twins: values.dataSource.map(item => {
          return {
            desired: {
              metadata: {
                type: item.type
              },
              value: item.value
            },
            "propertyName": item.key,
            reported: {
              metadata: {
                  "type": item.type,
              },
              value: item.value
            }
          }
        })
      }
    }
    props.onSubmit(params as DeviceFormValueType);
  };

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '属性名',
      dataIndex: 'key',
      width: '30%',
    },
    {
      title: '类型',
      key: 'type',
      dataIndex: 'type',
      valueType: 'select',
      width: '30%',
      valueEnum: {
        Int: { text: 'Int', status: 'Int' },
        String: { text: 'String', status: 'String' },
        Double: { text: 'Double', status: 'Double' },
        Float: { text: 'Float', status: 'Float' },
        Boolean: { text: 'Boolean', status: 'Boolean' },
        Bytes: { text: 'Bytes', status: 'Bytes' },
      },
    },
    {
      title: '属性值',
      dataIndex: 'value',
      width: '30%',
    },
    {
      title: '操作',
      valueType: 'option',
    },
  ]

  return (
    <Modal
      width={640}
      title='添加实例'
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
              label='实例名称'
              width="xl"
              placeholder="请输入实例名称"
              rules={[{ required: false,message: "请输入实例名称！" },
              { pattern: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/, message: '必须由小写字母数字“-”或“”组成。，并且必须以字母和数字字符开头和结尾' }]}
            />
            <ProFormSelect
              name="model"
              label="设备模型"
              request={async () => {
                const res = await getDevicemodelsList(sessionStorage.getItem("nameSpace"))
                return res.items.map(item => {
                  return {
                    label: item.metadata.name,
                    value: item.metadata.name
                  }
                })
              }}
              placeholder="请选择设备模型"
              rules={[{ required: false, message: '请选择设备模型！' }]}
            />
            <ProFormText
              name="protocol"
              label='访问协议'
              width="xl"
              placeholder="请输入访问协议"
              rules={[{ required: false,message: "请输入访问协议！" }]}
            />
            <ProFormSelect
              name="node"
              label="节点"
              request={async () => {
                const res = await getNodes()
                return res.items.map(item => {
                  return {
                    label: item.metadata.name,
                    value: item.metadata.name
                  }
                })
              }}
              placeholder="请选择节点"
              rules={[{ required: false, message: '请选择节点！' }]}
            />
            <ProFormTextArea 
              name="description" 
              label='描述' 
              width="xl" 
              placeholder=''
              rules={[{ pattern: /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/, message: '必须是空字符串或由字母数字字符“-”、“_”或“.”组成，并且必须以字母数字字符开头和结尾' }]}
            />
          </Col>
          <Col span={24} order={1}>
          <ProForm.Item
            label="孪生属性"
            name="dataSource"
            initialValue={twinsList}
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
            </ProForm.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DeptForm;
