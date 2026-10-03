import { Button } from "@/components/ui";
import { LazyHeroLogo3D } from "@/components/three";
import { BRANDS, DEPARTMENT_ORDER } from "@/content/brands";
import { getAsset } from "@/content/assets";

const FALLBACK_LOGO = "/brand/ventures/original/GN-VENTURES_BLACK.png";
const GRADIENT_TEXT = {
  backgroundImage: "linear-gradient(90deg, var(--b-accent-2), var(--b-accent), var(--b-accent-3))",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;

/** Page header: title, lead, primary download CTA, interactive logo and department chips. */
export default function Hero() {
  const logo = getAsset("ventures-primary-dark");
  const logoSrc = logo?.file ?? FALLBACK_LOGO;
  return (
    <header id="top" className="mb-[var(--section-gap)] scroll-mt-20" aria-labelledby="hero-title">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <div>
          <p className="gn-eyebrow mb-5">CORPORATE IDENTITY · BRAND SYSTEM</p>
          <h1 id="hero-title" className="text-[clamp(2.5rem,7vw,5.25rem)] leading-[1.02]">
            The system behind GN <span style={GRADIENT_TEXT}>Ventures.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--b-muted)] md:text-lg">
            One guide for creators, collaborators, designers, partners and AI agents. It documents the GN
            Ventures master identity and the six departments under it: how the logo, color, type, voice and
            components work, and where every file lives.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              href="#downloads"
              variant="primary"
              data-sfx="nav"
              aria-label="Download brand assets, jump to the downloads section"
            >
              Download brand assets
            </Button>
            <p className="font-ui text-sm tracking-[0.04em] text-[var(--b-muted)]">
              Brand Guidelines · Version 1.0 · 2026
            </p>
          </div>
        </div>
        <LazyHeroLogo3D
          src={logoSrc}
          alt="GN Ventures logo: lowercase lime gn with VENTURES, inside a rounded frame with a cyan, lime and amber gradient stroke"
          className="mx-auto w-full max-w-[26rem] lg:max-w-none"
        />
      </div>
      <nav aria-label="Departments" className="mt-12">
        <p className="gn-eyebrow mb-4">The six departments</p>
        <ul className="flex flex-wrap gap-3">
          {DEPARTMENT_ORDER.map((id) => {
            const brand = BRANDS[id];
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  data-sfx="nav"
                  className="gn-glass inline-flex min-h-11 items-center gap-2.5 rounded-full px-5 font-ui text-sm font-medium uppercase tracking-[0.1em] text-[var(--b-fg)] transition-colors hover:text-[var(--b-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-accent)]"
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full border border-[var(--b-border)]"
                    style={{ backgroundColor: brand.accent }}
                  />
                  {brand.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
