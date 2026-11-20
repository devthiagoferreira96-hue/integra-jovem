type LogoProps = {
  className?: string;
  showTagline?: boolean;
};

export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`marca-fixa inline-flex items-center justify-center rounded-lg bg-primary ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-[70%] w-[70%]"
        aria-hidden="true"
        role="presentation"
      >
        <path
          d="M 34.54 12.50 L 33.11 13.38 L 30.38 16.12 L 24.48 22.92 L 18.58 31.14 L 14.64 38.16 L 12.24 43.97 L 10.82 49.67 L 10.71 55.37 L 11.58 59.43 L 13.44 63.16 L 14.86 65.02 L 17.27 67.43 L 19.67 69.19 L 24.15 71.38 L 27.65 72.70 L 33.88 74.23 L 43.06 75.55 L 50.27 75.88 L 59.56 75.77 L 59.78 75.99 L 59.89 87.72 L 60.98 89.14 L 62.19 89.58 L 63.06 89.47 L 64.48 88.60 L 82.19 72.70 L 91.48 64.80 L 93.66 62.50 L 93.99 61.40 L 93.88 60.09 L 92.57 58.55 L 77.38 44.96 L 65.90 34.10 L 62.95 32.02 L 61.64 32.02 L 60.77 32.57 L 59.89 33.77 L 59.78 46.38 L 59.45 46.71 L 52.57 46.05 L 48.63 45.07 L 44.70 43.64 L 40.33 41.01 L 38.58 39.25 L 36.83 36.84 L 35.19 32.57 L 34.75 29.82 L 34.75 25.77 L 35.74 20.50 L 37.60 14.69 L 37.27 13.71 L 36.61 12.94 L 35.52 12.39 Z"
          fill="var(--primary-foreground)"
        />
      </svg>
    </span>
  );
}

export function Logo({ className = "", showTagline = false }: LogoProps) {
  return (
    <span className={`marca-fixa inline-flex flex-col ${className}`}>
      <span className="flex items-center gap-[2px] whitespace-nowrap break-keep font-display text-3xl font-extrabold leading-none tracking-tight">
        <span>in</span>
        <LogoIcon className="h-[1.50em] w-[1.50em]" />
        <span>tegra</span>
      </span>
      {showTagline ? (
        <>
          <span className="mt-1.5 flex h-[3px] w-full overflow-hidden rounded-full">
            <span className="h-full w-1/2 bg-primary" />
            <span className="h-full w-1/2 bg-subtle-foreground" />
          </span>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
            Jovem
          </span>
        </>
      ) : (
        <span className="sr-only">Jovem</span>
      )}
    </span>
  );
}
