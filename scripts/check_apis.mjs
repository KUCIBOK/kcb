import fs from 'fs'
import path from 'path'

async function main() {
  const repoRoot = path.resolve(process.cwd())
  const postmanEnvPath = path.join(repoRoot, 'postman', 'kucibok.postman_environment.json')
  let baseUrl = 'http://localhost:3000'
  try {
    const env = JSON.parse(fs.readFileSync(postmanEnvPath, 'utf8'))
    const base = env.values.find(v => v.key === 'base_url')
    if (base && base.value) baseUrl = base.value
  } catch (e) {
    console.error('Could not read postman environment, using default', e.message)
  }

  const endpoints = [
    { method: 'GET', path: '/api/health', public: true },
    { method: 'GET', path: '/api/health/payment', public: true },
    { method: 'GET', path: '/api/artworks/verify/KCB-00000001', public: true },
    { method: 'GET', path: '/api/delivery/track/TEST', public: true },
    { method: 'GET', path: '/api/auth/me', public: false },
    { method: 'POST', path: '/api/auth/signin', public: true, body: { email: 'test@example.com', password: 'your-password-here' } },
  ]

  console.log('Using baseUrl:', baseUrl)

  for (const ep of endpoints) {
    const url = new URL(ep.path, baseUrl).toString()
    const opts = { method: ep.method, headers: { 'Content-Type': 'application/json' } }
    if (ep.body) opts.body = JSON.stringify(ep.body)
    try {
      const res = await fetch(url, opts)
      let text = await res.text()
      let body
      try { body = text ? JSON.parse(text) : {} } catch { body = { _raw: text } }
      console.log(`\n[${ep.method}] ${url} -> ${res.status} ${res.statusText}`)
      console.log('Headers:', Object.fromEntries(res.headers.entries()))
      console.log('Body:', body)
    } catch (err) {
      console.log(`\n[${ep.method}] ${url} -> ERROR:`, err.message)
    }
  }
}

main().catch(err => { console.error(err); process.exit(1) })
