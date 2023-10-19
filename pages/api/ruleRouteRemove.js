import { removeItem } from '@/api/ruleRoute'

export default async function handler(req, res) {
  const result = await removeItem(req.query.namespaces, req.query.name)

  res.status(200).json({
    data: result.data
  })
}