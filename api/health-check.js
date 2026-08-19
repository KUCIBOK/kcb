/**
 * api/health-check.js — Emergency health check
 * Minimal function to verify Vercel can execute ANY code
 */

export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Vercel function is running',
  })
}
