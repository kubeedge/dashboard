import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const NamespaceSelect = () => {
  const [namespace, setNamespace] = useState("")
  const [namespaceList, setNamespaceList] = useState([])
  const router = useRouter()

  const handleNamespaceChange = (value) => {
    sessionStorage.setItem('namespace', value)
    router.reload(router.pathname)
  }

  useEffect(() => {
    async function fetchData() {
      const resp = await fetch('/api/dashboardAnalysis')
      const res = await resp.json()
      setNamespaceList(res.data.items)
      if (!sessionStorage.getItem('namespace')) {
        sessionStorage.setItem('namespace', 'kubeedge')
      }
      setNamespace(sessionStorage.getItem('namespace'))
    }
    fetchData()
  }, [])

  return (
    <FormControl sx={{ minWidth: '200px', ml: '40px' }}>
      <InputLabel id='namespace'>名称空间</InputLabel>
      <Select labelId="namespace" label='namespace' value={namespace} onChange={(e) => setNamespace(e.target.value)}>
        {
          namespaceList.map(item => (
            <MenuItem key={item.metadata.name} value={item.metadata.name} onClick={() => handleNamespaceChange(item.metadata.name)}>{item.metadata.name}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )
}

export default NamespaceSelect