import { getDetail } from "@/api/deviceModels";

export default async function handler(req, res) {
  const result = await getDetail(req.query.namespaces, req.query.name)

  res.status(200).json({
    data: result.data
  })
}