# ZimVerify — Supabase Email Template Customization

## How to Apply

1. Go to: https://supabase.com/dashboard/project/detzhzrvqcwkkfnlplnj
2. Click **Authentication** in the left sidebar
3. Click **Email Templates** tab
4. Update each template below and click **Save**

---

## 1. Confirm Signup

**Subject:** `Confirm your ZimVerify account`

**Body (HTML):**
```html
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #FAF8F5; border-radius: 12px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <div style="display: inline-block; background: #1a5c4c; padding: 10px 16px; border-radius: 10px; color: white; font-weight: bold; font-size: 20px;">ZimVerify</div>
  </div>
  <h2 style="color: #1a2b2a; font-size: 22px; margin-bottom: 8px; text-align: center;">Welcome to ZimVerify</h2>
  <p style="color: #6b7280; font-size: 15px; text-align: center; margin-bottom: 24px;">Zimbabwe's National Vehicle Verification Platform</p>
  <p style="color: #374151; font-size: 15px; line-height: 1.6;">Please confirm your email address to activate your account and access the platform.</p>
  <div style="text-align: center; margin: 28px 0;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: #1a5c4c; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">Confirm Email Address</a>
  </div>
  <p style="color: #9ca3af; font-size: 13px; text-align: center;">If you didn't create this account, you can safely ignore this email.</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
  <p style="color: #9ca3af; font-size: 12px; text-align: center;">ZimVerify — Trusted by law enforcement, insurers, and 14 million citizens.</p>
</div>
```

---

## 2. Reset Password

**Subject:** `Reset your ZimVerify password`

**Body (HTML):**
```html
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #FAF8F5; border-radius: 12px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <div style="display: inline-block; background: #1a5c4c; padding: 10px 16px; border-radius: 10px; color: white; font-weight: bold; font-size: 20px;">ZimVerify</div>
  </div>
  <h2 style="color: #1a2b2a; font-size: 22px; margin-bottom: 8px; text-align: center;">Reset Your Password</h2>
  <p style="color: #374151; font-size: 15px; line-height: 1.6; text-align: center;">We received a request to reset your password. Click the button below to choose a new one.</p>
  <div style="text-align: center; margin: 28px 0;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: #1a5c4c; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">Reset Password</a>
  </div>
  <p style="color: #9ca3af; font-size: 13px; text-align: center;">This link expires in 24 hours. If you didn't request this, no action is needed.</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
  <p style="color: #9ca3af; font-size: 12px; text-align: center;">ZimVerify — National Vehicle Verification Platform</p>
</div>
```

---

## 3. Magic Link

**Subject:** `Your ZimVerify sign-in link`

**Body (HTML):**
```html
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #FAF8F5; border-radius: 12px;">
  <div style="text-align: center; margin-bottom: 24px;">
    <div style="display: inline-block; background: #1a5c4c; padding: 10px 16px; border-radius: 10px; color: white; font-weight: bold; font-size: 20px;">ZimVerify</div>
  </div>
  <h2 style="color: #1a2b2a; font-size: 22px; margin-bottom: 8px; text-align: center;">Sign In to ZimVerify</h2>
  <p style="color: #374151; font-size: 15px; line-height: 1.6; text-align: center;">Click the button below to securely sign in to your account.</p>
  <div style="text-align: center; margin: 28px 0;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: #1a5c4c; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">Sign In</a>
  </div>
  <p style="color: #9ca3af; font-size: 13px; text-align: center;">This link expires in 1 hour.</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
  <p style="color: #9ca3af; font-size: 12px; text-align: center;">ZimVerify — Trusted by law enforcement, insurers, and 14 million citizens.</p>
</div>
```

---

## 4. Also Configure: URL Configuration

Go to **Authentication** > **URL Configuration** and set:
- **Site URL:** `https://zimra-vehicle-hub.preview.emergentagent.com`
- **Redirect URLs:** Add `https://zimra-vehicle-hub.preview.emergentagent.com/auth/callback`

This ensures email confirmation and password reset links redirect to the correct pages.
