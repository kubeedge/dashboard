import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import { getList, getYaml } from "@/api/crd"
import DataCard from "@/components/Pages/DataCard"
import DataTable from "@/components/Pages/DataTable"
import { useEffect, useState } from "react"
import CrdShowYMAL from '../../components/Pages/customize/crd/CrdShowYAML'
import QueryContainer from "@/components/Pages/QueryContainer"


const Page = (props) => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [curName, setCurName] = useState('');
  const [curYAML, setCurYAML] = useState(null)

  useEffect(() => {
    const list = props.data.items.map(item => ({
      name: item.metadata.name,
      group: item.spec.group,
      creationTimestamp: item.metadata.creationTimestamp,
      uid: item.metadata.uid
    }))
    setList(list)
  }, [])

  useEffect(() => {
    const fetchData = async (name) => {
      const resp = await fetch(`/api/crdYAML?name=${name}`)
      const res = await resp.json()
      setCurYAML(res.data);
    }
    if (curName) {
      fetchData(curName)
    }
  }, [curName])

  const getCurrentRecord = (record) => {
    setCurName(record.name)
    setOpen(true);
  }

  const tableTitleList = [
    {
      title: '名称',
      key: 'name'
    },
    {
      title: '组',
      key: 'group'
    },
    {
      title: '创建时间',
      key: 'creationTimestamp'
    },
    {
      title: '操作',
      key: 'operate',
      render: (record) => <Button variant="text" size="small" onClick={() => getCurrentRecord(record)}>查看YAML</Button>
    },
  ]

  return (
    <>
      {/* <QueryContainer>
        <Grid container spacing={2} justifyContent='flex-start' sx={{px: '20px'}}>
          <Grid>
            <Box sx={{display: 'flex', alignItems: 'center', pl: '10px'}}>
              <Typography component='h4' sx={{fontSize: '16px'}}>名称：</Typography>
              <TextField placeholder='请输入名称' size='small' />
            </Box>
          </Grid>
          <Grid>
            <Box sx={{display: 'flex', alignItems: 'center', pl: '10px'}}>
              <Typography component='h4' sx={{fontSize: '16px'}}>组：</Typography>
              <TextField placeholder='请输入组' size='small' />
            </Box>
          </Grid>
        </Grid>
      </QueryContainer> */}
      <DataCard title={'CRD'}>
        <DataTable titleList={tableTitleList} dataList={list}></DataTable>
      </DataCard>
      {open && <CrdShowYMAL open={open} yaml={curYAML} toggleShowYAML={setOpen} />}
    </>
  )
}

export async function getServerSideProps() {
  const res = await getList()
  return { props: { data: res.data } }
}

export default Page