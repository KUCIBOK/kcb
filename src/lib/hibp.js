/**
 * Vérifie si un mot de passe a été compromis via HaveIBeenPwned (k-anonymity).
 * Seuls les 5 premiers caractères du hash SHA-1 sont transmis — jamais le mot de passe.
 * En cas d'erreur réseau ou API, retourne false pour ne pas bloquer l'utilisateur.
 *
 * @param {string} password
 * @returns {Promise<boolean>} true si le mot de passe est dans une base de données compromise
 */
export async function isPasswordLeaked(password) {
  try {
    const encoded = new TextEncoder().encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-1', encoded)
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()

    const prefix = hashHex.slice(0, 5)
    const suffix = hashHex.slice(5)

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' },
    })
    if (!response.ok) return false

    const text = await response.text()
    return text.split('\n').some(line => line.split(':')[0].trim() === suffix)
  } catch {
    // Ne jamais bloquer l'utilisateur si l'API est indisponible
    return false
  }
}
