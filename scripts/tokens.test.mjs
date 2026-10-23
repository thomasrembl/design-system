import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build, flatten } from './build.mjs';

const lire = chemin => readFile(new URL(chemin, import.meta.url), 'utf8');
const tokens = JSON.parse(await lire('../tokens/tokens.json'));
const liste = flatten(tokens);
const valeur = Object.fromEntries(liste.map(t => [t.css, t.token.$value]));

// Noms déjà utilisés par le portfolio et Compta : ils ne doivent jamais disparaître.
const NOMS_DES_SITES = [
  '--bg', '--surface', '--surface-2', '--ink', '--muted', '--accent', '--on-accent', '--focus', '--key', '--rim',
  '--font', '--w-light', '--w-text', '--w-strong', '--step-small', '--step-ui', '--step-body', '--step-lead', '--step-head',
  '--sidebar', '--gutter', '--radius', '--gap', '--column', '--ease',
  '--amber', '--red', '--ok', '--error', '--line', '--line-soft', '--field-border', '--panel',
  '--chart-chaud', '--chart-froid', '--chart-neutre', '--page',
];

// Couples texte / fond qui doivent tenir le niveau AA (4,5 : 1).
const COUPLES = [
  ['--ink', '--bg'], ['--ink', '--surface'], ['--ink', '--surface-3'],
  ['--muted', '--bg'], ['--muted', '--surface'], ['--muted', '--surface-2'],
  ['--on-accent', '--accent'], ['--on-accent', '--accent-hover'],
  ['--amber', '--surface-2'], ['--red', '--surface-2'], ['--ok', '--surface-2'], ['--error', '--surface-2'],
  ['--paper-ink', '--paper'], ['--paper-muted', '--paper'], ['--paper-muted', '--paper-surface'],
  ['--ink', '--highlight'],
];

function luminance(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map(c => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contraste = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

test('css/tokens.css est à jour avec tokens/tokens.json', async () => {
  assert.equal(await lire('../css/tokens.css'), build(tokens));
});

test('chaque token a une valeur, un type et un nom CSS valide', () => {
  assert.ok(liste.length > 0);
  for (const t of liste) {
    assert.ok('$value' in t.token, t.chemin);
    assert.ok(t.token.$type, t.chemin);
    assert.match(t.css, /^--[a-z0-9-]+$/, t.chemin);
  }
});

test('chaque nom CSS est unique', () => {
  const vus = new Map();
  for (const t of liste) {
    assert.ok(!vus.has(t.css), `${t.css} défini deux fois : ${vus.get(t.css)} et ${t.chemin}`);
    vus.set(t.css, t.chemin);
  }
});

test('les noms utilisés par les sites existent toujours', () => {
  for (const nom of NOMS_DES_SITES) assert.ok(nom in valeur, `${nom} manque`);
});

test('les couples texte / fond passent le contraste AA', () => {
  for (const [texte, fond] of COUPLES) {
    const r = contraste(valeur[texte], valeur[fond]);
    assert.ok(r >= 4.5, `${texte} sur ${fond} : ${r.toFixed(2)} : 1`);
  }
});
