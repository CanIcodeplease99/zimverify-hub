# ZimVerify — Vercel Subdomain Setup Guide

## Step 1: Buy your domain

Purchase `zimverify.com` (or your preferred domain) from any registrar:
- [Namecheap](https://namecheap.com)
- [GoDaddy](https://godaddy.com)
- [Cloudflare](https://cloudflare.com) (recommended — free DNS)

## Step 2: Deploy to Vercel

1. Push your code to GitHub (use "Save to GitHub" in Emergent)
2. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
3. Framework: **Vite**
4. Root Directory: `frontend`
5. Build Command: `yarn build`
6. Output Directory: `dist`
7. Add environment variables:
   - `VITE_SUPABASE_URL` = `https://detzhzrvqcwkkfnlplnj.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_AXyK0VVMBkBpPpG4irNSvg_kYGWmvjo`

## Step 3: Add your domain to Vercel

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add these 4 domains:
   - `zimverify.com` (main public site)
   - `police.zimverify.com` (police portal)
   - `gov.zimverify.com` (government portal)
   - `insurance.zimverify.com` (insurance portal)

## Step 4: Configure DNS

At your domain registrar, add these DNS records:

### For root domain (zimverify.com)
| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

### For subdomains
| Type | Name | Value |
|------|------|-------|
| CNAME | police | `cname.vercel-dns.com` |
| CNAME | gov | `cname.vercel-dns.com` |
| CNAME | insurance | `cname.vercel-dns.com` |

> Note: Vercel provides the exact DNS values when you add each domain. Use their values.

## Step 5: Update Supabase redirect URLs

Go to Supabase Dashboard → Auth → URL Configuration:
- Site URL: `https://zimverify.com`
- Redirect URLs (add all):
  - `https://zimverify.com/auth/callback`
  - `https://police.zimverify.com/auth/callback`
  - `https://gov.zimverify.com/auth/callback`
  - `https://insurance.zimverify.com/auth/callback`

## How it works

The app detects the hostname automatically:
- `zimverify.com` → shows public site only, portal routes return 404
- `police.zimverify.com` → auto-redirects to police login, only police portal accessible
- `gov.zimverify.com` → auto-redirects to gov login, only government portal accessible
- `insurance.zimverify.com` → auto-redirects to insurance login

All internal portals are:
- Hidden from search engines (X-Robots-Tag: noindex, nofollow)
- Not linked from the public site
- Blocked if accessed from the wrong domain (returns 404, not "unauthorized")
- Protected by security headers (X-Frame-Options: DENY, strict referrer policy)
