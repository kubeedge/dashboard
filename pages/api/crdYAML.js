import { getYaml } from "@/api/crd"

export default async function handler(req, res) {
  const result = await getYaml(req.query.name)

  res.status(200).json({ data: result.data })
}