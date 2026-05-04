/**
 * useAuth.test.js — Tests unitaires pour src/api/useAuth.js
 *
 * Stratégie :
 *   - supabase est mocké via vi.mock pour isoler les appels Supabase Auth.
 *   - uploadProfileImage est mocké pour isoler les uploads Storage.
 *   - utils (useAPI) est mocké avec un getter statique simulant le comportement réel.
 *   - global.fetch est mocké avant chaque test pour les fonctions HTTP.
 *   - vi.useFakeTimers() + vi.runAllTimersAsync() court-circuitent le setTimeout(500)
 *     dans verifyEmail sans ralentir la suite.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  loginUser,
  SignUpUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logoutUser,
  getUserProfile,
  getUserById,
  updateUser,
  changePassword,
} from '../api/useAuth'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKS
// ─────────────────────────────────────────────────────────────────────────────

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      getSession: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
      signOut: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  },
}))

vi.mock('../lib/storage', () => ({
  uploadProfileImage: vi.fn(),
}))

vi.mock('./useAPI', () => ({
  utils: {
    api: '/api',
    get options() {
      return {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'kcb-api-key': 'test-key',
          Authorization: 'Bearer test-token',
        },
      }
    },
  },
}))

// Importer les mocks APRÈS vi.mock pour accéder aux fonctions espionnées.
import { supabase } from '../lib/supabase'
import { uploadProfileImage } from '../lib/storage'

// ─────────────────────────────────────────────────────────────────────────────
// FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

/** Utilisateur Supabase brut minimal, valide pour toKcbUser(). */
const SUPABASE_USER = {
  id: 'uuid-1234',
  email: 'test@kucibok.com',
  email_confirmed_at: '2024-01-01T00:00:00Z',
  user_metadata: {
    role: 'buyer',
    name: 'Amara Diallo',
  },
}

/** Résultat attendu de toKcbUser() pour SUPABASE_USER. */
const KCB_USER = {
  _id: 'uuid-1234',
  id: 'uuid-1234',
  email: 'test@kucibok.com',
  role: 'buyer',
  name: 'Amara Diallo',
  isEmailVerified: true,
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL RESET — clearAllMocks resets call counts on module-level vi.fn()
// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  // resetAllMocks vide aussi les queues mockResolvedValueOnce — évite les fuites entre describes
  vi.resetAllMocks()
})

// ─────────────────────────────────────────────────────────────────────────────
// loginUser
// ─────────────────────────────────────────────────────────────────────────────

describe('loginUser', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('succès — retourne un utilisateur normalisé', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: SUPABASE_USER },
      error: null,
    })

    const result = await loginUser('test@kucibok.com', 'motdepasse')

    expect(result.user).toMatchObject(KCB_USER)
    expect(result.error).toBeUndefined()
  })

  it('erreur Supabase — retourne { error: message }', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: {},
      error: { message: 'Invalid login credentials' },
    })

    const result = await loginUser('test@kucibok.com', 'mauvais')

    expect(result.error).toBe('Invalid login credentials')
    expect(result.user).toBeUndefined()
  })

  it('exception réseau — retourne { error }', async () => {
    supabase.auth.signInWithPassword.mockRejectedValueOnce(new Error('Network request failed'))

    const result = await loginUser('test@kucibok.com', 'motdepasse')

    expect(result.error).toBe('Network request failed')
    expect(result.user).toBeUndefined()
  })

  it('appelle signInWithPassword avec email et password corrects', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: SUPABASE_USER },
      error: null,
    })

    await loginUser('artiste@kcb.com', 'secret123')

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledOnce()
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'artiste@kcb.com',
      password: 'secret123',
    })
  })

  it('isEmailVerified est false quand email_confirmed_at est absent', async () => {
    const unverifiedUser = { ...SUPABASE_USER, email_confirmed_at: null }
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: unverifiedUser },
      error: null,
    })

    const result = await loginUser('test@kucibok.com', 'motdepasse')

    expect(result.user.isEmailVerified).toBe(false)
  })

  it('role par défaut est "buyer" quand user_metadata.role est absent', async () => {
    const userSansRole = {
      ...SUPABASE_USER,
      user_metadata: { name: 'Sans Rôle' },
    }
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: userSansRole },
      error: null,
    })

    const result = await loginUser('test@kucibok.com', 'motdepasse')

    expect(result.user.role).toBe('buyer')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// SignUpUser
// ─────────────────────────────────────────────────────────────────────────────

describe('SignUpUser', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('succès — retourne { user, message }', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { user: { id: 'uuid-1234', email: 'nouveau@kcb.com', role: 'artist' } },
      }),
    })

    const result = await SignUpUser({
      email: 'nouveau@kcb.com',
      password: 'password123',
      role: 'artist',
      name: 'Amara Diallo',
    })

    expect(result.user).toMatchObject({
      _id: 'uuid-1234',
      id: 'uuid-1234',
      email: 'nouveau@kcb.com',
    })
    expect(result.message).toBe('Inscription réussie. Vérifiez votre adresse email pour continuer.')
    expect(result.error).toBeUndefined()
  })

  it("email déjà utilisé — retourne le message brut de l'API", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Un compte existe déjà avec cet email.' }),
    })

    const result = await SignUpUser({
      email: 'existant@kcb.com',
      password: 'password123',
      role: 'artist',
      name: 'Dupont',
    })

    expect(result.error).toBe('Un compte existe déjà avec cet email.')
    expect(result.user).toBeUndefined()
  })

  it('erreur générique backend — retourne { error: message }', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Rôle invalide' }),
    })

    const result = await SignUpUser({
      email: 'test@kcb.com',
      password: 'password123',
      role: 'artist',
      name: 'Test',
    })

    expect(result.error).toBe('Rôle invalide')
    expect(result.user).toBeUndefined()
  })

  it('artiste avec image — appelle uploadProfileImage et retourne imageUrl', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { user: { id: 'artist-uuid', email: 'artiste@kcb.com', role: 'artist' } },
      }),
    })
    uploadProfileImage.mockResolvedValueOnce({
      url: 'https://cdn.kcb.com/profiles/artist-uuid/avatar.jpg',
    })

    const fakeFile = new File(['contenu'], 'photo.jpg', { type: 'image/jpeg' })

    const result = await SignUpUser({
      email: 'artiste@kcb.com',
      password: 'password123',
      role: 'artist',
      name: 'Kofi Mensah',
      image: fakeFile,
    })

    expect(uploadProfileImage).toHaveBeenCalledOnce()
    expect(uploadProfileImage).toHaveBeenCalledWith('artist-uuid', fakeFile)
    expect(result.imageUrl).toBe('https://cdn.kcb.com/profiles/artist-uuid/avatar.jpg')
    expect(result.user).toBeDefined()
    expect(result.error).toBeUndefined()
  })

  it("artiste avec échec upload — retourne quand même l'utilisateur (non-bloquant)", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { user: { id: 'artist-uuid-2', email: 'artiste2@kcb.com', role: 'artist' } },
      }),
    })
    uploadProfileImage.mockResolvedValueOnce({ error: 'Stockage indisponible' })

    const fakeFile = new File(['contenu'], 'photo.png', { type: 'image/png' })

    const result = await SignUpUser({
      email: 'artiste2@kcb.com',
      password: 'password123',
      role: 'artist',
      name: 'Fatou Sow',
      image: fakeFile,
    })

    expect(result.user).toBeDefined()
    expect(result.imageUrl).toBeNull()
    expect(result.error).toBeUndefined()
  })

  it("n'appelle pas uploadProfileImage si le rôle n'est pas artiste", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { user: { id: 'uuid-1234', email: 'curator@kcb.com', role: 'curator' } },
      }),
    })

    const fakeFile = new File(['contenu'], 'photo.jpg', { type: 'image/jpeg' })

    await SignUpUser({
      email: 'curator@kcb.com',
      password: 'password123',
      role: 'curator',
      name: 'Collector',
      image: fakeFile,
    })

    expect(uploadProfileImage).not.toHaveBeenCalled()
  })

  it('exception réseau — retourne { error }', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Connexion impossible'))

    const result = await SignUpUser({
      email: 'test@kcb.com',
      password: 'password123',
      role: 'artist',
      name: 'Test',
    })

    expect(result.error).toBe('Connexion impossible')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// verifyEmail
// ─────────────────────────────────────────────────────────────────────────────

describe('verifyEmail', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('succès avec session valide — retourne { user }', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: SUPABASE_USER } },
      error: null,
    })

    const promise = verifyEmail()
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result.user).toMatchObject(KCB_USER)
    expect(result.error).toBeUndefined()
  })

  it('pas de session — retourne erreur lien invalide', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: null,
    })

    const promise = verifyEmail()
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result.error).toBe('Lien de vérification invalide ou expiré.')
    expect(result.user).toBeUndefined()
  })

  it('session sans user — retourne erreur lien invalide', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: null } },
      error: null,
    })

    const promise = verifyEmail()
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result.error).toBe('Lien de vérification invalide ou expiré.')
  })

  it('erreur Supabase — retourne { error: message }', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: { message: 'Token expiré' },
    })

    const promise = verifyEmail()
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result.error).toBe('Token expiré')
    expect(result.user).toBeUndefined()
  })

  it('exception réseau — retourne { error }', async () => {
    supabase.auth.getSession.mockRejectedValueOnce(new Error('Réseau indisponible'))

    const promise = verifyEmail()
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result.error).toBe('Réseau indisponible')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// forgotPassword
// ─────────────────────────────────────────────────────────────────────────────

describe('forgotPassword', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('succès — retourne { ok: true }', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({ error: null })

    const result = await forgotPassword({ email: 'test@kucibok.com' })

    expect(result).toEqual({ ok: true })
    expect(result.error).toBeUndefined()
  })

  it('erreur Supabase — retourne { error: message }', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
      error: { message: 'Email non trouvé' },
    })

    const result = await forgotPassword({ email: 'inconnu@kcb.com' })

    expect(result.error).toBe('Email non trouvé')
    expect(result.ok).toBeUndefined()
  })

  it('exception réseau — retourne { error }', async () => {
    supabase.auth.resetPasswordForEmail.mockRejectedValueOnce(new Error('Service indisponible'))

    const result = await forgotPassword({ email: 'test@kcb.com' })

    expect(result.error).toBe('Service indisponible')
  })

  it('appelle resetPasswordForEmail avec le bon email', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({ error: null })

    await forgotPassword({ email: 'artiste@kcb.com' })

    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledOnce()
    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'artiste@kcb.com',
      expect.objectContaining({ redirectTo: expect.stringContaining('/reset-password') })
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// resetPassword
// ─────────────────────────────────────────────────────────────────────────────

describe('resetPassword', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('succès — retourne { ok: true, user }', async () => {
    supabase.auth.updateUser.mockResolvedValueOnce({
      data: { user: SUPABASE_USER },
      error: null,
    })

    const result = await resetPassword({ password: 'nouveauMotDePasse123' })

    expect(result.ok).toBe(true)
    expect(result.user).toMatchObject(KCB_USER)
    expect(result.error).toBeUndefined()
  })

  it('erreur Supabase — retourne { error: message }', async () => {
    supabase.auth.updateUser.mockResolvedValueOnce({
      data: {},
      error: { message: 'Session invalide' },
    })

    const result = await resetPassword({ password: 'motdepasse' })

    expect(result.error).toBe('Session invalide')
    expect(result.ok).toBeUndefined()
    expect(result.user).toBeUndefined()
  })

  it('exception réseau — retourne { error }', async () => {
    supabase.auth.updateUser.mockRejectedValueOnce(new Error('Timeout'))

    const result = await resetPassword({ password: 'motdepasse' })

    expect(result.error).toBe('Timeout')
  })

  it('appelle updateUser avec le bon mot de passe', async () => {
    supabase.auth.updateUser.mockResolvedValueOnce({
      data: { user: SUPABASE_USER },
      error: null,
    })

    await resetPassword({ password: 'SuperSecret99!' })

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'SuperSecret99!' })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// logoutUser
// ─────────────────────────────────────────────────────────────────────────────

describe('logoutUser', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('appelle supabase.auth.signOut', async () => {
    supabase.auth.signOut.mockResolvedValueOnce({})

    await logoutUser()

    expect(supabase.auth.signOut).toHaveBeenCalledOnce()
  })

  it('appelle signOut une seule fois même si appelé plusieurs fois en séquence', async () => {
    supabase.auth.signOut.mockResolvedValue({})

    await logoutUser()
    await logoutUser()

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(2)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getUserProfile
// ─────────────────────────────────────────────────────────────────────────────

describe('getUserProfile', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    global.fetch = vi.fn()
  })

  it('succès avec _id — retourne le profil', async () => {
    const profile = { _id: 'uuid-1234', userId: 'uuid-1234', bio: 'Artiste sénégalais' }
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ data: profile }),
    })

    const result = await getUserProfile('uuid-1234')

    expect(result).toEqual(profile)
    expect(result.error).toBeUndefined()
  })

  it('succès avec userId — retourne le profil', async () => {
    const profile = { userId: 'uuid-5678', bio: 'Collectionneur' }
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ data: profile }),
    })

    const result = await getUserProfile('uuid-5678')

    expect(result).toEqual(profile)
  })

  it('profil introuvable — retourne { error }', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ error: 'Profil introuvable' }),
    })

    const result = await getUserProfile('uuid-inexistant')

    expect(result.error).toBe('Profil introuvable')
  })

  it('réponse sans _id ni userId — retourne erreur par défaut', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({}),
    })

    const result = await getUserProfile('uuid-vide')

    expect(result.error).toBe('Profil introuvable')
  })

  it('exception réseau — retourne { error }', async () => {
    global.fetch.mockRejectedValueOnce(new Error('ERR_NETWORK'))

    const result = await getUserProfile('uuid-1234')

    expect(result.error).toBe('ERR_NETWORK')
  })

  it('appelle fetch avec la bonne URL', async () => {
    const profile = { _id: 'uuid-1234' }
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ data: profile }),
    })

    await getUserProfile('uuid-1234')

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/profile/uuid-1234',
      expect.objectContaining({ method: 'GET' })
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// getUserById
// ─────────────────────────────────────────────────────────────────────────────

describe('getUserById', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    global.fetch = vi.fn()
  })

  it('succès avec id — retourne les données utilisateur', async () => {
    const user = { id: 'uuid-1234', email: 'test@kcb.com', role: 'artist' }
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ data: user }),
    })

    const result = await getUserById('uuid-1234')

    expect(result).toEqual(user)
    expect(result.error).toBeUndefined()
  })

  it('succès avec _id — retourne les données utilisateur', async () => {
    const user = { _id: 'uuid-5678', email: 'autre@kcb.com' }
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ data: user }),
    })

    const result = await getUserById('uuid-5678')

    expect(result).toEqual(user)
  })

  it('utilisateur introuvable — retourne { error }', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ error: 'Utilisateur introuvable' }),
    })

    const result = await getUserById('uuid-inconnu')

    expect(result.error).toBe('Utilisateur introuvable')
  })

  it('réponse sans id ni _id — retourne erreur par défaut', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({}),
    })

    const result = await getUserById('uuid-vide')

    expect(result.error).toBe('Utilisateur introuvable')
  })

  it('exception réseau — retourne { error }', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Connexion refusée'))

    const result = await getUserById('uuid-1234')

    expect(result.error).toBe('Connexion refusée')
  })

  it('appelle fetch avec la bonne URL /api/auth/:id', async () => {
    const user = { id: 'uuid-1234' }
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ data: user }),
    })

    await getUserById('uuid-1234')

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/uuid-1234',
      expect.objectContaining({ method: 'GET' })
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// updateUser
// ─────────────────────────────────────────────────────────────────────────────

describe('updateUser', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    global.fetch = vi.fn()
  })

  it("succès avec role — retourne l'utilisateur mis à jour", async () => {
    const updatedUser = { _id: 'uuid-1234', role: 'artist', name: 'Kofi' }
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ data: updatedUser }),
    })

    const result = await updateUser('uuid-1234', { name: 'Kofi' })

    expect(result).toEqual(updatedUser)
    expect(result.error).toBeUndefined()
  })

  it('erreur backend — retourne { error }', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ error: 'Mise à jour refusée' }),
    })

    const result = await updateUser('uuid-1234', { name: 'Nouveau' })

    expect(result.error).toBe('Mise à jour refusée')
  })

  it('erreur via message — retourne { error }', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ message: 'Unauthorized' }),
    })

    const result = await updateUser('uuid-1234', { name: 'Test' })

    expect(result.error).toBe('Unauthorized')
  })

  it('exception réseau — retourne { error }', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Timeout réseau'))

    const result = await updateUser('uuid-1234', { name: 'Test' })

    expect(result.error).toBe('Timeout réseau')
  })

  it('appelle fetch en PUT avec le bon corps JSON', async () => {
    const updatedUser = { _id: 'uuid-1234', role: 'buyer' }
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ data: updatedUser }),
    })

    await updateUser('uuid-1234', { name: 'Amara', role: 'buyer' })

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/uuid-1234',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ name: 'Amara', role: 'buyer' }),
      })
    )
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// changePassword
// ─────────────────────────────────────────────────────────────────────────────

describe('changePassword', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    global.fetch = vi.fn()
  })

  it("succès — retourne l'utilisateur", async () => {
    const user = { _id: 'uuid-1234', email: 'test@kcb.com', role: 'buyer' }
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ data: user }),
    })

    const result = await changePassword({ oldPassword: 'ancien', newPassword: 'nouveau' })

    expect(result).toEqual(user)
    expect(result.error).toBeUndefined()
  })

  it('ancien mot de passe incorrect — retourne { error }', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ error: 'Mot de passe actuel incorrect' }),
    })

    const result = await changePassword({ oldPassword: 'faux', newPassword: 'nouveau' })

    expect(result.error).toBe('Mot de passe actuel incorrect')
  })

  it('erreur via message — retourne { error }', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ message: 'Forbidden' }),
    })

    const result = await changePassword({ oldPassword: 'old', newPassword: 'new' })

    expect(result.error).toBe('Forbidden')
  })

  it('exception réseau — retourne { error }', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Réseau hors ligne'))

    const result = await changePassword({ oldPassword: 'old', newPassword: 'new' })

    expect(result.error).toBe('Réseau hors ligne')
  })

  it('appelle fetch en POST vers /api/auth/change-password', async () => {
    const user = { _id: 'uuid-1234' }
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ data: user }),
    })

    const payload = { oldPassword: 'ancien', newPassword: 'nouveau123' }
    await changePassword(payload)

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/change-password',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    )
  })

  it("réponse sans _id — retourne { error } avec le message d'erreur du corps", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ error: 'Accès refusé' }),
    })

    const result = await changePassword({ oldPassword: 'old', newPassword: 'new' })

    expect(result.error).toBe('Accès refusé')
    expect(result._id).toBeUndefined()
  })
})
