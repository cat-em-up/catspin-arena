const SVG_NS = "http://www.w3.org/2000/svg";

export function startAnimatedPawFavicon(): () => void {
  const link = getOrCreateFaviconLink();

  let t = 0;

  const renderFrame = (): void => {
    const angle = Math.sin(t) * 45;

    const svg = createGoldenPawSvg(64, angle);
    link.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    t += 0.25;
  };

  renderFrame();
  const timer = window.setInterval(renderFrame, 60);

  return () => {
    window.clearInterval(timer);
  };
}

function getOrCreateFaviconLink(): HTMLLinkElement {
  let link = document.querySelector(
    "link[rel='icon']",
  ) as HTMLLinkElement | null;

  if (link === null) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  return link;
}

function createGoldenPawSvg(size: number, angle: number): string {
  return `<svg xmlns="${SVG_NS}" width="${size}" height="${size}" viewBox="0 0 64 64">
  <defs>
    <radialGradient id="gold" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#fff6b0"/>
      <stop offset="40%" stop-color="#ffd700"/>
      <stop offset="75%" stop-color="#e6b800"/>
      <stop offset="100%" stop-color="#b8860b"/>
    </radialGradient>
  </defs>

  <rect width="64" height="64" fill="transparent"/>

  <g transform="rotate(${angle} 32 40)">
    <ellipse cx="32" cy="40" rx="18" ry="14" fill="url(#gold)"/>

    <circle cx="20" cy="20" r="7" fill="url(#gold)"/>
    <circle cx="32" cy="14" r="7" fill="url(#gold)"/>
    <circle cx="44" cy="20" r="7" fill="url(#gold)"/>

    <ellipse cx="26" cy="34" rx="6" ry="3" fill="#ffffff55"/>
  </g>
</svg>`;
}
