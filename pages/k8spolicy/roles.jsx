import { Box, Button, Fab, Grid, TextField, Typography } from '@mui/material'
import DataCard from "@/components/Pages/DataCard"
import { useEffect, useState } from "react"
import { getList, removeItem } from '@/api/roles'
import DataTable from "@/components/Pages/DataTable"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddModal from "@/components/Pages/AddModal"
import AlertModal from '@/components/global/AlertModal'
import QueryContainer from '@/components/Pages/QueryContainer'


// 表单初始值
const formValue = {
  name: '',
  verbs: [{ value: '' }],
  apiGroups: [{ value: '' }],
  resources: [{ value: '' }],
  resourceNames: [{ value: '' }]
}

const Roles = (props) => {
  const [roleList, setRoleList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(formValue)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })

  // 抽取列表数据
  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/rolesList?namespaces=${sessionStorage.getItem('namespace')}`)
    const res = await resp.json()
    setRoleList(handleListData(res.data))
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
      title: '创建时间',
      key: 'creationTimestamp'
    },
    {
      title: '操作',
      key: 'operate',
      render: (record) => <Button variant="text" size="small" color="error" onClick={() => handleDelete(record)}>删除</Button>
    },
  ]

  // roles 删除
  const handleRemoveOne = async () => {
    if (!deleteName) return
    const resp = await fetch(`/api/rolesRemove?namespaces=${sessionStorage.getItem('namespace')}&name=${deleteName}`);
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


  const handleCancel = () => {
    setAddOpen(false)
    setForm(formValue)
  }

  const handleFieldChange = (field, value, index) => {
    if (field == 'name') {
      setForm({ ...form, [field]: value })
    } else {
      const origin = form[field] // 该字段原数据
      origin[index].value = value
      setForm({ ...form, [field]: origin })
    }
  }

  // 字段复制
  const handleFieldCopy = (field, value) => {
    const origin = form[field]
    origin.push(value || '')
    setForm({ ...form, [field]: origin })
  }

  // 字段删除
  const handleFieldDelete = (field, index) => {
    if (index === 0) return
    const origin = form[field]
    origin.splice(index, 1)
    setForm({ ...form, [field]: origin })
  }

  const handleRolesAdd = async () => {
    console.log(form);
    const params = {
      kind: 'Role',
      apiVersion: 'rbac.authorization.k8s.io/v1',
      metadata: {
        name: form.name,
        namespace: sessionStorage.getItem('namespace')
      },
      rules: [{
        verbs: form.verbs.map(item => item.value),
        apiGroups: form.apiGroups.map(item => item.value),
        resources: form.resources.map(item => item.value),
        resourceNames: form.resourceNames.map(item => item.value),
      }]
    }
    const resp = await fetch(`/api/rolesAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
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
        </Grid>
      </QueryContainer> */}
      <DataCard title='roles' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={roleList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <AddModal open={addOpen} maxWidth={'md'} handleClose={setAddOpen} onCancel={handleCancel} handleOk={handleRolesAdd}>
        <Box>
          <Grid item xs={12} sx={{ marginBottom: '10px' }}>
            <Typography as='h5' sx={{
              fontWeight: "500",
              fontSize: "14px",
              mb: "12px",
            }}>名称</Typography>
            <TextField
              placeholder='请输入名称'
              fullWidth
              id="name"
              name="name"
              size='small'
              autoComplete="name"
              InputProps={{
                style: { borderRadius: 8 },
              }}
              value={form.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
            />
          </Grid>

          <Box sx={{ display: 'flex', mb: '20px' }}>
            <Grid item xs={12} sx={{ width: '50%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                }}>verbs</Typography>
                <Button size='small' onClick={() => handleFieldCopy('verbs')}>新建</Button>
              </Box>

              {form.verbs.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                  <TextField
                    placeholder='请输入'
                    id="name"
                    name="name"
                    size='small'
                    InputProps={{
                      style: { borderRadius: 8 },
                    }}
                    value={item.value}
                    sx={{ width: '80%' }}
                    onChange={(e) => handleFieldChange('verbs', e.target.value, index)}
                  />
                  <Fab color='primary' sx={{ width: '30px', height: '30px', minHeight: '30px', ml: '10px' }} onClick={() => handleFieldCopy('verbs', item)}>
                    <ContentCopyIcon sx={{ fontSize: '16px' }} />
                  </Fab>
                  <Fab color='primary' sx={{ width: '30px', height: '30px', minHeight: '30px', ml: '5px' }} onClick={() => handleFieldDelete('verbs', index)}>
                    <ClearIcon sx={{ fontSize: '16px' }} />
                  </Fab>

                </Box>
              ))}
            </Grid>

            <Grid item xs={12} sx={{ width: '50%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                }}>apiGroups</Typography>
                <Button size='small' onClick={() => handleFieldCopy('apiGroups')}>新建</Button>
              </Box>

              {form.apiGroups.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                  <TextField
                    id="name"
                    placeholder='请输入'
                    name="name"
                    size='small'
                    InputProps={{
                      style: { borderRadius: 8 },
                    }}
                    value={item.value}
                    sx={{ width: '80%' }}
                    onChange={(e) => handleFieldChange('apiGroups', e.target.value, index)}
                  />
                  <Fab color='primary' sx={{ width: '30px', height: '30px', minHeight: '30px', ml: '20px' }} onClick={() => handleFieldCopy('apiGroups', item)}>
                    <ContentCopyIcon sx={{ fontSize: '16px' }} />
                  </Fab>
                  <Fab color='primary' sx={{ width: '30px', height: '30px', minHeight: '30px', ml: '5px' }} onClick={() => handleFieldDelete('apiGroups', index)}>
                    <ClearIcon sx={{ fontSize: '16px' }} />
                  </Fab>

                </Box>
              ))}
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', mb: '20px' }}>
            <Grid item xs={12} sx={{ width: '50%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                }}>resources</Typography>
                <Button size='small' onClick={() => handleFieldCopy('resources')}>新建</Button>
              </Box>

              {form.resources.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                  <TextField
                    id="name"
                    placeholder='请输入'
                    name="name"
                    size='small'
                    InputProps={{
                      style: { borderRadius: 8 },
                    }}
                    value={item.value}
                    sx={{ width: '80%' }}
                    onChange={(e) => handleFieldChange('resources', e.target.value, index)}
                  />
                  <Fab color='primary' sx={{ width: '30px', height: '30px', minHeight: '30px', ml: '10px' }} onClick={() => handleFieldCopy('resources', item)}>
                    <ContentCopyIcon sx={{ fontSize: '16px' }} />
                  </Fab>
                  <Fab color='primary' sx={{ width: '30px', height: '30px', minHeight: '30px', ml: '5px' }} onClick={() => handleFieldDelete('resources', index)}>
                    <ClearIcon sx={{ fontSize: '16px' }} />
                  </Fab>

                </Box>
              ))}

            </Grid>

            <Grid item xs={12} sx={{ width: '50%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                }}>resourceNames</Typography>
                <Button size='small' onClick={() => handleFieldCopy('resourceNames')}>新建</Button>
              </Box>

              {form.resourceNames.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                  <TextField
                    id="name"
                    placeholder='请输入'
                    name="name"
                    size='small'
                    InputProps={{
                      style: { borderRadius: 8 },
                    }}
                    value={item.value}
                    sx={{ width: '80%' }}
                    onChange={(e) => handleFieldChange('resourceNames', e.target.value, index)}
                  />
                  <Fab color='primary' sx={{ width: '30px', height: '30px', minHeight: '30px', ml: '20px' }} onClick={() => handleFieldCopy('resourceNames', item)}>
                    <ContentCopyIcon sx={{ fontSize: '16px' }} />
                  </Fab>
                  <Fab color='primary' sx={{ width: '30px', height: '30px', minHeight: '30px', ml: '5px' }} onClick={() => handleFieldDelete('resourceNames', index)}>
                    <ClearIcon sx={{ fontSize: '16px' }} />
                  </Fab>
                </Box>
              ))}

            </Grid>
          </Box>

        </Box>
      </AddModal>
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
    </>
  )
}

export default Roles