// The site's icons, drawn on a 24-unit grid with round strokes, in the spirit of Material Symbols
// Rounded. Each is data: stroked path data, plus optional filled path data.
const ICONS = {
  menu: { stroke: "M4 7h16M4 12h16M4 17h16" },
  close: { stroke: "M6 6l12 12M18 6 6 18" },
  arrow: { stroke: "M5 12h14M13 6l6 6-6 6" },
  external: { stroke: "M8 16 16 8M9.5 8H16v6.5" },
  phone: { stroke: "M6.6 3.5h2.6l1.7 4.3-2.1 1.3a11.5 11.5 0 0 0 6.1 6.1l1.3-2.1 4.3 1.7v2.6a2 2 0 0 1-2 2A16.6 16.6 0 0 1 4.6 5.5a2 2 0 0 1 2-2Z" },
  mail: { stroke: "M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2ZM4 8l8 5.5L20 8" },
  code: { stroke: "M9 7 4 12l5 5M15 7l5 5-5 5" },
  spark: { fill: "M12 2.5c.7 4.6 2.9 6.8 7.5 7.5-4.6.7-6.8 2.9-7.5 7.5-.7-4.6-2.9-6.8-7.5-7.5 4.6-.7 6.8-2.9 7.5-7.5Z M18.5 15.5c.3 1.9 1.1 2.7 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.3 2.7-1.1 3-3Z" },
  preview: { stroke: "M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM8 21h8", fill: "M10 8.2v5.6a.6.6 0 0 0 .9.5l4.6-2.8a.6.6 0 0 0 0-1l-4.6-2.8a.6.6 0 0 0-.9.5Z" },
  checklist: { stroke: "M4 7.5 5.8 9.3 9 6M12.5 8H20M4 15.5l1.8 1.8L9 14M12.5 16H20" },
  save: { stroke: "M7 19h10.5a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 6.5 9.5 4.75 4.75 0 0 0 7 19ZM12 16v-5M9.75 13 12 10.75 14.25 13" },
  deploy: { stroke: "M12 15V4M7.5 8.5 12 4l4.5 4.5M5 20h14" },
  layers: { stroke: "M12 4 20 8.2 12 12.4 4 8.2 12 4ZM4 12l8 4.2 8-4.2M4 15.8 12 20l8-4.2" },
  server: { stroke: "M6 4h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM6 13h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2ZM8 7.5h.01M8 16.5h.01" },
  home: { stroke: "M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1v-8.5Z" },
  chat: { stroke: "M6 5h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6l-5 3.5V17H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z", fill: "M8 11a1.2 1.2 0 1 0 0 .01ZM12 11a1.2 1.2 0 1 0 0 .01ZM16 11a1.2 1.2 0 1 0 0 .01Z" },
  rooms: { stroke: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 19.5c.6-3 2.7-5 5.5-5s4.9 2 5.5 5M16.5 5.5h3a1.5 1.5 0 0 1 1.5 1.5v2.5a1.5 1.5 0 0 1-1.5 1.5H18l-1.5 1.5v-1.5" },
  template: { stroke: "M8 8h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2ZM16 5H6a2 2 0 0 0-2 2v9" },
  memory: { stroke: "M5 5.5A1.5 1.5 0 0 1 6.5 4H18v14H6.5A1.5 1.5 0 0 0 5 19.5v-14ZM5 19.5A1.5 1.5 0 0 0 6.5 21H18v-3M9 8.5h5" },
  files: { stroke: "M4 7a2 2 0 0 1 2-2h3.6l2 2H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" },
  bot: { stroke: "M7 8h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3ZM12 8V5M12 4.5h.01", fill: "M9 12.2a1.3 1.3 0 1 0 0 .01ZM15 12.2a1.3 1.3 0 1 0 0 .01Z" },
  flask: { stroke: "M9 3.5h6M10 3.5v5.2L5.2 17.3A2.2 2.2 0 0 0 7.1 20.5h9.8a2.2 2.2 0 0 0 1.9-3.2L14 8.7V3.5M7.5 14h9" },
  city: { stroke: "M3 20.5h18M5 20.5V11h4.5v9.5M9.5 20.5V5.5H15v15M15 20.5v-7h4v7M12 9h.01M12 12h.01M12 15h.01" },
  document: { stroke: "M7 3.5h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1ZM14 3.5v4h4M9 12h6M9 15.5h6" },
  route: { stroke: "M6 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6 8v2.5a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3M18 9v7" },
  loop: { stroke: "M19 12a7 7 0 1 1-2.05-4.95M19.5 4.5V8h-3.5" },
  branch: { stroke: "M7 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM7 20.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM17 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM7 8.5v7M17 10.5c0 3.5-3 4-6 4.5-2 .3-4 .6-4 2.5" },
  diary: { stroke: "M12 6.5C10 5 7.5 4.5 4 4.5v13c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2v-13c-3.5 0-6 .5-8 2ZM12 6.5v13" },
  people: { stroke: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 19.5c.6-3 2.7-5 5.5-5s4.9 2 5.5 5M16 11a2.5 2.5 0 1 0 0-5M18 14.6c1.4.6 2.3 2.2 2.6 4.4" },
  eye: { stroke: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12ZM12 14.75a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z" },
  shield: { stroke: "M12 3.5 19 6v5.5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-2.5ZM9 12l2 2 4-4" },
};

export const ICON_NAMES = Object.keys(ICONS);

// Inline SVG for an icon. Decorative unless a label is given.
export function icon(name, label = "") {
  const def = ICONS[name];
  if (!def) throw new Error(`Unknown icon ${name}`);
  const a11y = label ? `role="img" aria-label="${label}"` : `aria-hidden="true"`;
  const stroke = def.stroke
    ? `<path d="${def.stroke}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    : "";
  const fill = def.fill ? `<path d="${def.fill}" fill="currentColor"/>` : "";
  return `<svg class="icon" viewBox="0 0 24 24" width="24" height="24" ${a11y} focusable="false">${stroke}${fill}</svg>`;
}
