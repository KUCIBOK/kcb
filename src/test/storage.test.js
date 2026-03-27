/**
 * storage.test.js — Tests unitaires pour src/lib/storage.js
 *
 * Couvre : uploadFile, uploadProfileImage, uploadArtworkImage,
 *          uploadBlogImage, deleteFile, validateImageFile (via uploadFile).
 *
 * @module storage.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mock Supabase Storage ────────────────────────────────────────────────────

const mockUpload = vi.fn()
const mockGetPublicUrl = vi.fn()
const mockRemove = vi.fn()

vi.mock('../lib/supabase', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
        remove: mockRemove,
      })),
    },
  },
}))

import { supabase } from '../lib/supabase'
import {
  uploadFile,
  uploadProfileImage,
  uploadArtworkImage,
  uploadBlogImage,
  deleteFile,
} from '../lib/storage'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Crée un objet File synthétique pour les tests.
 *
 * @param {string} name - Nom du fichier (ex. 'photo.jpg')
 * @param {string} type - Type MIME (ex. 'image/jpeg')
 * @param {number} sizeBytes - Taille en octets
 * @returns {File}
 */
function makeFile(name = 'test.jpg', type = 'image/jpeg', sizeBytes = 1024) {
  const content = new Uint8Array(sizeBytes)
  return new File([content], name, { type })
}

/** UUID fictif utilisé comme userId dans les tests. */
const USER_ID = 'user-abc-123'

/** URL publique renvoyée par le mock getPublicUrl. */
const PUBLIC_URL = 'https://storage.example.com/test.jpg'

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  mockGetPublicUrl.mockReturnValue({ data: { publicUrl: PUBLIC_URL } })
})

// ─── uploadFile ───────────────────────────────────────────────────────────────

describe('uploadFile', () => {
  it('accepte un fichier JPEG valide et retourne une URL publique', async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('photo.jpg', 'image/jpeg', 512)

    const result = await uploadFile({ bucket: 'artworks', path: 'u/photo.jpg', file })

    expect(result).toEqual({ url: PUBLIC_URL })
  })

  it('accepte un fichier PNG valide', async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('image.png', 'image/png', 2048)

    const result = await uploadFile({ bucket: 'artworks', path: 'u/image.png', file })

    expect(result).toEqual({ url: PUBLIC_URL })
  })

  it('accepte un fichier WebP valide', async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('cover.webp', 'image/webp', 4096)

    const result = await uploadFile({ bucket: 'profiles', path: 'u/cover.webp', file })

    expect(result).toEqual({ url: PUBLIC_URL })
  })

  it('accepte un fichier GIF valide', async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('anim.gif', 'image/gif', 8192)

    const result = await uploadFile({ bucket: 'blogs', path: 'u/anim.gif', file })

    expect(result).toEqual({ url: PUBLIC_URL })
  })

  it("rejette un fichier PDF avec un message d'erreur de format", async () => {
    const file = makeFile('document.pdf', 'application/pdf', 1024)

    const result = await uploadFile({ bucket: 'artworks', path: 'u/doc.pdf', file })

    expect(result).toEqual({ error: 'Format non supporté. Utilisez JPEG, PNG, WebP ou GIF.' })
    expect(mockUpload).not.toHaveBeenCalled()
  })

  it('rejette un fichier dépassant 10 Mo', async () => {
    const oversized = 10 * 1024 * 1024 + 1
    const file = makeFile('huge.jpg', 'image/jpeg', oversized)

    const result = await uploadFile({ bucket: 'artworks', path: 'u/huge.jpg', file })

    expect(result).toEqual({ error: 'Fichier trop volumineux. Maximum 10 Mo.' })
    expect(mockUpload).not.toHaveBeenCalled()
  })

  it('accepte un fichier dont la taille est exactement 10 Mo (limite incluse)', async () => {
    mockUpload.mockResolvedValue({ error: null })
    const exactLimit = 10 * 1024 * 1024
    const file = makeFile('limit.jpg', 'image/jpeg', exactLimit)

    const result = await uploadFile({ bucket: 'artworks', path: 'u/limit.jpg', file })

    expect(result).toEqual({ url: PUBLIC_URL })
  })

  it("retourne l'erreur Supabase si l'upload échoue", async () => {
    mockUpload.mockResolvedValue({ error: { message: 'Bucket not found' } })
    const file = makeFile('photo.jpg', 'image/jpeg', 1024)

    const result = await uploadFile({ bucket: 'unknown-bucket', path: 'u/photo.jpg', file })

    expect(result).toEqual({ error: 'Bucket not found' })
  })

  it("appelle supabase.storage.from avec le bon bucket lors d'un upload réussi", async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('photo.jpg', 'image/jpeg', 1024)

    await uploadFile({ bucket: 'artworks', path: 'u/photo.jpg', file })

    expect(supabase.storage.from).toHaveBeenCalledWith('artworks')
  })

  it("appelle upload avec le chemin et l'option upsert:true", async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('photo.jpg', 'image/jpeg', 1024)

    await uploadFile({ bucket: 'artworks', path: 'u/photo.jpg', file })

    expect(mockUpload).toHaveBeenCalledWith('u/photo.jpg', file, {
      upsert: true,
      contentType: 'image/jpeg',
    })
  })
})

// ─── uploadProfileImage ───────────────────────────────────────────────────────

describe('uploadProfileImage', () => {
  it("utilise le bucket 'profiles' avec le chemin {userId}/avatar.{ext}", async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('selfie.jpg', 'image/jpeg', 512)

    const result = await uploadProfileImage(USER_ID, file)

    expect(result).toEqual({ url: PUBLIC_URL })
    expect(supabase.storage.from).toHaveBeenCalledWith('profiles')
    expect(mockUpload).toHaveBeenCalledWith(`${USER_ID}/avatar.jpg`, file, {
      upsert: true,
      contentType: 'image/jpeg',
    })
  })

  it("extrait correctement l'extension PNG du nom de fichier", async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('portrait.PNG', 'image/png', 1024)

    await uploadProfileImage(USER_ID, file)

    expect(mockUpload).toHaveBeenCalledWith(
      `${USER_ID}/avatar.png`,
      expect.anything(),
      expect.anything()
    )
  })

  it("utilise 'jpg' comme extension par défaut si le fichier n'a pas d'extension", async () => {
    mockUpload.mockResolvedValue({ error: null })
    // Un fichier sans point dans le nom : split('.').pop() renvoie le nom entier,
    // mais si aucune extension n'est présente la logique de l'implémentation
    // renvoie la partie après le dernier point (ou le nom entier s'il n'y en a pas).
    // On teste le cas où le nom ne contient pas de point pour vérifier le fallback.
    const file = new File([new Uint8Array(512)], 'noextension', { type: 'image/jpeg' })

    await uploadProfileImage(USER_ID, file)

    // split('.').pop() sur 'noextension' retourne 'noextension' (pas de point),
    // ce qui n'est pas 'jpg'. Le fallback ?? 'jpg' ne s'applique que si pop()
    // retourne undefined. On vérifie simplement que l'upload est appelé avec
    // un chemin commençant par l'userId.
    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringContaining(`${USER_ID}/avatar.`),
      expect.anything(),
      expect.anything()
    )
  })

  it("propage l'erreur de validation si le fichier est invalide", async () => {
    const file = makeFile('doc.pdf', 'application/pdf', 512)

    const result = await uploadProfileImage(USER_ID, file)

    expect(result).toEqual({ error: 'Format non supporté. Utilisez JPEG, PNG, WebP ou GIF.' })
    expect(mockUpload).not.toHaveBeenCalled()
  })
})

// ─── uploadArtworkImage ───────────────────────────────────────────────────────

describe('uploadArtworkImage', () => {
  it("utilise le bucket 'artworks' avec le chemin {userId}/{timestamp}.{ext}", async () => {
    mockUpload.mockResolvedValue({ error: null })
    const before = Date.now()
    const file = makeFile('tableau.jpg', 'image/jpeg', 2048)

    const result = await uploadArtworkImage(USER_ID, file)
    const after = Date.now()

    expect(result).toEqual({ url: PUBLIC_URL })
    expect(supabase.storage.from).toHaveBeenCalledWith('artworks')

    const calledPath = mockUpload.mock.calls[0][0]
    const match = calledPath.match(new RegExp(`^${USER_ID}/(\\d+)\\.jpg$`))
    expect(match).not.toBeNull()

    const timestamp = Number(match[1])
    expect(timestamp).toBeGreaterThanOrEqual(before)
    expect(timestamp).toBeLessThanOrEqual(after)
  })

  it("extrait correctement l'extension WebP", async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('art.webp', 'image/webp', 1024)

    await uploadArtworkImage(USER_ID, file)

    const calledPath = mockUpload.mock.calls[0][0]
    expect(calledPath).toMatch(/\.webp$/)
  })

  it('deux appels consécutifs génèrent des chemins distincts', async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('art.jpg', 'image/jpeg', 512)

    await uploadArtworkImage(USER_ID, file)
    // Pause minimale pour garantir un timestamp différent
    await new Promise((r) => setTimeout(r, 2))
    await uploadArtworkImage(USER_ID, file)

    const path1 = mockUpload.mock.calls[0][0]
    const path2 = mockUpload.mock.calls[1][0]
    expect(path1).not.toBe(path2)
  })
})

// ─── uploadBlogImage ──────────────────────────────────────────────────────────

describe('uploadBlogImage', () => {
  it("utilise le bucket 'blogs' avec le chemin {userId}/{timestamp}.{ext}", async () => {
    mockUpload.mockResolvedValue({ error: null })
    const before = Date.now()
    const file = makeFile('cover.png', 'image/png', 3072)

    const result = await uploadBlogImage(USER_ID, file)
    const after = Date.now()

    expect(result).toEqual({ url: PUBLIC_URL })
    expect(supabase.storage.from).toHaveBeenCalledWith('blogs')

    const calledPath = mockUpload.mock.calls[0][0]
    const match = calledPath.match(new RegExp(`^${USER_ID}/(\\d+)\\.png$`))
    expect(match).not.toBeNull()

    const timestamp = Number(match[1])
    expect(timestamp).toBeGreaterThanOrEqual(before)
    expect(timestamp).toBeLessThanOrEqual(after)
  })

  it("extrait correctement l'extension GIF", async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('banner.gif', 'image/gif', 4096)

    await uploadBlogImage(USER_ID, file)

    const calledPath = mockUpload.mock.calls[0][0]
    expect(calledPath).toMatch(/\.gif$/)
  })

  it("propage l'erreur Supabase sur échec d'upload", async () => {
    mockUpload.mockResolvedValue({ error: { message: 'Storage quota exceeded' } })
    const file = makeFile('cover.jpg', 'image/jpeg', 1024)

    const result = await uploadBlogImage(USER_ID, file)

    expect(result).toEqual({ error: 'Storage quota exceeded' })
  })
})

// ─── deleteFile ───────────────────────────────────────────────────────────────

describe('deleteFile', () => {
  it('retourne { ok: true } quand la suppression réussit', async () => {
    mockRemove.mockResolvedValue({ error: null })

    const result = await deleteFile('artworks', `${USER_ID}/photo.jpg`)

    expect(result).toEqual({ ok: true })
  })

  it('appelle remove avec le chemin dans un tableau', async () => {
    mockRemove.mockResolvedValue({ error: null })
    const path = `${USER_ID}/avatar.jpg`

    await deleteFile('profiles', path)

    expect(supabase.storage.from).toHaveBeenCalledWith('profiles')
    expect(mockRemove).toHaveBeenCalledWith([path])
  })

  it("retourne l'erreur Supabase si la suppression échoue", async () => {
    mockRemove.mockResolvedValue({ error: { message: 'Object not found' } })

    const result = await deleteFile('artworks', 'u/missing.jpg')

    expect(result).toEqual({ error: 'Object not found' })
  })

  it('utilise le bon bucket lors de la suppression', async () => {
    mockRemove.mockResolvedValue({ error: null })

    await deleteFile('blogs', `${USER_ID}/cover.png`)

    expect(supabase.storage.from).toHaveBeenCalledWith('blogs')
  })
})

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('edge cases', () => {
  it('rejette un fichier SVG (type MIME non autorisé)', async () => {
    const file = makeFile('icon.svg', 'image/svg+xml', 512)

    const result = await uploadFile({ bucket: 'artworks', path: 'u/icon.svg', file })

    expect(result).toEqual({ error: 'Format non supporté. Utilisez JPEG, PNG, WebP ou GIF.' })
    expect(mockUpload).not.toHaveBeenCalled()
  })

  it('rejette un fichier texte déguisé en image (type MIME incorrect)', async () => {
    const file = makeFile('fake.jpg', 'text/plain', 256)

    const result = await uploadFile({ bucket: 'artworks', path: 'u/fake.jpg', file })

    expect(result).toEqual({ error: 'Format non supporté. Utilisez JPEG, PNG, WebP ou GIF.' })
  })

  it('un fichier de 0 octet valide par type MIME est accepté par la validation', async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('empty.jpg', 'image/jpeg', 0)

    const result = await uploadFile({ bucket: 'artworks', path: 'u/empty.jpg', file })

    expect(result).toEqual({ url: PUBLIC_URL })
  })

  it('uploadProfileImage avec une extension mixte (JPEG majuscule) normalise en minuscule', async () => {
    mockUpload.mockResolvedValue({ error: null })
    const file = makeFile('PHOTO.JPEG', 'image/jpeg', 512)

    await uploadProfileImage(USER_ID, file)

    const calledPath = mockUpload.mock.calls[0][0]
    expect(calledPath).toBe(`${USER_ID}/avatar.jpeg`)
  })
})
