/**
 * api/_lib/helpers.js — Helpers réutilisables pour tous les modules API
 */

/**
 * Réponse de succès
 */
export function ok(res, data, status = 200, pagination) {
  const body = { data }
  if (pagination) body.pagination = pagination
  return res.status(status).json(body)
}

/**
 * Réponse d'erreur
 */
export function fail(res, message, status = 400) {
  return res.status(status).json({ error: message })
}

/**
 * Réponse 404
 */
export function notFound(res, entity = 'Ressource') {
  return fail(res, `${entity} introuvable`, 404)
}

/**
 * Réponse 500
 */
export function serverError(res, err) {
  console.error('[API ERROR]', err?.message ?? err)
  return fail(res, 'Erreur serveur interne', 500)
}

/**
 * Extrait et vérifie le Bearer token
 */
export async function requireAuth(req, supabaseAdmin) {
  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  if (!token) return { error: 'Token manquant', status: 401 }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return { error: 'Token invalide ou expiré', status: 401 }
  return { user }
}

/**
 * Vérifie la clé API
 */
export function requireApiKey(req) {
  const apiKey = req.headers['kcb-api-key']
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return { ok: false, error: 'Clé API invalide', status: 401 }
  }
  return { ok: true }
}

/**
 * Vérifie le rôle utilisateur
 */
export async function requireRole(user, roles, supabaseAdmin) {
  const { data: dbUser, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !dbUser) {
    return { error: 'Impossible de vérifier le rôle', status: 403 }
  }
  const userRole = dbUser.role ?? 'buyer'
  if (!roles.includes(userRole)) {
    return { error: `Accès refusé. Rôle requis : ${roles.join(' ou ')}`, status: 403 }
  }
  return { ok: true, role: userRole }
}

/**
 * Vérifie si admin
 */
export async function requireAdmin(user, supabaseAdmin) {
  return requireRole(user, ['admin'], supabaseAdmin)
}

/**
 * Parse pagination depuis query params
 */
export function parsePagination(req) {
  const page = Math.max(1, parseInt(req.query.page ?? '1', 10))
  const limit = Math.min(1000, Math.max(1, parseInt(req.query.limit ?? '20', 10)))
  const from = (page - 1) * limit
  const to = from + limit - 1
  return { page, limit, from, to }
}

/**
 * Sanitize HTML dangerous content
 */
export function stripDangerousHtml(html) {
  if (typeof html !== 'string') return html
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/<form[\s\S]*?<\/form>/gi, '')
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/href\s*=\s*["']\s*javascript:[^"']*/gi, 'href="#"')
    .replace(/src\s*=\s*["']\s*javascript:[^"']*/gi, 'src=""')
}
