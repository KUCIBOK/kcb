# 🚀 PRODUCTION DEPLOYMENT PLAN

**Release:** v1.0.0-security  
**Branch:** `main`  
**Status:** Ready for Production  
**Date:** 2026-08-24  

---

## ⚠️ PRE-DEPLOYMENT CHECKLIST

### ✅ Code Review & Testing
- [x] Security audit completed
- [x] 16 vulnerabilities fixed
- [x] All commits on `main` branch
- [x] Documentation complete
- [x] No breaking changes
- [ ] **Staging deployment tested** ← REQUIRED BEFORE PRODUCTION
- [ ] **Security team approved** ← REQUIRED BEFORE PRODUCTION
- [ ] **Performance tested** ← REQUIRED BEFORE PRODUCTION

---

## 📋 DEPLOYMENT STEPS

### Phase 1: Database Migration (Supabase)

**Duration:** ~5 minutes  
**Reversibility:** ✅ Yes (can drop audit_logs table)

```bash
# Apply migration 011 (audit_logs table)
supabase migrations push

# Verify migration applied
supabase db list

# Check audit_logs table exists
supabase db remote schemas
```

### Phase 2: Environment Variables (Vercel)

**Duration:** ~2 minutes  
**Required Variables:**

```bash
# MUST SET - CORS security
CORS_ORIGIN=https://kucibok.com

# OPTIONAL - Rate limiting (without this, uses in-memory)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

**Steps:**
1. Go to: https://vercel.com/kucibok221-8539s-projects/kucibok
2. Settings → Environment Variables
3. Add/Update `CORS_ORIGIN=https://kucibok.com`
4. Optionally add Upstash Redis credentials
5. Click "Save"

### Phase 3: Deploy to Production (Vercel)

**Duration:** ~10-15 minutes  
**Reversibility:** ✅ Yes (can redeploy previous version)

```bash
# Option 1: Automatic (recommended)
# Push to main → Vercel auto-deploys

# Option 2: Manual via Vercel CLI
vercel deploy --prod

# Option 3: Via GitHub
# Merge to main → GitHub webhook triggers Vercel deploy
```

### Phase 4: Verification (Post-Deployment)

**Duration:** ~10 minutes  
**Critical:** ✅ Yes - MUST verify before considering deployment complete

```bash
# 1. Verify security headers
curl -i https://kucibok.com/api/artworks | grep -E "Strict-Transport-Security|Content-Security-Policy|X-Frame-Options"

# Expected output:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# Content-Security-Policy: default-src 'self'; ...
# X-Frame-Options: DENY

# 2. Test rate limiting headers
curl -i https://kucibok.com/api/artworks | grep -E "X-RateLimit"

# Expected:
# X-RateLimit-Limit: 500
# X-RateLimit-Remaining: 499
# X-RateLimit-Reset: [timestamp]

# 3. Test email validation
curl -X POST https://kucibok.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid.email","password":"test123"}'

# Expected: 400 Invalid email format

# 4. Check audit logs are working
supabase db remote exec "SELECT COUNT(*) FROM audit_logs;"

# Should show: count > 0 (audit entries recorded)
```

---

## 🔄 ROLLBACK PLAN

### If Issues Occur

**Duration:** ~10-15 minutes  
**Reversibility:** ✅ Yes

#### Database Rollback
```bash
# Drop audit_logs table (if needed)
supabase db remote exec "DROP TABLE audit_logs CASCADE;"

# Or keep it and just not use it
# (it won't break anything)
```

#### Environment Variables Rollback
```bash
# Remove problematic env vars in Vercel
# Or set CORS_ORIGIN back to previous value
```

#### Code Rollback (Last Resort)
```bash
# Redeploy previous version
vercel deploy --prod --target=production

# Or via GitHub
git revert HEAD
git push origin main
# Vercel will auto-redeploy
```

---

## 📊 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Staging deployment successful
- [ ] Security tests passing
- [ ] Performance acceptable
- [ ] Team sign-off obtained
- [ ] Backup of database taken (optional)
- [ ] Rollback plan reviewed

### Deployment
- [ ] Database migration applied
- [ ] Environment variables set
- [ ] Code deployed to production
- [ ] Deployment completed successfully

### Post-Deployment (CRITICAL)
- [ ] Security headers verified
- [ ] Rate limiting working
- [ ] Email validation working
- [ ] Audit logs recording
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Team notification sent

---

## 📱 MONITORING AFTER DEPLOYMENT

### Real-time Monitoring
```bash
# Watch for errors in Vercel logs
vercel logs --follow

# Monitor Supabase
# - Check audit_logs table size
# - Monitor database performance
```

### Metrics to Watch
- **Audit Logs:** Entries growing (mutations being logged)
- **Rate Limiting:** 429 responses for high-volume IPs
- **Security Headers:** Present on all responses
- **Email Validation:** Invalid emails rejected at signup
- **Performance:** No degradation from rate limiting

### Alerts to Set Up
- [ ] High error rate in API
- [ ] Audit logs table size > 1GB
- [ ] Rate limiting rejections > 10% requests
- [ ] Security header missing on responses

---

## 🎯 SUCCESS CRITERIA

✅ **Deployment successful when:**

1. **Security Headers Present**
   - HSTS: `max-age=31536000`
   - CSP: `default-src 'self'`
   - X-Frame-Options: `DENY`

2. **Rate Limiting Active**
   - Rate-Limit headers present
   - 429 responses for excess requests
   - No legitimate traffic blocked

3. **Audit Logging Working**
   - audit_logs table has entries
   - Timestamp and user_id recorded correctly
   - Before/after state captured for updates

4. **Email Validation Active**
   - Invalid emails rejected with 400
   - Valid emails accepted
   - Test: `user@domain.com` works, `invalid` fails

5. **No Breaking Changes**
   - Existing users can still login
   - Artwork CRUD operations work
   - Shortlist functionality intact
   - API response format unchanged (except new fields)

6. **Performance Acceptable**
   - No significant latency increase
   - Rate limiting doesn't impact normal users
   - Database queries performing well

---

## 📞 SUPPORT & ROLLBACK CONTACTS

If issues occur during deployment:

1. **Immediate Action:** Check Vercel logs for errors
2. **Database Issues:** Review Supabase dashboard
3. **Revert Code:** Use rollback plan above
4. **Questions:** See `AUDIT_COMPLETE.md` for details

---

## 📚 Related Documentation

- `AUDIT_COMPLETE.md` — Executive summary
- `SECURITY_FIXES_DAY1.md` — CRITICAL phase details
- `SECURITY_FIXES_JOUR2-3.md` — HIGH phase details
- `SECURITY_FIXES_WEEK2.md` — MEDIUM phase details
- `PR_DESCRIPTION.md` — Complete PR information

---

## ✅ FINAL SIGN-OFF

**Ready for Production Deployment:**

- [x] Code reviewed and merged to `main`
- [x] Tag created: `v1.0.0-security`
- [x] Documentation complete
- [x] Migration prepared
- [x] Rollback plan documented
- [ ] **Awaiting deployment approval**

---

**Status:** 🟢 **READY FOR PRODUCTION**  
**Risk Level:** 🟡 **MEDIUM** (comprehensive but first security audit)  
**Rollback Time:** ~15 minutes  
**Monitoring:** Essential for 24-48 hours post-deployment  

🚀 **Proceed with deployment when ready!**
