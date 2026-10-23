// Génère css/tokens.css depuis tokens/tokens.json. Lancé en commande : node scripts/build.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const EXT = 'fr.thomasremblier';
const estToken = n => n && typeof n === 'object' && '$value' in n;

/** Liste à plat : [{ chemin, css, token, groupe }] dans l'ordre du fichier. */
export function flatten(noeud, chemin = [], groupe = null) {
  const sortie = [];
  for (const [cle, val] of Object.entries(noeud)) {
    if (cle.startsWith('$') || !val || typeof val !== 'object') continue;
    if (estToken(val)) sortie.push({ chemin: [...chemin, cle].join('.'), css: '--' + cle, token: val, groupe });
    else sortie.push(...flatten(val, [...chemin, cle], val.$description || groupe));
  }
  return sortie;
}

const hexVersTriplet = hex => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(' ');
};

/** Valeur CSS d'un token selon son type. */
export function valeurCss(t) {
  const v = t.$value;
  if (t.$extensions?.[EXT]?.format === 'rgb-triplet') return hexVersTriplet(v);
  if (t.$type === 'cubicBezier') return `cubic-bezier(${v.join(', ')})`;
  if (t.$type === 'fontFamily') return v.map(f => (/\s/.test(f) ? `"${f}"` : f)).join(', ');
  return String(v);
}

export function build(tokens) {
  const lignes = ['/* Généré par scripts/build.mjs depuis tokens/tokens.json — ne pas modifier à la main. */', ':root {'];
  let groupe;
  for (const t of flatten(tokens)) {
    if (t.groupe !== groupe) {
      if (groupe !== undefined) lignes.push('');
      lignes.push(`  /* ${t.groupe} */`);
      groupe = t.groupe;
    }
    const note = t.token.$description ? ` /* ${t.token.$description} */` : '';
    lignes.push(`  ${t.css}: ${valeurCss(t.token)};${note}`);
  }
  lignes.push('}', '');
  return lignes.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const src = new URL('../tokens/tokens.json', import.meta.url);
  const dest = new URL('../css/tokens.css', import.meta.url);
  const tokens = JSON.parse(await readFile(src, 'utf8'));
  await writeFile(dest, build(tokens));
  console.log(`css/tokens.css : ${flatten(tokens).length} tokens`);
}
