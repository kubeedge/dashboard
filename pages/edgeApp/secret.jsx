import DataCard from "@/components/Pages/DataCard"
import DataTable from "@/components/Pages/DataTable"
import { useEffect, useState } from "react"
import { Box, Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Snackbar, Alert } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddModal from "@/components/Pages/AddModal"
import AddIcon from '@mui/icons-material/Add';
import DetailModal from '@/components/Pages/DetailModal';
import AlertModal from '@/components/global/AlertModal'
import QueryContainer from "@/components/Pages/QueryContainer"

const formValue = {
  namespace: 'kubeedge',
  name: '',
  type: 'kubernetes.io/dockerconfigjson',
  server: '',
  username: '',
  password: '',
  dataSource: [
    {
      key: '',
      value: ''
    }
  ]
}

const Secret = (props) => {
  const [secretList, setSecretList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [detailOpen, setDetailOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formValue)))
  const [detailInfos, setDetailInfos] = useState(null)

  const [secretDocker, setSecretDocker] = useState(null)
  const [sercetOpaqueList, setSercetOpaqueList] = useState([])

  const cardActions = [<Button key='add' startIcon={<AddIcon />} type='primary' variant="contained" onClick={() => setAddOpen(true)}>新建密钥</Button>]

  // 密钥详情表头信息
  const sercetDetailTile = [
    {
      title: '属性名',
      key: 'key'
    },
    {
      title: '属性值',
      key: 'value'
    }
  ]

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/secretList?namespaces=${sessionStorage.getItem('namespace')}`)
    const res = await resp.json()
    setSecretList(handleListData(res.data))
  }

  const handleSecretDetailInfo = () => {
    if (detailInfos.type == 'kubernetes.io/dockerconfigjson') {
      const data = JSON.parse(atob(detailInfos.data['.dockerconfigjson']))
      const server = Object.keys(data)[0]
      setSecretDocker({
        server,
        username: data[server].username,
        password: data[server].password
      })
    }
    if (detailInfos.type == 'Opaque') {
      const data = Object.keys(detailInfos.data).map((item, index) => ({
        key: item,
        value: Object.values(detailInfos.data)[index]
      }))
      setSercetOpaqueList(data)
    }
  }

  const handleShowDetail = async (record) => {
    setDetailOpen(true)
    const resp = await fetch(`/api/secretDetail?namespaces=kubeedge&name=${record.name}`)
    const res = await resp.json()
    setDetailInfos(res.data)
  }

  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      type: item.type,
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

  useEffect(() => {
    refetchDataList()
  }, [])

  useEffect(() => {
    if (detailInfos) {
      handleSecretDetailInfo();
    }
  }, [detailInfos])

  const tableTitleList = [
    {
      title: '密钥名称',
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
      render: (record) => [
        <Button key='detail' variant="text" size="small" onClick={() => handleShowDetail(record)}>详情</Button>,
        <Button key='del' variant="text" size="small" color="error" onClick={() => {
          setDeleteName(record.name);
          setOpen(true);
        }}>删除</Button>]
    },
  ]

  // secret 删除
  const handleRemoveOne = async () => {
    if (!deleteName) return
    const resp = await fetch(`/api/secretRemove?namespaces=${sessionStorage.getItem('namespace')}&name=${deleteName}`);
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

  // 弹框提醒选项
  const modelOptions = {
    title: "删除",
    desc: "确定删除该项吗",
    icon: InfoOutlinedIcon,
    color: 'rgb(205,173,20)',
    onOk: handleRemoveOne
  }

  const handleFieldChange = (field, value, seField, index) => {
    if (seField) {
      const originField = JSON.parse(JSON.stringify(form[field]))
      if (index != undefined) {
        originField[index][seField] = value
      } else {
        originField[seField] = value
      }
      setForm({ ...form, [field]: originField })
    } else {
      setForm({ ...form, [field]: value })
    }
  }

  const handleCancel = () => {
    setAddOpen(false)
    setForm(formValue)
  }

  // 孪生属性添加
  const handleAddOneData = () => {
    const originAttr = JSON.parse(JSON.stringify(form.dataSource))
    originAttr.push({
      key: '',
      value: ''
    })
    setForm({ ...form, dataSource: originAttr })
  }

  // 孪生属性删除
  const handleTwinAttrDelete = (index) => {
    const originAttr = JSON.parse(JSON.stringify(form.dataSource))
    originAttr.splice(index, 1)
    setForm({ ...form, dataSource: originAttr })
  }

  // 应用密钥新增
  const handleSecretAdd = async () => {
    const params = {
      kind: 'Secret',
      apiVersion: 'v1',
      type: form.type,
      metadata: {
        namespace: sessionStorage.getItem('namespace'),
        name: form.name
      },
      data: {}
    }
    if (form.type == 'kubernetes.io/dockerconfigjson') {
      const auth = window.btoa(`${form.username}: ${form.password}`)
      const info = {}
      info[form.server] = {
        username: form.username,
        password: form.password,
        auth: auth
      }
      const base64Data = window.btoa(JSON.stringify(info))
      params.data['.dockerconfigjson'] = base64Data
    } else if (form.type == 'Opaque') {
      form.dataSource.forEach(item => {
        params.data[item.key] = window.btoa(item.value)
      })
    }
    const resp = await fetch(`/api/secretAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
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
              <Typography component='h4' sx={{ fontSize: '16px' }}>密钥名称：</Typography>
              <TextField placeholder='请输入名称' size='small' />
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>类型：</Typography>
              <TextField placeholder='请输入' size='small' />
            </Box>
          </Grid>
        </Grid>
      </QueryContainer> */}
      <DataCard title='应用密钥' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={secretList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <AddModal open={addOpen} maxWidth={'sm'} handleClose={setAddOpen} onCancel={handleCancel} handleOk={handleSecretAdd}>
        <Box>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '80px'
              }}>
                名称空间：
              </Typography>
              <TextField
                size='small'
                disabled
                name="namespace"
                InputProps={{
                  style: { borderRadius: 4 },
                }}
                sx={{ width: '80%' }}
                value={form.namespace}
                onChange={(e) => handleFieldChange('namespace', e.target.value)} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '80px'
              }}>
                名称：
              </Typography>
              <TextField
                placeholder="请输入名称"
                size='small'
                name="name"
                InputProps={{
                  style: { borderRadius: 4 },
                }}
                sx={{ width: '80%' }}
                value={form.name}
                onChange={(e) => handleFieldChange('name', e.target.value)} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '80px'
              }}>
                类型：
              </Typography>
              <FormControl sx={{ width: '80%' }} size="small">
                <RadioGroup row value={form.type} onChange={(e) => handleFieldChange('type', e.target.value)}>
                  <FormControlLabel value='kubernetes.io/dockerconfigjson' control={<Radio />} label='Docker 仓库密码' />
                  <FormControlLabel value='Opaque' control={<Radio />} label='Opaque' />
                  <FormControlLabel value='TLS' control={<Radio />} label='TLS' />
                </RadioGroup>
              </FormControl>
            </Box>

            {form.type == 'kubernetes.io/dockerconfigjson' && <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  width: '140px'
                }}>
                  docker server：
                </Typography>
                <TextField
                  placeholder="请输入docker server"
                  size='small'
                  name="server"
                  InputProps={{
                    style: { borderRadius: 4 },
                  }}
                  sx={{ width: '80%' }}
                  value={form.server}
                  onChange={(e) => handleFieldChange('server', e.target.value)} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  width: '140px'
                }}>
                  docker username：
                </Typography>
                <TextField
                  placeholder="请输入docker username"
                  size='small'
                  name="username"
                  InputProps={{
                    style: { borderRadius: 4 },
                  }}
                  sx={{ width: '80%' }}
                  value={form.username}
                  onChange={(e) => handleFieldChange('username', e.target.value)} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  width: '140px'
                }}>
                  docker password：
                </Typography>
                <TextField
                  placeholder="请输入docker password"
                  size='small'
                  name="password"
                  type="password"
                  InputProps={{
                    style: { borderRadius: 4 },
                  }}
                  sx={{ width: '80%' }}
                  value={form.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)} />
              </Box>
            </Box>}

            {form.type == 'Opaque' && <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  width: '100px'
                }}>
                  孪生属性：
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" sx={{ width: '172px' }}>属性名</TableCell>
                        <TableCell align="center" sx={{ width: '172px' }}>属性值</TableCell>
                        <TableCell align="center" sx={{ width: '172px' }}>操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Button fullWidth variant="outlined" sx={{ borderStyle: 'dashed' }} onClick={handleAddOneData}>添加一行数据</Button>
                        </TableCell>
                      </TableRow>
                      {form.dataSource.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">
                            <TextField
                              placeholder="请输入属性名"
                              fullWidth
                              size='small'
                              name="name"
                              value={item.name}
                              onChange={(e) => handleFieldChange('dataSource', e.target.value, 'key', index)}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TextField
                              placeholder="请输入属性值"
                              fullWidth
                              size='small'
                              name="value"
                              value={item.value}
                              onChange={(e) => handleFieldChange('dataSource', e.target.value, 'value', index)}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Button color="error" onClick={() => handleTwinAttrDelete(index)}>删除</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>}
          </Grid>
        </Box>
      </AddModal>
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
      {detailOpen && <DetailModal title='密钥详情' maxWidth='md' open={detailOpen} handleClose={() => {
        setDetailOpen(false)
        setDetailInfos(null)
      }}>
        <Box>
          {!detailInfos && <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100px' }}><CircularProgress /></Grid>}
          {
            detailInfos && <>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '80px' }}>名称空间：</Typography>
                    <span>{detailInfos.metadata.namespace}</span>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '80px' }}>名称：</Typography>
                    <span>{detailInfos.metadata.name}</span>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '80px' }}>创建时间：</Typography>
                    <span>{detailInfos.metadata.creationTimestamp}</span>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '80px' }}>类型：</Typography>
                    <span>{detailInfos.type}</span>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ mt: '10px' }}>
                {(detailInfos.type == 'kubernetes.io/dockerconfigjson' && secretDocker) && <Grid container spacing={2}>
                  <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '140px' }}>docker server：</Typography>
                    <span>{secretDocker.server}</span>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '140px' }}>docker username：</Typography>
                    <span>{secretDocker.username}</span>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '140px' }}>docker password：</Typography>
                    <span>{secretDocker.password}</span>
                  </Grid>
                </Grid>}
                {detailInfos.type == 'Opaque' && <DataTable align='left' titleList={sercetDetailTile} dataList={sercetOpaqueList} />}
              </Box>
            </>
          }
        </Box>
      </DetailModal>}
    </>
  )
}

export default Secret