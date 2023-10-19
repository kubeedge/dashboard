import { getDeploymentPodsList } from "@/api/deployment"

export default async function handler(req, res) {
  const result = await getDeploymentPodsList(req.query.namespaces);

  res.status(200).json({ data: result.data })
}