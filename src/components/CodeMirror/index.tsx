import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

// 引入codemirror核心css,js文件（经试验css必须有，js文件还没发现它的用处）
import 'codemirror/lib/codemirror.css';
import 'codemirror/lib/codemirror.js'

import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter';

// 引入主题
import 'codemirror/theme/idea.css'

//ctrl+空格代码提示补全
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint.js';
//代码高亮
import 'codemirror/addon/selection/active-line';
//折叠代码
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import getYAMLJS from 'yamljs'

// 引入 yamljs 先安装 npm i yamljs
// const getYAMLJS = require('yamljs');
export type FormProps = {
  values: string;
  options: 
};

const CodeMirrorBox: React.FC<FormProps> = (props) => {
    const { values } = props
    const str = getYAMLJS.parse(JSON.stringify(values))
    return (
      <CodeMirror
        value={str}
        options={{
          // smartIndent:true,  //自动缩进
          // styleActiveLine:true,//光标代码高亮
          // autofocus:true,//自动获取焦点
          // readOnly: true, // 只读
          // matchBrackets: true,  //括号匹配，光标旁边的括号都高亮显示
          // autoCloseBrackets: true, //键入时将自动关闭()[]{}''""
          lineNumbers: true, // 显示行号
          theme: 'idea', // 设置主题
          mode: {
            name: 'yaml-frontmatter',
            // name: "javascript", // 没错，需要先引入 javascript
            // json: true
          },

          // (以下三行)设置支持代码折叠
          lineWrapping:true,
          foldGutter:true,
          gutters:['CodeMirror-linenumbers','CodeMirror-foldgutter'],
        }}

      // 在失去焦点的时候触发，这个时候放数据最好
      // onBlur={this.codeOnBlur}

      // 这个有必要加上，否则在一些情况下，第二次打开就会有问题
      // onBeforeChange={(editor, data, value) => {
      //   console.log("onBeforeChange fresh")
      //   console.log(JSON.stringify(data));
      // }}
      />
    );
}

export default CodeMirrorBox;