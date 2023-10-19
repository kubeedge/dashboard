import { removeItem } from '@/api/clusterroles'

export default async function handler(req, res) {
  const result = await removeItem(req.query.name)

  res.status(200).json({
    data: result.data
  })
}