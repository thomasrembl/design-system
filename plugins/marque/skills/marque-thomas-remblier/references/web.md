# Règles web et composants

## Installation
```bash
npm i github:thomasrembl/design-system   # installe aussi @fontsource-variable/geist
```
```css
@import "@thomasremblier/design-system/css/fonts.css";   /* avec un bundler (Astro, Vite) */
@import "@thomasremblier/design-system/css/index.css";   /* tokens + base + studio + composants */
```
- Fichiers séparés possibles : `css/tokens.css`, `base.css`, `studio.css`, `components.css`.
- Sans bundler : copier `node_modules/@thomasremblier/design-system/css/` dans le site et charger Geist par un `@font-face` auto-hébergé.
- Favicons : copier `assets/favicon/` dans `public/` ; `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`, `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`.
- Logos et icônes : `assets/logo/*.svg`, `assets/icones/*.svg` — à insérer en SVG inline pour profiter de `currentColor`.
- Mettre à jour : `npm update @thomasremblier/design-system` (ou réinstaller depuis GitHub).

## Contextes
| | Vitrine (défaut) | Outil (`data-contexte="outil"` sur `<html>`) | Papier (`.papier`) |
|---|---|---|---|
| Sidebar | 304 px | 272 px | — |
| Fond | studio animé (+ 3D R3F possible, `.has-3d`) | studio statique | `--paper` |
| Contenu | l'image d'abord | les données d'abord | documents |
| Registre | vouvoiement | tutoiement | vouvoiement |
| États colorés | non | oui | non |
| Filets | aucun | tableaux et KPI | séparateurs |

## Tokens utiles
Couleurs : `--bg --surface --surface-2 --surface-3 --ink --muted --accent --accent-hover --on-accent --focus --line --line-soft --field-border --field-hover --panel`, voiles et médias `--scrim` (derrière un tiroir) `--overlay-strong` (visionneuse plein écran) `--overlay-soft` (aperçu vidéo) `--chip` (pastille sur un média) `--bar` (barre mobile) `--video-bg` `--highlight` (« à compléter »), lumière `--key --rim` (triplets), états `--amber --red --error --ok`, papier `--paper*`.
Erreur en deux tons (Figma) : contour d'un champ et filet de notice en `--red`, texte du message en `--error`.
Typo : `--font --w-light --w-text --w-strong --step-small --step-ui --step-body --step-lead --step-kpi --step-title --step-head`.
Espaces : `--space-4 … --space-120` (4, 8, 12, 16, 24, 32, 48, 64, 80, 120), `--gutter` (16 → 32 px), `--gap` 10 px.
Formes : `--radius` 6 px, `--radius-pill`, `--shadow-panel` (seule ombre). Tailles : `--sidebar --sidebar-tool --column --legal --page --panel-width --button-height --button-height-sm --field-height`.
Mouvement : `--ease` `cubic-bezier(0.22, 1, 0.36, 1)`, `--dur-color` 200 ms, `--dur-button` 250 ms, `--dur-menu` 350 ms, `--dur-panel` 500 ms, `--dur-reveal` 900 ms, `--dur-zoom` 1 200 ms.
Un token manque ? L'ajouter dans `tokens/tokens.json` du dépôt `thomasrembl/design-system` (puis `npm run tokens:build`), jamais en dur dans un site.

## Composants (`css/components.css`)
```html
<!-- Boutons : une seule .btn--light par écran -->
<a class="btn btn--light" href="#contact">Me contacter</a>
<a class="btn btn--quiet" href="#projets">Voir les projets</a>
<button class="btn btn--ghost">Annuler</button>   <!-- + .btn--small, .btn--block, [disabled] -->
<button class="icon-button" aria-label="Fermer"><svg>…</svg></button>

<!-- Champ : libellé toujours visible au-dessus ; erreur = aria-invalid + .field__error -->
<label class="field"><span class="field__label">Adresse e-mail</span>
  <input class="field__control" type="email"><span class="field__hint">Je réponds sous 48 heures.</span></label>
<label class="check__label"><input class="check__box" type="checkbox"> J’accepte d’être recontacté</label>

<!-- Carte projet dans la grille vitrine (3 / 2 / 1 colonnes) ; aucun texte sur l'image -->
<div class="grid"><a class="card" href="/projets/flacon"><div class="card__media"><img src="…" alt="…"></div>
  <div class="card__meta"><span class="card__title">Flacon Aurore</span><span class="card__kind">Packshot · 2026</span></div></a></div>

<!-- Outil : badge (toujours un mot), notice, KPI, jauge, tableau -->
<span class="badge badge--rouge"><span class="badge__dot"></span>En retard</span>   <!-- --ok --ambre --rouge --neutre --muet -->
<div class="notice notice--ambre" role="status"><p class="notice__title">Facture en attente</p>
  <div class="notice__body"><p>Échéance dans 3 jours.</p></div></div>                <!-- --ok --erreur -->
<dl class="kpis"><div class="kpi kpi--ambre"><dt class="kpi__label">Cotisations</dt><dd class="kpi__value">4 020 €</dd></div></dl>
<div class="gauges"><div class="gauge"><div class="gauge__head"><span class="gauge__label">Plafond</span><span class="gauge__value">23 %</span></div>
  <div class="gauge__track"><div class="gauge__fill" style="width: 23%"></div></div></div></div>
<div class="table"><table>…<td class="is-right num">1 350,00 €</td>…</table></div>

<!-- Navigation de sidebar : page en cours = aria-current (encre + trait) -->
<aside class="sidebar no-scrollbar"><nav class="nav"><a href="/" aria-current="page">Tout</a><a href="/packshot">Packshot</a></nav></aside>

<!-- Tiroir (contact, édition) : dialog.showModal() -->
<dialog class="drawer"><div class="drawer__inner"><div class="drawer__head"><h2 class="drawer__title">Un produit à montrer ?</h2>
  <button class="drawer__close" aria-label="Fermer"><svg>…</svg></button></div>…</div></dialog>
```
Styles de texte : `.t-display .t-titre .t-accroche .t-corps .t-interface .t-bouton .t-petit .t-chiffre .t-muted`. Utilitaires : `.num`, `.visually-hidden`, `.skip`, `.no-scrollbar`, `.colonne`.
Rendu de référence : `demo/index.html` dans le dépôt GitHub.

## Mise en page
- Sidebar fixe (`.sidebar`, largeur `var(--sidebar)`), contenu décalé d'autant, marge `var(--gutter)` ; sous 1 023 px la sidebar devient un menu.
- Grille vitrine `.grid` : 3 colonnes ≥ 1 280 px, 2 de 640 à 1 279 px, 1 en dessous ; écart 28 px × 10 px.
- Points de rupture : 639 · 1 023 · 1 279 px (+ 479 px pour l'outil). Texte : 560 px max ; pages légales 680 px ; page outil 1 240 px.
- Rayon 6 px partout, pilule pour les badges, cercle pour les boutons ronds. Aucune bordure décorative.

## Mouvement
Une seule courbe (`--ease`), départ franc, arrivée douce, rien ne rebondit. Pression : échelle 0,97. Apparitions : fondu + 22 px en 900 ms, décalage de 80 ms par colonne. Survol de vignette : zoom × 1,035 en 1 200 ms. `prefers-reduced-motion` coupe tout (déjà dans `base.css`).

## Accessibilité
Contraste AA vérifié par les tests du dépôt ; focus visible 2 px `--focus` jamais supprimé ; cibles ≥ 44 px ; libellés de champs visibles ; `alt` sur chaque visuel produit ; `lang` déclaré (fr par défaut, en en miroir) ; lien d'évitement `.skip`.

## Avant de livrer
- [ ] Une seule action principale par écran, aucun texte sur les visuels, aucune couleur en dur.
- [ ] Textes au ton de la marque (`marque.md`), typographie française.
- [ ] Favicons et logo de la marque en place, métadonnées Open Graph (image 1 200 × 630 au style des assets).
- [ ] Contraste, focus et mouvement réduit vérifiés dans le navigateur.
