import { removeNode } from '@/api/edgeResource'

export default async function handler(req, res) {
  const result = await removeNode(req.query.name)

  res.status(200).json({
    data: result.data
  })
}