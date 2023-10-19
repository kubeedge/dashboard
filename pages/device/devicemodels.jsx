import DataCard from "@/components/Pages/DataCard"
import DataTable from "@/components/Pages/DataTable"
import { getList } from "@/api/deviceModels"
import { useEffect, useState } from "react"
import { Box, Button, Grid, TextField, Typography, FormControl, Select, MenuItem, CircularProgress } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddModal from "@/components/Pages/AddModal"
import AddIcon from '@mui/icons-material/Add';
import AlertModal from '@/components/global/AlertModal'
import DetailModal from '@/components/Pages/DetailModal';
import dayjs from 'dayjs'
import QueryContainer from "@/components/Pages/QueryContainer"

const formValue = {
  name: '',
  protocol: '',
  type: '',
  propertiesName: '',
  description: ''
}

const typelist = [
  { label: 'Int', value: 'int' },
  { label: 'String', value: 'string' },
  { label: 'Double', value: 'double' },
  { label: 'Float', value: 'float' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Bytes', value: 'bytes' },
]

const typeOptions = {
  int: { accessMode: 'ReadWrite', defaultValue: 1, minimum: 1, maximum: 5, unit: '度' },
  string: { accessMode: 'ReadWrite', defaultValue: 'default' },
  double: { accessMode: 'ReadWrite', defaultValue: 1.0, minimum: 1.0, maximum: 5.0, unit: '度' },
  float: { accessMode: 'ReadWrite', defaultValue: 1.0, minimum: 1.0, maximum: 5.0, unit: '度' },
  boolean: { accessMode: 'ReadWrite', defaultValue: true },
  bytes: { accessMode: 'ReadWrite' },
}

const detailFormValue = {
  name: '',
  type: ''
}

const DeviceModels = (props) => {
  const [deviceModelList, setDeviceModelList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formValue)))
  const [detailForm, setDetailForm] = useState(JSON.parse(JSON.stringify(detailFormValue)))
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailInfos, setDetailInfos] = useState(null)

  const [addTwinOpen, setAddTwinOpen] = useState(false)

  const cardActions = [<Button key='add' startIcon={<AddIcon />} type='primary' variant="contained" onClick={() => setAddOpen(true)}>添加模型</Button>]
  const detailCardActions = [<Button key='add' startIcon={<AddIcon />} type='primary' variant="contained" onClick={() => setAddTwinOpen(true)}>添加孪生属性</Button>]

  const handleDelete = (record) => {
    setDeleteName(record.name);
    setOpen(true); // 弹出确认删除框
  }

  // 提取列表数据
  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      protocol: item.spec.protocol,
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

    // 新增和删除后重新请求列表
    const refetchDataList = async () => {
      const resp = await fetch(`/api/deviceModelList?namespaces=${sessionStorage.getItem('namespace')}`)
      const res = await resp.json()
      setDeviceModelList(handleListData(res.data))
    }

  useEffect(() => {
    refetchDataList()
  }, [])

  // 详情
  const handleShowDetail = async (record) => {
    setDetailOpen(true)
    const resp = await fetch(`/api/deviceModelDetail?namespaces=${sessionStorage.getItem('namespace')}&name=${record.name}`)
    const res = await resp.json()
    setDetailInfos(res.data)
  }

  const tableTitleList = [
    {
      title: '名称',
      key: 'name'
    },
    {
      title: '协议',
      key: 'protocol'
    },
    {
      title: '创建时间',
      key: 'creationTimestamp'
    },
    {
      title: '操作',
      key: 'operate',
      render: (record) => [
        <Button variant="text" key='delete' size="small" color="error" onClick={() => handleDelete(record)}>删除</Button>,
        <Button key='show' variant="text" size="small" onClick={() => handleShowDetail(record)}>查看</Button>]
    },
  ]

  const detailTableTitleList = [
    {
      title: '属性名',
      key: 'name'
    },
    {
      title: '描述',
      key: 'desc'
    },
    {
      title: '类型',
      key: 'type'
    },
    {
      title: '属性详情',
      key: 'detail'
    },
    {
      title: '操作',
      key: 'operate'
    },
  ]

  // 设备模型删除
  const handleRemoveOne = async () => {
    if (!deleteName) return
    console.log(deleteName);
    const resp = await fetch(`/api/deviceModelRemove?namespaces=${sessionStorage.getItem('namespace')}&name=${deleteName}`);
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

  const handleFieldChange = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  // 设备模型添加弹框取消按钮
  const handleCancel = () => {
    setAddOpen(false)
    setForm(formValue)
  }

  // 设备模型详情设备孪生添加弹框取消按钮
  const handleDetailTwinCancel = () => {
    setAddTwinOpen(false)
    setDetailForm(detailFormValue)
  }

  // 设备模型新增
  const handleDeviceModelAdd = async () => {
    const params = {
      apiVersion: 'devices.kubeedge.io/v1alpha2',
      kind: 'DeviceModel',
      metadata: {
        name: form.name,
        namespace: sessionStorage.getItem('namespace'),
      },
      spec: {
        properties: [{
          name: form.propertiesName,
          description: form.description,
          type: {
            [form.type + '']: typeOptions[form.type + '']
          }
        }],
        protocol: form.protocol,
      }
    }
    const resp = await fetch(`/api/deviceModelAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
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

  // 模型详情设备孪生添加
  const handleDetailTwinAdd = async () => {
    const params = {
      apiVersion: 'devices.kubeedge.io/v1alpha2',
      kind: 'DeviceModel',
      metadata: {
        name: detailForm.name,
        namespace: sessionStorage.getItem('namespace'),
      },
      spec: {
        protocol: 'Modbus',
        properties: [{
          name: detailForm.name,
          desctiption: '',
          type: {
            [detailForm.type + '']: typeOptions[detailForm.type + '']
          }
        }],
      }
    }
    console.log(JSON.stringify(params));
    const resp = await fetch(`/api/deviceModelAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
      method: 'post',
      body: JSON.stringify(params)
    })
    const res = await resp.json()
    if (res.data && res.data.status == 'Success') {
      handleDetailTwinCancel()
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

  const handleDetailClose = () => {
    setDetailOpen(false)
    setDetailInfos(null)
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
      <DataCard title='设备模型' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={deviceModelList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <AddModal title='添加模型' open={addOpen} maxWidth={'sm'} handleClose={handleCancel} onCancel={handleCancel} handleOk={handleDeviceModelAdd}>
        <Box>
          <Grid>
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
                协议：
              </Typography>
              <TextField
                size='small'
                placeholder="请输入协议"
                name="protocol"
                InputProps={{
                  style: { borderRadius: 4 },
                }}
                sx={{ width: '80%' }}
                value={form.protocol}
                onChange={(e) => handleFieldChange('protocol', e.target.value)} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '80px'
              }}>
                描述：
              </Typography>
              <TextField
                size='small'
                placeholder="请输入描述"
                name="description"
                InputProps={{
                  style: { borderRadius: 4 },
                }}
                sx={{ width: '80%' }}
                value={form.description}
                onChange={(e) => handleFieldChange('description', e.target.value)} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '80px'
              }}>
                属性名：
              </Typography>
              <TextField
                fullWidth
                placeholder="请输入属性名"
                size='small'
                name="propertiesName"
                InputProps={{
                  style: { borderRadius: 4 },
                }}
                sx={{ width: '80%' }}
                value={form.propertiesName}
                onChange={(e) => handleFieldChange('propertiesName', e.target.value)} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '80px'
              }}>属性类型：</Typography>
              <FormControl sx={{ width: '80%' }} size='small'>
                <Select labelId='source-select' value={form.type} onChange={(e) => handleFieldChange('type', e.target.value)}>
                  {typelist.map((item, index) => (
                    <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Box>
      </AddModal>
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
      {detailOpen && <DetailModal title='详情' maxWidth={'md'} open={detailOpen} handleClose={handleDetailClose}>
        <Box>
          {!detailInfos && <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100px' }}><CircularProgress /></Grid>}
          {
            detailInfos && <>
              <Box>
                <Grid container>
                  <Grid item xs={4} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>名称：</Typography>
                    <span>{detailInfos.metadata.name}</span>
                  </Grid>
                  <Grid item xs={4} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>命名空间：</Typography>
                    <span>{detailInfos.metadata.namespace}</span>
                  </Grid>
                  <Grid item xs={4} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>创建时间：</Typography>
                    <span>{dayjs(detailInfos.metadata.creationTimestamp).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ mt: '20px' }}>
                <DataCard title='设备孪生' action={detailCardActions}>
                  <DataTable titleList={detailTableTitleList} dataList={[]} />
                </DataCard>
              </Box>
            </>
          }
        </Box>
        {addTwinOpen && <AddModal title='添加模型' open={addTwinOpen} handleClose={handleDetailTwinCancel} onCancel={handleDetailTwinCancel} handleOk={handleDetailTwinAdd}>
          <Box>
            <Grid>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  width: '80px'
                }}>
                  属性名：
                </Typography>
                <TextField
                  placeholder="请输入属性名"
                  size='small'
                  name="name"
                  InputProps={{
                    style: { borderRadius: 4 },
                  }}
                  sx={{ width: '80%' }}
                  value={detailForm.name}
                  onChange={(e) => setDetailForm({ ...detailForm, name: e.target.value })} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
                <Typography as='h5' sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  width: '80px'
                }}>属性类型：</Typography>
                <FormControl sx={{ width: '80%' }} size='small'>
                  <Select labelId='source-select' value={detailForm.type} onChange={(e) => setDetailForm({ ...detailForm, type: e.target.value })}>
                    {typelist.map((item, index) => (
                      <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Box>
        </AddModal>}
      </DetailModal>}
    </>
  )
}

export default DeviceModels