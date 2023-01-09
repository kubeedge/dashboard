import React, { useEffect, useRef, useState } from 'react';
import { FormInstance, message, Modal } from 'antd';
import type { DeptType, listType } from '../data.d';
// import CodeMirrorBox from '@/components/CodeMirror';
import { editYaml } from '../service'

import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror.js'

import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter';
import 'codemirror/theme/idea.css'
import 'codemirror/addon/selection/active-line';
import yaml from 'js-yaml'
import getYAMLJS from 'yamljs'

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (formVals?: DeptFormValueType, flag?: boolean) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<any>;
};

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const { values } = props;
  const [yamlStr, setYamlStr] = useState<any>();
  const [submitVal, setSubmitVal] = useState();
  useEffect(() => {}, [props])
  const myCodeMirrorRef = useRef()

  const handleOk = async () => {
    console.log(getYAMLJS.parse(submitVal))
    const res = await editYaml(values.metadata.name, getYAMLJS.parse(submitVal))
    console.log(res)
    if (res.status && res.status.nodeInfo) {
      message.success('修改成功')
      props.onCancel(res, true);
      return
    }
  };
  const handleCancel = () => {
    props.onCancel(values, true);
  };
  const handleBlur = () => {
    console.log(values);
    setYamlStr(yaml.dump(values))
  }
  const handleChange = (CodeMirror, changeObj, value) => {
    setSubmitVal(value)
  }
  const options = {
    smartIndent:true,  //自动缩进
    tabSize: 4,
    autoRefresh: true, // 自动刷新
    styleActiveLine:true,
    // readOnly: true, // 只读
    matchBrackets: true,  //括号匹配，光标旁边的括号都高亮显示
    lineNumbers: true, // 显示行号
    theme: 'idea', // 设置主题
    mode: {
      name: 'yaml-frontmatter'
    }
  }

  return (
    <Modal width={840} title='YAML' visible={props.visible} destroyOnClose onOk={handleOk} onCancel={handleCancel}>
      <CodeMirror ref={myCodeMirrorRef} cursor={{
    line: 20,
    ch: 1
  }} value={yamlStr} options={options} editorDidMount={handleBlur} onChange={handleChange}></CodeMirror>
    </Modal>
  );
};

export default DeptForm;
