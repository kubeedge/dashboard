import { Grid } from "@mui/material"
import { useEffect, useState } from "react"
import NameCard from "./NameCard"
import { useRouter } from "next/router"
import { getGlobalNamespace, setGlobalNamespace } from "@/utils/conf"
const AnalysisIntroduce = () => {

  const [namespaces, setNamespaces] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const resp = await fetch('/api/dashboardAnalysis')
      const res = await resp.json()
      setNamespaces(res.data.items)
    }
    fetchData()
  }, [])

  const goToSystem = (namespace) => {
    setGlobalNamespace('namespace', namespace);
    sessionStorage.setItem('namespace', namespace)
    router.push('/edgeResource/nodes')
  }

  return (
    <Grid container spacing={2}>
      {
        namespaces.map((item, index) => (
          <Grid key={index} item xs={4}>
            <NameCard name={item.metadata.name} timestamp={item.metadata.creationTimestamp} status={item.status.phase} onClick={goToSystem} />
          </Grid>
        ))
      }
    </Grid>
  )
}

export default AnalysisIntroduce