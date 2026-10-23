# Design system Thomas Remblier — plan

> Exécution : superpowers:executing-plans (natif). Spec : `docs/superpowers/specs/2026-10-23-design-system-design.md`.

**But :** publier `thomasrembl/design-system` (tokens, CSS, assets, plugin Claude), testé par `npm test` et `claude plugin validate`.

## Contraintes globales
- Node ≥ 20, aucune dépendance de build ; seule dépendance d'exécution : `@fontsource-variable/geist` ^5.3.0.
- Noms CSS existants conservés à l'identique (liste de la spec).
- Docs et commentaires en français ; noms de fichiers en kebab-case, sans accents.
- Rien de personnel (portrait, SIRET, adresse).

## Points à surveiller
1. Un nom de variable renommé casserait les deux sites → test 3 + liste figée dans la spec.
2. `tokens.css` modifié à la main puis écrasé → test 1 et en-tête « généré ».
3. Icônes à couleur figée → test 4 (`currentColor`).
4. Plugin non chargé par Claude Code → `claude plugin validate` sur la marketplace et sur le plugin.
5. Import de `index.css` sans bundler qui échoue sur la police → `fonts.css` séparé.

---

### Tâche 1 : amorce du dépôt
- `git init -b main`, `README.md` (titre + une phrase), `LICENSE` (MIT), `assets/LICENCE.md` ; commit sur `main` ; `gh repo create thomasrembl/design-system --public --source . --push` ; branche `dev`.

### Tâche 2 : tokens
- Test d'abord : `scripts/tokens.test.mjs` — (a) `build()` renvoie exactement le contenu de `css/tokens.css` ; (b) contrastes AA de la spec ; (c) chaque token porte `$value` et `$type`.
- `tokens/tokens.json` puis `scripts/build.mjs` (export `build(tokens) → string`, écrit `css/tokens.css` quand lancé en commande).
- Vérifier : `npm test` → tous verts.

### Tâche 3 : CSS
- Test d'abord : `scripts/css.test.mjs` — toute `var(--x)` de `css/*.css` est définie.
- `base.css` et `studio.css` repris des sites (sans les sélecteurs propres au portfolio) ; `components.css` depuis les règles extraites des deux sites, rebranchées sur les tokens ; `fonts.css`, `index.css`.

### Tâche 4 : assets
- Logos (copie de `marque/assets/logo`), icônes en `currentColor` (11, noms français des composants Figma), favicons SVG + PNG 32 / 180 / 512 exportés des cadres Figma `web/*`, signature HTML + `signature-tuile.png`.
- Test : `scripts/assets.test.mjs` — exports de `package.json` existants, SVG valides, icônes en `currentColor`.

### Tâche 5 : démo
- `demo/index.html` : tokens (pastilles, échelle typo, espacements) et chaque composant dans ses états. Contrôle visuel dans le navigateur (capture).

### Tâche 6 : plugin Claude
- `.claude-plugin/marketplace.json`, `plugins/marque/.claude-plugin/plugin.json`, `plugins/marque/skills/marque-thomas-remblier/SKILL.md` + `references/{marque,charte,web}.md`.
- Test : `scripts/plugin.test.mjs` (JSON, champs requis, frontmatter) ; `claude plugin validate .` et `claude plugin validate plugins/marque`.

### Tâche 7 : publication
- `README.md` complet, `CLAUDE.md` ; `npm test` vert ; commit et push `dev` ; PR `dev` → `main` ; arrêt jusqu'à la validation de Thomas.
