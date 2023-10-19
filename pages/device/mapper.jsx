import DataCard from "@/components/Pages/DataCard"
import DataTable from "@/components/Pages/DataTable"
import { getList } from "@/api/mapper"
import { useEffect, useState } from "react"
import { Button } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import AddIcon from '@mui/icons-material/Add';
import AlertModal from "@/components/global/AlertModal"
import QueryContainer from "@/components/Pages/QueryContainer"
import DeploymentAdd from "@/components/Pages/edgeapp/deploymentAdd"

const Mapper = (props) => {
  const [mapperList, setMapperList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
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
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/devicesList?namespaces=${sessionStorage.getItem('namespace')}`)
    const res = await resp.json()
    setMapperList(handleListData(res.data))
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

  const cardActions = [<Button key='add' startIcon={<AddIcon />} type='primary' variant="contained" onClick={() => setAddOpen(true)}>新建</Button>]

  const handleOnFinish = (flag) => {
    if (flag) {
      refetchDataList()
      setAlertInfo({
        type: 'success',
        msg: '添加成功'
      })
      setAddOpen(false)
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
        <Grid>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
            <Typography component='h4' sx={{ fontSize: '16px' }}>名称：</Typography>
            <TextField placeholder='请输入名称' size='small' />
          </Box>
        </Grid>
      </QueryContainer> */}
      <DataCard title='mapper' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={mapperList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <DeploymentAdd open={addOpen} onFinish={handleOnFinish} onClose={() => setAddOpen(false)} />
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
    </>
  )
}

export default Mapper