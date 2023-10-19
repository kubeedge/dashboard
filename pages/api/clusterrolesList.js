import { getList } from "@/api/clusterroles";

export default async function handler(req, res) {
  const result = await getList()

  res.status(200).json({
    data: result.data
  })
}