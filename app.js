/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */
   function g(o, ...p) {
    return p.reduce((a, k) => (a && a[k] !== undefined ? a[k] : null), o);
  }
  function hex2rgb(h) {
    try { return `${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`; }
    catch { return "65,105,225"; }
  }
  function alpha(hex, a) { return `rgba(${hex2rgb(hex)},${a})`; }
  
  /* ═══════════════════════════════════════════════════════
     FONT LOADER
     ═══════════════════════════════════════════════════════ */
  const _loadedFonts = new Set();
  function loadFont(name) {
    if (!name || _loadedFonts.has(name)) return;
    _loadedFonts.add(name);
    const safe = encodeURIComponent(name).replace(/%20/g, "+");
    const id = "gf-" + safe;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id; link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${safe}:wght@400;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }
  
  /* ═══════════════════════════════════════════════════════
     APPLY TOKENS TO SHELL (CSS vars)
     ═══════════════════════════════════════════════════════ */
  function applyTokensToUI(p) {
    const root = document.documentElement;
    const isDark = p.themeMode === "dark";
    if (isDark) {
      root.style.setProperty("--shell-bg",           p.bg      || "#06060f");
      root.style.setProperty("--shell-surface",      p.surface || "#0e0e20");
      root.style.setProperty("--shell-surface-2",    "#09091a");
      root.style.setProperty("--shell-surface-3",    "#141430");
      root.style.setProperty("--shell-border",       "#1a1a3a");
      root.style.setProperty("--shell-border-hi",    "#252555");
      root.style.setProperty("--shell-text",         p.tp      || "#d0d0ff");
      root.style.setProperty("--shell-text-sec",     p.ts      || "#7070b8");
      root.style.setProperty("--shell-text-muted",   p.tm      || "#454580");
      root.style.setProperty("--shell-editor-bg",    "#030308");
      root.style.setProperty("--shell-editor-text",  "#8090c8");
      root.style.setProperty("--shell-scrollbar",    "#252555");
      root.style.setProperty("--shell-error-bg",     "#100616");
      root.style.setProperty("--shell-error-text",   "#ff6b8a");
      root.style.setProperty("--shell-error-border", "#2a1020");
      root.style.setProperty("--scanline-opacity",   "0.03");
    } else {
      root.style.setProperty("--shell-bg",           p.bg      || "#f0f4ff");
      root.style.setProperty("--shell-surface",      p.surface || "#ffffff");
      root.style.setProperty("--shell-surface-2",    "#e8eeff");
      root.style.setProperty("--shell-surface-3",    "#f5f8ff");
      root.style.setProperty("--shell-border",       "#c8d4f0");
      root.style.setProperty("--shell-border-hi",    "#a0b4e0");
      root.style.setProperty("--shell-text",         p.tp      || "#1e2a4a");
      root.style.setProperty("--shell-text-sec",     p.ts      || "#4a5878");
      root.style.setProperty("--shell-text-muted",   p.tm      || "#7a8aaa");
      root.style.setProperty("--shell-editor-bg",    "#f5f8ff");
      root.style.setProperty("--shell-editor-text",  "#3a4a70");
      root.style.setProperty("--shell-scrollbar",    "#c0cce8");
      root.style.setProperty("--shell-error-bg",     "#fff0f0");
      root.style.setProperty("--shell-error-text",   "#c0392b");
      root.style.setProperty("--shell-error-border", "#f5c6c6");
      root.style.setProperty("--scanline-opacity",   "0");
    }
    root.style.setProperty("--shell-accent", p.primary);
    root.style.setProperty("--p-color",      p.primary);
    root.style.setProperty("--tok-primary",    p.primary);
    root.style.setProperty("--tok-secondary",  p.secondary);
    root.style.setProperty("--tok-bg",         p.bg);
    root.style.setProperty("--tok-surface",    p.surface);
    root.style.setProperty("--tok-text-pri",   p.tp);
    root.style.setProperty("--tok-text-sec",   p.ts);
    root.style.setProperty("--tok-text-muted", p.tm);
    root.style.setProperty("--tok-ff", `'${p.ff}', sans-serif`);
    root.style.setProperty("--tok-fm", `'${p.fm}', monospace`);
    loadFont(p.ff); loadFont(p.fm); loadFont(p.fd);
  }
  
  /* ═══════════════════════════════════════════════════════
     FORM ↔ TOKEN STATE
     ═══════════════════════════════════════════════════════ */
  
  /** Read all form inputs and return a flat token config object */
  function readForm() {
    const v  = (id) => document.getElementById(id)?.value || "";
    const n  = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    const themeMode = document.querySelector(".toggle-btn.active")?.dataset.val || "light";
  
    const gradStr = (degId, aId, bId) =>
      `${n(degId)}deg, ${v(aId)}, ${v(bId)}`;
  
    return {
      meta: {
        name:    v("f-meta-name")    || "Azure Light",
        version: v("f-meta-version") || "1.0.0",
        author:  v("f-meta-author")  || "System",
      },
      theme: themeMode,
      colors: {
        primary:    v("f-col-primary"),
        secondary:  v("f-col-secondary"),
        accent:     v("f-col-accent"),
        highlight:  v("f-col-highlight"),
        background: v("f-col-bg"),
        surface:    v("f-col-surface"),
        text: {
          primary:   v("f-col-text-primary"),
          secondary: v("f-col-text-secondary"),
          muted:     v("f-col-text-muted"),
          inverse:   "#ffffff",
        },
        status: {
          success: v("f-col-success"),
          warning: v("f-col-warning"),
          error:   v("f-col-error"),
          info:    v("f-col-info"),
        },
      },
      gradients: {
        brand:  gradStr("f-grad-brand-deg",  "f-grad-brand-a",  "f-grad-brand-b"),
        neon:   gradStr("f-grad-neon-deg",   "f-grad-neon-a",   "f-grad-neon-b"),
        cyber:  gradStr("f-grad-cyber-deg",  "f-grad-cyber-a",  "f-grad-cyber-b"),
        void:   `135deg, ${v("f-col-text-primary")}, ${v("f-col-secondary")}`,
        aurora: gradStr("f-grad-aurora-deg", "f-grad-aurora-a", "f-grad-aurora-b"),
        sunset: `135deg, ${v("f-col-primary")}, ${v("f-col-accent")}`,
      },
      typography: {
        font_family: {
          primary:   v("f-ff-primary"),
          secondary: v("f-ff-secondary"),
          display:   v("f-ff-display"),
        },
        font_size: {
          xs:      n("f-sz-xs"),
          sm:      n("f-sz-sm"),
          md:      n("f-sz-md"),
          lg:      n("f-sz-lg"),
          xl:      n("f-sz-xl"),
          xxl:     n("f-sz-xxl"),
          display: n("f-sz-display"),
        },
        font_weight: { regular:400, medium:500, semibold:600, bold:700, black:900 },
        line_height:  { tight:1.1, base:1.5, loose:1.8 },
        letter_spacing: { tight:"-0.02em", normal:"0em", wide:"0.06em", wider:"0.14em", widest:"0.24em" },
      },
      spacing: {
        xs: n("f-sp-xs"), sm: n("f-sp-sm"), md: n("f-sp-md"),
        lg: n("f-sp-lg"), xl: n("f-sp-xl"), xxl: n("f-sp-xxl"),
        xxxl: 96,
      },
      border: {
        radius: {
          none: 0,
          sm:   n("f-br-sm"),
          md:   n("f-br-md"),
          lg:   n("f-br-lg"),
          xl:   n("f-br-xl"),
          full: 9999,
        },
        width: { thin:1, normal:2, thick:4 },
      },
      shadows: {
        sm:    `0 1px 3px rgba(30,42,74,0.08)`,
        md:    `0 4px 12px rgba(30,42,74,0.12)`,
        lg:    `0 10px 30px rgba(30,42,74,0.16)`,
        glow:  "0 0 20px",
        neon:  "0 0 30px",
        inset: "inset 0 1px 3px rgba(30,42,74,0.12)",
      },
      ui: {
        card:   { border_radius: n("f-ui-card-radius"),  padding: n("f-ui-card-padding") },
        button: { border_radius: n("f-ui-btn-radius"),   padding: "10px 16px", font_weight: 600 },
        input:  { border_radius: n("f-ui-input-radius"), padding: "10px 12px" },
        modal:  { border_radius: 16, padding: 24 },
      },
    };
  }
  
  /** Populate form from a parsed YAML object (for Import) */
  function populateForm(t) {
    const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined && val !== null) el.value = val; };
    const setColor = (colId, hexId, previewId, val) => {
      if (!val) return;
      set(colId, val); set(hexId, val);
      const p = document.getElementById(previewId);
      if (p) p.style.background = val;
    };
    const parseGrad = (str) => {
      if (!str) return null;
      const m = str.match(/^(\d+)deg\s*,\s*(#[0-9a-fA-F]+)\s*,\s*(#[0-9a-fA-F]+)/);
      return m ? { deg: m[1], a: m[2], b: m[3] } : null;
    };
    const setGrad = (degId, aId, bId, cpAid, cpBid, str) => {
      const m = parseGrad(str);
      if (!m) return;
      set(degId, m.deg); set(aId, m.a); set(bId, m.b);
      const pA = document.getElementById(cpAid); if (pA) pA.style.background = m.a;
      const pB = document.getElementById(cpBid); if (pB) pB.style.background = m.b;
    };
  
    set("f-meta-name",    g(t,"meta","name"));
    set("f-meta-version", g(t,"meta","version"));
    set("f-meta-author",  g(t,"meta","author"));
  
    // Theme toggle
    const mode = (g(t,"theme") || "light").toLowerCase();
    document.querySelectorAll(".toggle-btn").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById(mode === "dark" ? "f-theme-dark" : "f-theme-light");
    if (activeBtn) activeBtn.classList.add("active");
  
    setColor("f-col-primary",   "ch-primary",   "cp-primary",   g(t,"colors","primary"));
    setColor("f-col-secondary", "ch-secondary", "cp-secondary", g(t,"colors","secondary"));
    setColor("f-col-accent",    "ch-accent",    "cp-accent",    g(t,"colors","accent"));
    setColor("f-col-highlight", "ch-highlight", "cp-highlight", g(t,"colors","highlight"));
    setColor("f-col-bg",        "ch-bg",        "cp-bg",        g(t,"colors","background"));
    setColor("f-col-surface",   "ch-surface",   "cp-surface",   g(t,"colors","surface"));
    setColor("f-col-text-primary",   "ch-text-primary",   "cp-text-primary",   g(t,"colors","text","primary"));
    setColor("f-col-text-secondary", "ch-text-secondary", "cp-text-secondary", g(t,"colors","text","secondary"));
    setColor("f-col-text-muted",     "ch-text-muted",     "cp-text-muted",     g(t,"colors","text","muted"));
    setColor("f-col-success", "ch-success", "cp-success", g(t,"colors","status","success"));
    setColor("f-col-warning", "ch-warning", "cp-warning", g(t,"colors","status","warning"));
    setColor("f-col-error",   "ch-error",   "cp-error",   g(t,"colors","status","error"));
    setColor("f-col-info",    "ch-info",    "cp-info",    g(t,"colors","status","info"));
  
    setGrad("f-grad-brand-deg", "f-grad-brand-a", "f-grad-brand-b", "cp-grad-brand-a", "cp-grad-brand-b", g(t,"gradients","brand"));
    setGrad("f-grad-neon-deg",  "f-grad-neon-a",  "f-grad-neon-b",  "cp-grad-neon-a",  "cp-grad-neon-b",  g(t,"gradients","neon"));
    setGrad("f-grad-cyber-deg", "f-grad-cyber-a", "f-grad-cyber-b", "cp-grad-cyber-a", "cp-grad-cyber-b", g(t,"gradients","cyber"));
    setGrad("f-grad-aurora-deg","f-grad-aurora-a","f-grad-aurora-b","cp-grad-aurora-a","cp-grad-aurora-b",g(t,"gradients","aurora"));
  
    const setSlider = (id, valId, val) => {
      if (val == null) return;
      set(id, val);
      const sv = document.getElementById(valId); if (sv) sv.textContent = val;
    };
    const sz = g(t,"typography","font_size") || {};
    setSlider("f-sz-xs",  "sv-sz-xs",  sz.xs);
    setSlider("f-sz-sm",  "sv-sz-sm",  sz.sm);
    setSlider("f-sz-md",  "sv-sz-md",  sz.md);
    setSlider("f-sz-lg",  "sv-sz-lg",  sz.lg);
    setSlider("f-sz-xl",  "sv-sz-xl",  sz.xl);
    setSlider("f-sz-xxl", "sv-sz-xxl", sz.xxl);
    setSlider("f-sz-display","sv-sz-display",sz.display);
  
    set("f-ff-primary",   g(t,"typography","font_family","primary"));
    set("f-ff-secondary", g(t,"typography","font_family","secondary"));
    set("f-ff-display",   g(t,"typography","font_family","display"));
  
    const sp = g(t,"spacing") || {};
    setSlider("f-sp-xs",  "sv-sp-xs",  sp.xs);
    setSlider("f-sp-sm",  "sv-sp-sm",  sp.sm);
    setSlider("f-sp-md",  "sv-sp-md",  sp.md);
    setSlider("f-sp-lg",  "sv-sp-lg",  sp.lg);
    setSlider("f-sp-xl",  "sv-sp-xl",  sp.xl);
    setSlider("f-sp-xxl", "sv-sp-xxl", sp.xxl);
  
    const br = g(t,"border","radius") || {};
    setSlider("f-br-sm","sv-br-sm",br.sm);
    setSlider("f-br-md","sv-br-md",br.md);
    setSlider("f-br-lg","sv-br-lg",br.lg);
    setSlider("f-br-xl","sv-br-xl",br.xl);
  
    setSlider("f-ui-card-radius",  "sv-ui-card-radius",  g(t,"ui","card","border_radius"));
    setSlider("f-ui-card-padding", "sv-ui-card-padding", g(t,"ui","card","padding"));
    setSlider("f-ui-btn-radius",   "sv-ui-btn-radius",   g(t,"ui","button","border_radius"));
    setSlider("f-ui-input-radius", "sv-ui-input-radius", g(t,"ui","input","border_radius"));
  
    updateGradPreviews();
  }
  
  /** Update gradient strip previews */
  function updateGradPreviews() {
    [["brand","gp-brand"], ["neon","gp-neon"], ["cyber","gp-cyber"], ["aurora","gp-aurora"]].forEach(([k, pid]) => {
      const deg = document.getElementById(`f-grad-${k}-deg`)?.value || "135";
      const a   = document.getElementById(`f-grad-${k}-a`)?.value   || "#000";
      const b   = document.getElementById(`f-grad-${k}-b`)?.value   || "#fff";
      const el  = document.getElementById(pid);
      if (el) el.style.background = `linear-gradient(${deg}deg, ${a}, ${b})`;
    });
  }
  
  /* ═══════════════════════════════════════════════════════
     RENDER  (reads form → builds token object → renders canvas)
     ═══════════════════════════════════════════════════════ */
  const errorBar = document.getElementById("eb");
  const mainEl   = document.getElementById("main");
  let charts = [];
  
  function render() {
    charts.forEach(c => { try { c.destroy(); } catch(e){} });
    charts = [];
    errorBar.style.display = "none";
  
    const t = readForm();
  
    const p = {
      primary:   g(t,"colors","primary")    || "#2563eb",
      secondary: g(t,"colors","secondary")  || "#1e40af",
      accent:    g(t,"colors","accent")     || "#7c3aed",
      highlight: g(t,"colors","highlight")  || "#0ea5e9",
      bg:        g(t,"colors","background") || "#f0f4ff",
      surface:   g(t,"colors","surface")    || "#ffffff",
      tp:        g(t,"colors","text","primary")   || "#1e2a4a",
      ts:        g(t,"colors","text","secondary") || "#4a5878",
      tm:        g(t,"colors","text","muted")     || "#7a8aaa",
      ok:        g(t,"colors","status","success") || "#16a34a",
      warn:      g(t,"colors","status","warning") || "#d97706",
      err:       g(t,"colors","status","error")   || "#dc2626",
      info:      g(t,"colors","status","info")    || "#0284c7",
  
      gradBrand:  g(t,"gradients","brand")  || "135deg, #1e40af, #2563eb",
      gradNeon:   g(t,"gradients","neon")   || "135deg, #7c3aed, #2563eb",
      gradCyber:  g(t,"gradients","cyber")  || "135deg, #0ea5e9, #2563eb",
      gradVoid:   g(t,"gradients","void")   || "135deg, #1e2a4a, #2d3f6e",
      gradAurora: g(t,"gradients","aurora") || "135deg, #7c3aed, #0ea5e9",
      gradSunset: g(t,"gradients","sunset") || "135deg, #2563eb, #7c3aed",
  
      ff: g(t,"typography","font_family","primary")   || "Inter",
      fm: g(t,"typography","font_family","secondary") || "JetBrains Mono",
      fd: g(t,"typography","font_family","display")   || "Space Grotesk",
      sz: g(t,"typography","font_size") || { xs:10,sm:12,md:14,lg:18,xl:24,xxl:32,display:48 },
      fw: g(t,"typography","font_weight") || { regular:400,medium:500,semibold:600,bold:700,black:900 },
      lh: g(t,"typography","line_height")    || { tight:1.1,base:1.5,loose:1.8 },
      ls: g(t,"typography","letter_spacing") || { tight:"-0.02em",normal:"0em",wide:"0.06em",wider:"0.14em",widest:"0.24em" },
  
      spacing: g(t,"spacing") || { xs:4,sm:8,md:16,lg:24,xl:40,xxl:64,xxxl:96 },
  
      shSm:   g(t,"shadows","sm")    || "0 1px 3px rgba(30,42,74,0.08)",
      shMd:   g(t,"shadows","md")    || "0 4px 12px rgba(30,42,74,0.12)",
      shLg:   g(t,"shadows","lg")    || "0 10px 30px rgba(30,42,74,0.16)",
      shGlow: g(t,"shadows","glow")  || "0 0 20px",
      shNeon: g(t,"shadows","neon")  || "0 0 30px",
      shInset:g(t,"shadows","inset") || "inset 0 1px 3px rgba(30,42,74,0.12)",
  
      rNone: g(t,"border","radius","none") ?? 0,
      rSm:   g(t,"border","radius","sm")   ?? 4,
      rMd:   g(t,"border","radius","md")   ?? 8,
      rLg:   g(t,"border","radius","lg")   ?? 12,
      rXl:   g(t,"border","radius","xl")   ?? 16,
      rFull: g(t,"border","radius","full") ?? 9999,
  
      cr: g(t,"ui","card","border_radius")    ?? 12,
      cp: g(t,"ui","card","padding")          ?? 16,
      ir: g(t,"ui","input","border_radius")   ?? 8,
      br: g(t,"ui","button","border_radius")  ?? 8,
  
      metaName:   g(t,"meta","name")    || "System",
      metaVer:    g(t,"meta","version") || "1.0.0",
      metaAuthor: g(t,"meta","author")  || "—",
  
      themeMode: (g(t,"theme") || "light").toString().toLowerCase().trim(),
    };
  
    document.documentElement.style.setProperty("--p-color", p.primary);
    applyTokensToUI(p);
  
    const F  = `font-family:'${p.ff}',sans-serif`;
    const FM = `font-family:'${p.fm}',monospace`;
    const FD = `font-family:'${p.fd}','${p.ff}',sans-serif`;
  
    mainEl.innerHTML =
      buildBanner(p, F, FM, FD) +
      buildPalette(p, F, FM) +
      buildStatusBadges(p, F, FM) +
      buildTypography(p, F, FM, FD) +
      buildGradients(p, F, FM) +
      buildShadows(p, F, FM) +
      buildBannerVariants(p, F, FM, FD) +
      buildThumbnails(p, F, FM, FD) +
      buildUIComponents(p, F, FM) +
      buildWindowComponents(p, F, FM, FD) +
      buildCards(p, F, FM, FD) +
      buildDataTable(p, F, FM) +
      buildTagsChips(p, F, FM) +
      buildTimeline(p, F, FM) +
      buildMiniScreens(p, F, FM, FD) +
      buildCharts(p, F, FM) +
      buildSpacingRadius(p, F, FM) +
      buildInteractionStates(p, F, FM);
  
    setTimeout(() => initCharts(p), 60);
  }
  
  /* ═══════════════════════════════════════════════════════
     EXPORT YAML
     ═══════════════════════════════════════════════════════ */
  function exportYaml() {
    const obj = readForm();
    const name    = (obj.meta?.name    || "theme").toLowerCase().replace(/\s+/g,"-");
    const version = obj.meta?.version  || "1.0.0";
    const yaml    = jsyaml.dump(obj, { indent: 2, lineWidth: 120 });
    const blob    = new Blob([yaml], { type: "text/yaml;charset=utf-8;" });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement("a");
    a.href = url; a.download = `${name}-v${version}.yaml`; a.click();
    URL.revokeObjectURL(url);
  }
  
  /* ═══════════════════════════════════════════════════════
     IMPORT YAML
     ═══════════════════════════════════════════════════════ */
  const fileInput = document.getElementById("fileInput");
  document.getElementById("ib").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = jsyaml.load(ev.target.result);
        populateForm(parsed);
        render();
      } catch(err) {
        errorBar.textContent = "⚠ YAML Error: " + err.message;
        errorBar.style.display = "block";
      }
    };
    reader.readAsText(file);
  });
  
  /* ═══════════════════════════════════════════════════════
     FORM LIVE BINDING
     ═══════════════════════════════════════════════════════ */
  function initFormBindings() {
    // Color pickers ↔ hex text inputs (bidirectional)
    const colorPairs = [
      ["f-col-primary",        "ch-primary",        "cp-primary"],
      ["f-col-secondary",      "ch-secondary",       "cp-secondary"],
      ["f-col-accent",         "ch-accent",          "cp-accent"],
      ["f-col-highlight",      "ch-highlight",       "cp-highlight"],
      ["f-col-bg",             "ch-bg",              "cp-bg"],
      ["f-col-surface",        "ch-surface",         "cp-surface"],
      ["f-col-text-primary",   "ch-text-primary",    "cp-text-primary"],
      ["f-col-text-secondary", "ch-text-secondary",  "cp-text-secondary"],
      ["f-col-text-muted",     "ch-text-muted",      "cp-text-muted"],
      ["f-col-success",        "ch-success",         "cp-success"],
      ["f-col-warning",        "ch-warning",         "cp-warning"],
      ["f-col-error",          "ch-error",           "cp-error"],
      ["f-col-info",           "ch-info",            "cp-info"],
      ["f-grad-brand-a",  null, "cp-grad-brand-a"],
      ["f-grad-brand-b",  null, "cp-grad-brand-b"],
      ["f-grad-neon-a",   null, "cp-grad-neon-a"],
      ["f-grad-neon-b",   null, "cp-grad-neon-b"],
      ["f-grad-cyber-a",  null, "cp-grad-cyber-a"],
      ["f-grad-cyber-b",  null, "cp-grad-cyber-b"],
      ["f-grad-aurora-a", null, "cp-grad-aurora-a"],
      ["f-grad-aurora-b", null, "cp-grad-aurora-b"],
    ];
  
    colorPairs.forEach(([pickerId, hexId, previewId]) => {
      const picker  = document.getElementById(pickerId);
      const hexEl   = hexId ? document.getElementById(hexId) : null;
      const preview = document.getElementById(previewId);
      if (!picker) return;
  
      picker.addEventListener("input", () => {
        const val = picker.value;
        if (hexEl) hexEl.value = val;
        if (preview) preview.style.background = val;
        updateGradPreviews();
      });
  
      if (hexEl) {
        hexEl.addEventListener("input", () => {
          const val = hexEl.value;
          if (/^#[0-9a-fA-F]{6}$/.test(val)) {
            picker.value = val;
            if (preview) preview.style.background = val;
            updateGradPreviews();
          }
        });
      }
    });
  
    // Sliders → display labels
    document.querySelectorAll("input[type=range]").forEach(slider => {
      const valEl = document.getElementById("sv-" + slider.id.replace("f-",""));
      if (valEl) {
        slider.addEventListener("input", () => { valEl.textContent = slider.value; });
      }
    });
  
    // Theme mode toggle
    document.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".toggle-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  
    // Gradient angle inputs → live preview
    ["brand","neon","cyber","aurora"].forEach(k => {
      const degEl = document.getElementById(`f-grad-${k}-deg`);
      if (degEl) degEl.addEventListener("input", updateGradPreviews);
    });
  }
  
  /* ═══════════════════════════════════════════════════════
     WIRE UP BUTTONS & KEYBOARD
     ═══════════════════════════════════════════════════════ */
  document.getElementById("exportYaml").addEventListener("click", exportYaml);
  
  document.getElementById("ab").addEventListener("click", () => {
    const btn = document.getElementById("ab");
    btn.classList.remove("flash");
    void btn.offsetWidth;
    btn.classList.add("flash");
    render();
  });
  
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault(); render();
    }
  });
  
  /* ═══════════════════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════════════════ */
  initFormBindings();
  updateGradPreviews();
  render();
  
  /* ── SECTION HELPERS ──────────────────────────────── */
  function sec(title, body) {
    return `<div class="cat"><div class="cat-title">${title}</div>${body}</div>`;
  }
  
  /* ══════════════════════════════════════════════════
     SECTION BUILDERS
     ══════════════════════════════════════════════════ */
  
  /* 1. HERO BANNER ─────────────────────────────────── */
  function buildBanner(p, F, FM, FD) {
    const banner = `
    <div class="banner-comp" style="background:linear-gradient(${p.gradBrand});padding:32px 28px;position:relative;overflow:hidden">
      <!-- grid bg -->
      <div style="position:absolute;inset:0;background-image:linear-gradient(${alpha(p.primary, 0.08)} 1px,transparent 1px),linear-gradient(90deg,${alpha(p.primary, 0.08)} 1px,transparent 1px);background-size:40px 40px;pointer-events:none"></div>
      <!-- glow blob -->
      <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;border-radius:50%;background:${alpha(p.accent, 0.25)};filter:blur(60px);pointer-events:none"></div>
      <div style="position:relative;z-index:1">
        <div style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.5);${FM};margin-bottom:10px">▸ System · v${p.metaVer}</div>
        <div style="font-size:${p.sz?.display || 48}px;font-weight:${p.fw?.black || 900};color:#fff;${FD};line-height:1;letter-spacing:-0.03em;text-shadow:0 0 40px ${alpha(p.primary, 0.6)}" class="neon-text">${p.metaName}</div>
        <div style="font-size:${p.sz?.lg || 18}px;color:rgba(255,255,255,0.65);${F};margin-top:10px;font-weight:${p.fw?.medium || 500}">Design Token System · by ${p.metaAuthor}</div>
        <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap">
          <button style="background:#fff;color:${p.secondary};border:none;border-radius:${p.br}px;padding:10px 22px;font-size:12px;font-weight:${p.fw?.bold || 700};${F};cursor:pointer;letter-spacing:0.04em">Get Started ↗</button>
          <button style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.4);border-radius:${p.br}px;padding:10px 22px;font-size:12px;${F};cursor:pointer;backdrop-filter:blur(4px)">View Docs</button>
        </div>
      </div>
    </div>`;
    return sec("Hero Banner", banner);
  }
  
  /* 2. PALETTE ─────────────────────────────────────── */
  function buildPalette(p, F, FM) {
    const swatches = [
      ["Primary", p.primary],
      ["Secondary", p.secondary],
      ["Accent", p.accent],
      ["Highlight", p.highlight],
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
        <div style="height:40px;border-radius:4px;background:${v};margin-bottom:8px;border:1px solid rgba(255,255,255,0.05);box-shadow:0 0 16px ${alpha(v, 0.3)}"></div>
        <div style="font-size:10px;font-weight:700;color:${p.tp};${F};margin-bottom:2px">${k}</div>
        <div style="font-size:9px;color:${p.ts};${FM}">${v}</div>
      </div>`,
      )
      .join("");
    return sec(
      "Palette & Brand",
      `<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px">${swatches}</div>`,
    );
  }
  
  /* 3. STATUS BADGES ───────────────────────────────── */
  function buildStatusBadges(p, F, FM) {
    const badges = [
      [p.ok, "success", "Operational", "All systems nominal"],
      [p.warn, "warning", "Degraded", "Performance issues"],
      [p.err, "critical", "Offline", "Service unavailable"],
      [p.info, "info", "Monitoring", "Running diagnostics"],
    ];
    const html = badges
      .map(
        ([c, label, title, sub]) => `
      <div style="background:${alpha(c, 0.06)};border:1px solid ${alpha(c, 0.2)};border-radius:${p.rMd}px;padding:12px 14px;display:flex;align-items:center;gap:12px">
        <div class="status-dot" style="width:8px;height:8px;border-radius:50%;background:${c};color:${c};box-shadow:0 0 10px ${c};flex-shrink:0"></div>
        <div style="flex:1">
          <div style="font-size:12px;color:${p.tp};${F};font-weight:600">${title}</div>
          <div style="font-size:10px;color:${p.ts};${FM};margin-top:2px">${sub}</div>
        </div>
        <span class="badge" style="background:${alpha(c, 0.12)};color:${c};border:1px solid ${alpha(c, 0.2)}">${label}</span>
      </div>`,
      )
      .join("");
    return sec("Status & Alerts", `<div class="grid g2">${html}</div>`);
  }
  
  /* 4. TYPOGRAPHY SCALE ────────────────────────────── */
  function buildTypography(p, F, FM, FD) {
    const rows = [
      {
        label: "Display",
        size: (p.sz?.display || 48) + "px",
        weight: p.fw?.black || 900,
        ls: p.ls?.tight || "-0.02em",
        lh: p.lh?.tight || 1.1,
        sample: p.metaName,
        font: FD,
      },
      {
        label: "XXL",
        size: (p.sz?.xxl || 32) + "px",
        weight: p.fw?.black || 900,
        ls: p.ls?.tight || "-0.02em",
        lh: p.lh?.tight || 1.1,
        sample: "Interface Layer",
        font: FD,
      },
      {
        label: "XL",
        size: (p.sz?.xl || 24) + "px",
        weight: p.fw?.bold || 700,
        ls: "-0.01em",
        lh: p.lh?.tight || 1.1,
        sample: "Design System",
        font: F,
      },
      {
        label: "LG",
        size: (p.sz?.lg || 18) + "px",
        weight: p.fw?.semibold || 600,
        ls: "0",
        lh: p.lh?.base || 1.5,
        sample: "Component Architecture",
        font: F,
      },
      {
        label: "MD",
        size: (p.sz?.md || 14) + "px",
        weight: p.fw?.regular || 400,
        ls: "0",
        lh: p.lh?.loose || 1.8,
        sample:
          "Tokens define every visual decision in a coherent design system.",
        font: F,
      },
      {
        label: "SM",
        size: (p.sz?.sm || 12) + "px",
        weight: p.fw?.regular || 400,
        ls: p.ls?.wide || "0.06em",
        lh: p.lh?.base || 1.5,
        sample: "Metadata · Version · Author · Tag · Label",
        font: F,
      },
      {
        label: "XS",
        size: (p.sz?.xs || 10) + "px",
        weight: p.fw?.bold || 700,
        ls: p.ls?.widest || "0.24em",
        lh: p.lh?.base || 1.5,
        sample: "LABEL · CAPTION · BADGE · MICRO",
        font: FM,
      },
    ];
    const html = rows
      .map(
        (r) => `
      <div class="type-row">
        <div style="font-size:${r.size};font-weight:${r.weight};color:${p.tp};${r.font};line-height:${r.lh};letter-spacing:${r.ls};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:500px">${r.sample}</div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:9px;color:${p.primary};${FM};font-weight:700">${r.label}</div>
          <div style="font-size:9px;color:${p.ts};${FM};margin-top:2px">${r.size} / w${r.weight}</div>
        </div>
      </div>`,
      )
      .join("");
    const monoRow = `
      <div class="type-row" style="margin-top:4px">
        <div style="font-size:${p.sz?.md || 14}px;color:${p.ts};${FM};letter-spacing:0.03em">const token = { primary: <span style="color:${p.ok}">"${p.primary}"</span>, version: <span style="color:${p.ok}">"${p.metaVer}"</span> };</div>
        <div style="flex-shrink:0;text-align:right">
          <div style="font-size:9px;color:${p.accent};${FM};font-weight:700">Mono</div>
          <div style="font-size:9px;color:${p.ts};${FM};margin-top:2px">${p.fm}</div>
        </div>
      </div>`;
    return sec("Typography Scale", html + monoRow);
  }
  
  /* 5. GRADIENTS ───────────────────────────────────── */
  function buildGradients(p, F, FM) {
    const grads = [
      ["Brand", p.gradBrand],
      ["Neon", p.gradNeon],
      ["Cyber", p.gradCyber],
      ["Void", p.gradVoid],
      ["Aurora", p.gradAurora],
      ["Sunset", p.gradSunset],
    ];
    const html = grads
      .map(
        ([name, grad]) => `
      <div>
        <div class="grad-tile animated-grad" style="background:linear-gradient(${grad})">
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:10px">
            <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.9);${FM};text-shadow:0 1px 6px rgba(0,0,0,0.8)">${name}</span>
            <span style="font-size:8px;color:rgba(255,255,255,0.5);${FM};margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${grad}</span>
          </div>
        </div>
      </div>`,
      )
      .join("");
    return sec(
      "Gradients",
      `<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px">${html}</div>`,
    );
  }
  
  /* 6. SHADOWS ─────────────────────────────────────── */
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
        "Neon Accent",
        `${p.shNeon} ${alpha(p.accent, 0.5)}`,
        `box-shadow:${p.shNeon} ${alpha(p.accent, 0.5)}`,
      ],
      [
        "Neon Cyan",
        `${p.shNeon} ${alpha(p.highlight, 0.5)}`,
        `box-shadow:${p.shNeon} ${alpha(p.highlight, 0.5)}`,
      ],
    ];
    const html = shs
      .map(
        ([name, val, style]) => `
      <div class="shadow-swatch">
        <div style="width:44px;height:44px;border-radius:${p.rMd}px;background:${p.surface};flex-shrink:0;${style}"></div>
        <div>
          <div style="font-size:11px;font-weight:700;color:${p.tp};${F}">${name}</div>
          <div style="font-size:9px;color:${p.ts};${FM};margin-top:3px;word-break:break-all;line-height:1.5">${val}</div>
        </div>
      </div>`,
      )
      .join("");
    return sec("Shadows & Elevation", `<div class="grid g2">${html}</div>`);
  }
  
  /* 7. BANNER VARIANTS ─────────────────────────────── */
  function buildBannerVariants(p, F, FM, FD) {
    // Announcement banner
    const announcement = `
      <div style="background:${alpha(p.primary, 0.1)};border:1px solid ${alpha(p.primary, 0.3)};border-radius:${p.rMd}px;padding:12px 16px;display:flex;align-items:center;gap:12px">
        <div style="width:8px;height:8px;border-radius:50%;background:${p.primary};box-shadow:0 0 8px ${p.primary};flex-shrink:0;animation:pulse-dot 2s infinite;color:${p.primary}"></div>
        <span style="font-size:12px;color:${p.tp};${F};flex:1">New feature shipped: <strong>Token versioning 2.0</strong> is now available.</span>
        <span style="font-size:10px;color:${p.primary};${FM};cursor:pointer;white-space:nowrap">Learn more →</span>
      </div>`;
  
    // Warning banner
    const warning = `
      <div style="background:${alpha(p.warn, 0.08)};border:1px solid ${alpha(p.warn, 0.3)};border-radius:${p.rMd}px;padding:12px 16px;display:flex;align-items:center;gap:12px">
        <span style="font-size:16px;flex-shrink:0">⚠</span>
        <span style="font-size:12px;color:${p.tp};${F};flex:1">Scheduled maintenance on <strong>Saturday 03:00 UTC</strong>. Expect 10 min downtime.</span>
        <span style="font-size:10px;color:${p.ts};${FM};cursor:pointer;white-space:nowrap">Dismiss ✕</span>
      </div>`;
  
    // Full-width dark banner
    const darkBanner = `
      <div style="position:relative;background:linear-gradient(${p.gradVoid});border:1px solid ${alpha(p.primary, 0.2)};border-radius:${p.rMd}px;padding:20px;overflow:hidden">
        <div style="position:absolute;bottom:-20px;right:-20px;width:120px;height:120px;border-radius:50%;background:${alpha(p.accent, 0.15)};filter:blur(30px);pointer-events:none"></div>
        <div style="font-size:9px;color:${p.ts};${FM};letter-spacing:0.18em;text-transform:uppercase;margin-bottom:6px">System Notice</div>
        <div style="font-size:16px;font-weight:800;color:${p.tp};${FD};margin-bottom:8px">v${p.metaVer} · ${p.metaName}</div>
        <div style="font-size:11px;color:${p.ts};${F}">Production build · All tokens compiled · ${new Date().toLocaleDateString("en-GB")}</div>
      </div>`;
  
    return sec(
      "Banner Variants",
      `<div style="display:flex;flex-direction:column;gap:10px">${announcement}${warning}${darkBanner}</div>`,
    );
  }
  
  /* 8. THUMBNAILS ──────────────────────────────────── */
  function buildThumbnails(p, F, FM, FD) {
    const thumbs = [
      { grad: p.gradBrand, icon: "◈", label: "Brand", tag: "v2.0" },
      { grad: p.gradNeon, icon: "◉", label: "Neon", tag: "NEW" },
      { grad: p.gradCyber, icon: "◊", label: "Cyber", tag: "BETA" },
      { grad: p.gradAurora, icon: "⬡", label: "Aurora", tag: "DEV" },
      { grad: p.gradSunset, icon: "▣", label: "Sunset", tag: "PROD" },
      { grad: p.gradVoid, icon: "■", label: "Void", tag: "DARK" },
    ];
    const thumbHtml = thumbs
      .map(
        ({ grad, icon, label, tag }) => `
      <div class="thumb-item" style="background:linear-gradient(${grad});border:1px solid ${alpha(p.primary, 0.15)}">
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px">
          <span style="font-size:20px;color:rgba(255,255,255,0.8)">${icon}</span>
          <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.9);${FM};letter-spacing:0.1em">${label}</span>
        </div>
        <div style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,0.5);border-radius:2px;padding:2px 5px;font-size:7px;font-weight:700;color:rgba(255,255,255,0.7);${FM};letter-spacing:0.08em">${tag}</div>
      </div>`,
      )
      .join("");
  
    // Featured thumbnail
    const featured = `
      <div style="grid-column:span 2;position:relative;border-radius:${p.rMd}px;overflow:hidden;aspect-ratio:16/7;background:linear-gradient(${p.gradNeon});border:1px solid ${alpha(p.accent, 0.3)}">
        <div style="position:absolute;inset:0;background-image:radial-gradient(circle at 20% 50%,${alpha(p.primary, 0.3)} 0%,transparent 60%),radial-gradient(circle at 80% 50%,${alpha(p.accent, 0.3)} 0%,transparent 60%)"></div>
        <div style="position:absolute;bottom:0;left:0;right:0;padding:20px 24px;background:linear-gradient(to top,rgba(0,0,0,0.8),transparent)">
          <div style="font-size:8px;color:rgba(255,255,255,0.5);${FM};letter-spacing:0.16em;text-transform:uppercase;margin-bottom:6px">Featured Project</div>
          <div style="font-size:22px;font-weight:900;color:#fff;${FD};letter-spacing:-0.02em">${p.metaName} Design System</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.6);${F};margin-top:4px">by ${p.metaAuthor} · v${p.metaVer}</div>
        </div>
      </div>`;
  
    return sec(
      "Thumbnails & Media Cards",
      `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px">
        ${featured}
        ${thumbHtml}
      </div>`,
    );
  }
  
  /* 9. UI COMPONENTS ───────────────────────────────── */
  function buildUIComponents(p, F, FM) {
    // Button variants
    const buttons = `
      <div class="tile">
        <div class="tile-label">Button System</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">
          <button style="background:${p.primary};color:#fff;border:none;border-radius:${p.br}px;padding:8px 18px;font-size:12px;font-weight:700;${F};cursor:pointer;letter-spacing:0.04em;box-shadow:0 0 12px ${alpha(p.primary, 0.4)}">Primary</button>
          <button style="background:${p.accent};color:#fff;border:none;border-radius:${p.br}px;padding:8px 18px;font-size:12px;font-weight:700;${F};cursor:pointer;box-shadow:0 0 12px ${alpha(p.accent, 0.4)}">Accent</button>
          <button style="background:linear-gradient(${p.gradNeon});color:#fff;border:none;border-radius:${p.br}px;padding:8px 18px;font-size:12px;font-weight:700;${F};cursor:pointer">Gradient</button>
          <button style="background:transparent;color:${p.tp};border:1.5px solid ${alpha(p.tp,0.3)};border-radius:${p.br}px;padding:8px 18px;font-size:12px;${F};cursor:pointer">Ghost</button>
          <button style="background:${alpha(p.primary, 0.12)};color:${p.primary};border:1px solid ${alpha(p.primary, 0.3)};border-radius:${p.br}px;padding:8px 18px;font-size:12px;font-weight:700;${F};cursor:pointer">Soft</button>
          <button style="background:${alpha(p.err, 0.12)};color:${p.err};border:1px solid ${alpha(p.err, 0.3)};border-radius:${p.br}px;padding:8px 18px;font-size:12px;font-weight:700;${F};cursor:pointer">Danger</button>
          <button style="background:${alpha(p.tp,0.04)};color:${p.tm};border:1px solid ${alpha(p.tp,0.1)};border-radius:${p.br}px;padding:8px 18px;font-size:12px;${F};cursor:not-allowed;opacity:0.5" disabled>Disabled</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${["sm", "md", "lg"].map((sz, i) => `<button style="background:${p.primary};color:#fff;border:none;border-radius:${p.br}px;padding:${[5, 8, 12][i]}px ${[12, 18, 24][i]}px;font-size:${[10, 12, 14][i]}px;font-weight:700;${F};cursor:pointer">Button ${sz.toUpperCase()}</button>`).join("")}
          <button style="background:${p.primary};color:#fff;border:none;border-radius:${p.rFull}px;padding:8px 18px;font-size:12px;font-weight:700;${F};cursor:pointer">Pill</button>
          <button style="background:${p.primary};color:#fff;border:none;border-radius:${p.br}px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer">+</button>
        </div>
      </div>`;
  
    // Input fields
    const inputs = `
      <div class="tile">
        <div class="tile-label">Input Fields</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div>
            <label style="font-size:10px;color:${p.ts};${FM};display:block;margin-bottom:4px;letter-spacing:0.08em">USERNAME</label>
            <div style="background:${alpha(p.tp,0.04)};border:1px solid ${alpha(p.tp,0.15)};border-radius:${p.ir}px;padding:9px 12px;display:flex;align-items:center;gap:8px">
              <span style="color:${p.ts};font-size:12px">@</span>
              <input class="input-spec" style="color:${p.tp}" placeholder="username" />
            </div>
          </div>
          <div style="background:${alpha(p.tp,0.04)};border:1.5px solid ${p.primary};border-radius:${p.ir}px;padding:9px 12px;box-shadow:0 0 0 3px ${alpha(p.primary, 0.12)}">
            <input class="input-spec" style="color:${p.tp}" placeholder="Focused state…" />
          </div>
          <div style="background:${alpha(p.err, 0.04)};border:1px solid ${alpha(p.err,0.5)};border-radius:${p.ir}px;padding:9px 12px">
            <input class="input-spec" style="color:${p.tp}" placeholder="Invalid input" />
            <div style="font-size:9px;color:${p.err};margin-top:5px;${FM}">⚠ This field is required</div>
          </div>
          <div style="background:${alpha(p.ok, 0.04)};border:1px solid ${alpha(p.ok, 0.4)};border-radius:${p.ir}px;padding:9px 12px;display:flex;align-items:center;justify-content:space-between">
            <input class="input-spec" style="color:${p.tp}" placeholder="Valid input" />
            <span style="color:${p.ok};font-size:13px;flex-shrink:0">✓</span>
          </div>
          <div style="background:${alpha(p.tp,0.02)};border:1px solid ${alpha(p.tp,0.08)};border-radius:${p.ir}px;padding:9px 12px;opacity:0.45">
            <input class="input-spec" style="color:${p.ts}" placeholder="Disabled…" disabled />
          </div>
        </div>
      </div>`;
  
    // Progress & members
    const progress = `
      <div class="tile">
        <div class="tile-label">Progress & Team</div>
        <div style="margin-bottom:16px">
          ${[
            ["Sprint Goal", 78, p.primary],
            ["Bug Rate", 23, p.err],
            ["Coverage", 94, p.ok],
            ["Velocity", 61, p.accent],
          ]
            .map(
              ([label, pct, c]) => `
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="font-size:10px;color:${p.ts};${F}">${label}</span>
                <span style="font-size:10px;color:${p.tp};${FM};font-weight:700">${pct}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width:${pct}%;background:${c};box-shadow:0 0 6px ${alpha(c, 0.5)}"></div>
              </div>
            </div>`,
            )
            .join("")}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div class="avatar-stack">
            ${[p.primary, p.accent, p.ok, p.warn, p.highlight].map((c, i) => `<div class="avatar" style="background:${alpha(c, 0.2)};color:${c}">${"ABCDE"[i]}</div>`).join("")}
          </div>
          <span style="font-size:10px;color:${p.ts};${FM}">+12 members</span>
        </div>
      </div>`;
  
    // Toggles
    const toggles = `
      <div class="tile">
        <div class="tile-label">Controls</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${[
            ["Feature flags", true, p.primary],
            ["Dark mode", true, p.accent],
            ["Beta access", false, p.ok],
            ["Notifications", true, p.highlight],
          ]
            .map(
              ([label, on, c]) => `
            <div style="display:flex;align-items:center;justify-content:space-between">
              <span style="font-size:12px;color:${p.tp};${F}">${label}</span>
              <div style="width:36px;height:20px;border-radius:10px;background:${on ? c : "rgba(255,255,255,0.08)"};position:relative;flex-shrink:0;box-shadow:${on ? `0 0 8px ${alpha(c, 0.4)}` : "none"}">
                <div style="width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:3px;${on ? "left:19px" : "left:3px"};transition:left 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>
              </div>
            </div>`,
            )
            .join("")}
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.05)" />
          ${[
            ["Enable telemetry", true],
            ["Auto-save", false],
          ]
            .map(
              ([label, checked]) => `
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:14px;height:14px;border-radius:2px;border:1px solid ${checked ? p.primary : "rgba(255,255,255,0.15)"};background:${checked ? alpha(p.primary, 0.2) : "transparent"};display:flex;align-items:center;justify-content:center;flex-shrink:0">
                ${checked ? `<div style="width:7px;height:5px;border-left:2px solid ${p.primary};border-bottom:2px solid ${p.primary};transform:rotate(-45deg) translateY(-1px)"></div>` : ""}
              </div>
              <span style="font-size:12px;color:${p.tp};${F}">${label}</span>
            </div>`,
            )
            .join("")}
        </div>
      </div>`;
  
    return sec(
      "UI Components",
      `<div class="grid g2">${buttons}</div><div class="grid g3" style="margin-top:10px">${inputs}${progress}${toggles}</div>`,
    );
  }
  
  /* 10. WINDOW COMPONENTS ──────────────────────────── */
  function buildWindowComponents(p, F, FM, FD) {
    // OS-style window
    const osWindow = `
      <div class="window-comp" style="box-shadow:${p.shLg}">
        <div class="window-titlebar">
          <div class="window-btn" style="background:#eb5757"></div>
          <div class="window-btn" style="background:#f5a623"></div>
          <div class="window-btn mini-dot-live" style="background:#6ac174"></div>
          <span style="font-size:9px;color:${p.ts};${FM};margin-left:8px;flex:1;text-align:center">${p.metaName} · Dashboard</span>
        </div>
        <div class="window-body" style="background:${p.bg}">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px">
            ${[
              [p.ok, "2,400", "Requests", "2.4k"],
              [p.primary, "98", "Uptime", "98%"],
              [p.warn, "142", "Latency", "142ms"],
            ]
              .map(
                ([c, num, l, disp]) => `
              <div style="background:${p.surface};border-radius:6px;padding:10px;border:1px solid ${alpha(c, 0.15)}">
                <div style="font-size:8px;color:${p.ts};${FM};margin-bottom:4px;text-transform:uppercase;letter-spacing:0.1em">${l}</div>
                <div class="count-num" data-target="${num}" data-display="${disp}" style="font-size:18px;font-weight:900;color:${c};${FD};text-shadow:0 0 16px ${alpha(c, 0.5)}">0</div>
              </div>`,
              )
              .join("")}
          </div>
          <div style="background:${p.surface};border-radius:6px;padding:10px;border:1px solid ${alpha(p.primary, 0.1)}">
            <canvas id="cMiniLine" height="60"></canvas>
          </div>
        </div>
      </div>`;
  
    // Terminal window
    const terminal = `
      <div class="window-comp" style="box-shadow:${p.shLg}">
        <div class="window-titlebar">
          <div class="window-btn" style="background:#eb5757"></div>
          <div class="window-btn" style="background:#f5a623"></div>
          <div class="window-btn" style="background:#6ac174"></div>
          <span style="font-size:9px;color:${p.ts};${FM};margin-left:8px">zsh — tokens</span>
        </div>
        <div class="window-body" style="background:#020208;min-height:110px">
          <pre style="font-family:'JetBrains Mono',monospace;font-size:10.5px;line-height:1.7;color:#60608a"
          ><span style="color:${p.ok}">✓</span> <span style="color:${p.ts}">loading</span> <span style="color:${p.primary}">${p.metaName}</span>
  <span style="color:${p.ok}">✓</span> <span style="color:${p.ts}">tokens compiled</span>
  <span style="color:${p.ok}">✓</span> <span style="color:${p.ts}">version</span> <span style="color:${p.warn}">${p.metaVer}</span>
  <span style="color:${p.accent}">$</span> <span style="color:#fff">apply theme --tokens ${p.metaName.toLowerCase()}</span>
  <span style="color:${p.ts}">  primary: </span><span style="color:${p.ok}">${p.primary}</span>
  <span style="color:${p.ts}">  accent:  </span><span style="color:${p.ok}">${p.accent}</span>
  <span style="color:${p.accent}">$</span> <span style="color:#fff;animation:blink-cursor 1s infinite">█</span></pre>
        </div>
      </div>`;
  
    // Modal window
    const modal = `
      <div class="window-comp" style="box-shadow:${p.shLg}">
        <div class="window-titlebar">
          <span style="font-size:9px;color:${p.ts};${FM};flex:1">Confirm Action</span>
          <div class="window-btn" style="background:#eb5757"></div>
        </div>
        <div class="window-body">
          <div style="font-size:14px;font-weight:700;color:${p.tp};${F};margin-bottom:8px">Delete token set?</div>
          <div style="font-size:11px;color:${p.ts};${F};line-height:1.6;margin-bottom:16px">This will permanently delete <strong style="color:${p.tp}">${p.metaName} v${p.metaVer}</strong> and all associated design tokens. This action cannot be undone.</div>
          <div style="display:flex;gap:8px;justify-content:flex-end">
            <button style="background:transparent;color:${p.ts};border:1px solid ${alpha(p.tp,0.2)};border-radius:${p.br}px;padding:7px 14px;font-size:11px;${F};cursor:pointer">Cancel</button>
            <button style="background:${p.err};color:#fff;border:none;border-radius:${p.br}px;padding:7px 14px;font-size:11px;font-weight:700;${F};cursor:pointer;box-shadow:0 0 12px ${alpha(p.err, 0.4)}">Delete</button>
          </div>
        </div>
      </div>`;
  
    return sec(
      "Window Components",
      `<div class="grid g3">${osWindow}${terminal}${modal}</div>`,
    );
  }
  
  /* 11. CARD VARIANTS ──────────────────────────────── */
  function buildCards(p, F, FM, FD) {
    // Feature card
    const featureCard = `
      <div style="background:${p.surface};border:1px solid ${alpha(p.primary, 0.2)};border-radius:${p.cr}px;padding:${p.cp}px;box-shadow:${p.shMd}">
        <div style="width:40px;height:40px;border-radius:${p.rMd}px;background:${alpha(p.primary, 0.15)};display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:12px;border:1px solid ${alpha(p.primary, 0.2)}">◈</div>
        <div style="font-size:14px;font-weight:700;color:${p.tp};${F};margin-bottom:6px">Token System</div>
        <div style="font-size:11px;color:${p.ts};${F};line-height:1.6">A unified source of truth for all design decisions across your entire product.</div>
        <div style="margin-top:14px;font-size:11px;color:${p.primary};${FM};cursor:pointer">Learn more →</div>
      </div>`;
  
    // Pricing card
    const pricingCard = `
      <div style="position:relative;background:linear-gradient(${p.gradNeon});border-radius:${p.cr}px;padding:${p.cp}px;box-shadow:${p.shGlow} ${alpha(p.accent, 0.3)}" class="shimmer-card">
        <div style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.2);border-radius:${p.rFull}px;padding:3px 9px;font-size:9px;font-weight:700;color:#fff;${FM};letter-spacing:0.06em">PRO</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.6);${FM};letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px">Upgrade Plan</div>
        <div style="font-size:32px;font-weight:900;color:#fff;${FD};margin-bottom:4px">$49</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.6);${F};margin-bottom:16px">per month</div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
          ${["Unlimited tokens", "Team collaboration", "Priority support"]
            .map(
              (f) => `
            <div style="display:flex;align-items:center;gap:8px">
              <span style="color:#fff;font-size:10px">✓</span>
              <span style="font-size:11px;color:rgba(255,255,255,0.8);${F}">${f}</span>
            </div>`,
            )
            .join("")}
        </div>
        <button style="width:100%;background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3);border-radius:${p.br}px;padding:9px;font-size:12px;font-weight:700;${F};cursor:pointer;backdrop-filter:blur(4px)">Get Pro Access</button>
      </div>`;
  
    // Profile / identity card
    const profileCard = `
      <div style="background:${p.surface};border:1px solid ${alpha(p.accent, 0.2)};border-radius:${p.cr}px;padding:${p.cp}px;text-align:center">
        <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(${p.gradAurora});margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#fff;${FD};box-shadow:0 0 20px ${alpha(p.accent, 0.4)}">
          ${p.metaAuthor.charAt(0).toUpperCase()}
        </div>
        <div style="font-size:14px;font-weight:700;color:${p.tp};${F};margin-bottom:4px">${p.metaAuthor}</div>
        <div style="font-size:10px;color:${p.ts};${FM};margin-bottom:12px">Design System Author</div>
        <div style="display:flex;justify-content:center;gap:16px;margin-bottom:14px">
          ${[
            ["42", "Tokens"],
            ["8", "Systems"],
            ["2.4k", "Stars"],
          ]
            .map(
              ([n, l]) => `
            <div style="text-align:center">
              <div style="font-size:16px;font-weight:800;color:${p.tp};${FD}">${n}</div>
              <div style="font-size:9px;color:${p.ts};${FM}">${l}</div>
            </div>`,
            )
            .join("")}
        </div>
        <button style="width:100%;background:${alpha(p.accent, 0.15)};color:${p.accent};border:1px solid ${alpha(p.accent, 0.3)};border-radius:${p.br}px;padding:7px;font-size:11px;font-weight:700;${F};cursor:pointer">Follow</button>
      </div>`;
  
    // Stat cards row
    const statCards = `
      <div class="stat-card">
        <div style="font-size:9px;color:${p.ts};${FM};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">Total Tokens</div>
        <div class="count-num" data-target="248" data-display="248" style="font-size:28px;font-weight:900;color:${p.primary};${FD};text-shadow:0 0 20px ${alpha(p.primary, 0.4)}">0</div>
        <div style="font-size:10px;color:${p.ok};${FM};margin-top:4px">↑ +12 this week</div>
      </div>
      <div class="stat-card" style="--p-color:${p.accent}">
        <div style="font-size:9px;color:${p.ts};${FM};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">Components</div>
        <div class="count-num" data-target="64" data-display="64" style="font-size:28px;font-weight:900;color:${p.accent};${FD};text-shadow:0 0 20px ${alpha(p.accent, 0.4)}">0</div>
        <div style="font-size:10px;color:${p.ok};${FM};margin-top:4px">↑ +4 this week</div>
      </div>
      <div class="stat-card" style="--p-color:${p.ok}">
        <div style="font-size:9px;color:${p.ts};${FM};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">Coverage</div>
        <div class="count-num" data-target="97" data-display="97%" style="font-size:28px;font-weight:900;color:${p.ok};${FD};text-shadow:0 0 20px ${alpha(p.ok, 0.4)}">0</div>
        <div style="font-size:10px;color:${p.ok};${FM};margin-top:4px">→ Stable</div>
      </div>
      <div class="stat-card" style="--p-color:${p.warn}">
        <div style="font-size:9px;color:${p.ts};${FM};letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">Warnings</div>
        <div class="count-num" data-target="3" data-display="3" style="font-size:28px;font-weight:900;color:${p.warn};${FD};text-shadow:0 0 20px ${alpha(p.warn, 0.4)}">0</div>
        <div style="font-size:10px;color:${p.ts};${FM};margin-top:4px">↓ -2 resolved</div>
      </div>`;
  
    return sec(
      "Card Variants",
      `
      <div class="grid g3">${featureCard}${pricingCard}${profileCard}</div>
      <div class="grid g4" style="margin-top:10px">${statCards}</div>`,
    );
  }
  
  /* 12. DATA TABLE ─────────────────────────────────── */
  function buildDataTable(p, F, FM) {
    const rows = [
      {
        name: "primary",
        value: p.primary,
        type: "Color",
        status: "stable",
        since: "v1.0",
      },
      {
        name: "accent",
        value: p.accent,
        type: "Color",
        status: "stable",
        since: "v1.0",
      },
      {
        name: "highlight",
        value: p.highlight,
        type: "Color",
        status: "new",
        since: "v2.0",
      },
      {
        name: "surface",
        value: p.surface,
        type: "Color",
        status: "stable",
        since: "v1.0",
      },
      {
        name: "font-display",
        value: p.fd,
        type: "Font",
        status: "changed",
        since: "v2.0",
      },
      {
        name: "radius-sm",
        value: p.rSm + "px",
        type: "Space",
        status: "stable",
        since: "v1.0",
      },
    ];
  
    const statusColor = {
      stable: p.ok,
      new: p.info,
      changed: p.warn,
      deprecated: p.err,
    };
  
    const tableHtml = `
      <div class="tile" style="overflow:auto">
        <div class="tile-label">Token Reference</div>
        <table class="data-table">
          <thead>
            <tr>
              ${["Token", "Value", "Type", "Status", "Since"].map((h) => `<th style="color:${p.ts}">${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr>
                <td style="color:${p.tp};font-weight:600">--${r.name}</td>
                <td style="color:${p.ts}">
                  <span style="display:inline-flex;align-items:center;gap:7px;max-width:200px">
                    ${r.value.startsWith("#") ? `<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${r.value};border:1px solid ${alpha(p.tp,0.15)};flex-shrink:0"></span>` : ""}
                    <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.value}</span>
                  </span>
                </td>
                <td><span class="tag" style="background:${alpha(p.primary, 0.1)};color:${p.primary};border:1px solid ${alpha(p.primary, 0.2)}">${r.type}</span></td>
                <td><span class="tag" style="background:${alpha(statusColor[r.status] || p.ok, 0.1)};color:${statusColor[r.status] || p.ok};border:1px solid ${alpha(statusColor[r.status] || p.ok, 0.2)}">${r.status}</span></td>
                <td style="color:${p.ts}">${r.since}</td>
              </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>`;
  
    return sec("Data Table", tableHtml);
  }
  
  /* 13. TAGS & CHIPS ───────────────────────────────── */
  function buildTagsChips(p, F, FM) {
    const tagSets = [
      {
        label: "Category Tags",
        tags: [
          [p.primary, "Design"],
          [p.accent, "System"],
          [p.highlight, "Tokens"],
          [p.ok, "Stable"],
          [p.warn, "Beta"],
          [p.err, "Breaking"],
          [p.info, "New"],
        ],
      },
      {
        label: "Tech Stack",
        tags: [
          [p.primary, "CSS"],
          [p.accent, "JS"],
          [p.highlight, "YAML"],
          [p.ok, "HTML"],
          [p.warn, "Node"],
        ],
      },
    ];
  
    const html = tagSets
      .map(
        ({ label, tags }) => `
      <div class="tile">
        <div class="tile-label">${label}</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${tags
            .map(
              ([c, name]) => `
            <span class="tag" style="background:${alpha(c, 0.1)};color:${c};border:1px solid ${alpha(c, 0.25)}">${name}</span>`,
            )
            .join("")}
        </div>
      </div>`,
      )
      .join("");
  
    // Breadcrumb
    const breadcrumb = `
      <div class="tile">
        <div class="tile-label">Breadcrumb</div>
        <div class="breadcrumb" style="color:${p.ts}">
          <span style="color:${p.ts};cursor:pointer">Home</span>
          <span style="color:${p.tm}">›</span>
          <span style="color:${p.ts};cursor:pointer">Systems</span>
          <span style="color:${p.tm}">›</span>
          <span style="color:${p.tp};font-weight:600">${p.metaName}</span>
        </div>
      </div>`;
  
    // Kbd shortcuts
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
                      `<span style="background:${p.surface};border:1px solid ${alpha(p.tp,0.2)};border-bottom:2px solid ${alpha(p.tp,0.35)};border-radius:3px;padding:2px 7px;font-size:10px;${FM};color:${p.tp}">${k}</span>`,
                  )
                  .join('<span style="color:${p.tm};font-size:9px">+</span>')}
              </div>
            </div>`,
            )
            .join("")}
        </div>
      </div>`;
  
    return sec(
      "Tags, Chips & Navigation",
      `<div class="grid g3">${html}${breadcrumb}${kbd}</div>`,
    );
  }
  
  /* 14. TIMELINE ───────────────────────────────────── */
  function buildTimeline(p, F, FM) {
    const events = [
      {
        color: p.ok,
        icon: "✓",
        title: "v2.0 Released",
        sub: "Major token overhaul",
        time: "Today",
      },
      {
        color: p.primary,
        icon: "◈",
        title: "Display font added",
        sub: "Orbitron for headings",
        time: "2d ago",
      },
      {
        color: p.accent,
        icon: "✦",
        title: "Gradient system v2",
        sub: "6 new gradient presets",
        time: "5d ago",
      },
      {
        color: p.warn,
        icon: "!",
        title: "Breaking change",
        sub: "Renamed spacing.xxl → xxxl",
        time: "1w ago",
      },
      {
        color: p.info,
        icon: "i",
        title: "v1.0 Published",
        sub: "Initial token system",
        time: "1mo ago",
      },
    ];
  
    const html = `
      <div class="tile" style="padding:18px">
        <div class="tile-label">Changelog</div>
        <div style="margin-top:4px">
          ${events
            .map(
              ({ color, icon, title, sub, time }) => `
            <div class="timeline-item">
              <div class="timeline-dot" style="color:${color};background:${alpha(color, 0.12)};display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700">${icon}</div>
              <div style="flex:1">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                  <span style="font-size:12px;font-weight:600;color:${p.tp};${F}">${title}</span>
                  <span style="font-size:9px;color:${p.ts};${FM};flex-shrink:0">${time}</span>
                </div>
                <div style="font-size:10px;color:${p.ts};${F};margin-top:2px">${sub}</div>
              </div>
            </div>`,
            )
            .join("")}
        </div>
      </div>`;
  
    return sec(
      "Timeline & Changelog",
      `<div class="grid g2">${html}<div class="grid" style="gap:8px">
      ${events
        .slice(0, 3)
        .map(
          ({ color, title, sub, time }) => `
        <div style="background:${p.surface};border:1px solid ${alpha(color, 0.2)};border-left:3px solid ${color};border-radius:${p.rMd}px;padding:10px 12px">
          <div style="font-size:11px;font-weight:600;color:${p.tp};${F}">${title}</div>
          <div style="font-size:10px;color:${p.ts};${FM};margin-top:2px">${sub} · ${time}</div>
        </div>`,
        )
        .join("")}
      </div></div>`,
    );
  }
  
  /* 15. MINI SCREENS ───────────────────────────────── */
  function buildMiniScreens(p, F, FM, FD) {
    // Dashboard
    const dashboard = `
      <div class="mini-screen">
        <div class="mini-screen-bar">
          <div class="mini-dot" style="background:#eb5757"></div>
          <div class="mini-dot" style="background:#f5a623"></div>
          <div class="mini-dot mini-dot-live" style="background:#6ac174"></div>
          <span style="font-size:9px;color:${p.ts};${FM};margin-left:6px">${p.metaName} · Live</span>
        </div>
        <div class="mini-screen-body" style="background:${p.bg};padding:14px">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
            ${[
              [p.ok, "2400", "RPS", "2.4k"],
              [p.primary, "99", "UP", "99%"],
              [p.warn, "80", "MS", "80ms"],
            ]
              .map(
                ([c, num, l, d]) => `
              <div style="background:${p.surface};border-radius:6px;padding:8px;border:1px solid ${alpha(c, 0.15)}">
                <div style="font-size:8px;color:${p.ts};${FM};margin-bottom:2px">${l}</div>
                <div class="count-num" data-target="${num}" data-display="${d}" style="font-size:15px;font-weight:900;color:${c};${FD}">0</div>
              </div>`,
              )
              .join("")}
          </div>
          <div style="background:${p.surface};border-radius:6px;padding:8px;border:1px solid rgba(255,255,255,0.04)">
            <canvas id="cMiniLine" height="55"></canvas>
          </div>
        </div>
      </div>`;
  
    // Mobile
    const mobile = `
      <div class="mini-screen" style="max-width:200px;margin:0 auto">
        <div style="background:${p.bg};padding:14px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
            <div style="width:28px;height:28px;border-radius:${p.rMd}px;background:linear-gradient(${p.gradNeon});display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#fff">${p.metaName.charAt(0)}</div>
            <div style="display:flex;flex-direction:column;gap:3px">
              ${[p.tp, p.primary, p.tp].map((c, i) => `<div style="height:2px;width:${[18, 12, 18][i]}px;border-radius:1px;background:${c}"></div>`).join("")}
            </div>
          </div>
          <div style="font-size:8px;color:${p.ts};${FM};letter-spacing:0.12em;text-transform:uppercase;margin-bottom:3px">Hello,</div>
          <div style="font-size:17px;font-weight:900;color:${p.tp};${FD};margin-bottom:14px">${p.metaAuthor}</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${[
              [p.primary, "Deploy", "↑3"],
              [p.ok, "Build", "✓"],
              [p.warn, "Review", "!"],
            ]
              .map(
                ([c, l, t]) => `
              <div style="background:${p.surface};border-radius:${p.rMd}px;padding:9px;display:flex;align-items:center;gap:8px;border:1px solid ${alpha(c, 0.15)}">
                <div style="width:6px;height:6px;border-radius:1px;background:${c};box-shadow:0 0 6px ${c};flex-shrink:0"></div>
                <span style="font-size:10px;color:${p.tp};${F};flex:1">${l}</span>
                <span style="font-size:9px;color:${c};${FM};font-weight:700">${t}</span>
              </div>`,
              )
              .join("")}
          </div>
        </div>
      </div>`;
  
    // Notifications
    const notifications = `
      <div class="mini-screen">
        <div class="mini-screen-bar">
          <div class="mini-dot" style="background:#eb5757"></div>
          <div class="mini-dot" style="background:#f5a623"></div>
          <div class="mini-dot" style="background:#6ac174"></div>
          <span style="font-size:9px;color:${p.ts};${FM};margin-left:6px">Notifications · 4</span>
        </div>
        <div class="mini-screen-body" style="background:${p.bg};display:flex;flex-direction:column;gap:5px">
          ${[
            [p.ok, "✓", "Deploy successful", "2m ago"],
            [p.info, "·", "PR #42 merged", "5m ago"],
            [p.warn, "!", "High memory", "12m ago"],
            [p.err, "✕", "Tests failed", "1h ago"],
          ]
            .map(
              ([c, icon, msg, time]) => `
            <div class="notif-row" style="display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:${p.rMd}px;background:${p.surface};border-left:2px solid ${c}">
              <div style="width:14px;height:14px;border-radius:50%;background:${alpha(c, 0.12)};display:flex;align-items:center;justify-content:center;font-size:8px;color:${c};flex-shrink:0">${icon}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:10px;color:${p.tp};${F};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${msg}</div>
              </div>
              <div style="font-size:8px;color:${p.ts};${FM};flex-shrink:0">${time}</div>
            </div>`,
            )
            .join("")}
        </div>
      </div>`;
  
    return sec(
      "Mini Screens",
      `<div class="grid g3">${dashboard}${mobile}${notifications}</div>`,
    );
  }
  
  /* 16. DATA CHARTS ────────────────────────────────── */
  function buildCharts(p, F, FM) {
    return sec(
      "Data Visualization",
      `
      <div class="grid g2">
        <div class="tile chart-tile"><div class="tile-label">Area · Performance</div><div style="height:140px"><canvas id="cLine"></canvas></div></div>
        <div class="tile chart-tile"><div class="tile-label">Bar · Distribution</div><div style="height:140px"><canvas id="cBar"></canvas></div></div>
        <div class="tile chart-tile"><div class="tile-label">Doughnut · Composition</div><div style="height:140px;display:flex;align-items:center;justify-content:center"><canvas id="cDoughnut"></canvas></div></div>
        <div class="tile chart-tile"><div class="tile-label">Radar · Coverage</div><div style="height:140px;display:flex;align-items:center;justify-content:center"><canvas id="cRadar"></canvas></div></div>
      </div>`,
    );
  }
  
  /* 17. SPACING & RADIUS ───────────────────────────── */
  function buildSpacingRadius(p, F, FM) {
    const spacingKeys = Object.entries(
      p.spacing || { xs: 4, sm: 8, md: 16, lg: 24, xl: 40, xxl: 64, xxxl: 96 },
    );
    const spacingBars = spacingKeys
      .map(
        ([k, v]) => `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:7px">
        <div style="font-size:9px;color:${p.ts};${FM};width:32px;flex-shrink:0">${k}</div>
        <div style="height:14px;border-radius:2px;background:${alpha(p.primary, 0.5)};width:${Math.min(v * 1.6, 140)}px;flex-shrink:0;box-shadow:0 0 4px ${alpha(p.primary, 0.3)}"></div>
        <div style="font-size:9px;color:${p.ts};${FM}">${v}px</div>
      </div>`,
      )
      .join("");
  
    const radiusShapes = [
      ["none", p.rNone || 0],
      ["sm", p.rSm || 3],
      ["md", p.rMd || 6],
      ["lg", p.rLg || 10],
      ["xl", p.rXl || 16],
      ["full", p.rFull || 9999],
    ]
      .map(
        ([k, v]) => `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:9px">
        <div style="width:36px;height:36px;border:2px solid ${p.primary};border-radius:${Math.min(v, 50)}px;flex-shrink:0;box-shadow:0 0 8px ${alpha(p.primary, 0.3)}"></div>
        <div>
          <div style="font-size:10px;font-weight:700;color:${p.tp};${F}">${k}</div>
          <div style="font-size:9px;color:${p.ts};${FM}">${v >= 9999 ? "9999px" : v + "px"}</div>
        </div>
      </div>`,
      )
      .join("");
  
    return sec(
      "Spacing & Border Radius",
      `
      <div class="grid g2">
        <div class="tile"><div class="tile-label">Spacing Scale</div>${spacingBars}</div>
        <div class="tile"><div class="tile-label">Border Radius</div>${radiusShapes}</div>
      </div>`,
    );
  }
  
  /* 18. INTERACTION STATES ─────────────────────────── */
  function buildInteractionStates(p, F, FM) {
    const tooltips = `
      <div class="tile">
        <div class="tile-label">Tooltips & Overlays</div>
        <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-end;padding-top:36px">
          ${[
            { bg: p.surface, borderC: p.tp, tc: p.tp,  btnBg: p.surface,  btnBorder: p.tp,    label: "Default"  },
            { bg: p.primary, borderC: p.primary, tc: "#fff", btnBg: p.primary, btnBorder: p.primary, label: "Primary"  },
            { bg: p.err,     borderC: p.err,     tc: "#fff", btnBg: p.err,     btnBorder: p.err,     label: "Danger"   },
          ]
            .map(
              ({ bg, borderC, tc, btnBg, btnBorder, label }) => `
            <div class="tooltip-wrap">
              <div class="tooltip-box" style="background:${bg};border:1px solid ${alpha(borderC,0.35)};color:${tc};box-shadow:0 4px 16px ${alpha(p.tp,0.12)}">${label} tooltip
                <div style="position:absolute;top:100%;left:50%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid ${bg}"></div>
              </div>
              <button style="background:${btnBg};border:1px solid ${alpha(btnBorder,0.5)};color:${tc};border-radius:${p.rMd}px;padding:6px 14px;font-size:11px;font-weight:600;${F};cursor:pointer">${label}</button>
            </div>`,
            )
            .join("")}
        </div>
      </div>`;
  
    const codeBlock = `
      <div class="tile">
        <div class="tile-label">Code Specimen</div>
        <div style="background:${p.bg};border-radius:${p.rMd}px;padding:14px;border:1px solid ${alpha(p.tp,0.1)}">
          <pre style="font-family:'JetBrains Mono',monospace;font-size:10.5px;line-height:1.7;color:${p.tm};white-space:pre"><span style="color:${p.accent}">import</span> <span style="color:${p.tp}">{ tokens }</span> <span style="color:${p.accent}">from</span> <span style="color:${p.ok}">'${p.metaName.toLowerCase().replace(/\s/g, "-")}'</span>
  
  <span style="color:${p.info}">const</span> <span style="color:${p.tp}">theme</span> = {
    primary: <span style="color:${p.ok}">"${p.primary}"</span>,
    accent:  <span style="color:${p.ok}">"${p.accent}"</span>,
    surface: <span style="color:${p.ok}">"${p.surface}"</span>,
    radius:  <span style="color:${p.warn}">${p.rLg}</span>,
  }</pre>
        </div>
      </div>`;
  
    return sec(
      "Interaction Tokens",
      `<div class="grid g2">${tooltips}${codeBlock}</div>`,
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
      charts.push(new Chart(el, { type, data, options: opts || base }));
    };
  
    tryChart("cLine", "line", {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      datasets: [
        {
          data: [12, 32, 22, 48, 36, 60, 44, 72],
          borderColor: p.primary,
          tension: 0.45,
          fill: true,
          backgroundColor: alpha(p.primary, 0.1),
          pointRadius: 3,
          pointBackgroundColor: p.primary,
        },
        {
          data: [8, 20, 30, 24, 50, 38, 56, 48],
          borderColor: p.accent,
          tension: 0.45,
          fill: true,
          backgroundColor: alpha(p.accent, 0.08),
          pointRadius: 3,
          pointBackgroundColor: p.accent,
        },
      ],
    });
  
    tryChart("cBar", "bar", {
      labels: ["A", "B", "C", "D", "E", "F"],
      datasets: [
        {
          data: [42, 28, 60, 34, 52, 38],
          backgroundColor: p.primary + "cc",
          borderRadius: 4,
        },
        {
          data: [22, 44, 28, 56, 24, 48],
          backgroundColor: p.accent + "cc",
          borderRadius: 4,
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
        cutout: "72%",
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
            backgroundColor: alpha(p.accent, 0.1),
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
            grid: { color: alpha(p.primary, 0.1) },
            ticks: { display: false },
            pointLabels: {
              font: { size: 9, family: "JetBrains Mono" },
              color: p.ts,
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
      },
    );
  
    // Mini line chart
    const elM = document.getElementById("cMiniLine");
    if (elM) {
      charts.push(
        new Chart(elM, {
          type: "line",
          data: {
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            datasets: [
              {
                data: [30, 45, 28, 60, 50, 72, 58, 80, 65, 90],
                borderColor: p.primary,
                tension: 0.45,
                fill: true,
                backgroundColor: alpha(p.primary, 0.08),
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
    void btn.offsetWidth;
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