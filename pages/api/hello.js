export default function handler (req, res) {
  res.status(200).json({ api: process.env.RAPIDAPI_HOST, key: process.env.RAPIDAPI_KEY })
}
