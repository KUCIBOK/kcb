/**
 * api/_modules/auth.js — Authentification (Thin Wrapper)
 * Routes: POST/GET /api/auth/*
 *
 * Placeholder module — delegates to main handler for now.
 * To be progressively extracted in future sprints.
 *
 * Structure:
 * export async function handle(req, res, segment, context) {}
 */

// TODO: Extract auth handlers progressively from main api/[...path].js
export async function handle(req, res, segment, context) {
  // This module exists for future extraction.
  // Main handler currently handles all auth routes.
  return false // Not handled by this module
}
