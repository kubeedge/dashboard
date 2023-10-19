import { Button, Box, TextField, Grid, Typography } from '@mui/material'
import DataCard from "@/components/Pages/DataCard"
import { useEffect, useState } from "react"
import { getList } from '@/api/services'
import DataTable from "@/components/Pages/DataTable"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddModal from "@/components/Pages/AddModal"
import AddIcon from '@mui/icons-material/Add';
import AlertModal from '@/components/global/AlertModal'
import QueryContainer from '@/components/Pages/QueryContainer'

const formValue = {
  name: '',
  port: ''
}

const ServiceGrid = (props) => {
  const [serivcesList, setServicesList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formValue)))
  const [addOpen, setAddOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })

  // 抽取列表数据
  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      type: item.spec.type,
      clusterIP: item.spec.clusterIP,
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/servicesList?namespaces=${sessionStorage.getItem('namespace')}`)
    const res = await resp.json()
    setServicesList(handleListData(res.data))
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
      title: 'ClusterIP',
      key: 'clusterIP'
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

  // services 删除
  const handleRemoveOne = async () => {
    if (!deleteName) return
    const resp = await fetch(`/api/servicesRemove?namespaces=${sessionStorage.getItem('namespace')}&name=${deleteName}`);
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

  const handleFieldChange = (field, value) => {
    if (field == 'port' && isNaN(parseInt(value))) {
      return
    }
    setForm({ ...form, [field]: field == 'port' ? parseInt(value) : value })
  }

  // services 新增
  const handleServicesAdd = async () => {
    const params = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: form.name,
        namespace: sessionStorage.getItem('namespace'),
      },
      spec: {
        ports: [
          {
            port: form.port,
          }
        ],
      }
    }
    const resp = await fetch(`/api/servicesAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
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
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>ClusterIp：</Typography>
              <TextField placeholder='请输入ClusterIp' size='small' />
            </Box>
          </Grid>
        </Grid>
      </QueryContainer> */}
      <DataCard title='services' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={serivcesList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <AddModal open={addOpen} maxWidth={'sm'} handleClose={handleCancel} onCancel={handleCancel} handleOk={handleServicesAdd}>
        <Box>
          <TextField
            fullWidth
            id="name"
            label="name"
            name="name"
            InputProps={{
              style: { borderRadius: 8 },
            }}
            value={form.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
          />
          <TextField
            fullWidth
            id="port"
            label="port"
            name="port"
            InputProps={{
              style: { borderRadius: 8 },
            }}
            value={form.port}
            sx={{ mt: '10px' }}
            onChange={(e) => handleFieldChange('port', e.target.value)}
          />
        </Box>
      </AddModal>
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
    </>
  )
}

export default ServiceGrid