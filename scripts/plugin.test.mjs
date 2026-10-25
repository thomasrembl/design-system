import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const racine = new URL('../', import.meta.url);
const lire = chemin => readFile(new URL(chemin, racine), 'utf8');
const existe = chemin => stat(new URL(chemin, racine)).then(() => true, () => false);
const SKILL = 'plugins/marque/skills/marque-thomas-remblier/';

test('la marketplace liste le plugin marque', async () => {
  const m = JSON.parse(await lire('.claude-plugin/marketplace.json'));
  assert.equal(m.name, 'thomasremblier');
  assert.ok(m.owner?.name);
  const p = m.plugins.find(x => x.name === 'marque');
  assert.ok(p, 'plugin marque absent');
  assert.equal(p.source, './plugins/marque');
  assert.ok(await existe('plugins/marque/.claude-plugin/plugin.json'));
});

test('le manifeste du plugin est complet et cohérent avec la marketplace', async () => {
  const pl = JSON.parse(await lire('plugins/marque/.claude-plugin/plugin.json'));
  const m = JSON.parse(await lire('.claude-plugin/marketplace.json'));
  assert.equal(pl.name, 'marque');
  assert.match(pl.version, /^\d+\.\d+\.\d+$/);
  assert.ok(pl.description);
  assert.equal(m.plugins.find(x => x.name === 'marque').version, pl.version);
});

test('le paquet et le plugin portent le même numéro de version', async () => {
  const pkg = JSON.parse(await lire('package.json'));
  const pl = JSON.parse(await lire('plugins/marque/.claude-plugin/plugin.json'));
  assert.equal(pkg.version, pl.version);
});

test('le skill a son nom, une description et ses références', async () => {
  const md = await lire(SKILL + 'SKILL.md');
  const entete = md.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(entete, 'en-tête YAML manquant');
  assert.match(entete[1], /^name: marque-thomas-remblier$/m);
  assert.match(entete[1], /^description: .{80,}$/m);
  for (const ref of ['marque.md', 'charte.md', 'web.md']) {
    assert.ok(await existe(SKILL + 'references/' + ref), ref);
    assert.ok(md.includes('references/' + ref), `SKILL.md ne renvoie pas à ${ref}`);
  }
});

test('rien de personnel dans le plugin', async () => {
  for (const f of ['SKILL.md', 'references/marque.md', 'references/charte.md', 'references/web.md']) {
    const texte = await lire(SKILL + f);
    // Données réelles (numéro SIRET, adresse), pas le simple mot « SIRET » des consignes.
    assert.doesNotMatch(texte, /\b\d{3} ?\d{3} ?\d{3} ?\d{5}\b|rue de Ponthieu|75008/i, f);
  }
});
