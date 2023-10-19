import DataCard from "@/components/Pages/DataCard"
import DataTable from "@/components/Pages/DataTable"
import { useEffect, useState } from "react"
import { Box, Button, Grid, Typography, CircularProgress } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransitionsModal from "@/components/global/TransitionModal"
import DetailModal from '@/components/Pages/DetailModal';
import CrdShowYMAL from "@/components/Pages/customize/crd/CrdShowYAML"
import AddIcon from '@mui/icons-material/Add';
import DeploymentTabs from "@/components/Pages/edgeapp/deploymentTabs"
import AlertModal from '@/components/global/AlertModal'
import QueryContainer from "@/components/Pages/QueryContainer"
import DeploymentAdd from "@/components/Pages/edgeapp/deploymentAdd"

const queryFormValue = {
  name: '',
  count: ''
}

const Deployment = (props) => {
  const [deploymentList, setDeploymentList] = useState([])
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [yamlOpen, setYamlOpen] = useState(false)
  const [deleteName, setDeleteName] = useState('');
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertInfo, setAlertInfo] = useState({
    type: 'info',
    msg: '提示'
  })
  const [detailInfos, setDetailInfos] = useState(null)
  const [queryForm, setQueryForm] = useState(JSON.parse(JSON.stringify(queryFormValue)))

  const cardActions = [<Button key='add' startIcon={<AddIcon />} type='primary' variant="contained" onClick={() => setAddOpen(true)}>创建容器</Button>]

  // 抽取列表数据
  const handleListData = (result) => {
    return result.items.map(item => ({
      name: item.metadata.name,
      instances: item.status.replicas - (item.status.unavailableReplicas || 0) + '/' + item.status.replicas,
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
  }

  // 新增和删除后重新请求列表
  const refetchDataList = async () => {
    const resp = await fetch(`/api/deploymentList?namespaces=${sessionStorage.getItem('namespace')}`)
    const res = await resp.json()
    setDeploymentList(handleListData(res.data))
  }

  useEffect(() => {
    refetchDataList()
  }, [])

  const handleDelete = (record) => {
    setDeleteName(record.name);
    setOpen(true); // 弹出确认删除框
  }

  const handleShowDetail = async (record) => {
    setDetailOpen(true)
    const resp = await fetch(`/api/deploymentDetail?namespaces=${sessionStorage.getItem('namespace')}&name=${record.name}`)
    const res = await resp.json()
    setDetailInfos(res.data)
  }

  const tableTitleList = [
    {
      title: '名称',
      key: 'name'
    },
    {
      title: '实例数(正常/全部)',
      key: 'instances'
    },
    {
      title: '创建时间',
      key: 'creationTimestamp'
    },
    {
      title: '操作',
      key: 'operate',
      render: (record) => [<Button key='detail' variant="text" size="small" onClick={() => handleShowDetail(record)}>详情</Button>,
      <Button key='del' variant="text" size="small" color="error" onClick={() => handleDelete(record)}>删除</Button>]
    },
  ]

  // deployment 删除
  const handleRemoveOne = async () => {
    if (!deleteName) return
    const resp = await fetch(`/api/deploymentRemove?namespaces=${sessionStorage.getItem('namespace')}&name=${deleteName}`);
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

  const handleDetailClose = () => {
    setDetailOpen(false)
    setDetailInfos(null)
  }

  // 查询重置
  const queryReset = () => {
    setQueryForm(queryFormValue);
    refetchDataList()
  }

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
      {/* <QueryContainer onQuery={refetchDataList} onReset={queryReset}>
        <Grid container spacing={2} justifyContent='flex-start' sx={{ px: '20px' }}>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>名称：</Typography>
              <TextField placeholder='请输入名称' size='small' value={queryForm.name} onChange={(e) => setQueryForm({...queryForm, name: e.target.value})} />
            </Box>
          </Grid>
          <Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: '10px' }}>
              <Typography component='h4' sx={{ fontSize: '16px' }}>实例数(正常/全部)：</Typography>
              <TextField placeholder='请输入' size='small' value={queryForm.count} onChange={(e) => setQueryForm({...queryForm, count: e.target.value})} />
            </Box>
          </Grid>
        </Grid>
      </QueryContainer> */}
      <DataCard title='容器应用' action={cardActions}>
        <DataTable titleList={tableTitleList} dataList={deploymentList} />
      </DataCard>
      <TransitionsModal open={open} option={modelOptions} handleClose={setOpen} />
      <DeploymentAdd open={addOpen} onFinish={handleOnFinish} onClose={() => setAddOpen(false)} />
      <AlertModal open={alertOpen} type={alertInfo.type} msg={alertInfo.msg} onClose={() => setAlertOpen(false)} />
      {detailOpen && <DetailModal title='容器应用详情' maxWidth={'lg'} confirmText='YAML' open={detailOpen} handleClose={handleDetailClose} handleOk={() => setYamlOpen(true)}>
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
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>ID：</Typography>
                    <span>{detailInfos.metadata.uid}</span>
                  </Grid>
                  <Grid item xs={4} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '140px' }}>实例数(正常/全部)：</Typography>
                    <span>{detailInfos.status.replicas - detailInfos.status.unavailableReplicas + '/' + detailInfos.status.replicas}</span>
                  </Grid>
                  <Grid item xs={4} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>创建时间：</Typography>
                    <span>{detailInfos.metadata.creationTimestamp}</span>
                  </Grid>
                  <Grid item xs={4} sx={{ display: 'flex', my: '10px' }}>
                    <Typography as='h5' sx={{ fontSize: '14px', fontWeight: '500', width: '100px' }}>节点描述：</Typography>
                    <span>{detailInfos.metadata.annotations['k8s.kuboard.cn/displayName']}</span>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <DeploymentTabs />
              </Box>
            </>
          }
        </Box>
      </DetailModal>}
      {yamlOpen && <CrdShowYMAL open={yamlOpen} yaml={detailInfos} toggleShowYAML={setYamlOpen} />}
    </>
  )
}

export default Deployment