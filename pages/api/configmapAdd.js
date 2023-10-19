import { addConfig } from "@/api/configmap";

export default async function handler(req, res) {
  try {
    const result = await addConfig(req.query.namespaces, JSON.parse(req.body))
    res.status(200).json({
      data: {
        ...result.data,
        status: 'Success'
      }
    })
  } catch (error) {
    res.status(200).json({
      data: {
        status: 'error',
        msg: error.message
      }
    })
  }
}