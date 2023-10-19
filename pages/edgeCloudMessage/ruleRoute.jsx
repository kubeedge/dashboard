import { Button, Box, TextField, Grid, Typography, FormControl, Select, MenuItem } from '@mui/material'
import DataCard from "@/components/Pages/DataCard"
import { useEffect, useState } from "react"
import { getList } from '@/api/ruleRoute'
import DataTable from "@/components/Pages/DataTable"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddModal from "@/components/Pages/AddModal"
import AddIcon from '@mui/icons-material/Add';
import AlertModal from '@/components/global/AlertModal'
import QueryContainer from '@/components/Pages/QueryContainer'

const formValue = {
  name: '',
  source: '',
  sourceResource: '',
  target: '',
  targetResource: '',
  desc: ''
}

const RuleRoute = (props) => {
  const [ruleRouteList, setRuleRouteList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formValue)))
  const [nodeList, setNodeList] = useState([])
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })

  // 抽取列表数据
  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      source: item.spec.source,
      sourceResource: item.spec.sourceResource.path || '-',
      target: item.spec.target,
      targetResource: item.spec.targetResource.path || '-',
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/ruleRouteList?namespaces=${sessionStorage.getItem('namespace')}`)
    const res = await resp.json()
    setRuleRouteList(handleListData(res.data))
  }

  useEffect(() => {
    refetchDataList()
  }, [])

  // 获取 nodeLists
  useEffect(() => {
    async function fetchNodelists() {
      const resp = await fetch(`/api/ruleRoute?namespace=${sessionStorage.getItem('namespace')}`)
      const res = await resp.json();
      setNodeList(res.data.items)
    }
    fetchNodelists()
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
      title: '原端点',
      key: 'source'
    },
    {
      title: '原端点资源',
      key: 'sourceResource'
    },
    {
      title: '目标端点',
      key: 'target'
    },
    {
      title: '目标资源端点',
      key: 'targetResource'
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

  // 消息路由删除
  const handleRemoveOne = async () => {
    if (!deleteName) return
    const resp = await fetch(`/api/ruleRouteRemove?namespaces=${sessionStorage.getItem('namespace')}&name=${deleteName}`);
    const res = await resp.json()
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

  const cardActions = [<Button key='add' startIcon={<AddIcon />} type='primary' variant="contained" onClick={() => setAddOpen(true)}>新建</Button>]

  const handleFieldChange = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const handleCancel = () => {
    setAddOpen(false)
    setForm(formValue)
  }

  const handleRuleRouteAdd = async () => {
    const params = {
      "apiVersion": "rules.kubeedge.io/v1",
      "kind": "Rule",
      "metadata": {
        "name": form.name,
        "labels": {
          "description": form.desc
        }
      },
      "spec": {
        "source": form.source,
        "sourceResource": {
          path: form.sourceResource
        },
        "target": form.target,
        "targetResource": {
          path: form.targetResource
        }
      }
    }
    const resp = await fetch(`/api/ruleRouteAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
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
              <Typography component='h4' sx={{ fontSize: '16px' }}>原端点：</Typography>
              <TextField placeholder='请输入' size='small' />
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>原端点资源：</Typography>
              <TextField placeholder='请输入' size='small' />
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>目标端点：</Typography>
              <TextField placeholder='请输入' size='small' />
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>目的端点资源：</Typography>
              <TextField placeholder='请输入' size='small' />
            </Box>
          </Grid>
        </Grid>
      </QueryContainer> */}
      <DataCard title='消息路由' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={ruleRouteList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <AddModal open={addOpen} maxWidth={'sm'} handleClose={setAddOpen} onCancel={handleCancel} handleOk={handleRuleRouteAdd}>
        <Box>
          <Grid>
            <Typography as='h5' sx={{
              fontWeight: "500",
              fontSize: "14px",
              mb: "10px",
            }}>消息路由名称</Typography>
            <TextField
              fullWidth
              placeholder='请输入消息路由名称'
              size='small'
              name="name"
              InputProps={{
                style: { borderRadius: 4 },
              }}
              sx={{ mb: '10px' }}
              value={form.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
            />
            <Box sx={{ mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                mb: "10px",
              }}>源端点</Typography>
              <FormControl fullWidth size='small'>
                <Select labelId='source-select' value={form.source} onChange={(e) => handleFieldChange('source', e.target.value)}>
                  {nodeList.map((item, index) => (
                    <MenuItem key={index} value={item.metadata.name}>{item.metadata.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Typography as='h5' sx={{
              fontWeight: "500",
              fontSize: "14px",
            }}>源端点资源</Typography>
            <TextField
              fullWidth
              placeholder='请输入源端点资源'
              size='small'
              name="sourceResource"
              InputProps={{
                style: { borderRadius: 4 },
              }}
              sx={{ mt: '10px', mb: '10px' }}
              value={form.sourceResource}
              onChange={(e) => handleFieldChange('sourceResource', e.target.value)}
            />
            <Box sx={{ mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                mb: "10px",
              }}>目的端点</Typography>
              <FormControl fullWidth size='small'>
                <Select labelId='target-select' size='small' value={form.target} onChange={(e) => handleFieldChange('target', e.target.value)}>
                  {nodeList.map((item, index) => (
                    <MenuItem key={index} value={item.metadata.name}>{item.metadata.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Typography as='h5' sx={{
              fontWeight: "500",
              fontSize: "14px",
            }}>目的端点资源</Typography>
            <TextField
              placeholder='请输入目的端点资源'
              fullWidth
              size='small'
              name="targetResource"
              InputProps={{
                style: { borderRadius: 4 },
              }}
              sx={{ mt: '10px', mb: '10px' }}
              value={form.targetResource}
              onChange={(e) => handleFieldChange('targetResource', e.target.value)}
            />
            <Typography as='h5' sx={{
              fontWeight: "500",
              fontSize: "14px",
            }}>描述</Typography>
            <TextField
              fullWidth
              placeholder='请输入'
              size='small'
              multiline
              rows={4}
              name="desc"
              InputProps={{
                style: { borderRadius: 4 },
              }}
              sx={{ mt: '10px', mb: '10px' }}
              value={form.desc}
              onChange={(e) => handleFieldChange('desc', e.target.value)}
            />
          </Grid>
        </Box>
      </AddModal>
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
    </>
  )
}

export default RuleRoute