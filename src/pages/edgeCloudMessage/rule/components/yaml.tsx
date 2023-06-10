import React, { useRef, useState } from "react";
import { Modal } from "antd";
import type { DeptType, listType } from "../../nodeGroup/data";
// import CodeMirrorBox from '@/components/CodeMirror';

import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";

import "codemirror/mode/yaml-frontmatter/yaml-frontmatter";
import "codemirror/theme/idea.css";
import "codemirror/addon/selection/active-line";
import yaml from "js-yaml";

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (flag?: boolean, formVals?: DeptFormValueType) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: any;
};

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const { values } = props;
  const [yamlStr, setYamlStr] = useState<any>();

  const myCodeMirrorRef = useRef();

  const handleOk = () => {
    setYamlStr("");
    props.onCancel();
  };
  const handleCancel = () => {
    setYamlStr("");
    props.onCancel();
  };
  const handleBlur = () => {
    setYamlStr(yaml.dump(values));
  };
  const options = {
    focused: true,
    smartIndent: true, //自动缩进
    tabSize: 4,
    styleActiveLine: true,
    readOnly: true, // 只读
    matchBrackets: true, //括号匹配，光标旁边的括号都高亮显示
    lineNumbers: true, // 显示行号
    theme: "idea", // 设置主题
    mode: {
      name: "yaml-frontmatter",
    },
  };

  return (
    <Modal
      width={840}
      title="YAML"
      destroyOnClose
      open={props.visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <CodeMirror
        ref={myCodeMirrorRef}
        value={yamlStr}
        options={options}
        editorDidMount={handleBlur}
      ></CodeMirror>
    </Modal>
  );
};

export default DeptForm;
