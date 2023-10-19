import { getDeploymentDetail } from "@/api/deployment"

export default async function handler(req, res) {
  const result = await getDeploymentDetail(req.query.namespaces, req.query.name);

  res.status(200).json({ data: result.data })
}