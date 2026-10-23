import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';

const racine = new URL('../', import.meta.url);
const lire = chemin => readFile(new URL(chemin, racine), 'utf8');
const existe = chemin => stat(new URL(chemin, racine)).then(() => true, () => false);
const svgs = async dossier => (await readdir(new URL(dossier, racine))).filter(f => f.endsWith('.svg'));

const ICONES = ['fermer', 'bas', 'glisser', 'retour', 'menu', 'lien-externe', 'lecture', 'ajouter', 'droite', 'haut', 'remonter'];

test('les chemins exportés par package.json existent', async () => {
  const pkg = JSON.parse(await lire('package.json'));
  for (const cible of Object.values(pkg.exports)) {
    const chemin = cible.replace(/^\.\//, '').replace(/\*$/, '');
    assert.ok(await existe(chemin || '.'), cible);
  }
  for (const dossier of pkg.files) assert.ok(await existe(dossier), dossier);
});

test('les trois logos sont là', async () => {
  assert.deepEqual((await svgs('assets/logo/')).sort(), ['monogramme.svg', 'plein.svg', 'tuile.svg']);
});

test('les 11 icônes sont là et suivent la couleur du texte', async () => {
  assert.deepEqual((await svgs('assets/icones/')).sort(), ICONES.map(n => n + '.svg').sort());
  for (const f of ICONES) {
    const svg = await lire(`assets/icones/${f}.svg`);
    assert.match(svg, /currentColor/, f);
    assert.doesNotMatch(svg, /#[0-9a-f]{3,8}\b/i, `${f} contient une couleur figée`);
    assert.match(svg, /viewBox="0 0 24 24"/, f);
  }
});

test('le monogramme et la version pleine suivent la couleur du texte', async () => {
  for (const f of ['monogramme', 'plein']) assert.match(await lire(`assets/logo/${f}.svg`), /fill="currentColor"/, f);
});

test('chaque SVG est un document SVG complet', async () => {
  for (const dossier of ['assets/logo/', 'assets/icones/', 'assets/favicon/']) {
    for (const f of await svgs(dossier)) {
      const svg = (await lire(dossier + f)).trim();
      assert.match(svg, /^<svg[\s>]/, dossier + f);
      assert.match(svg, /<\/svg>$/, dossier + f);
      assert.match(svg, /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, dossier + f);
    }
  }
});

test('favicons et signature sont là', async () => {
  for (const f of ['assets/favicon/favicon.svg', 'assets/favicon/favicon-32.png', 'assets/favicon/apple-touch-icon.png', 'assets/favicon/icon-512.png',
    'assets/signature/signature.html', 'assets/signature/signature-tuile.png']) assert.ok(await existe(f), f);
});
