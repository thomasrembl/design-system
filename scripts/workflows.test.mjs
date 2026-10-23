import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const lire = chemin => readFile(new URL(chemin, import.meta.url), 'utf8');
const wf = await lire('../.github/workflows/update-site.yml');
// Découpe le workflow en jobs (clés à deux espaces sous « jobs: »).
const jobs = Object.fromEntries(wf.split(/\njobs:\n/)[1].split(/\n(?=  [a-z-]+:\n)/).map(b => [b.trim().split(':')[0], b]));

test('le workflow de mise à jour a ses trois jobs', () => {
  assert.deepEqual(Object.keys(jobs), ['preparer', 'verifier', 'publier']);
});

test('la commande du site ne tourne que dans le job en lecture seule', () => {
  assert.match(jobs.verifier, /inputs\.verify/);
  assert.doesNotMatch(jobs.preparer + jobs.publier, /inputs\.verify/);
  assert.match(jobs.verifier, /permissions:\n\s+contents: read\n/);
  assert.doesNotMatch(jobs.verifier + jobs.preparer, /: write/);
  assert.doesNotMatch(jobs.verifier, /GH_TOKEN|github\.token/);
});

test('les jobs qui exécutent du code ne gardent pas les identifiants git', () => {
  for (const j of ['preparer', 'verifier']) assert.match(jobs[j], /persist-credentials: false/, j);
});

test('le job qui écrit n’exécute ni npm ni le code du paquet', () => {
  assert.doesNotMatch(jobs.publier, /\bnpm |\bnpx |\bnode /);
});

test('la résolution n’exécute aucun script et une PR existante arrête tout', () => {
  assert.match(jobs.preparer, /--ignore-scripts/);
  assert.match(jobs.preparer, /--package-lock-only/);
  assert.match(jobs.preparer, /gh pr list .*--state all/);
  assert.match(jobs.preparer, /maxSatisfying/);
});

test('toutes les actions sont épinglées sur un SHA', async () => {
  for (const f of ['ci.yml', 'release.yml', 'update-site.yml']) {
    const contenu = await lire('../.github/workflows/' + f);
    for (const [, ref] of contenu.matchAll(/uses: [^@\s]+@(\S+)/g)) assert.match(ref, /^[0-9a-f]{40}$/, `${f} : @${ref}`);
  }
});

test('le paquet n’a pas de script qui ferait préparer la dépendance git', async () => {
  const pkg = JSON.parse(await lire('../package.json'));
  for (const s of ['build', 'prepare', 'prepack', 'preinstall', 'install', 'postinstall']) assert.ok(!(s in pkg.scripts), s);
});
