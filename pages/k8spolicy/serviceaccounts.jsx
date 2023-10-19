import { Box, Button, Grid, TextField, Typography, FormControl, Select, MenuItem } from '@mui/material'
import DataCard from "@/components/Pages/DataCard"
import { getList, removeItem } from "@/api/serviceAccount"
import { useEffect, useState } from "react"
import DataTable from "@/components/Pages/DataTable"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddModal from "@/components/Pages/AddModal"
import AddIcon from '@mui/icons-material/Add';
import AlertModal from '@/components/global/AlertModal'
import QueryContainer from '@/components/Pages/QueryContainer'

const ServiceAccount = (props) => {
  const [SAList, setSAList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [addOpen, setAddOpen] = useState(false)

  const [formName, setFormName] = useState('')
  const [formKey, setFormKey] = useState('')
  const [secretList, setSecretList] = useState([])
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })

  // 抽取列表信息
  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/serviceAccountList?namespaces=${sessionStorage.getItem('namespace')}`)
    const res = await resp.json()
    setSAList(handleListData(res.data))
  }

  useEffect(() => {
    refetchDataList()
  }, [])

  // 获取密钥列表
  useEffect(() => {
    async function fetchData() {
      const resp = await fetch(`/api/secretList?namespaces=${sessionStorage.getItem('namespace')}`)
      const res = await resp.json()
      setSecretList(res.data.items.map(item => ({
        label: item.metadata.name,
        value: item.metadata.name
      })))
    }
    fetchData()
  }, [])

  const handleDelete = (record) => {
    setDeleteName(record.name);
    setOpen(true); // 弹出确认删除框
  }

  // 表头信息
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

  // 删除
  const handleRemoveOne = async () => {
    if (!deleteName) return
    const resp = await fetch(`/api/serviceAccountRemove?namespaces=${sessionStorage.getItem('namespace')}&name=${deleteName}`);
    const res = await resp.json();
    console.log("🚀 ~ file: serviceaccounts.jsx:87 ~ handleRemoveOne ~ res:", res)
    if (res) { // && res.data.status == 'Success'
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
    setFormName('')
    setFormKey('')
  }

  // serviceAccount 添加
  const handleServiceAccountAdd = async () => {
    const params = {
      kind: 'ServiceAccount',
      apiVersion: 'v1',
      metadata: {
        name: formName,
        namespace: sessionStorage.getItem('namespace'),
      },
      secrets: [{
        name: formKey
      }]
    }
    const resp = await fetch(`/api/serviceAccountAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
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
      <DataCard title='serviceaccounts' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={SAList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <AddModal open={addOpen} handleClose={setAddOpen} onCancel={handleCancel} handleOk={handleServiceAccountAdd}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
            <Typography as='h5' sx={{
              fontWeight: "500",
              fontSize: "14px",
              width: '100px'
            }}>名称：</Typography>
            <TextField
              sx={{ width: '80%' }}
              placeholder='请输入名称'
              name="name"
              size='small'
              InputProps={{
                style: { borderRadius: 4 },
              }}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
            <Typography as='h5' sx={{
              fontWeight: "500",
              fontSize: "14px",
              width: '100px'
            }}>密钥：</Typography>
            <FormControl sx={{ width: '80%' }} size='small'>
              <Select placeholder="请选择" value={formKey} onChange={(e) => setFormKey(e.target.value)}>
                {secretList.map(item => (
                  <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </AddModal>
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
    </>
  )
}

export default ServiceAccount