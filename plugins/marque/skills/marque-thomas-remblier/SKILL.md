---
name: marque-thomas-remblier
description: Marque et design system de Thomas Remblier, artiste CGI produit. À utiliser pour tout site, page, landing, composant, interface, visuel, post, signature, document ou texte de Thomas Remblier (portfolio thomasremblier.fr, Compta, nouveaux projets) — create a website, page, UI or brand asset for Thomas Remblier — et dès qu'il parle de « ma marque », « ma charte », « mon design system » ou de ses couleurs, polices, logos.
---

# Marque Thomas Remblier

Thomas Remblier est artiste CGI produit, freelance : packshots, films 3D, web interactif (React Three Fiber) et outils Houdini (HDA). Promesse : **« L'image avant le produit. »** Cibles : marques, agences, studios de design, e-commerce.

La marque est **monochrome** (noir studio, encre, gris, blanc cassé). Sa seule couleur est la **lumière studio** : une principale chaude (key `#FFE2BE`) et un contour froid (rim `#C4D6FF`), jamais en aplat sur un composant. Police unique **Geist**, graisses 300 / 350 / 450, jamais au-dessus.

Avant de produire, lire la référence utile :
- `references/marque.md` — plateforme, cibles, offres, valeurs, **ton de voix** (tout texte).
- `references/charte.md` — logo, couleurs, typographie, lumière, icônes, applications (visuels, documents).
- `references/web.md` — installation, contextes, tokens, **composants et leur HTML**, mise en page, mouvement, accessibilité (sites et interfaces).

## Règles non négociables
1. Une seule action principale (`.btn--light`, blanc cassé) par écran.
2. Aucune bordure décorative : on sépare par la surface ou l'espace.
3. La lumière studio éclaire (halos, reflets, rendus, graphiques), elle ne remplit jamais un composant.
4. Une couleur d'état n'est jamais seule : toujours un mot (badge, notice).
5. Aucun texte posé sur un visuel produit.
6. Contraste AA (4,5 : 1) et focus visible (contour 2 px blanc cassé) partout.
7. Chiffres tabulaires (`.num`), alignés à droite dans les tableaux.
8. Ton : « je » jamais « nous », vouvoiement côté clients, tutoiement dans les outils perso ; phrases courtes, concrètes, sans point d'exclamation ni superlatif ; typographie française (espaces insécables, ’, « »).

## Démarrer un site
```bash
npm i github:thomasrembl/design-system
```
```css
/* styles globaux du site (Astro, Vite…) */
@import "@thomasremblier/design-system/css/fonts.css"; /* Geist auto-hébergée */
@import "@thomasremblier/design-system/css/index.css"; /* tokens, base, studio, composants */
```
Sans bundler : copier `css/` et charger Geist autrement (voir `references/web.md`).

Squelette de page vitrine :
```html
<html lang="fr">
<body>
  <div class="studio" aria-hidden="true">
    <div class="studio__spot studio__spot--key"></div><div class="studio__spot studio__spot--rim"></div>
    <div class="studio__spot studio__spot--fill"></div><div class="studio__grain"></div>
  </div>
  <a class="skip" href="#contenu">Aller au contenu</a>
  <aside class="sidebar no-scrollbar">…logo, <nav class="nav">…</nav>…</aside>
  <main id="contenu">…</main>
</body>
</html>
```
Outil (tableaux, données) : `<html lang="fr" data-contexte="outil">` → sidebar 272 px, couleurs d'état, filets. Document imprimé : classe `.papier`.

## Ce que le paquet fournit
- `css/` : `tokens.css` (généré, ne pas modifier), `base.css`, `studio.css`, `components.css`, `fonts.css`, `index.css`.
- `tokens/tokens.json` : source des tokens (W3C Design Tokens).
- `assets/` : `logo/` (tuile, monogramme et plein en `currentColor`), `icones/` (11 icônes 24 px, trait 1,6, `currentColor`), `favicon/` (SVG, PNG 32 / 180 / 512), `signature/` (signature e-mail HTML).
- Dans le dépôt GitHub (pas dans le paquet) : `demo/index.html`, tous les composants et leur rendu attendu.

## Ne pas faire
- Inventer une couleur d'accent, une deuxième police, des capitales de mise en forme, des ombres décoratives, des dégradés colorés sur les composants.
- Utiliser « VFX » pour décrire Thomas (il fait du CGI produit).
- Écrire de couleur en dur : passer par les variables (`var(--ink)`, `var(--surface-2)`…). Si un token manque, l'ajouter dans `tokens/tokens.json` du dépôt `thomasrembl/design-system`, pas dans le site.
- Mettre des données personnelles (adresse, SIRET, portrait) dans un dépôt public.

Figma de la marque (charte, bibliothèque, assets) : https://www.figma.com/design/NX4WhM0e2jx6oObUMxQ5x0/Claude
