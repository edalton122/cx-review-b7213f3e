import { calcLine, pluralizeUnit, type WasteLine } from '../lib/waste';

// ---------- Keep the active tab visible on narrow screens ----------
document.querySelector<HTMLElement>('.tab[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });

// ---------- Side-by-side layout toggle ----------
const compare = document.querySelector<HTMLElement>('.compare');
document.querySelectorAll<HTMLButtonElement>('.seg button').forEach((btn, _, all) => {
  btn.addEventListener('click', () => {
    if (!compare) return;
    compare.dataset.view = btn.dataset.view;
    all.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
  });
});

// ---------- Waste worksheet ----------
const dataEl = document.getElementById('waste-data');
const cxGroup = document.getElementById('complexity');
if (dataEl && cxGroup) {
  const lines: WasteLine[] = JSON.parse(dataEl.textContent || '[]');
  const eq = document.getElementById('ws-eq');
  const fmt = (n: number) =>
    (Math.round(n * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const complexity = () =>
    parseFloat(cxGroup.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')?.dataset.value || '0') || 0;

  const recalc = () => {
    const add = complexity();
    lines.forEach((l, i) => {
      const row = document.querySelector<HTMLElement>(`tr[data-line="${l.id}"]`);
      const input = document.getElementById(`w-${l.id}`) as HTMLInputElement | null;
      if (!row || !input) return;
      const wastePct = Math.min(40, Math.max(0, parseFloat(input.value) || 0));
      const r = calcLine(l, add, wastePct);
      row.querySelector('[data-cell="total"]')!.textContent = `${r.totalWastePct}%`;
      row.querySelector('[data-cell="with"]')!.textContent = `${fmt(r.withWaste)} ${l.mu}`;
      const order = row.querySelector<HTMLElement>('[data-cell="order"]')!;
      const before = order.firstChild?.textContent;
      order.innerHTML = `${r.order}<small>${pluralizeUnit(l.unit, r.order)}</small>`;
      if (before !== String(r.order)) {
        order.classList.remove('bump');
        void order.offsetWidth;
        order.classList.add('bump');
      }
      if (i === 0 && eq) eq.textContent = `${l.measured} sq × ${100 + r.totalWastePct}% ÷ ⅓ sq per bundle = ${r.order} bundles`;
    });
  };
  document.getElementById('wsBody')?.addEventListener('input', recalc);
  cxGroup.querySelectorAll<HTMLButtonElement>('button').forEach((b, _, all) =>
    b.addEventListener('click', () => {
      all.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      recalc();
    }),
  );
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
  if (e.target === lb || (e.target as HTMLElement).closest('.lb-body')) lb.close();
});
