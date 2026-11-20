import { describe, expect, it } from 'vitest';
import waste from '../data/waste.json';
import { calcLine, pluralizeUnit } from './waste';

const moderate = waste.complexity.find((c) => c.default)!.value;

describe('waste worksheet defaults (Moderate, +2%)', () => {
  const expected: Record<string, { total: number; withWaste: number; order: number }> = {
    shingles: { total: 14, withWaste: 32.4, order: 98 },
    underlay: { total: 7, withWaste: 30.4, order: 4 },
    icewater: { total: 10, withWaste: 204.6, order: 4 },
    starter: { total: 7, withWaste: 226.8, order: 2 },
    ridge: { total: 12, withWaste: 71.7, order: 3 },
    drip: { total: 7, withWaste: 226.8, order: 23 },
  };

  for (const line of waste.lines) {
    it(`${line.name}`, () => {
      const r = calcLine(line, moderate);
      const e = expected[line.id];
      expect(r.totalWastePct).toBe(e.total);
      expect(Math.round(r.withWaste * 10) / 10).toBe(e.withWaste);
      expect(r.order).toBe(e.order);
    });
  }
});

describe('behavior', () => {
  it('complexity changes quantities', () => {
    const shingles = waste.lines[0];
    expect(calcLine(shingles, 0).order).toBeLessThan(calcLine(shingles, 5).order);
  });
  it('an edited waste % flows through', () => {
    const shingles = waste.lines[0];
    expect(calcLine(shingles, 0, 20).order).toBe(Math.ceil((28.4 * 1.2) / (1 / 3) - 1e-9));
  });
  it('pluralizes', () => {
    expect(pluralizeUnit('roll', 1)).toBe('roll');
    expect(pluralizeUnit('roll', 4)).toBe('rolls');
  });
});
