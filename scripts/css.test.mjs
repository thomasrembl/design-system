import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const dossier = new URL('../css/', import.meta.url);
const fichiers = (await readdir(dossier)).filter(f => f.endsWith('.css'));
const contenu = Object.fromEntries(await Promise.all(fichiers.map(async f => [f, await readFile(new URL(f, dossier), 'utf8')])));
const sansCommentaires = css => css.replace(/\/\*[\s\S]*?\*\//g, '');

// Variables définies n'importe où dans css/ (tokens.css ou définitions locales d'un composant).
const definies = new Set(Object.values(contenu).flatMap(css => [...sansCommentaires(css).matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m => m[1])));

test('les fichiers CSS attendus existent', () => {
  for (const f of ['tokens.css', 'base.css', 'studio.css', 'components.css', 'fonts.css', 'index.css']) assert.ok(f in contenu, f);
});

test('toute variable utilisée est définie', () => {
  for (const [f, css] of Object.entries(contenu)) {
    for (const [, nom] of sansCommentaires(css).matchAll(/var\((--[a-z0-9-]+)/g)) {
      assert.ok(definies.has(nom), `${f} utilise ${nom}, défini nulle part`);
    }
  }
});

test('aucune couleur en dur dans les composants', () => {
  const css = sansCommentaires(contenu['components.css']).replace(/url\("data:[^"]*"\)/g, '');
  const dures = css.match(/#[0-9a-f]{3,8}\b|rgba?\(\s*\d/gi) || [];
  assert.deepEqual(dures, [], 'utiliser les tokens : ' + dures.join(', '));
});

test('index.css importe la base sans la police', () => {
  const imports = [...contenu['index.css'].matchAll(/@import\s+["']\.\/([^"']+)["']/g)].map(m => m[1]);
  assert.deepEqual(imports, ['tokens.css', 'base.css', 'studio.css', 'components.css']);
});
