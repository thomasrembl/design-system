# Design system Thomas Remblier — spec

Date : 2026-10-23 · Statut : à valider par Thomas
Dépôt : `~/Documents/Claude/design-system` → `github.com/thomasrembl/design-system` (public)
Sources : `~/Documents/Claude/marque/brief.md` (marque, charte, règles web), CSS du portfolio (`Freelance-Website/src/styles/`) et de Compta (`Compta/src/styles/`), lus sans modification. Figma : https://www.figma.com/design/NX4WhM0e2jx6oObUMxQ5x0/Claude

## But
Un seul endroit où vivent les tokens, le CSS, les composants, les assets et les règles de la marque, installable dans un site en une commande, et branché sur Claude Code par un plugin : à la prochaine création de site, Claude part de la marque au lieu de la redécouvrir.

## Ce que le dépôt contient
| Chemin | Rôle |
|---|---|
| `tokens/tokens.json` | Source unique des tokens (format W3C Design Tokens : `$value`, `$type`, `$description`). |
| `scripts/build.mjs` | Génère `css/tokens.css` depuis `tokens.json`. `npm run tokens:build`. |
| `scripts/*.test.mjs` | Tests `node --test`. `npm test`. |
| `css/tokens.css` | Généré, ne pas modifier à la main. |
| `css/base.css` | Reset, typo Geist, focus, sélection, mouvement réduit, utilitaires (`.num`, `.visually-hidden`, `.skip`, `[hidden]`). |
| `css/studio.css` | Fond studio : halos key / rim / fill + grain, dérive lente, coupé en mouvement réduit. |
| `css/components.css` | Bouton, champ, carte projet, badge, notice, navigation, KPI, tableau, panneau latéral. |
| `css/fonts.css` | `@import '@fontsource-variable/geist'` (nécessite un bundler : Astro, Vite). |
| `css/index.css` | Importe tokens, base, studio, components (pas fonts). |
| `assets/` | Logos (tuile, monogramme, plein), 11 icônes, favicons (SVG + PNG 32, 180, 512), signature e-mail HTML. |
| `demo/index.html` | Page qui montre tous les composants et tokens (contrôle visuel). |
| `.claude-plugin/marketplace.json` | Marketplace `thomasremblier`. |
| `plugins/marque/` | Plugin Claude Code `marque` : un skill + ses références. |
| `CLAUDE.md`, `README.md`, `LICENSE`, `assets/LICENCE.md` | Règles de travail, mode d'emploi, licences. |

## Tokens et noms CSS
Les noms déjà utilisés par les deux sites restent identiques (`--bg`, `--surface`, `--surface-2`, `--ink`, `--muted`, `--accent`, `--on-accent`, `--focus`, `--key`, `--rim` en triplets RVB, `--font`, `--w-light|text|strong`, `--step-small|ui|body|lead|head`, `--sidebar`, `--gutter`, `--radius`, `--gap`, `--column`, `--ease`) : un site existant peut adopter le paquet sans renommer.
S'ajoutent les valeurs du brief et de Compta : `--surface-3`, `--accent-hover`, `--line`, `--line-soft`, `--field-border`, `--amber`, `--red`, `--error`, `--ok`, `--panel` (surface translucide des panneaux, 84 %), `--chart-chaud`, `--chart-froid`, `--chart-neutre` (séries des graphiques, noms de Compta, à la place de `--rim-deep`), `--field-hover`, `--scrim`, `--step-kpi`, groupe papier (`--paper`, `--paper-surface`, `--paper-ink`, `--paper-muted`, `--paper-line`), `--step-title`, espacements `--space-4` … `--space-120`, `--radius-pill`, tailles (`--sidebar-tool`, `--legal`, `--page`, `--panel-width`, `--button-height`, `--button-height-sm`, `--field-height`), durées (`--dur-color`, `--dur-button`, `--dur-menu`, `--dur-panel`, `--dur-reveal`, `--dur-zoom`), `--shadow-panel`.
Contexte outil : `[data-contexte="outil"]` sur `<html>` passe `--sidebar` à 272 px (règle du brief : vitrine 304, outil 272).

## Composants
Classes reprises des sites (mêmes noms quand ils existent, BEM sinon), liées uniquement aux variables ; chaque composant a son exemple HTML dans la démo et dans la référence du skill.

## Plugin Claude
- Installation, une fois par machine : `/plugin install marque --marketplace thomasrembl/design-system` (ou, avant Claude Code 2.1.275 : `/plugin marketplace add thomasrembl/design-system` puis `/plugin install marque@thomasremblier`).
- Skill `marque-thomas-remblier` : se déclenche pour tout site, page, composant, visuel ou texte de marque de Thomas. Il donne la marque en résumé, les règles non négociables, l'installation du paquet et renvoie à trois références : `marque.md` (plateforme, cibles, offres, ton de voix), `charte.md` (logo, couleurs, typo, lumière, icônes), `web.md` (contextes, tokens, composants et HTML, règles, accessibilité, mouvement).
- Vérifié par `claude plugin validate`.

## Public : ce qui n'y va pas
Ni portrait, ni SIRET, ni adresse. Le plugin d'export Figma et son relais restent dans `marque`.

## Licence
Code (CSS, scripts, tokens) : MIT. Logos, icônes et éléments de marque : tous droits réservés (`assets/LICENCE.md`).

## Tests (`npm test`)
1. `css/tokens.css` est identique à ce que produit `build.mjs` depuis `tokens.json`.
2. Contraste AA (≥ 4,5 : 1) : encre / noir, gris / noir, gris / surface 2, noir / blanc cassé, texte papier / papier, gris foncé / papier, rouge clair / surface.
3. Toute variable `var(--x)` utilisée dans `css/*.css` est définie dans `tokens.css` ou localement.
4. Les chemins exportés par `package.json` existent ; chaque SVG est valide et les icônes utilisent `currentColor`.
5. Manifestes du plugin et de la marketplace : JSON valide, champs requis, `SKILL.md` avec `name` et `description`.

## Git
Premier commit minimal sur `main` (README, licences), puis tout le travail sur `dev` et PR `dev` → `main`, validée par Thomas (règle de ses dépôts).

## Hors périmètre (suite possible)
Faire passer le portfolio et Compta sur ce paquet ; thème clair complet pour les sites.
