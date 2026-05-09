---
title: "Page Moved — Transparent Prepayment Model"
description: "We've updated our payment model. This page now redirects to our new Transparent Prepayment Model."
head:
  - - meta
    - http-equiv: refresh
      content: "0; url=/uae-business/benefits/prepayment-model"
  - - link
    - rel: canonical
      href: https://goldenfish.ae/uae-business/benefits/prepayment-model
sidebar: false
aside: false
prev: false
next: false
---

# This page has moved

Golden Fish now operates on a **Transparent Prepayment Model** with no hidden fees.

If you are not redirected automatically, please visit:

**[/uae-business/benefits/prepayment-model](/uae-business/benefits/prepayment-model)**

---

> **Server-side note (better solution):** instead of this client-side meta-refresh stub, configure a proper 301 redirect:
>
> **Netlify** — add to `_redirects`:
> ```
> /uae-business/benefits/success-based-fees    /uae-business/benefits/prepayment-model    301
> ```
>
> **Vercel** — add to `vercel.json`:
> ```json
> { "redirects": [{
>     "source": "/uae-business/benefits/success-based-fees",
>     "destination": "/uae-business/benefits/prepayment-model",
>     "permanent": true
> }]}
> ```
>
> **VitePress config** — `rewrites` won't redirect, but you can add a custom Vite plugin or use the host-level redirect above. After 301 is in place, this stub file can be deleted.
