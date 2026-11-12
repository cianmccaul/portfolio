/**
 * Behaviour for the floating chrome: the nav's tint and lens, the theme and
 * Reduce-glass controls, and the command palette. Plain DOM, no framework:
 * the whole file is a few kilobytes and every page shares it.
 *
 * The theme and glass choices are applied before first paint by the inline
 * script in Base.astro; this file only changes them afterwards.
 */
const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const store = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string | null) => {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch {
      /* private mode: the choice lasts for this page */
    }
  },
};

/* ── Nav: dark tint over the night band ─────────────────────────────────── */
const header = document.querySelector<HTMLElement>('[data-nav]');
const nights = [...document.querySelectorAll<HTMLElement>('[data-night]')];
if (header && nights.length) {
  // A one-pixel line through the middle of the pill: whatever band crosses it
  // is what the pill is sitting on.
  const LINE = 42;
  const over = new Set<Element>();
  let observer: IntersectionObserver | undefined;
  const watch = () => {
    observer?.disconnect();
    over.clear();
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.isIntersecting ? over.add(entry.target) : over.delete(entry.target);
        if (over.size) header.dataset.over = 'night';
        else delete header.dataset.over;
      },
      { rootMargin: `-${LINE}px 0px -${Math.max(0, window.innerHeight - LINE - 1)}px 0px` },
    );
    nights.forEach((night) => observer!.observe(night));
  };
  watch();
  let pending = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(pending);
    pending = window.setTimeout(watch, 150);
  });
}

/* ── Nav: the lens (Chromium only) ──────────────────────────────────────── */
// One small image, the size of the pill, drives the SVG filter in Nav.astro.
// Red and green say how far to bend the backdrop at each pixel: nothing in the
// middle, and along the rim it is pulled inwards, following the pill's curve,
// the way the edge of a lens does. Blue marks the middle, which stays frosted
// so the labels keep a calm ground; only the rim is clear enough to refract.
const pill = document.querySelector<HTMLElement>('.glass-lens');
const map = document.querySelector<SVGFEImageElement>('[data-lens-map]');
if (pill && map && root.dataset.lens !== undefined) {
  const RIM = 11;
  const build = () => {
    const width = Math.round(pill.offsetWidth);
    const height = Math.round(pill.offsetHeight);
    if (!width || !height) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const image = ctx.createImageData(width, height);
    const radius = Math.min(parseFloat(getComputedStyle(pill).borderTopLeftRadius) || 0, height / 2, width / 2);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Distance to the edge of the rounded rectangle, and the way out.
        const qx = Math.abs(x + 0.5 - width / 2) - (width / 2 - radius);
        const qy = Math.abs(y + 0.5 - height / 2) - (height / 2 - radius);
        const ox = Math.max(qx, 0);
        const oy = Math.max(qy, 0);
        const outside = Math.hypot(ox, oy);
        const depth = radius - (outside + Math.min(Math.max(qx, qy), 0));
        let nx = 0;
        let ny = 0;
        if (outside > 0) {
          nx = ox / outside;
          ny = oy / outside;
        } else if (qx > qy) nx = 1;
        else ny = 1;
        if (x < width / 2) nx = -nx;
        if (y < height / 2) ny = -ny;
        const t = Math.min(1, Math.max(0, depth / RIM));
        const bend = (1 - t) ** 2;
        const i = (y * width + x) * 4;
        image.data[i] = 128 - nx * bend * 127;
        image.data[i + 1] = 128 - ny * bend * 127;
        image.data[i + 2] = 255 * t * t * (3 - 2 * t);
        image.data[i + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
    map.setAttribute('href', canvas.toDataURL());
    map.setAttribute('width', String(width));
    map.setAttribute('height', String(height));
    root.dataset.lens = 'on';
  };
  // Not needed for first paint: wait until the browser has a quiet moment.
  const idle = window.requestIdleCallback ?? ((run: () => void) => window.setTimeout(run, 200));
  idle(() => {
    build();
    new ResizeObserver(build).observe(pill);
  });
}

/* ── Theme ──────────────────────────────────────────────────────────────── */
type Theme = 'light' | 'dark' | 'system';
const currentTheme = (): Theme => (root.dataset.theme as Theme | undefined) ?? 'system';
const themeInputs = [...document.querySelectorAll<HTMLInputElement>('input[name="theme"]')];
const syncTheme = () => {
  const theme = currentTheme();
  themeInputs.forEach((input) => (input.checked = input.value === theme));
  // The browser's own chrome follows the page, not the system, once a theme is forced.
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    const forced = meta.dataset[theme];
    if (forced) meta.content = forced;
    else if (meta.dataset.own) meta.content = meta.dataset.own;
  });
};
function setTheme(theme: Theme, from?: Element | null) {
  const apply = () => {
    if (theme === 'system') delete root.dataset.theme;
    else root.dataset.theme = theme;
    store.set('theme', theme === 'system' ? null : theme);
    syncTheme();
  };
  const ground = () => getComputedStyle(document.body).backgroundColor;
  const before = ground();
  if (!document.startViewTransition || reduced.matches) return apply();
  // The new theme opens from the control that asked for it, in 300 ms.
  const box = from?.getBoundingClientRect();
  const x = box ? box.left + box.width / 2 : window.innerWidth / 2;
  const y = box ? box.top + box.height / 2 : 0;
  root.dataset.reveal = '';
  const transition = document.startViewTransition(apply);
  transition.ready
    .then(() => {
      if (ground() === before) return; // same look, nothing to reveal
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {});
  transition.finished.finally(() => delete root.dataset.reveal);
}
themeInputs.forEach((input) => input.addEventListener('change', () => setTheme(input.value as Theme, input.parentElement)));

/* ── Reduce glass ───────────────────────────────────────────────────────── */
const glassInputs = [...document.querySelectorAll<HTMLInputElement>('[data-glass-toggle]')];
const glassReduced = () => root.dataset.glass === 'off';
const syncGlass = () => glassInputs.forEach((input) => (input.checked = glassReduced()));
function setGlass(reduce: boolean) {
  if (reduce) root.dataset.glass = 'off';
  else delete root.dataset.glass;
  store.set('glass', reduce ? 'off' : 'on');
  syncGlass();
}
glassInputs.forEach((input) => input.addEventListener('change', () => setGlass(input.checked)));
syncTheme();
syncGlass();

/* ── Command palette ────────────────────────────────────────────────────── */
const palette = document.querySelector<HTMLDialogElement>('#palette');
if (palette) {
  const input = palette.querySelector<HTMLInputElement>('input')!;
  const options = [...palette.querySelectorAll<HTMLElement>('[role="option"]')];
  const groups = [...palette.querySelectorAll<HTMLElement>('[role="group"]')];
  const empty = palette.querySelector<HTMLElement>('[data-empty]')!;
  let active: HTMLElement | undefined;

  const visible = () => options.filter((option) => !option.hidden);
  const mark = (option: HTMLElement | undefined, scroll = true) => {
    active?.setAttribute('aria-selected', 'false');
    active = option;
    if (!option) return input.removeAttribute('aria-activedescendant');
    option.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', option.id);
    if (scroll) option.scrollIntoView({ block: 'nearest' });
  };
  const filter = () => {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    for (const option of options) {
      const text = `${option.textContent} ${option.dataset.keys ?? ''}`.toLowerCase();
      option.hidden = !words.every((word) => text.includes(word));
    }
    for (const group of groups) group.hidden = !group.querySelector('[role="option"]:not([hidden])');
    const shown = visible();
    empty.hidden = shown.length > 0;
    mark(shown[0]);
  };
  const state = () => {
    // Show which theme and glass setting are in force.
    const theme = currentTheme();
    for (const option of options) {
      if (option.dataset.theme) option.toggleAttribute('data-current', option.dataset.theme === theme);
      if (option.dataset.run === 'glass') option.toggleAttribute('data-current', glassReduced());
    }
  };
  const open = () => {
    if (palette.open) return;
    input.value = '';
    state();
    filter();
    palette.showModal();
    input.focus();
  };
  const run = (option: HTMLElement) => {
    const { href, theme, run: action, copy } = option.dataset;
    if (theme) {
      setTheme(theme as Theme, option);
      return state();
    }
    if (action === 'glass') {
      setGlass(!glassReduced());
      return state();
    }
    palette.close();
    if (copy) return; // the copy handler in Toast.astro has already seen this click
    if (!href) return;
    if (option.dataset.download !== undefined) {
      const link = Object.assign(document.createElement('a'), { href, download: '' });
      link.click();
    } else if (/^https?:/.test(href)) window.open(href, '_blank', 'noopener');
    else window.location.assign(href);
  };

  input.addEventListener('input', filter);
  input.addEventListener('keydown', (event) => {
    const shown = visible();
    const at = active ? shown.indexOf(active) : -1;
    const move = (to: number) => {
      event.preventDefault();
      mark(shown[(to + shown.length) % shown.length]);
    };
    if (event.key === 'ArrowDown') move(at + 1);
    else if (event.key === 'ArrowUp') move(at - 1);
    else if (event.key === 'Home') move(0);
    else if (event.key === 'End') move(shown.length - 1);
    else if (event.key === 'Enter' && active) {
      event.preventDefault();
      active.click();
    }
  });
  options.forEach((option) => {
    option.addEventListener('click', () => run(option));
    option.addEventListener('pointermove', () => active !== option && mark(option, false));
  });
  // A click on the dimmed page behind the panel closes it.
  palette.addEventListener('click', (event) => event.target === palette && palette.close());
  document.querySelectorAll('[data-palette-open]').forEach((button) => button.addEventListener('click', open));
  document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
    event.preventDefault();
    palette.open ? palette.close() : open();
  });
  // Show the modifier this keyboard actually has.
  if (/Mac|iPhone|iPad/.test(navigator.platform)) {
    document.querySelectorAll('[data-mod]').forEach((key) => (key.textContent = '⌘'));
  }
}
