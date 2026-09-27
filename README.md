# build.tonyteng.dev

Promo video + companion site for **Custom AI Solutions** by Tony Teng.

```
video/   Remotion project — 30s promo (main), 60s cut, stills, OG image
site/    Next.js 16 site — deployed to Vercel at build.tonyteng.dev
```

## Video (`video/`)

| Command | What it does |
|---|---|
| `npm run studio` | Open Remotion Studio to preview/scrub scenes |
| `npm run render` | Render the 30s cut `out/promo.mp4` (composition `Promo`) |
| `npm run render:full` | Render the 60s cut `out/promo-full.mp4` (composition `PromoFull`) |
| `npm run stills` | Poster (30s cut), `out/case-{1,2,3}.jpg` (60s cut), `out/og.png` |
| `node scripts/frames.mjs [Promo \| PromoFull] 60 330 …` | Render specific frames to `out/frames/` for quick checks |

- All on-screen text is in `src/copy/en.ts`. For the Chinese version, add `src/copy/zh.ts` with the same shape and a second composition.
- 30s cut: `src/PromoShort.tsx` + scenes in `src/short/`. 60s cut: `src/Promo.tsx` + scenes in `src/scenes/`. Each scene's timeline constants sit at the top of its file.
- The 30s copy lives under `copy.short` in `src/copy/en.ts`.
- Music: put a royalty-free track in `public/` and set `MUSIC_FILE` in `src/config.ts`, then re-render.

After re-rendering, copy media into the site:

```bash
cp video/out/promo.mp4 video/out/poster.jpg site/public/media/
for i in 1 2 3; do ffmpeg -y -i video/out/case-$i.jpg -vf "crop=1920:760:0:270" -q:v 3 site/public/media/case-$i.jpg; done
ffmpeg -y -i video/out/promo.mp4 -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -an site/public/media/promo.webm
cp video/out/og.png site/app/opengraph-image.png && cp video/out/og.png site/app/twitter-image.png
```

## Site (`site/`)

- Copy lives in `lib/site.ts` (cases, steps, capabilities, FAQ).
- Contact form posts to `app/api/contact/route.ts`, which emails you through [Resend](https://resend.com).
  Env vars (see `.env.example`): `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, optional `CONTACT_FROM_EMAIL`.
  Without a verified domain in Resend, the default sender only delivers to your Resend account's own email.

## Deploy

1. `cd site && vercel env add RESEND_API_KEY production` (and `CONTACT_TO_EMAIL`, optionally `CONTACT_FROM_EMAIL`)
2. `vercel --prod`
3. `vercel domains add build.tonyteng.dev`
4. Cloudflare DNS for tonyteng.dev: `CNAME build → cname.vercel-dns.com` (same proxy setting as the `hotel` record)
