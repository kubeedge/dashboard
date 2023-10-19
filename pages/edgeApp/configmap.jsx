import DataCard from "@/components/Pages/DataCard"
import DataTable from "@/components/Pages/DataTable"
import { useEffect, useState } from "react"
import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddModal from "@/components/Pages/AddModal"
import AddIcon from '@mui/icons-material/Add';
import AlertModal from '@/components/global/AlertModal'
import QueryContainer from "@/components/Pages/QueryContainer"
import useFetchData from "@/hooks/useFetchData";

const queryFormValue = {
  name: '',
  tag: ''
}

const ConfigMap = (props) => {
  const [configMapList, setConfigMapList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [addOpen, setAddOpen] = useState(false)
  const [formName, setFormName] = useState('')
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })
  const [queryForm, setQueryForm] = useState(JSON.parse(JSON.stringify(queryFormValue)))

  // const [dataList] = useFetchData({
  //   url: '/api/configmapList',
  //   namespace: true
  // })

  // useEffect(() => {
  //   console.log(dataList);
  // }, [dataList])

  // 抽取列表数据
  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      labels: JSON.stringify(item.metadata.labels || ''),
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/configmapList?namespaces=${sessionStorage.getItem('namespace')}`)
    const res = await resp.json()
    setConfigMapList(handleListData(res.data))
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
      title: '配置项名称',
      key: 'name'
    },
    {
      title: '标签',
      key: 'labels'
    },
    {
      title: '创建时间',
      key: 'metadata.creationTimestamp'
    },
    {
      title: '操作',
      key: 'operate',
      render: (record) => <Button variant="text" size="small" color="error" onClick={() => handleDelete(record)}>删除</Button>
    },
  ]

  // configmap 删除
  const handleRemoveOne = async () => {
    if (!deleteName) return
    const resp = await fetch(`/api/configmapRemove?namespaces=${sessionStorage.getItem('namespace')}&name=${deleteName}`);
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
    setFormName('')
  }

  // 新增提交
  const handleOk = async () => {
    if (!formName) return
    const params = {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: formName,
        namespace: sessionStorage.getItem('namespace')
      }
    }
    const resp = await fetch(`/api/configmapAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
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

  // 查询重置
  const queryReset = () => {
    setQueryForm(queryFormValue);
    tagst()
  }

  return (
    <>
      {/* <QueryContainer onQuery={refetchDataList} onReset={queryReset}>
        <Grid container spacing={2} justifyContent='flex-start' sx={{ px: '20px' }}>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>配置项名称：</Typography>
              <TextField placeholder='请输入名称' size='small' />
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>标签：</Typography>
              <TextField placeholder='请输入标签' size='small' />
            </Box>
          </Grid>
        </Grid>
      </QueryContainer> */}
      <DataCard title='应用配置' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={configMapList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <AddModal open={addOpen} maxWidth={'sm'} handleClose={setAddOpen} onCancel={handleCancel} handleOk={handleOk}>
        <Box>
          <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '10px' }}>
              <Typography as='h5' sx={{
                fontWeight: "500",
                fontSize: "14px",
                width: '80px'
              }}>name</Typography>
              <TextField
                placeholder="请输入 Name"
                size='small'
                name="name"
                InputProps={{
                  style: { borderRadius: 4 },
                }}
                sx={{ width: '80%' }}
                value={formName}
                onChange={(e) => setFormName(e.target.value)} />
            </Box>
          </Grid>
        </Box>
      </AddModal>
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
    </>
  )
}

export default ConfigMap