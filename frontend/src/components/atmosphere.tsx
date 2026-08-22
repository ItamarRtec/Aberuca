type AtmosphereProps = {
  label?: string;
  framed?: boolean;
  hero?: boolean;
};

export function Atmosphere({
  label = "Aberuca",
  framed = true,
  hero = false,
}: AtmosphereProps) {
  const frame = hero
    ? "atmosphere atmosphere--hero"
    : framed
      ? "atmosphere atmosphere--banner"
      : "atmosphere";

  return (
    <div className={frame}>
      <div className="atmosphere__field" aria-hidden="true">
        <span className="orb orb--ember" />
        <span className="orb orb--rose" />
        <span className="orb orb--violet" />
      </div>
      <svg className="grain" aria-hidden="true">
        <filter id="aberuca-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={4}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#aberuca-grain)" />
      </svg>
      {label ? <p className="atmosphere__wordmark">{label}</p> : null}
    </div>
  );
}
