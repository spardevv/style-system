/* ── YAML DEFAULT ────────────────────────────────── */
const YAML_DEFAULT = `meta:
  name: "System Blueprint"
  version: "1.0.0"
  author: "Dev"

colors:
  primary: "#3B82F6"
  secondary: "#64748B"
  accent: "#3B82F6"
  background: "#0D0D0D"
  surface: "#1A1A1A"
  text:
    primary: "#FFFFFF"
    secondary: "#94A3B8"
    muted: "#444444"
  status:
    success: "#10B981"
    warning: "#F59E0B"
    error: "#EF4444"
    info: "#94A3B8"

gradients:
  brand: "135deg, #3B82F6, #64748B"
  warm: "135deg, #F59E0B, #EF4444"
  cool: "135deg, #94A3B8, #10B981"
  dark: "135deg, #0D0D0D, #1A1A1A"
  subtle: "180deg, #1A1A1A, #0D0D0D"

typography:
  font_family:
    primary: "Inter"
    secondary: "JetBrains Mono"
  font_size:
    xs: 10
    sm: 12
    md: 14
    lg: 18
    xl: 24
    display: 36
  font_weight:
    regular: 400
    semibold: 600
    bold: 700
    black: 700
  line_height:
    tight: 1.2
    base: 1.5
    loose: 1.8
  letter_spacing:
    tight: "-0.01em"
    normal: "0em"
    wide: "0.06em"
    wider: "0.12em"

spacing:
  xs: 4
  sm: 8
  md: 16
  lg: 24
  xl: 40
  xxl: 64

border:
  radius:
    sm: 4
    md: 8
    lg: 12
    xl: 16
    full: 9999

shadows:
  sm: "0 2px 8px rgba(0,0,0,0.5)"
  md: "0 4px 20px rgba(0,0,0,0.6)"
  lg: "0 8px 40px rgba(0,0,0,0.7)"
  glow: "0 0 20px"
  inset: "inset 0 1px 3px rgba(0,0,0,0.5)"

ui:
  card:
    border_radius: 12
    padding: 16
  input:
    border_radius: 8
    padding: "8px 12px"
  button:
    border_radius: 8
    padding: "7px 14px"
    font_weight: 700`;

/* ── INIT ────────────────────────────────────────── */
const editor = document.getElementById("ye");
const errorBar = document.getElementById("eb");
const mainEl = document.getElementById("main");
const fileInput = document.getElementById("fileInput");
let charts = [];

editor.value = YAML_DEFAULT;

/* ── IMPORT ──────────────────────────────────────── */
document
  .getElementById("ib")
  .addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    editor.value = ev.target.result;
    render();
  };
  reader.readAsText(file);
});

/* ── EXPORT ──────────────────────────────────────── */
function exportYaml() {
  let obj;
  try {
    obj = jsyaml.load(editor.value);
  } catch (e) {
    alert("Erro ao ler YAML para exportação");
    return;
  }
  const name = (obj.meta?.name || "theme").toLowerCase().replace(/\s+/g, "-");
  const version = obj.meta?.version || "1.0.0";
  const filename = `${name}-v${version}.yaml`;
  const yaml = jsyaml.dump(obj, { indent: 2, lineWidth: 120 });
  const blob = new Blob([yaml], { type: "text/yaml;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── HELPERS ─────────────────────────────────────── */
function g(o, ...p) {
  return p.reduce((a, k) => (a && a[k] !== undefined ? a[k] : null), o);
}
function hex2rgb(h) {
  try {
    return `${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)}`;
  } catch {
    return "59,130,246";
  }
}
function alpha(hex, a) {
  return `rgba(${hex2rgb(hex)},${a})`;
}

/* ── APPLY TOKENS TO THE UI SHELL ────────────────── */
function applyTokensToUI(p) {
  const root = document.documentElement;

  // colours
  root.style.setProperty("--tok-primary", p.primary);
  root.style.setProperty("--tok-secondary", p.secondary);
  root.style.setProperty("--tok-bg", p.bg);
  root.style.setProperty("--tok-surface", p.surface);
  root.style.setProperty("--tok-text-pri", p.tp);
  root.style.setProperty("--tok-text-sec", p.ts);
  root.style.setProperty("--tok-text-muted", p.tm);
  root.style.setProperty("--tok-ok", p.ok);
  root.style.setProperty("--tok-warn", p.warn);
  root.style.setProperty("--tok-err", p.err);
  root.style.setProperty("--p-color", p.primary);

  // typography
  root.style.setProperty("--tok-ff", `'${p.ff}', sans-serif`);
  root.style.setProperty("--tok-fm", `'${p.fm}', monospace`);
  root.style.setProperty("--tok-sz-sm", (p.sz?.sm || 12) + "px");
  root.style.setProperty("--tok-sz-md", (p.sz?.md || 14) + "px");

  // spacing
  const sp = p.spacing || {};
  root.style.setProperty("--tok-sp-sm", (sp.sm || 8) + "px");
  root.style.setProperty("--tok-sp-md", (sp.md || 16) + "px");

  // border radius
  root.style.setProperty("--tok-r-sm", (p.rSm || 4) + "px");
  root.style.setProperty("--tok-r-md", (p.rMd || 8) + "px");
  root.style.setProperty("--tok-r-lg", (p.rLg || 12) + "px");
  root.style.setProperty("--tok-r-card", (p.cr || 12) + "px");

  // shadows
  root.style.setProperty("--tok-sh-sm", p.shSm);
  root.style.setProperty("--tok-sh-md", p.shMd);

  // load Google Fonts dynamically for the primary font
  loadFont(p.ff);
  loadFont(p.fm);
}

const _loadedFonts = new Set();
function loadFont(name) {
  if (!name || _loadedFonts.has(name)) return;
  _loadedFonts.add(name);
  const safe = encodeURIComponent(name).replace(/%20/g, "+");
  const id = "gf-" + safe;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${safe}:wght@400;600;700;800&display=swap`;
  document.head.appendChild(link);
}

/* ── MAIN RENDER ─────────────────────────────────── */
function render() {
  charts.forEach((c) => {
    try {
      c.destroy();
    } catch (e) {}
  });
  charts = [];
  let t;
  try {
    t = jsyaml.load(editor.value);
    errorBar.style.display = "none";
  } catch (e) {
    errorBar.textContent = "⚠ YAML Error: " + e.message;
    errorBar.style.display = "block";
    return;
  }

  const p = {
    primary: g(t, "colors", "primary") || "#3B82F6",
    secondary: g(t, "colors", "secondary") || "#64748B",
    accent: g(t, "colors", "accent") || "#A855F7",
    bg: g(t, "colors", "background") || "#0D0D0D",
    surface: g(t, "colors", "surface") || "#1A1A1A",
    tp: g(t, "colors", "text", "primary") || "#FFFFFF",
    ts: g(t, "colors", "text", "secondary") || "#94A3B8",
    tm: g(t, "colors", "text", "muted") || "#444444",
    ok: g(t, "colors", "status", "success") || "#10B981",
    warn: g(t, "colors", "status", "warning") || "#F59E0B",
    err: g(t, "colors", "status", "error") || "#EF4444",
    info: g(t, "colors", "status", "info") || "#38BDF8",
    gradBrand: g(t, "gradients", "brand") || "135deg, #3B82F6, #A855F7",
    gradWarm: g(t, "gradients", "warm") || "135deg, #F59E0B, #EF4444",
    gradCool: g(t, "gradients", "cool") || "135deg, #38BDF8, #10B981",
    gradDark: g(t, "gradients", "dark") || "135deg, #0D0D0D, #1e1e2e",
    gradSubtle: g(t, "gradients", "subtle") || "180deg, #1A1A1A, #0D0D0D",
    ff: g(t, "typography", "font_family", "primary") || "Syne",
    fm: g(t, "typography", "font_family", "secondary") || "JetBrains Mono",
    sz: g(t, "typography", "font_size") || {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 20,
      xl: 28,
      display: 40,
    },
    fw: g(t, "typography", "font_weight") || {
      regular: 400,
      bold: 700,
      black: 800,
    },
    lh: g(t, "typography", "line_height") || {
      tight: 1.1,
      base: 1.5,
      loose: 1.8,
    },
    ls: g(t, "typography", "letter_spacing") || {
      tight: "-0.02em",
      normal: "0em",
      wide: "0.08em",
      wider: "0.16em",
    },
    shSm: g(t, "shadows", "sm") || "0 2px 8px rgba(0,0,0,0.5)",
    shMd: g(t, "shadows", "md") || "0 4px 20px rgba(0,0,0,0.6)",
    shLg: g(t, "shadows", "lg") || "0 8px 40px rgba(0,0,0,0.7)",
    shGlow: g(t, "shadows", "glow") || "0 0 24px",
    shInset: g(t, "shadows", "inset") || "inset 0 1px 3px rgba(0,0,0,0.5)",
    rSm: g(t, "border", "radius", "sm") || 4,
    rMd: g(t, "border", "radius", "md") || 8,
    rLg: g(t, "border", "radius", "lg") || 12,
    rXl: g(t, "border", "radius", "xl") || 20,
    rFull: g(t, "border", "radius", "full") || 9999,
    cr: g(t, "ui", "card", "border_radius") || 12,
    cp: g(t, "ui", "card", "padding") || 16,
    metaName: g(t, "meta", "name") || "Blueprint",
    metaVer: g(t, "meta", "version") || "1.0.0",
    metaAuthor: g(t, "meta", "author") || "—",
  };

  document.documentElement.style.setProperty("--p-color", p.primary);
  const F = `font-family:'${p.ff}',sans-serif`;
  const FM = `font-family:'${p.fm}',monospace`;

  /* ── BUILD SECTIONS ──────────────────────────────── */

  // 1. PALETTE
  const palette = buildPalette(p, F, FM);
  // 2. STATUS BADGES
  const statusBadges = buildStatusBadges(p, F, FM);
  // 3. TYPOGRAPHY
  const typography = buildTypography(p, F, FM);
  // 4. GRADIENTS
  const gradients = buildGradients(p, F, FM);
  // 5. SHADOWS
  const shadows = buildShadows(p, F, FM);
  // 6. UI COMPONENTS
  const uiComponents = buildUIComponents(p, F, FM);
  // 7. MINI SCREENS
  const miniScreens = buildMiniScreens(p, F, FM);
  // 8. DATA CHARTS
  const charts_html = buildCharts(p, F, FM);
  // 9. SPACING & BORDER RADIUS
  const spacing = buildSpacingRadius(p, F, FM);
  // 10. INTERACTION STATES
  const interactionStates = buildInteractionStates(p, F, FM);

  mainEl.innerHTML =
    palette +
    statusBadges +
    typography +
    gradients +
    shadows +
    uiComponents +
    miniScreens +
    charts_html +
    spacing +
    interactionStates;

  setTimeout(() => initCharts(p), 60);
}

/* ── SECTION BUILDERS ─────────────────────────────── */

function sec(title, body) {
  return `<div class="cat"><div class="cat-title">${title}</div>${body}</div>`;
}

function buildPalette(p, F, FM) {
  const swatches = [
    ["Primary", p.primary],
    ["Secondary", p.secondary],
    ["Accent", p.accent],
    ["Surface", p.surface],
    ["Background", p.bg],
    ["Success", p.ok],
    ["Warning", p.warn],
    ["Error", p.err],
    ["Info", p.info],
  ]
    .map(
      ([k, v]) => `
    <div class="tile swatch-tile" style="padding:10px">
      <div style="height:44px;border-radius:6px;background:${v};margin-bottom:8px;border:1px solid rgba(255,255,255,0.06)"></div>
      <div style="font-size:10px;font-weight:700;color:${p.tp};${F};margin-bottom:2px">${k}</div>
      <div style="font-size:9px;color:${p.ts};${FM}">${v}</div>
    </div>`,
    )
    .join("");
  return sec(
    "Palette & Brand",
    `<div class="grid g4" style="grid-template-columns:repeat(auto-fill,minmax(100px,1fr))">${swatches}</div>`,
  );
}

function buildStatusBadges(p, F, FM) {
  const badges = [
    [p.ok, "success", "Operational"],
    [p.warn, "warning", "Degraded"],
    [p.err, "error", "Critical"],
    [p.info, "info", "Monitoring"],
  ];
  const html = badges
    .map(
      ([c, label, text]) => `
    <div style="background:${alpha(c, 0.08)};border:1px solid ${alpha(c, 0.2)};border-radius:${p.rMd}px;padding:10px 14px;display:flex;align-items:center;gap:10px">
      <div class="status-dot" style="width:7px;height:7px;border-radius:50%;background:${c};color:${c};box-shadow:0 0 8px ${c}"></div>
      <span style="font-size:12px;color:${p.tp};${F};font-weight:600">${text}</span>
      <span class="badge" style="margin-left:auto;background:${alpha(c, 0.15)};color:${c}">${label}</span>
    </div>`,
    )
    .join("");
  return sec(
    "Status & Alerts",
    `<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">${html}</div>`,
  );
}

function buildTypography(p, F, FM) {
  const rows = [
    {
      label: "Display",
      size: (p.sz?.display || 40) + "px",
      weight: p.fw?.black || 800,
      ls: p.ls?.tight || "-0.02em",
      lh: p.lh?.tight || 1.1,
      sample: p.metaName,
    },
    {
      label: "Heading",
      size: (p.sz?.xl || 28) + "px",
      weight: p.fw?.bold || 700,
      ls: p.ls?.tight || "-0.02em",
      lh: p.lh?.tight || 1.1,
      sample: "Interface Layer",
    },
    {
      label: "Large",
      size: (p.sz?.lg || 20) + "px",
      weight: p.fw?.semibold || 600,
      ls: "0",
      lh: p.lh?.base || 1.5,
      sample: "Design System",
    },
    {
      label: "Body",
      size: (p.sz?.md || 14) + "px",
      weight: p.fw?.regular || 400,
      ls: "0",
      lh: p.lh?.loose || 1.8,
      sample: "Tokens define every visual decision in a coherent system.",
    },
    {
      label: "Small",
      size: (p.sz?.sm || 12) + "px",
      weight: p.fw?.regular || 400,
      ls: p.ls?.wide || "0.08em",
      lh: p.lh?.base || 1.5,
      sample: "Metadata · Version · Author · Tag",
    },
    {
      label: "Micro",
      size: (p.sz?.xs || 10) + "px",
      weight: p.fw?.bold || 700,
      ls: p.ls?.wider || "0.16em",
      lh: p.lh?.base || 1.5,
      sample: "LABEL · CAPTION · BADGE",
    },
  ];
  const html = rows
    .map(
      (r) => `
    <div class="type-row">
      <div>
        <div style="font-size:${r.size};font-weight:${r.weight};color:${p.tp};${F};line-height:${r.lh};letter-spacing:${r.ls};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:440px">${r.sample}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:9px;color:${p.primary};${FM};font-weight:600">${r.label}</div>
        <div style="font-size:9px;color:${p.ts};${FM};margin-top:2px">${r.size} / ${r.weight}</div>
      </div>
    </div>`,
    )
    .join("");
  const monoRow = `
    <div class="type-row" style="margin-top:4px">
      <div style="font-size:${p.sz?.md || 14}px;color:${p.ts};${FM};letter-spacing:0.04em">const token = { primary: "${p.primary}", version: "${p.metaVer}" };</div>
      <div style="flex-shrink:0;text-align:right">
        <div style="font-size:9px;color:${p.accent};${FM};font-weight:600">Mono</div>
        <div style="font-size:9px;color:${p.ts};${FM};margin-top:2px">${p.fm}</div>
      </div>
    </div>`;
  return sec("Typography Scale", html + monoRow);
}

function buildGradients(p, F, FM) {
  const grads = [
    ["Brand", p.gradBrand],
    ["Warm", p.gradWarm],
    ["Cool", p.gradCool],
    ["Dark", p.gradDark],
    ["Subtle", p.gradSubtle],
  ];
  const html = grads
    .map(
      ([name, grad]) => `
    <div>
      <div class="grad-tile animated-grad" style="background:linear-gradient(${grad})">
        <div style="position:absolute;inset:0;display:flex;align-items:flex-end;padding:10px">
          <span style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.8);${FM};text-shadow:0 1px 4px rgba(0,0,0,0.5)">${name}</span>
        </div>
      </div>
      <div style="margin-top:5px;font-size:9px;color:${p.ts};${FM};padding:0 2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${grad}</div>
    </div>`,
    )
    .join("");
  return sec(
    "Gradients",
    `<div class="grid g3" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${html}</div>`,
  );
}

function buildShadows(p, F, FM) {
  const shs = [
    ["Shadow SM", p.shSm, `box-shadow:${p.shSm}`],
    ["Shadow MD", p.shMd, `box-shadow:${p.shMd}`],
    ["Shadow LG", p.shLg, `box-shadow:${p.shLg}`],
    [
      "Glow Primary",
      `${p.shGlow} ${alpha(p.primary, 0.5)}`,
      `box-shadow:${p.shGlow} ${alpha(p.primary, 0.5)}`,
    ],
    [
      "Glow Accent",
      `${p.shGlow} ${alpha(p.accent, 0.5)}`,
      `box-shadow:${p.shGlow} ${alpha(p.accent, 0.5)}`,
    ],
    [
      "Inset",
      p.shInset,
      `box-shadow:${p.shInset};background:${alpha(p.primary, 0.05)}`,
    ],
  ];
  const html = shs
    .map(
      ([name, val, style]) => `
    <div class="shadow-swatch">
      <div style="width:42px;height:42px;border-radius:${p.rMd}px;background:${p.surface};flex-shrink:0;${style}"></div>
      <div>
        <div style="font-size:11px;font-weight:700;color:${p.tp};${F}">${name}</div>
        <div style="font-size:9px;color:${p.ts};${FM};margin-top:3px;word-break:break-all">${val}</div>
      </div>
    </div>`,
    )
    .join("");
  return sec("Shadows & Elevation", `<div class="grid g2">${html}</div>`);
}

function buildUIComponents(p, F, FM) {
  // Card variants
  const cards = `
    <div style="background:${p.surface};border-radius:${p.cr}px;padding:${p.cp}px;border:1px solid rgba(255,255,255,0.06);box-shadow:${p.shMd}">
      <div style="font-size:9px;color:${p.ts};letter-spacing:0.1em;text-transform:uppercase;${FM};margin-bottom:6px">Project</div>
      <div style="font-size:16px;font-weight:800;color:${p.tp};${F};line-height:1.2">${p.metaName}</div>
      <div style="font-size:11px;color:${p.ts};${F};margin-top:5px">v${p.metaVer} · by ${p.metaAuthor}</div>
      <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
        <button style="background:${p.primary};color:#fff;border:none;border-radius:${p.rMd}px;padding:7px 14px;font-size:11px;font-weight:700;${F};cursor:pointer">Primary</button>
        <button style="background:linear-gradient(${p.gradBrand});color:#fff;border:none;border-radius:${p.rMd}px;padding:7px 14px;font-size:11px;font-weight:700;${F};cursor:pointer">Gradient</button>
        <button style="background:transparent;color:${p.tp};border:1px solid #2e2e2e;border-radius:${p.rMd}px;padding:7px 14px;font-size:11px;${F};cursor:pointer">Ghost</button>
        <button style="background:${alpha(p.primary, 0.1)};color:${p.primary};border:1px solid ${alpha(p.primary, 0.3)};border-radius:${p.rMd}px;padding:7px 14px;font-size:11px;font-weight:700;${F};cursor:pointer">Soft</button>
      </div>
    </div>
    <div style="position:relative;background:linear-gradient(${p.gradBrand});border-radius:${p.cr}px;padding:${p.cp}px;box-shadow:${p.shGlow} ${alpha(p.primary, 0.3)}" class="shimmer-card">
      <div style="font-size:9px;color:rgba(255,255,255,0.6);letter-spacing:0.14em;text-transform:uppercase;${FM};margin-bottom:8px">Gradient Card</div>
      <div style="font-size:18px;font-weight:800;color:#fff;${F}">Premium Tier</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.7);${F};margin-top:4px">Unlock advanced features</div>
      <div style="margin-top:16px">
        <div style="background:rgba(255,255,255,0.15);border-radius:${p.rFull}px;height:4px">
          <div style="background:#fff;width:72%;height:100%;border-radius:${p.rFull}px"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:5px">
          <span style="font-size:9px;color:rgba(255,255,255,0.6);${FM}">72% used</span>
          <span style="font-size:9px;color:rgba(255,255,255,0.6);${FM}">28% free</span>
        </div>
      </div>
    </div>`;

  // Inputs
  const inputs = `
    <div class="tile">
      <div class="tile-label">Input Fields</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div style="background:${alpha(p.tp, 0.04)};border:1px solid #2e2e2e;border-radius:${p.rMd}px;padding:9px 12px;display:flex;align-items:center;gap:8px">
          <input class="input-spec" style="color:${p.tp}" placeholder="Default input…" />
        </div>
        <div style="background:${alpha(p.tp, 0.04)};border:1px solid ${p.primary};border-radius:${p.rMd}px;padding:9px 12px;box-shadow:0 0 0 3px ${alpha(p.primary, 0.12)}">
          <input class="input-spec" style="color:${p.tp}" placeholder="Focused state…" />
        </div>
        <div style="background:${alpha(p.err, 0.05)};border:1px solid ${p.err};border-radius:${p.rMd}px;padding:9px 12px">
          <input class="input-spec" style="color:${p.tp}" placeholder="Error state…" />
          <div style="font-size:10px;color:${p.err};margin-top:5px;${FM}">Field is required</div>
        </div>
        <div style="background:${alpha(p.tp, 0.02)};border:1px solid #1e1e1e;border-radius:${p.rMd}px;padding:9px 12px;opacity:0.5">
          <input class="input-spec" style="color:${p.ts}" placeholder="Disabled…" disabled />
        </div>
      </div>
    </div>`;

  // Progress & Avatars
  const progressAvatars = `
    <div class="tile">
      <div class="tile-label">Progress & Members</div>
      <div style="margin-bottom:14px">
        ${[
          ["Sprint Goal", 78, p.primary],
          ["Bug Rate", 23, p.err],
          ["Coverage", 94, p.ok],
        ]
          .map(
            ([label, pct, c]) => `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:10px;color:${p.ts};${F}">${label}</span>
              <span style="font-size:10px;color:${p.tp};${FM};font-weight:700">${pct}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${pct}%;background:${c}"></div>
            </div>
          </div>`,
          )
          .join("")}
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div class="avatar-stack">
          ${[p.primary, p.accent, p.ok, p.warn].map((c, i) => `<div class="avatar" style="background:${alpha(c, 0.2)};color:${c}">${"ABCD"[i]}</div>`).join("")}
        </div>
        <span style="font-size:10px;color:${p.ts};${FM}">+14 members</span>
      </div>
    </div>`;

  // Toggle & Checkbox
  const toggleCheck = `
    <div class="tile">
      <div class="tile-label">Toggles & Controls</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${[
          ["Feature flags", true, p.primary],
          ["Dark mode", true, p.accent],
          ["Beta access", false, p.ok],
        ]
          .map(
            ([label, on, c]) => `
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span style="font-size:12px;color:${p.tp};${F}">${label}</span>
            <div style="width:34px;height:20px;border-radius:10px;background:${on ? c : "#2e2e2e"};position:relative;transition:background 0.2s;flex-shrink:0">
              <div style="width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:3px;${on ? "left:17px" : "left:3px"};transition:left 0.2s"></div>
            </div>
          </div>`,
          )
          .join("")}
        <hr style="border:none;border-top:1px solid #1e1e1e" />
        ${[
          ["Enable telemetry", true],
          ["Auto-save", false],
        ]
          .map(
            ([label, checked]) => `
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:14px;height:14px;border-radius:3px;border:1px solid ${checked ? p.primary : "#3e3e3e"};background:${checked ? alpha(p.primary, 0.2) : "transparent"};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              ${checked ? `<div style="width:7px;height:7px;background:${p.primary};border-radius:1px"></div>` : ""}
            </div>
            <span style="font-size:12px;color:${p.tp};${F}">${label}</span>
          </div>`,
          )
          .join("")}
      </div>
    </div>`;

  return sec(
    "UI Components",
    `
    <div class="grid g2">${cards}</div>
    <div class="grid g3" style="margin-top:10px">${inputs}${progressAvatars}${toggleCheck}</div>`,
  );
}

function buildMiniScreens(p, F, FM) {
  // Dashboard mini
  const dashboard = `
    <div class="mini-screen">
      <div class="mini-screen-bar">
        <div class="mini-dot" style="background:#eb5757"></div>
        <div class="mini-dot" style="background:#f5a623"></div>
        <div class="mini-dot mini-dot-live" style="background:#6ac174"></div>
        <span style="font-size:9px;color:#444;${FM};margin-left:6px">Dashboard · ${p.metaName}</span>
      </div>
      <div class="mini-screen-body" style="background:${p.bg}">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
          ${[
            [p.ok, "2400", "Requests", "2.4k"],
            [p.primary, "98", "Uptime", "98%"],
            [p.warn, "142", "Latency", "142ms"],
          ]
            .map(
              ([c, num, l, disp]) => `
            <div style="background:${p.surface};border-radius:8px;padding:10px;border:1px solid rgba(255,255,255,0.06)">
              <div style="font-size:9px;color:${p.ts};${FM};margin-bottom:4px">${l}</div>
              <div class="count-num" data-target="${num}" data-display="${disp}" style="font-size:16px;font-weight:800;color:${c};${F}">0</div>
            </div>`,
            )
            .join("")}
        </div>
        <div style="background:${p.surface};border-radius:8px;padding:10px;border:1px solid rgba(255,255,255,0.06)">
          <canvas id="cMiniLine" height="60"></canvas>
        </div>
      </div>
    </div>`;

  // Mobile mini
  const mobile = `
    <div class="mini-screen" style="max-width:220px;margin:0 auto">
      <div style="background:${p.bg};padding:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <div style="width:28px;height:28px;border-radius:${p.rMd}px;background:linear-gradient(${p.gradBrand});display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff">${p.metaName.charAt(0)}</div>
          <div style="width:20px;height:14px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer">
            ${[p.tp, p.primary, p.tp].map((c) => `<div style="height:2px;border-radius:1px;background:${c}"></div>`).join("")}
          </div>
        </div>
        <div style="font-size:9px;color:${p.ts};${FM};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px">Welcome back</div>
        <div style="font-size:18px;font-weight:800;color:${p.tp};${F};margin-bottom:16px">${p.metaAuthor}</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${[
            [p.primary, "Deploy", "+3"],
            [p.ok, "Build", "✓"],
            [p.warn, "Review", "!"],
          ]
            .map(
              ([c, label, tag]) => `
            <div style="background:${p.surface};border-radius:${p.rMd}px;padding:10px;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,0.04)">
              <div style="width:8px;height:8px;border-radius:2px;background:${c};flex-shrink:0"></div>
              <span style="font-size:11px;color:${p.tp};${F};flex:1">${label}</span>
              <span style="font-size:9px;color:${c};${FM};font-weight:700">${tag}</span>
            </div>`,
            )
            .join("")}
        </div>
      </div>
    </div>`;

  // Notification mini
  const notifications = `
    <div class="mini-screen">
      <div class="mini-screen-bar">
        <div class="mini-dot" style="background:#eb5757"></div>
        <div class="mini-dot" style="background:#f5a623"></div>
        <div class="mini-dot" style="background:#6ac174"></div>
        <span style="font-size:9px;color:#444;${FM};margin-left:6px">Notifications</span>
      </div>
      <div class="mini-screen-body" style="background:${p.bg};display:flex;flex-direction:column;gap:6px">
        ${[
          [p.ok, "✓", "Deploy successful", "2m ago"],
          [p.info, "·", "PR #42 merged", "5m ago"],
          [p.warn, "!", "High memory usage", "12m ago"],
          [p.err, "✕", "Test suite failed", "1h ago"],
        ]
          .map(
            ([c, icon, msg, time]) => `
          <div class="notif-row" style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:${p.rMd}px;background:${p.surface};border-left:3px solid ${c}">
            <div style="width:16px;height:16px;border-radius:50%;background:${alpha(c, 0.15)};display:flex;align-items:center;justify-content:center;font-size:8px;color:${c};flex-shrink:0">${icon}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;color:${p.tp};${F};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${msg}</div>
            </div>
            <div style="font-size:9px;color:${p.ts};${FM};flex-shrink:0">${time}</div>
          </div>`,
          )
          .join("")}
      </div>
    </div>`;

  return sec(
    "Mini Screens & Layouts",
    `<div class="grid g3">${dashboard}${mobile}${notifications}</div>`,
  );
}

function buildCharts(p, F, FM) {
  const html = `
    <div class="grid g2">
      <div class="tile chart-tile">
        <div class="tile-label">Area · Trend</div>
        <div style="height:140px"><canvas id="cLine"></canvas></div>
      </div>
      <div class="tile chart-tile">
        <div class="tile-label">Bar · Distribution</div>
        <div style="height:140px"><canvas id="cBar"></canvas></div>
      </div>
      <div class="tile chart-tile">
        <div class="tile-label">Doughnut · Composition</div>
        <div style="height:140px;display:flex;align-items:center;justify-content:center"><canvas id="cDoughnut"></canvas></div>
      </div>
      <div class="tile chart-tile">
        <div class="tile-label">Radar · Coverage</div>
        <div style="height:140px;display:flex;align-items:center;justify-content:center"><canvas id="cRadar"></canvas></div>
      </div>
    </div>`;
  return sec("Data Visualization", html);
}

function buildSpacingRadius(p, F, FM) {
  const spacingTokens = g_spacing(p);
  const radiusTokens = g_radius(p, F, FM);
  return sec(
    "Spacing & Border Radius",
    `<div class="grid g2">${spacingTokens}${radiusTokens}</div>`,
  );
}

function g_spacing(p) {
  const tokens = [
    ["xs", 4],
    ["sm", 8],
    ["md", 16],
    ["lg", 24],
    ["xl", 40],
    ["xxl", 64],
  ];
  const bars = tokens
    .map(
      ([k, v]) => `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="font-size:9px;color:${p.ts};font-family:'JetBrains Mono',monospace;width:28px;flex-shrink:0">${k}</div>
      <div style="height:16px;border-radius:3px;background:${alpha(p.primary, 0.5)};width:${Math.min(v * 2, 128)}px;flex-shrink:0"></div>
      <div style="font-size:9px;color:${p.ts};font-family:'JetBrains Mono',monospace">${v}px</div>
    </div>`,
    )
    .join("");
  return `<div class="tile"><div class="tile-label">Spacing Scale</div>${bars}</div>`;
}

function g_radius(p, F, FM) {
  const tokens = [
    ["sm", p.rSm || 4],
    ["md", p.rMd || 8],
    ["lg", p.rLg || 12],
    ["xl", p.rXl || 20],
    ["full", p.rFull || 9999],
  ];
  const shapes = tokens
    .map(
      ([k, v]) => `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
      <div style="width:36px;height:36px;border:2px solid ${p.primary};border-radius:${Math.min(v, 50)}px;flex-shrink:0"></div>
      <div>
        <div style="font-size:10px;font-weight:700;color:${p.tp};${F}">${k}</div>
        <div style="font-size:9px;color:${p.ts};${FM}">${v >= 9999 ? "9999px" : v + "px"}</div>
      </div>
    </div>`,
    )
    .join("");
  return `<div class="tile"><div class="tile-label">Border Radius</div>${shapes}</div>`;
}

function buildInteractionStates(p, F, FM) {
  // Tooltips
  const tooltips = `
    <div class="tile">
      <div class="tile-label">Tooltips & Overlays</div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end;padding-top:30px">
        ${[
          [p.surface, "#fff", p.tp, "Default"],
          [p.primary, p.primary, "#fff", "Primary"],
          [p.err, p.err, "#fff", "Danger"],
        ]
          .map(
            ([bg, border, tc, label]) => `
          <div class="tooltip-wrap">
            <div class="tooltip-box" style="background:${bg};border:1px solid ${alpha(border, 0.4)};color:${tc};">
              ${label} tooltip
              <div style="position:absolute;top:100%;left:50%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid ${bg}"></div>
            </div>
            <button style="background:${alpha(bg, 0.2)};border:1px solid ${alpha(border, 0.3)};color:${tc};border-radius:${p.rMd}px;padding:6px 12px;font-size:11px;${F};cursor:pointer">${label}</button>
          </div>`,
          )
          .join("")}
      </div>
    </div>`;

  // Code block
  const codeBlock = `
    <div class="tile">
      <div class="tile-label">Code Block</div>
      <div style="background:#060606;border-radius:${p.rMd}px;padding:14px;border:1px solid #1e1e1e;overflow:auto">
        <pre style="font-family:'JetBrains Mono',monospace;font-size:10.5px;line-height:1.7;color:#888;white-space:pre"><span style="color:${alpha(p.accent, 0.9)}">import</span> <span style="color:${p.tp}">{ tokens }</span> <span style="color:${alpha(p.accent, 0.9)}">from</span> <span style="color:${p.ok}">'${p.metaName.toLowerCase().replace(/\s/g, "-")}'</span>

<span style="color:${alpha(p.info, 0.8)}">const</span> <span style="color:${p.tp}">theme</span> = {
  primary: <span style="color:${p.ok}">"${p.primary}"</span>,
  accent:  <span style="color:${p.ok}">"${p.accent}"</span>,
  surface: <span style="color:${p.ok}">"${p.surface}"</span>,
  radius:  <span style="color:${p.warn}">${p.rLg}</span>,
}</pre>
      </div>
    </div>`;

  // Keyboard shortcuts
  const kbd = `
    <div class="tile">
      <div class="tile-label">Keyboard Shortcuts</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${[
          ["Apply", "⌘ + ↵"],
          ["Export", "⌘ + E"],
          ["Import", "⌘ + I"],
          ["Reset", "⌘ + R"],
        ]
          .map(
            ([action, keys]) => `
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span style="font-size:11px;color:${p.ts};${F}">${action}</span>
            <div style="display:flex;gap:3px">
              ${keys
                .split(" + ")
                .map(
                  (k) =>
                    `<span style="background:#1e1e1e;border:1px solid #2e2e2e;border-bottom:2px solid #1a1a1a;border-radius:4px;padding:2px 7px;font-size:10px;${FM};color:${p.tp}">${k}</span>`,
                )
                .join('<span style="color:#333;font-size:9px">+</span>')}
            </div>
          </div>`,
          )
          .join("")}
      </div>
    </div>`;

  return sec(
    "Interaction Tokens",
    `<div class="grid g3">${tooltips}${codeBlock}${kbd}</div>`,
  );
}

/* ── CHART INIT ──────────────────────────────────── */
function initCharts(p) {
  const base = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  };

  const tryChart = (id, type, data, opts) => {
    const el = document.getElementById(id);
    if (!el) return;
    const chart = new Chart(el, { type, data, options: opts || base });
    charts.push(chart);
  };

  tryChart("cLine", "line", {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        data: [10, 28, 18, 42, 30, 50, 38],
        borderColor: p.primary,
        tension: 0.45,
        fill: true,
        backgroundColor: alpha(p.primary, 0.12),
        pointRadius: 3,
        pointBackgroundColor: p.primary,
      },
    ],
  });

  tryChart("cBar", "bar", {
    labels: ["A", "B", "C", "D", "E", "F"],
    datasets: [
      {
        data: [40, 22, 56, 30, 48, 35],
        backgroundColor: p.primary + "cc",
        borderRadius: 5,
      },
      {
        data: [20, 38, 24, 50, 20, 44],
        backgroundColor: p.accent + "cc",
        borderRadius: 5,
      },
    ],
  });

  tryChart(
    "cDoughnut",
    "doughnut",
    {
      labels: ["Primary", "Accent", "Success", "Warning"],
      datasets: [
        {
          data: [42, 25, 20, 13],
          backgroundColor: [p.primary, p.accent, p.ok, p.warn],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      cutout: "70%",
    },
  );

  tryChart(
    "cRadar",
    "radar",
    {
      labels: ["DX", "Perf", "A11y", "Design", "Tests", "Docs"],
      datasets: [
        {
          data: [85, 72, 90, 95, 68, 78],
          borderColor: p.accent,
          backgroundColor: alpha(p.accent, 0.12),
          pointBackgroundColor: p.accent,
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    },
    {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          grid: { color: "#1e1e1e" },
          ticks: { display: false },
          pointLabels: {
            font: { size: 9, family: "JetBrains Mono" },
            color: "#444",
          },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    },
  );

  // Mini line (inside mini screen)
  const elM = document.getElementById("cMiniLine");
  if (elM) {
    charts.push(
      new Chart(elM, {
        type: "line",
        data: {
          labels: [1, 2, 3, 4, 5, 6, 7, 8],
          datasets: [
            {
              data: [30, 45, 28, 60, 50, 72, 58, 80],
              borderColor: p.primary,
              tension: 0.45,
              fill: true,
              backgroundColor: alpha(p.primary, 0.1),
              pointRadius: 0,
              borderWidth: 1.5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } },
        },
      }),
    );
  }

  // Animated number counters
  document.querySelectorAll(".count-num").forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    const display = el.dataset.display;
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      // show final display label once done, number while animating
      el.textContent = progress < 1 ? current.toLocaleString() : display;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* ── WIRE UP EVENTS ──────────────────────────────── */
document.getElementById("exportYaml").addEventListener("click", exportYaml);
document.getElementById("ab").addEventListener("click", () => {
  const btn = document.getElementById("ab");
  btn.classList.remove("flash");
  void btn.offsetWidth; // reflow to restart animation
  btn.classList.add("flash");
  render();
});
editor.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    render();
  }
});

render();
