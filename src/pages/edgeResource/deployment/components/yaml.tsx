import React, { useEffect, useRef, useState } from "react";
import { message, Modal } from "antd";
import type { DeptType } from "../data.d";
// import CodeMirrorBox from '@/components/CodeMirror';
import { editYaml } from "../service";

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";

import "codemirror/mode/yaml-frontmatter/yaml-frontmatter";
import "codemirror/theme/idea.css";
import "codemirror/addon/selection/active-line";
import yaml from "js-yaml";
import getYAMLJS from "yamljs";

export type DeptFormValueType = Record<string, unknown> & Partial<DeptType>;

export type DeptFormProps = {
  onCancel: (formVals?: DeptFormValueType, flag?: boolean) => void;
  onSubmit: (values: DeptFormValueType) => Promise<void>;
  visible: boolean;
  values: Partial<any>;
};

const DeptForm: React.FC<DeptFormProps> = (props) => {
  const { values } = props;
  const [yamlStr, setYamlStr] = useState<any>(yaml.dump(values));
  const [submitVal, setSubmitVal] = useState();
  const myCodeMirrorRef = useRef();

  const handleOk = async () => {
    console.log(getYAMLJS.parse(submitVal));
    // const res = {};
    const res = await editYaml(
      values.metadata.namespace,
      values.metadata.name,
      getYAMLJS.parse(submitVal)
    );
    console.log(res);
    if (res.status && res.status.conditions) {
      message.success("修改成功");
      props.onCancel(res, true);
      return;
    }
  };
  const handleChange = (codeMirror, changeObj, value) => {
    setYamlStr(value);
    setSubmitVal(value);
  };
  const options = {
    smartIndent: true, //自动缩进
    tabSize: 4,
    autoRefresh: true, // 自动刷新
    styleActiveLine: true,
    // readOnly: true, // 只读
    matchBrackets: true, //括号匹配，光标旁边的括号都高亮显示
    lineNumbers: true, // 显示行号
    theme: "idea", // 设置主题
    mode: {
      name: "yaml-frontmatter",
    },
  };

  const handleEditorDidMount = (editor) => {
    // editor.setSize("100%", "100%");
    editor.refresh();
    editor.setValue(yamlStr);
  };

  useEffect(() => {
    setYamlStr(yaml.dump(values));
  }, [values]);

  return (
    <Modal
      width={840}
      title="YAML"
      zIndex={1001}
      open={props.visible}
      onOk={handleOk}
      onCancel={props.onCancel}
    >
      <CodeMirror
        ref={myCodeMirrorRef}
        value={yamlStr}
        options={options}
        editorDidMount={handleEditorDidMount}
        onBeforeChange={handleChange}
      ></CodeMirror>
    </Modal>
  );
};

export default DeptForm;
