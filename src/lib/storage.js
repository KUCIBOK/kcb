/**
 * storage.js — Utilitaires Supabase Storage pour Kucibok.
 *
 * Buckets attendus (à créer dans le dashboard Supabase) :
 *   - `profiles`      public  — photos de profil artistes / collectionneurs / pros
 *   - `artworks`      public  — images d'œuvres
 *   - `blogs`         public  — images articles de blog
 *   - `certificates`  private — certificats PDF générés
 *
 * @module storage
 */

import imageCompression from 'browser-image-compression'
import { supabase } from './supabase'

/** Types MIME acceptés pour les images. */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/** Taille maximale autorisée par fichier (10 Mo). */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

/** Options de compression appliquées avant upload. */
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp',
}

async function compressImage(file) {
  if (file.type === 'image/gif') return file
  try {
    return await imageCompression(file, COMPRESSION_OPTIONS)
  } catch {
    return file
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valide un fichier image avant upload.
 *
 * @param {File} file
 * @returns {{ ok: true } | { error: string }}
 */
function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: 'Format non supporté. Utilisez JPEG, PNG, WebP ou GIF.' }
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { error: 'Fichier trop volumineux. Maximum 10 Mo.' }
  }
  return { ok: true }
}

/**
 * Upload un fichier vers un bucket Supabase Storage.
 * Écrase silencieusement si le chemin existe déjà (upsert).
 *
 * @param {{ bucket: string, path: string, file: File }} params
 * @returns {Promise<{ url: string } | { error: string }>}
 */
export async function uploadFile({ bucket, path, file }) {
  const validation = validateImageFile(file)
  if (!validation.ok) return { error: validation.error }

  const compressed = await compressImage(file)
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, compressed, { upsert: true, contentType: compressed.type })

  if (error) return { error: error.message }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl }
}

// ─────────────────────────────────────────────────────────────────────────────
// DOMAINES MÉTIER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Upload une photo de profil dans le bucket `profiles`.
 * Chemin : `profiles/{userId}/avatar.{ext}`
 *
 * @param {string} userId - UUID Supabase de l'utilisateur
 * @param {File} file
 * @returns {Promise<{ url: string } | { error: string }>}
 */
export async function uploadProfileImage(userId, file) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  return uploadFile({ bucket: 'profiles', path: `${userId}/avatar.${ext}`, file })
}

/**
 * Upload une image d'œuvre dans le bucket `artworks`.
 * Chemin : `artworks/{userId}/{timestamp}.{ext}`
 *
 * @param {string} userId - UUID Supabase de l'utilisateur (artiste ou pro)
 * @param {File} file
 * @returns {Promise<{ url: string } | { error: string }>}
 */
export async function uploadArtworkImage(userId, file) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const timestamp = Date.now()
  return uploadFile({ bucket: 'artworks', path: `${userId}/${timestamp}.${ext}`, file })
}

/**
 * Upload une image de blog dans le bucket `blogs`.
 * Chemin : `blogs/{userId}/{timestamp}.{ext}`
 *
 * @param {string} userId - UUID Supabase de l'auteur
 * @param {File} file
 * @returns {Promise<{ url: string } | { error: string }>}
 */
export async function uploadBlogImage(userId, file) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const timestamp = Date.now()
  return uploadFile({ bucket: 'blogs', path: `${userId}/${timestamp}.${ext}`, file })
}

/**
 * Supprime un fichier d'un bucket Supabase Storage.
 *
 * @param {string} bucket
 * @param {string} path
 * @returns {Promise<{ ok: true } | { error: string }>}
 */
export async function deleteFile(bucket, path) {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) return { error: error.message }
  return { ok: true }
}
