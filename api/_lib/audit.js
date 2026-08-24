/**
 * audit.js — Audit logging for compliance and security
 *
 * Logs all mutations (CREATE, UPDATE, DELETE) to audit_logs table
 * @module api/_lib/audit
 */

/**
 * Log an audit event
 *
 * @param {object} supabaseAdmin - Supabase admin client
 * @param {object} options - Event details
 * @param {string} options.action - Action type (CREATE, UPDATE, DELETE, READ)
 * @param {string} options.table - Table name
 * @param {string} options.userId - User ID performing action
 * @param {string} options.resourceId - ID of affected resource
 * @param {object} [options.before] - Previous state (for UPDATE)
 * @param {object} [options.after] - New state (for CREATE/UPDATE)
 * @param {string} [options.ipAddress] - Client IP
 * @param {string} [options.userAgent] - Client user agent
 * @returns {Promise<boolean>} Success status
 */
export async function auditLog(supabaseAdmin, options) {
  const {
    action,
    table,
    userId,
    resourceId,
    before = null,
    after = null,
    ipAddress = 'unknown',
    userAgent = 'unknown',
  } = options

  try {
    // Only log mutations, not reads
    if (!['CREATE', 'UPDATE', 'DELETE'].includes(action)) {
      return true // Skip logging for reads
    }

    const { error } = await supabaseAdmin.from('audit_logs').insert({
      action,
      table_name: table,
      user_id: userId,
      resource_id: resourceId,
      before_state: before,
      after_state: after,
      ip_address: ipAddress,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
    })

    if (error) {
      console.error('[Audit Log Error]', error.message)
      return false
    }

    return true
  } catch (err) {
    console.error('[Audit Log Exception]', err.message)
    return false
  }
}

/**
 * Extract client IP from request
 *
 * @param {import('@vercel/node').VercelRequest} req
 * @returns {string} Client IP
 */
export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  )
}

/**
 * Extract user agent from request
 *
 * @param {import('@vercel/node').VercelRequest} req
 * @returns {string} User agent
 */
export function getUserAgent(req) {
  return req.headers['user-agent'] || 'unknown'
}
