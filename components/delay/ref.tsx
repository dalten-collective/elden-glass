/**
 * Ref — the prose reference callout.
 *
 *   <Ref n={1} />               → [1]
 *   <Ref n={11} sub="a–i" />    → [11a–i]
 *   <Ref n={3} kind="roman" />  → [iii]
 *
 * Renders `<sup class="ref">…</sup>`. Styled by the `.delay sup.ref` rule
 * in globals.css — gold, JetBrains Mono, slight super-baseline raise.
 */

type RefKind = 'arabic' | 'roman';

type RefProps = {
  n: number | string;
  sub?: string;
  kind?: RefKind;
};

// Arabic → lowercase roman. Kept at module scope: the table is small and
// hoisting avoids re-allocating on every call.
const ROMAN_TABLE: Array<[number, string]> = [
  [1000, 'm'],
  [900, 'cm'],
  [500, 'd'],
  [400, 'cd'],
  [100, 'c'],
  [90, 'xc'],
  [50, 'l'],
  [40, 'xl'],
  [10, 'x'],
  [9, 'ix'],
  [5, 'v'],
  [4, 'iv'],
  [1, 'i'],
];

function toRoman(value: number | string): string {
  if (typeof value === 'string') return value;
  let n = value;
  let out = '';
  for (const [val, sym] of ROMAN_TABLE) {
    while (n >= val) {
      out += sym;
      n -= val;
    }
  }
  return out;
}

export function Ref({ n, sub, kind = 'arabic' }: RefProps) {
  const num = kind === 'roman' ? toRoman(n) : n;
  return (
    <sup className="ref">
      [{num}
      {sub ?? ''}]
    </sup>
  );
}
