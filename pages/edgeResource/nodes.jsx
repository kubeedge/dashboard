import { Box, Button, Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Backdrop, CircularProgress } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DataCard from "@/components/Pages/DataCard"
import { useEffect, useState } from "react"
import { getNodesList, removeNode } from '@/api/edgeResource'
import DataTable from "@/components/Pages/DataTable"
import TransitionsModal from '@/components/global/TransitionModal'
import AddModal from "@/components/Pages/AddModal"
import AddIcon from '@mui/icons-material/Add';
import DetailModal from '@/components/Pages/DetailModal';
import CrdShowYMAL from '@/components/Pages/customize/crd/CrdShowYAML';
import AlertModal from '@/components/global/AlertModal'


const formValue = {
  name: '',
  cloudIP: '',
  version: '',
  type: '',
  token: '',
  command: ''
}

const typelist = [{ label: 'Hostname', value: 'Hostname' }, { label: 'ExternalIP', value: 'ExternalIP' }, { label: 'InternalIP', value: 'InternalIP' }]

const Nodes = (props) => {
  const [nodeList, setNodeList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [addOpen, setAddOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [yamlOpen, setYamlOpen] = useState(false)
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formValue)))
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })

  const [detailInfos, setDetailInfos] = useState(null)

  // 抽取列表数据
  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      state: item.status.phase || '-',
      ip: item.metadata.name + ' / ' + item.status.addresses[0].address,
      creationTimestamp: item.metadata.creationTimestamp,
      hostname: item.status.addresses[1].address,
      // resourceVersion: item.metadata.resourceVersion,
      resourceVersion: item.status.nodeInfo.kubeletVersion,
      uid: item.metadata.uid
    }))
  }

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/nodeList`)
    const res = await resp.json()
    setNodeList(handleListData(res.data))
  }

  useEffect(() => {
    setNodeList(handleListData(props.data))
  }, [])

  const handleDelete = (record) => {
    setDeleteName(record.name);
    setOpen(true); // 弹出确认删除框
  }

  const handleShowDetail = async (record) => {
    setDetailOpen(true)
    const resp = await fetch(`/api/nodesDetail?id=${record.name}`)
    const res = await resp.json()
    setDetailInfos(res.data)
  }

  const tableTitleList = [
    {
      title: '名称/ID',
      key: 'name'
    },
    {
      title: '状态',
      key: 'state'
    },
    {
      title: '主机名/网络',
      key: 'ip'
    },
    {
      title: '创建时间',
      key: 'creationTimestamp'
    },
    {
      title: '边缘侧软件版本',
      key: 'resourceVersion'
    },
    {
      title: '节点标签',
      key: 'hostname'
    },
    {
      title: '操作',
      key: 'operate',
      render: (record) => {
        const detailBtn = <Button key='detail' variant="text" size="small" onClick={() => handleShowDetail(record)}>详情</Button>
        const deleteBtn = <Button key='del' variant="text" size="small" color="error" onClick={() => handleDelete(record)}>删除</Button>
        return [detailBtn, deleteBtn]
      }
    },
  ]

  const handleRemoveOne = async () => {
    if (!deleteName) return
    const resp = await fetch(`/api/nodeRemove?name=${deleteName}`);
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

  const cardActions = [<Button key='add' startIcon={<AddIcon />} type='primary' variant="contained" onClick={() => setAddOpen(true)}>注册节点</Button>]

  const handleFieldChange = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const handleCancel = () => {
    setAddOpen(false)
    setForm(formValue)
  }

  const handleDetailClose = () => {
    setDetailOpen(false)
    setDetailInfos(null)
  }

  // 生成命令
  const createCommand = () => {
    if (!form.cloudIP || !form.version || !form.token) return
    setForm({ ...form, remark: `keadm join --kubeedge-version=${form.version} --cloudcore-ipport=${form.cloudIP} --token=${form.token}` })
  }

  // 边缘节点新增
  const handleCreateNode = async () => {
    if(!form.name || !form.cloudIP || !form.version || !form.type) return
    const params = {
      apiVersion: 'v1',
      kind: 'Node',
      metadata: {
        name: form.name,
      },
      status: {
        addresses: [
          {
            address: form.cloudIP,
            type: form.type
          },
          {
            address: form.name,
            type: 'Hostname'
          }
        ],
        nodeInfo: {
          kubeletVersion: form.version
        }
      }
    }
    const resp = await fetch(`/api/nodeAdd`, {
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
      <DataCard title='边缘节点' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={nodeList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <AddModal title='注册节点' open={addOpen} maxWidth={'sm'} handleClose={setAddOpen} onCancel={handleCancel} handleOk={handleCreateNode}>
        <Box>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '120px'
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
                width: '120px'
              }}>
                cloudIP：
              </Typography>
              <TextField
                placeholder="请输入cloudIP"
                size='small'
                name="cloudIP"
                InputProps={{
                  style: { borderRadius: 4 },
                }}
                sx={{ width: '80%' }}
                value={form.cloudIP}
                onChange={(e) => handleFieldChange('cloudIP', e.target.value)} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '120px'
              }}>
                kubedege版本：
              </Typography>
              <TextField
                placeholder="请输入kubedege版本"
                size='small'
                name="version"
                InputProps={{
                  style: { borderRadius: 4 },
                }}
                sx={{ width: '80%' }}
                value={form.version}
                onChange={(e) => handleFieldChange('version', e.target.value)} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '120px'
              }}>属性类型：</Typography>
              <FormControl sx={{ width: '80%' }} size='small'>
                <Select labelId='source-select' value={form.type} onChange={(e) => handleFieldChange('type', e.target.value)}>
                  {typelist.map((item, index) => (
                    <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '120px'
              }}>
                token：
              </Typography>
              <TextField
                placeholder="请输入token"
                size='small'
                name="token"
                InputProps={{
                  style: { borderRadius: 4 },
                }}
                sx={{ width: '80%' }}
                value={form.token}
                onChange={(e) => handleFieldChange('token', e.target.value)} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '120px'
              }}>
                命令：
              </Typography>
              <TextField
                placeholder="请输入命令"
                size='small'
                multiline
                rows={4}
                name="remark"
                InputProps={{
                  style: { borderRadius: 4 },
                }}
                sx={{ width: '80%' }}
                value={form.remark}
                onChange={(e) => handleFieldChange('remark', e.target.value)} />
            </Box>
          </Grid>
        </Box>
      </AddModal>
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
      <DetailModal title='节点详情' maxWidth={'md'} confirmText='YAML' open={detailOpen} handleClose={handleDetailClose} handleOk={() => setYamlOpen(true)}>
        <Grid container>
          {!detailInfos && <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100px' }}><CircularProgress /></Grid>}
          {detailInfos && <>
            <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
              <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>名称：</Typography>
              <span>{detailInfos.metadata.name}</span>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
              <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>状态：</Typography>
              <span>{detailInfos.status.phase}</span>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
              <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>ID：</Typography>
              <span>{detailInfos.metadata.uid}</span>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
              <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>节点描述：</Typography>
              <span>{detailInfos.metadata.annotations['node.alpha.kubernetes.io/ttl']}</span>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
              <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>创建时间：</Typography>
              <span>{detailInfos.metadata.creationTimestamp}</span>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
              <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>主机名：</Typography>
              <span>{detailInfos.status.addresses[1].address}</span>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
              <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '146px' }}>操作系统：</Typography>
              <span>{detailInfos.status.nodeInfo.osImage} | {detailInfos.status.nodeInfo.operatingSystem} | {detailInfos.status.nodeInfo.architecture} | {detailInfos.status.nodeInfo.kernelVersion}</span>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
              <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>网络(网卡:IP)：</Typography>
              <span>{detailInfos.status.addresses[0].address}</span>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
              <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>规格：</Typography>
              <span>{detailInfos.status.capacity?.cpu} | {detailInfos.status.capacity?.memory}</span>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
              <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500' }}>容器运行时版本：</Typography>
              <span>{detailInfos.status.nodeInfo.containerRuntimeVersion}</span>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', my: '10px' }}>
              <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500' }}>边缘测软件版本：</Typography>
              <span>{detailInfos.status.nodeInfo.kubeletVersion}</span>
            </Grid>
          </>}
        </Grid>
      </DetailModal>
      {yamlOpen && <CrdShowYMAL open={yamlOpen} yaml={detailInfos} toggleShowYAML={setYamlOpen} />}
    </>
  )
}

export async function getServerSideProps() {
  const res = await getNodesList()
  return { props: { data: res.data } }
}

export default Nodes