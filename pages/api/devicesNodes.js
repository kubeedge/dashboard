import { getNodes } from "@/api/devices";

export default async function handler(req, res) {
  const result = await getNodes()

  res.status(200).json({
    data: result.data
  })
}