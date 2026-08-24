# 🐛 Email + Password Login Troubleshooting

**Status:** Google OAuth ✅ | Email/Password ❌

---

## Quick Diagnosis

### Symptom: "Email ou mot de passe incorrect"

This error comes from Supabase when:
1. Email doesn't exist in auth.users
2. Password is wrong
3. Email is not confirmed

---

## Step 1: Verify Email Confirmation

**Check:** Did you receive verification email after signup?

- ✅ Yes → Go to Step 2
- ❌ No → Go to "Resend Verification Email"

### Resend Verification Email
```bash
# Contact support or use password reset instead
# (Easier than resending verification)
```

---

## Step 2: Try Password Reset

**Most likely fix:** You forgot your password, or it needs to be reset

1. Go to login page
2. Click "Forgot Password?"
3. Enter your email
4. Check email for reset link
5. Create new password (min 8 characters)
6. Login with new password

---

## Step 3: Check Account Status

**If password reset didn't work:**

Your account might not exist. This can happen if:
- Signup failed (server error)
- Email validation rejected your email

### Try signing up again
1. Use same email
2. Choose strong password (8+ chars)
3. Verify email immediately after signup
4. Try logging in

---

## Step 4: Contact Support

If none of above works:

1. **Account is broken** → Support can recreate it
2. **Migration issue** → Account existed before but lost

Email: `kucibok221@gmail.com`

Include:
- Your email
- Error message
- Whether Google OAuth works

---

## Technical Details (For Debugging)

### Email/Password Login Flow
1. Frontend calls: `supabase.auth.signInWithPassword({ email, password })`
2. Supabase checks `auth.users` table
3. Returns error if:
   - User not found
   - Password incorrect
   - Email not confirmed (depends on settings)

### Why Google OAuth Works
- OAuth creates user with confirmed email automatically
- Doesn't require password
- Bypasses email confirmation

### Email Validation Added Recently
- New: Regex validation `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- Only affects NEW signups
- Existing accounts unaffected

---

## Recommended Solution

**Try this now:**
1. Click "Forgot Password" on login page
2. Enter your email
3. Check email for reset link (check spam folder)
4. Create new password
5. Login with new password + email

This should work immediately.

---

**Still broken?** Let me know and I'll check Supabase directly for your account.
