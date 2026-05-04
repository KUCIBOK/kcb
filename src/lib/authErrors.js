/**
 * Traduit les messages d'erreur Supabase bruts en messages lisibles.
 * @param {string} raw - Message d'erreur Supabase
 * @returns {string}
 */
export function friendlyAuthError(raw) {
  if (!raw) return 'Une erreur est survenue. Veuillez réessayer.'
  const msg = raw.toLowerCase()

  if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials'))
    return 'Email ou mot de passe incorrect.'
  if (msg.includes('email not confirmed'))
    return 'Veuillez vérifier votre email avant de vous connecter.'
  if (msg.includes('invalid_grant') || msg.includes('refresh_token_not_found'))
    return 'Session expirée. Veuillez vous reconnecter.'
  if (msg.includes('user not found') || msg.includes('no user found'))
    return 'Aucun compte trouvé avec cet email.'
  if (msg.includes('signup_disabled')) return 'Les inscriptions sont temporairement désactivées.'
  if (msg.includes('too_many_requests') || msg.includes('over_request_rate_limit'))
    return 'Trop de tentatives. Veuillez patienter quelques minutes.'
  if (msg.includes('over_email_send_rate_limit'))
    return "Limite d'envoi d'emails atteinte. Réessayez dans quelques minutes."
  if (msg.includes('already registered') || msg.includes('already exists'))
    return 'Un compte existe déjà avec cet email.'
  if (msg.includes('password') && msg.includes('weak'))
    return 'Mot de passe trop faible. Utilisez au moins 8 caractères.'
  if (msg.includes('network') || msg.includes('fetch'))
    return 'Problème de connexion. Vérifiez votre réseau.'

  return raw
}
