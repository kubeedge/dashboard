import { getNamespaces } from "@/api/kubuedge"

export default async function handler(req, res) {
  const result = await getNamespaces()

  res.status(200).json({ data: result.data })
}