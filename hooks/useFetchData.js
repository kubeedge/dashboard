import { useEffect, useState } from "react"

const useFetchData = (option) => {
  const [dataList, setDataList] = useState([]);

  const fetchData = async () => {
    let reqUrl = option.namespace ? `${option.url}?namespaces=${sessionStorage.getItem('namespace')}` : option.url
    const resp = await fetch(reqUrl);
    const res = await resp.json();
    setDataList(res.data.items);
  }

  useEffect(() => {
    fetchData()
  }, [])

  return [dataList, fetchData]
}

export default useFetchData