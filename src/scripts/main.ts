import { calcLine, pluralizeUnit, type WasteLine } from '../lib/waste';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Status filters ----------
const cards = Array.from(document.querySelectorAll<HTMLElement>('#cards .card'));
const filterBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('#filters button'));
const summaryBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('#summary button'));

function applyFilter(f: string) {
  cards.forEach((c) => {
    c.hidden = !(f === 'all' || c.dataset.status === f);
  });
  filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
  summaryBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
}
filterBtns.forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter!)));
summaryBtns.forEach((b) =>
  b.addEventListener('click', () => {
    const active = b.getAttribute('aria-pressed') === 'true';
    applyFilter(active ? 'all' : b.dataset.filter!);
    document.getElementById('musthaves')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }),
);

// ---------- Waste worksheet ----------
const dataEl = document.getElementById('waste-data');
const complexity = document.getElementById('complexity') as HTMLSelectElement | null;
if (dataEl && complexity) {
  const lines: WasteLine[] = JSON.parse(dataEl.textContent || '[]');
  const fmt = (n: number) =>
    (Math.round(n * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const recalc = () => {
    const add = parseFloat(complexity.value) || 0;
    lines.forEach((l) => {
      const row = document.querySelector<HTMLElement>(`tr[data-line="${l.id}"]`);
      const input = document.getElementById(`w-${l.id}`) as HTMLInputElement | null;
      if (!row || !input) return;
      const wastePct = Math.min(40, Math.max(0, parseFloat(input.value) || 0));
      const r = calcLine(l, add, wastePct);
      row.querySelector('[data-cell="total"]')!.textContent = `${r.totalWastePct}%`;
      row.querySelector('[data-cell="with"]')!.textContent = `${fmt(r.withWaste)} ${l.mu}`;
      row.querySelector('[data-cell="order"]')!.textContent = `${r.order} ${pluralizeUnit(l.unit, r.order)}`;
    });
  };
  document.getElementById('wsBody')?.addEventListener('input', recalc);
  complexity.addEventListener('change', recalc);
  recalc();
}

// ---------- Lightbox ----------
const lb = document.getElementById('lightbox') as HTMLDialogElement | null;
const lbImg = document.getElementById('lbImg') as HTMLImageElement | null;
const lbCap = document.getElementById('lbCap');
document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('.shot');
  if (btn && lb && lbImg && lbCap) {
    lbImg.src = btn.dataset.full || '';
    lbImg.alt = btn.dataset.caption || '';
    lbCap.textContent = btn.dataset.caption || '';
    lb.showModal();
  }
});
document.getElementById('lbClose')?.addEventListener('click', () => lb?.close());
lb?.addEventListener('click', (e) => {
  if (e.target === lb) lb.close();
});

// ---------- Scroll spy ----------
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.tabs a'));
const sections = links.map((a) => document.querySelector(a.getAttribute('href')!)).filter(Boolean) as Element[];
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${en.target.id}`));
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}

// ---------- Theme toggle ----------
const root = document.documentElement;
const stored = localStorage.getItem('theme');
if (stored) root.dataset.theme = stored;
document.getElementById('themeBtn')?.addEventListener('click', () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  const next = dark ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
});
