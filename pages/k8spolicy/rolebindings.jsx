import { Box, Button, Grid, TextField, Typography, Fab, FormControl, Select, MenuItem } from '@mui/material'
import DataCard from "@/components/Pages/DataCard"
import { useEffect, useState } from "react"
import { getList, removeItem } from '@/api/rolebinding'
import DataTable from "@/components/Pages/DataTable"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddModal from "@/components/Pages/AddModal"
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AlertModal from '@/components/global/AlertModal'
import QueryContainer from '@/components/Pages/QueryContainer'


// 表单初始值
const formValue = {
  name: '',
  subjects: [{
    kind: '',
    apiGroup: '',
    name: ''
  }],
  roleRef: {
    kind: 'Role',
    apiGroup: 'rbac.authorization.k8s.io',
    name: ''
  }
}

const kindTypes = [
  {
    label: 'User',
    value: 'User',
    apiGroup: 'rbac.authorization.k8s.io'
  },
  {
    label: 'Group',
    value: 'Group',
    apiGroup: 'rbac.authorization.k8s.io'
  },
  {
    label: 'ServiceAccount',
    value: 'ServiceAccount',
    apiGroup: ''
  },
]

const RoleBindings = (props) => {
  const [roleBindingList, setRoleBindingList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formValue)))
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })

  // 抽取列表数据
  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      roleRef: item.roleRef.name,
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/rolebindingList?namespaces=${sessionStorage.getItem('namespace')}`)
    const res = await resp.json()
    setRoleBindingList(handleListData(res.data))
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
      title: 'roleRef',
      key: 'roleRef'
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

  // rolebinding 删除
  const handleRemoveOne = async () => {
    if (!deleteName) return
    const resp = await fetch(`/api/rolebindingRemove?namespaces=${sessionStorage.getItem('namespace')}&name=${deleteName}`);
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
    setForm(JSON.parse(JSON.stringify(formValue)))
  }

  const handleFieldChange = (field, seField, value, index) => {
    if (field == 'name') {
      setForm({ ...form, [field]: value })
    } else {
      const origin = form[field] // 该字段原数据
      if (index !== undefined) {
        if (seField == 'kind') {
          origin[index].apiGroup = kindTypes.find(type => type.value == value).apiGroup
        }
        origin[index][seField] = value
      } else {
        origin[seField] = value
      }
      setForm({ ...form, [field]: origin })
    }
  }

  // 字段复制
  const handleFieldCopy = (field, index) => {
    const origin = form[field]
    if (index !== undefined) {
      origin.push(JSON.parse(JSON.stringify(origin[index])))
    } else {
      origin.push({
        kind: '',
        apiGroup: '',
        name: ''
      })
    }
    setForm({ ...form, [field]: origin })
  }

  // 字段删除
  const handleFieldDelete = (field, index) => {
    if (index === 0) return
    const origin = form[field]
    origin.splice(index, 1)
    setForm({ ...form, [field]: origin })
  }

  // rolebinding 添加
  const handleRolebindingAdd = async () => {
    const params = {
      kind: 'RoleBinding',
      apiVersion: 'rbac.authorization.k8s.io/v1',
      metadata: {
        name: form.name,
        namespace: sessionStorage.getItem('namespace')
      },
      subjects: form.subjects.map(item => {
        return {
          kind: item.kind,
          apiGroup: item.apiGroup,
          name: item.name
        }
      }),
      roleRef: {
        kind: form.roleRef.kind,
        apiGroup: form.roleRef.apiGroup,
        name: form.roleRef.name
      }
    }
    const resp = await fetch(`/api/rolebindingAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
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
            <Box sx={{display: 'flex', alignItems: 'center', pl: '10px'}}>
              <Typography component='h4' sx={{fontSize: '16px'}}>roleRef：</Typography>
              <TextField placeholder='roleRef' size='small' />
            </Box>
          </Grid>
        </Grid>
      </QueryContainer> */}
      <DataCard title='RoleBindings' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={roleBindingList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <AddModal open={addOpen} maxWidth={'md'} handleClose={handleCancel} onCancel={handleCancel} handleOk={handleRolebindingAdd}>
        <Box>
          <Grid>
            <Typography as='h5' sx={{
              fontWeight: "500",
              fontSize: "14px",
              mb: "12px",
            }}>名称</Typography>
            <TextField
              label="名称"
              name="name"
              size='small'
              InputProps={{
                style: { borderRadius: 8 },
              }}
              sx={{ width: '70%' }}
              value={form.name}
              onChange={(e) => handleFieldChange('name', '', e.target.value)}
            ></TextField>
          </Grid>

          <Box sx={{ mt: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <Grid sx={{ width: '45%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  mb: "12px",
                }}>subjects</Typography>
                <Box>
                  <Button size='small' sx={{ ml: '-10px', mr: '-10px' }} onClick={() => handleFieldCopy('subjects')}>新建</Button>
                </Box>
              </Box>
              {form.subjects.map((item, index) => (
                <Box key={index} sx={{ mb: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', my: '5px' }}>
                    <Typography as='h5' sx={{
                      fontWeight: "500",
                      fontSize: "14px",
                      width: '80px'
                    }}>kind：</Typography>
                    <FormControl sx={{ width: '55%' }} size='small'>
                      <Select labelId='source-select' value={item.kind} onChange={(e) => handleFieldChange('subjects', 'kind', e.target.value, index)}>
                        {kindTypes.map(item => (
                          <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box sx={{ ml: '10px' }}>
                      <Fab color='primary' sx={{ width: '28px', height: '28px', minHeight: '28px' }} onClick={() => handleFieldCopy('subjects', index)}>
                        <ContentCopyIcon sx={{ fontSize: '14px' }} />
                      </Fab>
                      {index !== 0 && <Fab color='primary' sx={{ width: '28px', height: '28px', minHeight: '28px', ml: '4px' }} onClick={() => handleFieldDelete('subjects', index)}>
                        <ClearIcon sx={{ fontSize: '14px' }} />
                      </Fab>}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', my: '5px' }}>
                    <Typography as='h5' sx={{
                      fontWeight: "500",
                      fontSize: "14px",
                      width: '80px'
                    }}>apiGroup：</Typography>
                    <TextField
                      fullWidth
                      name="apiGroup"
                      size='small'
                      disabled
                      InputProps={{
                        style: { borderRadius: 4 },
                      }}
                      value={item.apiGroup}
                      sx={{ width: '55%' }}
                    ></TextField>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', my: '5px' }}>
                    <Typography as='h5' sx={{
                      fontWeight: "500",
                      fontSize: "14px",
                      width: '80px'
                    }}>name：</Typography>
                    <TextField
                      fullWidth
                      name="name"
                      size='small'
                      InputProps={{
                        style: { borderRadius: 4 },
                      }}
                      value={item.name}
                      sx={{ width: '55%' }}
                      onChange={(e) => handleFieldChange('subjects', 'name', e.target.value, index)}
                    ></TextField>
                  </Box>
                </Box>
              ))}
            </Grid>

            <Grid sx={{ width: '45%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '50%', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  mb: "12px",
                }}>roleRef</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', my: '5px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  width: '80px'
                }}>kind：</Typography>
                <TextField disabled sx={{ width: '55%' }} size='small' value={form.roleRef.kind} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', my: '5px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  width: '80px'
                }}>apiGroup：</Typography>
                <TextField
                  fullWidth
                  name="apiGroup"
                  size='small'
                  disabled
                  InputProps={{
                    style: { borderRadius: 4 },
                  }}
                  value={form.roleRef.apiGroup}
                  sx={{ width: '55%' }}
                ></TextField>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', my: '5px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  width: '80px'
                }}>name：</Typography>
                <TextField
                  fullWidth
                  name="name"
                  size='small'
                  InputProps={{
                    style: { borderRadius: 4 },
                  }}
                  value={form.roleRef.name}
                  sx={{ width: '55%' }}
                  onChange={(e) => handleFieldChange('roleRef', 'name', e.target.value)}
                ></TextField>
              </Box>
            </Grid>
          </Box>
        </Box>
      </AddModal>
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
    </>
  )
}

export default RoleBindings