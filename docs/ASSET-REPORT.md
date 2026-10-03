# Asset report

Produced by the assets agent. Registry: `src/content/assets.ts` (167 entries, sizes measured from real files). Fonts: `src/content/fonts-manifest.ts`. Total `public/brand` is about 15 MB, `public/fonts` about 0.5 MB.

## Original versus derived

**Original** (copied untouched into `public/brand/<brand>/original/`, 33 workspace files plus 2 Drive vectors):

- Primary lockups on black: GN Ventures, GN Media, GN Academy, GN Labs (1080 px PNG), GN Club (648 px JPG).
- Each sister site's own icon, apple icon, favicon.ico and Open Graph image (Media, Academy, Labs, Club, Mazal icon and OG, Commune).
- GN Club mascot cursors (44 and 88 px), Mazal cursor.svg, Media otter mascot, Commune illustration and its WebP copy.
- Mazal M vectors `mazal_m_lime.svg` and `mazal_m_white.svg` from Drive. They are the only original vectors in the company. The polygon geometry is unchanged. The files carried a large embedded metadata block (a provenance manifest), which was dropped, so the stored files are 257 bytes.

**Derived** (every entry has `source: "derived"` and a provenance string; none is official):

- Per lockup brand (Ventures, Media, Academy, Club, Labs), 20 files each: transparent primary, horizontal crop (PNG, lossless WebP, traced SVG), square, on-light (PNG and SVG), mono white and mono ink (PNG and SVG), watermark, app icon 1024, apple touch 180, manifest 192 and 512, avatar 1024 (artwork at 50 percent width), favicon.ico (16, 32, 48), Open Graph template 1200x630 (PNG and WebP).
- Mazal: M mark, square, primary on midnight plate, mono ink (PNG and SVG), mono white, on-light, watermark, icon set, OG, all rendered from the original SVGs.
- GN Commune: mono black and mono white (PNG and SVG), primary on black plate, square, watermark, icon set, OG.

How they were made:

1. Transparency: luminance to alpha on the black plate (alpha from the brightest channel, colour unmultiplied at the edges). Checked at 3x zoom on white and on black: no halo.
2. On-light: the same artwork recoloured with HSL lightness capped at 0.38, so the lime and gradient frame read on white. This is a proposed variant, not an official file.
3. Icons: artwork centred on a flat square (ink black for the GN family, white for Commune, `#04070C` for Mazal). Manifest icons keep the artwork inside the maskable safe zone.
4. OG template: flat site ink (`#08090a` Ventures and Club, `#0a0a0f` Media, `#050605` Labs, `#0f1927` Academy computed from its dark oklch bg, black for Commune, `#04070C` to `#05090F` for Mazal) with faint lime and cyan glows, logo bottom-left, no headline text.
5. Vectors: potrace on the frame and the letters separately for the five lockups, with the gradient stops and the lime sampled from the source. Silhouette IoU against the source was 0.987 to 0.989 for all five and 0.982 for the Commune illustration, and each SVG was rasterised and compared by eye. Provenance reads "Traced from <file>". They are not official vectors.

## What could not be fetched or traced

Drive is read-only and the downloads only return inline base64. Only the two small SVGs could be reproduced faithfully by hand, so every binary Drive file was skipped and recorded in `MISSING_ASSETS`:

| File | Drive id | Fallback |
|---|---|---|
| GN VENTURES_WHITE.png | (Drive id removed) | derived light and mono variants |
| mazal_m_lime_1024.png | (Drive id removed) | rendered from SVG |
| mazal_m_white_4096.png | (Drive id removed) | rendered from SVG |
| Mazi.png | (Drive id removed) | none, no Mazi image in the pack |
| Mazal Logo.jpg | (Drive id removed) | none |
| MAZAL_Brand_Kit.pdf | (Drive id removed) | link to Drive instead of hosting |
| gnclub_logo_2048 (1).png | (Drive id removed) | workspace logo.jpg |
| gnclub_logo_navy_2048.png | (Drive id removed) | none, second Club style absent |
| GN Club-White.jpg / GN Club-Black.jpg | (Drive id removed) / (Drive id removed) | none |
| GN MEDIA / LABS / ACADEMY PNGs (Drive copies) | 1K9gNvdh..., 1vh3lbCD..., 1oM1fqth... | not compared by hash, workspace copies kept |

Nothing was traced and rejected. Not traced by design: the app icons, avatars, OG and other raster composites, which are plate composites rather than logos. The traced SVGs are in the registry only where they are clean.

## What is missing

- Original vector files for every logo except Mazal's M (all other SVGs are traces).
- Official light and on-white variants for GN Ventures, Media, Academy, Club, Labs. The on-light files are derived proposals. Mazal's kit defines no light variant either.
- GN Commune wordmark image: none exists, the wordmark is live Jost 300 text.
- Mazal wordmark SVG and the Mazi mascot files.
- Both GN Club logo styles side by side: only the 648 px workspace style is in the pack. Owner still has to confirm the current one.
- The Mazal brand kit PDF is not hosted.
- GN Media otter mascot is stored as an unconfirmed brand link and sits in the registry as kind `mascot`, not in the identity set.

## Drive ids actually used

- `(Drive id removed)` mazal_m_lime.svg (downloaded, reproduced)
- `(Drive id removed)` mazal_m_white.svg (downloaded, reproduced)
- Metadata only (sizes checked, not downloaded): the other ids in the table above.

No file was shared, trashed, updated, copied or created in Drive.

## Fonts

Ten families, latin subset woff2 from `@fontsource/*` 5.3.0 (installed outside the project), each with the OFL text from the package as `OFL.txt` (SIL Open Font License 1.1): Josefin Sans 300 and 400, Manrope 300 to 700, Poppins 400 500 600, Geist Mono 400 and 500, Archivo 700 800 900, Archivo Black 400, Jost 300, Inter 400 500 600, Caveat 400 and 600, IBM Plex Mono 400. Archivo Black is a separate family because the Mazal kit's "900 Archivo Black" is not Archivo weight 900.

## Notes for the integrator

- File names of the original plates were changed from spaces to hyphens (for example `GN-VENTURES_BLACK.png`) so URLs stay clean. Content is untouched.
- `AssetKind` gained `avatar`, `manifest` and `watermark` beyond the spec union. `web-services` is absent from `BrandId` and from every file.
- `mazal-on-light` and `commune-on-light` point at existing files (`mono-ink.png` and the original illustration), so two ids can share one file.
- `VECTOR_STATUS` in `assets.ts` carries the text for the "SVG placeholder: original vector pending" label.
- Build scripts and node_modules live in the session scratchpad, the project `package.json` was never touched.
