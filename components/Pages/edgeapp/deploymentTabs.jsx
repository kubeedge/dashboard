import PropTypes from 'prop-types'
import { Button, Box, Tabs, Tab, TableContainer, TableHead, TableRow, TableCell, TableBody, Table, Paper } from '@mui/material'
import { useEffect, useState } from 'react'
import Empty from '@/components/global/Empty';
import DataTable from "@/components/Pages/DataTable"


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const DeploymentTabs = () => {
  const [tabValue, setTabValue] = useState(0)
  const [list, setList] = useState([])

  useEffect(() => {
    async function fetchData() {
      const resp = await fetch('/api/deploymentPodList?namespaces=kubeedge')
      const res = await resp.json()
      const resList = res.data.items.map((item) => ({
        name: item.metadata.name,
        uid: item.metadata.uid,
        nodeName: item.spec.nodeName,
        status: item.status.phase,
        // resources: item.spec.containers[0].resources,
        resources: '',
        creationTimestamp: item.metadata.creationTimestamp,
        loadingTime: item.metadata.creationTimestamp
      }))
      setList(resList)
    }
    if (tabValue == 0) {
      fetchData()
    }
  }, [tabValue])

  const tableTitleList = [
    {
      title: '实例名称/ID',
      key: 'name'
    },
    {
      title: '节点',
      key: 'nodeName'
    },
    {
      title: '状态',
      key: 'status'
    },
    {
      title: '资源用量',
      key: 'resources'
    },
    {
      title: '运行时间',
      key: 'loadingTime'
    },
    {
      title: '创建时间',
      key: 'creationTimestamp'
    },
    {
      title: '操作',
      key: 'operate',
      render: (record) => <Button key='del' variant="text" size="small" color="error">删除</Button>
    },
  ]

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={(e, value) => setTabValue(value)}>
          <Tab label='实例列表'></Tab>
          <Tab label='更新升级'></Tab>
          <Tab label='标签'></Tab>
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <DataTable titleList={tableTitleList} dataList={list} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>upgrade</CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>tag</CustomTabPanel>
    </>
  )
}

export default DeploymentTabs