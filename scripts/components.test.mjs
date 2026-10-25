import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const racine = new URL('../', import.meta.url);
const lire = chemin => readFile(new URL(chemin, racine), 'utf8');
const sansCommentaires = css => css.replace(/\/\*[\s\S]*?\*\//g, '');

const css = await lire('css/components.css');
const demo = await lire('demo/index.html');
const web = await lire('plugins/marque/skills/marque-thomas-remblier/references/web.md');
const fiche = await lire('docs/composants-v0.2.md');

// Composants du hub (v0.2.0) : carte d'action à confirmer, liste des demandes, modale, panneau, navigation mobile.
const COMPOSANTS = ['action-card', 'inquiries', 'modal', 'panel', 'mobile-nav'];
// Le HTML de la fiche : c'est lui que les sites recopient.
const exemples = [...fiche.matchAll(/```html\n([\s\S]*?)```/g)].map(m => m[1]);

test('chaque composant du hub a son CSS, son exemple commenté, sa démo, sa place dans web.md et dans la fiche', () => {
  const commentaires = (css.match(/\/\*[\s\S]*?\*\//g) || []).join('\n');
  for (const c of COMPOSANTS) {
    const classe = new RegExp(`class="${c}\\b`);
    assert.match(sansCommentaires(css), new RegExp(`\\.${c}\\b`), `components.css : aucune règle pour .${c}`);
    assert.match(commentaires, classe, `components.css : .${c} sans exemple HTML commenté`);
    assert.match(demo, classe, `demo/index.html : .${c} absent`);
    assert.match(web, classe, `web.md : .${c} absent`);
    assert.match(fiche, classe, `docs/composants-v0.2.md : .${c} absent`);
  }
});

test('le HTML de la fiche passe une CSP stricte : ni script, ni style en ligne, ni gestionnaire on…', () => {
  assert.ok(exemples.length >= COMPOSANTS.length, 'docs/composants-v0.2.md : un exemple HTML par composant au moins');
  for (const html of exemples) {
    assert.doesNotMatch(html, /<script|\sstyle="|\son[a-z]+="/i, html.slice(0, 80));
  }
});

test('une seule action principale (.btn--light) par exemple', () => {
  for (const html of exemples) {
    assert.ok((html.match(/btn--light/g) || []).length <= 1, html.slice(0, 80));
  }
});

test('chaque badge porte un mot', () => {
  for (const [nom, html] of [['fiche', exemples.join('\n')], ['démo', demo]]) {
    const badges = html.match(/<span class="badge[ "]/g) || [];
    const remplis = [...html.matchAll(/<span class="badge[^"]*">(?:<span class="badge__dot"[^>]*><\/span>)?([^<]*)<\/span>/g)];
    assert.equal(remplis.length, badges.length, `${nom} : un badge n'a pas la forme attendue`);
    for (const [badge, mot] of remplis) assert.ok(mot.trim(), `${nom} : badge sans mot : ${badge}`);
  }
});

test('les dates et durées des exemples sont en chiffres tabulaires (.num)', () => {
  for (const html of exemples) {
    for (const [balise] of html.matchAll(/<time\b[^>]*>/g)) assert.match(balise, /class="[^"]*\bnum\b/, balise);
  }
});

test('les composants du hub coupent leur mouvement sous prefers-reduced-motion', () => {
  const propre = sansCommentaires(css);
  const bloc = propre.match(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/);
  assert.ok(bloc, 'components.css : bloc prefers-reduced-motion manquant');
  // Bouge : une animation, ou une transition de position, d'opacité ou de visibilité (un simple fondu de couleur n'est pas un mouvement).
  const bouge = /\banimation\s*:|\btransition\s*:\s*(?:[\d.]+m?s|[^;]*\b(?:transform|translate|scale|rotate|opacity|visibility|all)\b)/;
  const normal = texte => texte.replace(/\s+/g, ' ').trim();
  for (const [, selecteur, corps] of propre.replace(bloc[0], '').matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!bouge.test(corps) || !COMPOSANTS.some(c => selecteur.includes('.' + c))) continue;
    assert.ok(normal(bloc[1]).includes(normal(selecteur) + ' {'), `${normal(selecteur)} bouge encore sous prefers-reduced-motion`);
  }
});

test('aucune classe nouvelle ne reprend un nom déjà pris par le menu des sites', () => {
  // Le portfolio et Compta ont leurs propres .topbar, .burger et .menu : les redéfinir ici changerait leur menu à la mise à jour.
  assert.doesNotMatch(sansCommentaires(css), /\.(topbar|burger|menu)\b/);
});
