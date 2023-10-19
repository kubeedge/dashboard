import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/xq-light.css';
import * as JsYaml from 'js-yaml'

const { UnControlled: CodeMirror } = (typeof window !== 'undefined' && require('react-codemirror2')) || {}

if (typeof window !== 'undefined') {
  require('codemirror/lib/codemirror')
  require('codemirror/mode/yaml-frontmatter/yaml-frontmatter')
  require('codemirror/addon/selection/active-line')
}

const options = {
  smartIndent: true,  //自动缩进
  tabSize: 4,
  autoRefresh: true, // 自动刷新
  styleActiveLine: true,
  readOnly: true, // 只读
  foldGutter: true,
  matchBrackets: true,  //括号匹配，光标旁边的括号都高亮显示
  lineNumbers: true, // 显示行号
  theme: 'xq-light', // 设置主题
  mode: {
    name: 'yaml-frontmatter'
  },
}

const CrdShowYMAL = ({ open, yaml, toggleShowYAML }) => {
  const [yamlStr, setYamlStr] = useState();
  const handleBlur = () => {
    setYamlStr(JsYaml.dump(yaml))
  }

  return (
    <>
      <Dialog fullWidth maxWidth='md' open={open} onClose={() => toggleShowYAML(false)} scroll='paper'>
        <DialogTitle>YMAL</DialogTitle>
        <DialogContent>
          {yaml ?
            <CodeMirror value={yamlStr} options={options} editorDidMount={handleBlur} />
            : <CircularProgress />
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => toggleShowYAML(false)}>取消</Button>
          <Button onClick={() => toggleShowYAML(false)} variant="contained">确定</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CrdShowYMAL