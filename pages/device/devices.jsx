import DataCard from "@/components/Pages/DataCard"
import DataTable from "@/components/Pages/DataTable"
import { getList, removeItem } from "@/api/devices"
import { useEffect, useState } from "react"
import { Box, Button, Grid, TextField, Typography, FormControl, Snackbar, Alert, Select, MenuItem, TableContainer, CircularProgress, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddModal from "@/components/Pages/AddModal"
import AddIcon from '@mui/icons-material/Add';
import DetailModal from '@/components/Pages/DetailModal';
import AlertModal from "@/components/global/AlertModal"
import QueryContainer from "@/components/Pages/QueryContainer"


const formValue = {
  name: '',
  protocol: '',
  node: '',
  model: '',
  description: '',
  dataSource: [
    {
      key: '',
      type: '',
      value: ''
    }
  ]
}

const typelist = [
  { label: 'Int', value: 'int' },
  { label: 'String', value: 'string' },
  { label: 'Double', value: 'double' },
  { label: 'Float', value: 'float' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Bytes', value: 'bytes' },
]

const Devices = (props) => {
  const [deviceList, setDeviceList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [addOpen, setAddOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formValue)))
  const [nodeList, setNodeList] = useState([])
  const [deviceModals, setDeviceModals] = useState([])
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })
  const [detailInfos, setDetailInfos] = useState(null)
  const [detailTableList, setDetailTableList] = useState([])

  const cardActions = [<Button key='add' startIcon={<AddIcon />} type='primary' variant="contained" onClick={() => setAddOpen(true)}>添加实例</Button>]
  const detailTableTitles = [
    {
      title: '属性名',
      key: 'key'
    },
    {
      title: '类型',
      key: 'type'
    },
    {
      title: '属性值',
      key: 'value'
    },
    {
      title: '上报值',
      key: 'report'
    }
  ]

  const handleDelete = (record) => {
    setDeleteName(record.name);
    setOpen(true); // 弹出确认删除框
  }

  // 抽取列表数据
  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      protocol: item.spec.protocol.customizedProtocol.protocolName,
      node: item.spec.nodeSelector.nodeSelectorTerms[0].matchExpressions[0].values[0],
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/devicesList?namespaces=${sessionStorage.getItem('namespace')}`)
    const res = await resp.json()
    setDeviceList(handleListData(res.data))
  }

  useEffect(() => {
    refetchDataList()
  }, [])

  // 设备模型列表
  useEffect(() => {
    async function fetchData() {
      const resp = await fetch(`/api/deviceModelList?namespaces=${sessionStorage.getItem('namespace')}`)
      const res = await resp.json()
      setDeviceModals(res.data.items.map(item => ({
        label: item.metadata.name,
        value: item.metadata.name
      })))
    }
    fetchData()
  }, [])

  // 节点列表
  useEffect(() => {
    async function fetchData() {
      const resp = await fetch(`/api/devicesNodes`)
      const res = await resp.json()
      setNodeList(res.data.items.map(item => ({
        label: item.metadata.name,
        value: item.metadata.name
      })))
    }
    fetchData()
  }, [])

  // 详情信息
  const handleShowDetail = async (record) => {
    setDetailOpen(true)
    const resp = await fetch(`/api/devicesDetail?namespaces=${sessionStorage.getItem('namespace')}&name=${record.name}`)
    const res = await resp.json()
    setDetailInfos(res.data)
    setDetailTableList(res.data.status.twins.map((item) => ({
      key: item.propertyName,
      type: item.desired.metadata.type,
      value: item.desired.value,
      report: item.reported.value
    })))
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
      title: '节点',
      key: 'node'
    },
    {
      title: '创建时间',
      key: 'creationTimestamp'
    },
    {
      title: '操作',
      key: 'operate',
      render: (record) => [<Button key='detail' variant="text" size="small" onClick={() => handleShowDetail(record)}>详情</Button>,
      <Button key='delete' variant="text" size="small" color="error" onClick={() => handleDelete(record)}>删除</Button>]
    },
  ]

  // 设备实例删除
  const handleRemoveOne = async () => {
    if (!deleteName) return
    const resp = await fetch(`/api/devicesRemove?namespaces=${sessionStorage.getItem('namespace')}&name=${deleteName}`);
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

  const handleFieldChange = (field, value, seField, index) => {
    if (seField) {
      const origin = form[field]
      origin[index][seField] = value
      setForm({ ...form, [field]: origin })
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
      type: '',
      value: ''
    })
    setForm({ ...form, dataSource: originAttr })
  }

  // 孪生属性删除
  const handledataSourceDelete = (index) => {
    const originAttr = JSON.parse(JSON.stringify(form.dataSource))
    originAttr.splice(index, 1)
    setForm({ ...form, dataSource: originAttr })
  }

  // 设备实例新增
  const handleDevicesAdd = async () => {
    const params = {
      apiVersion: 'devices.kubeedge.io/v1alpha2',
      kind: 'Device',
      metadata: {
        labels: {
          description: form.description
        },
        name: form.name,
        namespace: sessionStorage.getItem('namespace'),
      },
      spec: {
        deviceModelRef: {
          name: form.model,
        },
        nodeSelector: {
          nodeSelectorTerms: [
            {
              matchExpressions: [
                {
                  key: '',
                  operator: 'In',
                  values: [form.node]
                }
              ]
            }
          ]
        },
        protocol: {
          customizedProtocol: {
            protocolName: form.protocol
          }
        }
      },
      status: {
        twins: form.dataSource.map(item => {
          return {
            desired: {
              metadata: {
                type: item.type
              },
              value: item.value
            },
            "propertyName": item.key,
            reported: {
              metadata: {
                "type": item.type,
              },
              value: item.value
            }
          }
        })
      }
    }

    const resp = await fetch(`/api/devicesAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
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
              <Typography component='h4' sx={{ fontSize: '16px' }}>协议：</Typography>
              <TextField placeholder='请输入协议' size='small' />
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>节点：</Typography>
              <TextField placeholder='请输入节点' size='small' />
            </Box>
          </Grid>
        </Grid>
      </QueryContainer> */}
      <DataCard title='设备实例' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={deviceList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <AddModal title='添加实例' open={addOpen} maxWidth={'md'} handleClose={setAddOpen} onCancel={handleCancel} handleOk={handleDevicesAdd}>
        <Box>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '80px'
              }}>
                实例名称：
              </Typography>
              <TextField
                placeholder="请输入实例名称"
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
              }}>设备模型：</Typography>
              <FormControl sx={{ width: '80%' }} size='small'>
                <Select placeholder="请选择设备模型" labelId='source-select' value={form.model} onChange={(e) => handleFieldChange('model', e.target.value)}>
                  {deviceModals.map((item, index) => (
                    <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '80px'
              }}>
                访问协议：
              </Typography>
              <TextField
                placeholder="请输入访问协议"
                size='small'
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
              }}>节点：</Typography>
              <FormControl sx={{ width: '80%' }} size='small'>
                <Select placeholder="请选择节点" labelId='source-select' value={form.node} onChange={(e) => handleFieldChange('node', e.target.value)}>
                  {nodeList.map((item, index) => (
                    <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '80px'
              }}>
                描述：
              </Typography>
              <TextField
                placeholder="请输入描述"
                size='small'
                multiline
                rows={4}
                name="description"
                InputProps={{
                  style: { borderRadius: 4 },
                }}
                sx={{ width: '80%' }}
                value={form.description}
                onChange={(e) => handleFieldChange('description', e.target.value)} />
            </Box>

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
                      <TableCell align="center" sx={{ width: '172px' }}>类型</TableCell>
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
                            name="key"
                            value={item.key}
                            onChange={(e) => handleFieldChange('dataSource', e.target.value, 'key', index)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <FormControl fullWidth size='small'>
                            <Select placeholder="请选择类型" labelId='source-select' value={item.type} onChange={(e) => handleFieldChange('dataSource', e.target.value, 'type', index)}>
                              {typelist.map((item, index) => (
                                <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
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
                          <Button color="error" onClick={() => handledataSourceDelete(index)}>删除</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
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
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '80px' }}>名称：</Typography>
                    <span>{detailInfos.metadata.namespace}</span>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '80px' }}>协议：</Typography>
                    <span>{detailInfos.spec.protocol.customizedProtocol.protocolName}</span>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '80px' }}>节点：</Typography>
                    <span>{detailInfos.spec.nodeSelector.nodeSelectorTerms[0].matchExpressions[0].values[0]}</span>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '80px' }}>创建时间：</Typography>
                    <span>{detailInfos.metadata.creationTimestamp}</span>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '80px' }}>描述：</Typography>
                    <span>{detailInfos.metadata.labels.description}</span>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ mt: '10px' }}>
                <DataTable titleList={detailTableTitles} dataList={detailTableList} />
              </Box>
            </>
          }
        </Box>
      </DetailModal>}
    </>
  )
}

export default Devices