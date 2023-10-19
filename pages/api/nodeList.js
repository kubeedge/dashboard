import { getNodesList } from "@/api/edgeResource";

export default async function handler(req, res) {
  const result = await getNodesList(req.query.namespaces)

  res.status(200).json({
    data: result.data
  })
}