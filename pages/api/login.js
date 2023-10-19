import { login } from "@/api/login"

export default async function handler(req, res) {
  const result = await login(JSON.parse(req.body))

  res.status(200).json({
    data: result
  })
}