import { Button, Box, TextField, Grid, Typography, FormControl, Select, MenuItem } from '@mui/material'
import DataCard from "@/components/Pages/DataCard"
import { useEffect, useState } from "react"
import { getList } from '@/api/ruleEndpoint'
import DataTable from "@/components/Pages/DataTable"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddModal from "@/components/Pages/AddModal"
import AddIcon from '@mui/icons-material/Add';
import AlertModal from '@/components/global/AlertModal'
import QueryContainer from '@/components/Pages/QueryContainer'

const formValue = {
  type: '',
  name: '',
  port: ''
}

const typeList = [
  { label: 'rest', value: 'rest' },
  { label: 'eventbus', value: 'eventbus' },
  { label: 'servicebus', value: 'servicebus' }
]

const RuleEndpoint = (props) => {
  const [rulePointList, setRulePointList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formValue)))
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })

  // 抽取列表信息
  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      type: item.spec.ruleEndpointType,
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/ruleEndpointList?namespaces=${sessionStorage.getItem('namespace')}`)
    const res = await resp.json()
    setRulePointList(handleListData(res.data))
  }

  useEffect(() => {
    refetchDataList()
  }, [])

  const handleDelete = (record) => {
    setDeleteName(record.name);
    setOpen(true); // 弹出确认删除框
  }

  const tableTitleList = [
    {
      title: '名称',
      key: 'name'
    },
    {
      title: '类型',
      key: 'type'
    },
    {
      title: '创建时间',
      key: 'creationTimestamp'
    },
    {
      title: '操作',
      key: 'operate',
      render: (record) => <Button variant="text" size="small" color="error" onClick={() => handleDelete(record)}>删除</Button>
    },
  ]

  const handleRemoveOne = async () => {
    if (!deleteName) return
    const resp = await fetch(`/api/ruleEndpointRemove?namespaces=${sessionStorage.getItem('namespace')}&name=${deleteName}`);
    const res = await resp.json();
    if (res && res.data.status == 'Success') {
      refetchDataList()
      setOpen(false);
      setAlertInfo({
        type: 'success',
        msg: '删除成功'
      })
      setAlertOpen(true)
    }
  }

  const modelOptions = {
    title: "删除",
    desc: "确定删除该项吗",
    icon: InfoOutlinedIcon,
    color: 'rgb(205,173,20)',
    onOk: handleRemoveOne
  }

  const cardActions = [<Button key='add' startIcon={<AddIcon />} type='primary' variant="contained" onClick={() => setAddOpen(true)}>新建消息端点</Button>]

  const handleFieldChange = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const handleCancel = () => {
    setAddOpen(false)
    setForm(formValue)
  }

  // 消息端点添加
  const handleRuleEndpointAdd = async () => {
    const params = {
      "apiVersion": "rules.kubeedge.io/v1",
      "kind": "RuleEndpoint",
      "metadata": {
        "name": form.name
      },
      "spec": {
        "ruleEndpointType": form.type,
        "properties": {
          service_port: form.port
        }
      }
    }
    const resp = await fetch(`/api/ruleEndpointAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
      method: 'post',
      body: JSON.stringify(params)
    })
    const res = await resp.json()
    if (res.data && res.data.status == 'Success') {
      handleCancel()
      refetchDataList()
      setAlertInfo({
        type: 'success',
        msg: '添加成功'
      })
    } else {
      setAlertInfo({
        type: 'error',
        msg: '添加失败，请重试'
      })
    }
    setAlertOpen(true)
  }

  return (
    <>
      {/* <QueryContainer>
        <Grid container spacing={2} justifyContent='flex-start' sx={{ px: '20px' }}>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>名称：</Typography>
              <TextField placeholder='请输入名称' size='small' />
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>类型：</Typography>
              <TextField placeholder='请输入类型' size='small' />
            </Box>
          </Grid>
        </Grid>
      </QueryContainer> */}
      <DataCard title='消息端点' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={rulePointList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <AddModal title='新建消息端点' open={addOpen} maxWidth={'sm'} handleClose={setAddOpen} onCancel={handleCancel} handleOk={handleRuleEndpointAdd}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
            <Typography as='h5' sx={{
              fontWeight: "500",
              fontSize: "14px",
              width: '100px'
            }}>消息端点类型：</Typography>
            <FormControl sx={{ width: '80%' }} size='small'>
              <Select placeholder="请选择设备模型" labelId='source-select' value={form.type} onChange={(e) => handleFieldChange('type', e.target.value)}>
                {typeList.map((item, index) => (
                  <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
            <Typography as='h5' sx={{
              fontWeight: "500",
              fontSize: "14px",
              width: '100px'
            }}>消息端点名称：</Typography>
            <TextField
              sx={{ width: '80%' }}
              placeholder='请输入消息端点名称'
              name="name"
              size='small'
              InputProps={{
                style: { borderRadius: 4 },
              }}
              value={form.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
            />
          </Box>
          {form.type == 'servicebus' && <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
            <Typography as='h5' sx={{
              fontWeight: "500",
              fontSize: "14px",
              width: '100px'
            }}>端口：</Typography>
            <TextField
              sx={{ width: '80%' }}
              placeholder='请输入端口'
              name="port"
              size='small'
              InputProps={{
                style: { borderRadius: 4 },
              }}
              value={form.port}
              onChange={(e) => handleFieldChange('port', e.target.value)}
            />
          </Box>}
        </Box>
      </AddModal>
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
    </>
  )
}

export default RuleEndpoint