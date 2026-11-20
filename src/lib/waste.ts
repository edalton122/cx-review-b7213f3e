export interface WasteLine {
  id: string;
  name: string;
  measured: number;
  mu: string;
  waste: number;
  coverage: number;
  unit: string;
  coverageLabel: string;
}

export interface WasteResult {
  totalWastePct: number;
  withWaste: number;
  order: number;
}

/**
 * Order = measured x (1 + (line waste % + complexity %) / 100) / coverage, rounded up.
 * The 1e-9 tolerance stops float noise (for example 98.00000000000001) from adding a whole extra unit.
 * This mirrors the planned Salesforce before-save Flow.
 */
export function calcLine(line: WasteLine, complexityPct: number, wastePct: number = line.waste): WasteResult {
  const safeWaste = Math.max(0, Number.isFinite(wastePct) ? wastePct : 0);
  const totalWastePct = safeWaste + complexityPct;
  const withWaste = line.measured * (1 + totalWastePct / 100);
  const order = Math.ceil(withWaste / line.coverage - 1e-9);
  return { totalWastePct, withWaste, order };
}

export function pluralizeUnit(unit: string, qty: number): string {
  return qty === 1 ? unit : `${unit}s`;
}
