import { getNodesDetail } from "@/api/edgeResource"

export default async function handler(req, res) {
  const result = await getNodesDetail(req.query.id)

  res.status(200).json({ data:result.data})
}