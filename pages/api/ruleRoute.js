import { getNodeList } from "@/api/ruleRoute"

export default async function handler(req, res) {
  const result = await getNodeList(req.query.namespace)

  res.status(200).json({ data:result.data})
}