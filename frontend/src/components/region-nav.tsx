import Link from "next/link";
import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  LATAM_COUNTRIES,
  REGIONS,
  type RegionId,
} from "@/lib/regions";

type PeruAudience = "enterprise" | "sme";
type NavPhase = "chooser" | "rising" | "ready";

type RegionNavProps = {
  current: RegionId;
  contactActive?: boolean;
  solutionsActive?: boolean;
  peruAudience?: PeruAudience | null;
  onContact?: () => void;
  onSolutions?: () => void;
  onPeruAudienceSelect?: (audience: PeruAudience) => void;
  onExtended?: () => void;
  placeSelected?: boolean;
  ready?: boolean;
};

export function RegionNav({
  current,
  contactActive = false,
  solutionsActive = false,
  peruAudience = null,
  onContact,
  onSolutions,
  onPeruAudienceSelect,
  onExtended,
  placeSelected = false,
  ready = false,
}: RegionNavProps) {
  const inLatam = current !== "usa";
  const navRef = useRef<HTMLDivElement>(null);
  const [startWidth, setStartWidth] = useState<number | null>(null);
  const [phase, setPhase] = useState<NavPhase>("chooser");
  const [latamOpen, setLatamOpen] = useState(inLatam);
  const expandLatamInPlace = current === "usa" && !placeSelected;
  const menuOpen = phase === "ready";

  if (!ready && phase !== "chooser") {
    setPhase("chooser");
  }

  if (!ready && startWidth !== null) {
    setStartWidth(null);
  }

  useLayoutEffect(() => {
    if (!ready || startWidth !== null) return;
    const nav = navRef.current;
    if (!nav) return;
    setStartWidth(nav.getBoundingClientRect().width);
  }, [ready, startWidth]);

  useEffect(() => {
    if (!ready || startWidth === null || phase !== "chooser") return undefined;

    const frame = window.requestAnimationFrame(() => setPhase("rising"));
    return () => window.cancelAnimationFrame(frame);
  }, [phase, ready, startWidth]);

  useEffect(() => {
    if (phase !== "rising") return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(
      () => setPhase("ready"),
      reduced ? 0 : 1450,
    );

    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "ready") return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => onExtended?.(), reduced ? 0 : 1300);

    return () => window.clearTimeout(id);
  }, [onExtended, phase]);

  return (
    <div
      ref={navRef}
      className={`market-nav is-${phase}`}
      style={
        startWidth
          ? ({ "--nav-start-width": `${startWidth}px` } as CSSProperties)
          : undefined
      }
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.propertyName === "top" && phase === "rising") {
          setPhase("ready");
        }
        if (event.propertyName === "width" && phase === "ready") {
          onExtended?.();
        }
      }}
    >
      <nav className="region-nav" aria-label="Mercados">
        <Link href="/" className="region-nav__mark" aria-label="Aberuca">
          <img
            src="/aberuca-mark.png"
            alt=""
            width={1271}
            height={1238}
          />
        </Link>
        <Link
          href="/?place=usa"
          aria-current={
            current === "usa" && placeSelected ? "page" : undefined
          }
        >
          USA
        </Link>
        {onSolutions && current === "usa" ? (
          <div
            className={`region-nav__chat${menuOpen ? " is-open" : ""}`}
            id="usa-solutions"
          >
            <div className="region-nav__chat-inner">
              <span className="region-nav__divider" aria-hidden="true" />
              <button
                type="button"
                aria-pressed={solutionsActive}
                tabIndex={menuOpen ? undefined : -1}
                onClick={onSolutions}
              >
                Solutions
              </button>
            </div>
          </div>
        ) : null}
        <span className="region-nav__divider region-nav__divider--markets" aria-hidden="true" />
        {expandLatamInPlace ? (
          <button
            type="button"
            aria-expanded={latamOpen}
            aria-controls="latam-countries"
            data-active={latamOpen || undefined}
            onClick={() => setLatamOpen(true)}
          >
            Latam
          </button>
        ) : (
          <Link
            href="/latam"
            aria-current={current === "latam" ? "page" : undefined}
            data-active={inLatam || undefined}
          >
            Latam
          </Link>
        )}

        <div
          className={`region-nav__chat${latamOpen ? " is-open" : ""}`}
          id="latam-countries"
        >
          <div className="region-nav__chat-inner">
            <span className="region-nav__divider" aria-hidden="true" />
            {LATAM_COUNTRIES.map((id) => {
              const region = REGIONS[id];
              return (
                <Link
                  key={id}
                  href={region.href}
                  aria-current={id === current ? "page" : undefined}
                  tabIndex={latamOpen ? undefined : -1}
                >
                  {region.short}
                </Link>
              );
            })}
          </div>
        </div>

        {onPeruAudienceSelect ? (
          <div
            className={`region-nav__chat${menuOpen ? " is-open" : ""}`}
            id="peru-audiences"
          >
            <div className="region-nav__chat-inner">
              <span className="region-nav__divider" aria-hidden="true" />
              <button
                type="button"
                aria-pressed={peruAudience === "sme"}
                tabIndex={menuOpen ? undefined : -1}
                onClick={() => onPeruAudienceSelect("sme")}
              >
                Pequeñas y medianas empresas
              </button>
              <button
                type="button"
                aria-pressed={peruAudience === "enterprise"}
                tabIndex={menuOpen ? undefined : -1}
                onClick={() => onPeruAudienceSelect("enterprise")}
              >
                Grandes Empresas
              </button>
              {onSolutions ? (
                <button
                  type="button"
                  aria-pressed={solutionsActive}
                  tabIndex={menuOpen ? undefined : -1}
                  onClick={onSolutions}
                >
                  Soluciones
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {onContact ? (
          <>
            <span className="region-nav__divider" aria-hidden="true" />
            <button
              type="button"
              className="region-nav__contact"
              aria-pressed={contactActive}
              onClick={onContact}
            >
              {current === "usa" ? "Contact" : "Contacto"}
            </button>
          </>
        ) : null}
      </nav>
    </div>
  );
}
