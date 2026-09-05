# sshpod docs

Documentation site for [`sshpod`](https://github.com/sshpod/sshpod), built with
VitePress and published at [www.sshpod.com](https://www.sshpod.com).

## Local development

Install dependencies:

```bash
npm install
```

Or with `just`:

```bash
just install
```

Start the dev server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the built site locally:

```bash
npm run preview
```

Run the production build smoke test:

```bash
just test
```

## Project structure

- `docs/index.md` is the homepage.
- `docs/.vitepress/config.mts` contains site config, nav, sidebar, and metadata.
- `docs/.vitepress/theme/` contains the hero layout override and the palette.
- `docs/install.md`, `docs/quick-start.md`, `docs/providers.md`, `docs/devcontainer.md`,
  `docs/config.md`, `docs/cli.md`, `docs/roadmap.md`, and `docs/about.md` are the content.
- `docs/public/` contains generated logo variants, favicons, the social card, and `CNAME`.
- Mermaid diagrams come from `vitepress-plugin-mermaid`; roadmap checkboxes from `markdown-it-task-lists`.
- `assets/sshpod.png` is the original 1254x1254 artwork. Everything in `docs/public/`
  is derived from it with ImageMagick; see [Regenerating the logo](#regenerating-the-logo).

## Regenerating the logo

The original has no alpha channel — its transparency checkerboard is baked into
the pixels — so the published assets are keyed out and trimmed:

```bash
magick assets/sshpod.png -fuzz 12% -transparent '#D1D1D1' -fuzz 12% -transparent '#FEFEFE' \
  -alpha extract -threshold 40% \
  -define connected-components:area-threshold=20000 \
  -define connected-components:mean-color=true -connected-components 8 \
  -morphology Close Disk:2 /tmp/mask.png

magick assets/sshpod.png /tmp/mask.png -alpha off -compose CopyOpacity -composite \
  -trim +repage /tmp/logo-full.png
```

`/tmp/logo-full.png` is then resized to `docs/public/logo.png` (640px wide),
`box.png` (256px), `favicon.png` / `apple-touch-icon.png` (180px), and
`favicon.ico`, each quantized to 64 colors.

## Deployment

The site is deployed with **Cloudflare Pages**, connected to this repository.
Build settings:

| Setting | Value |
| --- | --- |
| Framework preset | None (or VitePress) |
| Build command | `npm run build` |
| Build output directory | `docs/.vitepress/dist` |
| Root directory | `/` |

`.node-version` pins Node 20 for the Cloudflare build image. The custom domain
`www.sshpod.com` is set in the Cloudflare Pages project, not in this repo.

`docs/public/_headers` is picked up by Cloudflare Pages and sets
`X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy` on every
response.
