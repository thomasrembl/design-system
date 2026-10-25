# Composants du hub · design system v0.2.0

24 octobre 2026. Cinq composants pour le hub de Compta : le panneau générique, la liste des demandes, la carte d’action à confirmer, la modale de confirmation et la navigation mobile. Ils viennent de la spec du hub V1 (section 7.7), réduite à ces cinq composants par la spec de la partie 2 (section 10). Le fil de discussion, la zone de saisie, le bouton micro et le bouton « Écouter » sont retirés : ils n’existent pas ici.

Cette fiche sert de référence au plan 2b du hub. Pour chaque composant, elle donne ses classes, ses attributs d’état et son HTML minimal. Le CSS est dans [`css/components.css`](../css/components.css), le rendu dans [`demo/index.html`](../demo/index.html), la règle de marque dans la fiche [`web.md`](../plugins/marque/skills/marque-thomas-remblier/references/web.md) du skill.

## Règles communes

- **HTML et CSS seulement.** Ni script, ni style en ligne, ni attribut `on…=` : tout passe sous la CSP stricte de Compta (`default-src 'self'`). Le comportement (ouvrir, fermer, minuter, rediriger) est codé dans le site.
- **États** : une classe (`.action-card--annulee`) ou un attribut (`open`, `aria-busy`, `aria-expanded`, `aria-current`).
- **Tokens seulement**, avec `data-contexte="outil"` sur `<html>` pour les couleurs d’état. Deux tokens s’ajoutent : `--modal-width` (480 px) et `--bar-height` (68 px).
- **Une seule `.btn--light` par écran.** La carte et la modale en portent une : la page qui les montre n’en a pas d’autre visible.
- **Un badge porte toujours un mot.** Dates et chiffres en `.num` (`<time class="num">`).
- **Aucune bordure décorative.** Le panneau et la carte se détachent du fond par la surface `--panel`. Seuls restent les filets `--line-soft` entre les lignes d’une liste, comme dans les tableaux.
- **Mouvement** : la modale monte de 12 px, le menu descend de 8 px. Tout est coupé sous `prefers-reduced-motion`, dans `components.css` comme dans `base.css`.
- **Accessibilité** : contraste AA (vérifié par `npm test`), contour de focus 2 px de `base.css` jamais retiré, cibles de 44 px au téléphone.

## 1. Panneau générique

Surface des blocs d’une fiche client, d’un projet ou d’une analyse. Le titre du bloc est posé au-dessus de la surface, comme dans tout Compta.

| Classe | Rôle |
|---|---|
| `.panel-group` | Le bloc : titre puis panneau, 14 px d’écart. Le `<section>` qui porte `aria-labelledby`. |
| `.panel-group__head` | La ligne du titre : titre à gauche, précision ou lien à droite. |
| `.panel-group__title` | Le titre (`<h2>`). Un compteur s’écrit en `<sup class="num" aria-hidden="true">`, suivi d’un texte masqué. |
| `.panel-group__aside` | Une précision grise à droite du titre. |
| `.panel-group__link` | Un lien à droite du titre (« Toutes les demandes »). |
| `.panel` | La surface (`--panel`, rayon 6 px, sans bordure ni marge intérieure). Une liste posée dedans gère sa propre marge. |
| `.panel--pad` | Marge intérieure de 20 × 22 px (18 × 16 px au téléphone), pour un texte ou un formulaire. |
| `.panel__empty`, `.panel__empty-title`, `.panel__empty-text` | État vide : « Rien pour l’instant », puis une précision facultative. |

| État | Comment |
|---|---|
| Normal | Le contenu dans `.panel`. |
| Vide | `.panel__empty` à la place du contenu. |

```html
<section class="panel-group" aria-labelledby="bloc-notes">
  <div class="panel-group__head">
    <h2 class="panel-group__title" id="bloc-notes">Notes<sup class="num" aria-hidden="true">2</sup><span class="visually-hidden">, 2 notes</span></h2>
    <a class="panel-group__link" href="/clients/12#notes">Toutes les notes</a>
  </div>
  <div class="panel panel--pad">
    <p>Préfère les rendus sur fond sombre. Rappeler en novembre pour la gamme de fêtes.</p>
  </div>
</section>

<!-- Vide -->
<section class="panel-group" aria-labelledby="bloc-documents">
  <div class="panel-group__head"><h2 class="panel-group__title" id="bloc-documents">Documents</h2></div>
  <div class="panel">
    <div class="panel__empty">
      <p class="panel__empty-title">Rien pour l’instant</p>
      <p class="panel__empty-text">Les devis et les factures des projets arrivent ici.</p>
    </div>
  </div>
</section>
```

## 2. Liste des demandes

Les demandes de la page `/demandes`, en cinq groupes. Chaque groupe est un **panneau** (`.panel-group` puis `.panel`) qui porte la liste. Les noms de classes sont ceux de Compta.

| Classe | Rôle |
|---|---|
| `.inquiries` | La liste (`<ul aria-label="…">`, le nom du groupe). |
| `.inquiry` | Une demande (`<li>`), séparée de la précédente par un filet `--line-soft`. |
| `.inquiry__who`, `.inquiry__name`, `.inquiry__sub` | L’expéditeur ou la société, puis le canal, l’adresse et le sujet en gris. |
| `.inquiry__facts` | `<dl>` : type, langue, date de réception (`<time class="num">`). |
| `.inquiry__status` | Le statut, un `.badge`. |
| `.inquiry__actions` | Les boutons de la ligne (`.btn--small`, chacun dans son `<form method="post">`). |
| `.inquiry__attach` | Choix d’un client ou d’un projet (`.field` et bouton), sur toute la largeur. |
| `.inquiry__text`, `.inquiry__body` | Le texte du mail, replié dans un `<details>`, en texte seul. |

| Groupe | Statut affiché |
|---|---|
| À traiter | Analysée : `.badge--ok` |
| À vérifier | À vérifier : `.badge--ambre` |
| À rattacher | À rattacher : `.badge--neutre` |
| En échec | En échec : `.badge--rouge` |
| Écartés (14 jours) | Écartée : `.badge--muet` |

Un groupe vide montre l’état vide du panneau. Mise en page : 4 colonnes sur ordinateur ; à partir de 1 023 px, le nom et le statut sur la première ligne, puis les faits et les boutons ; à partir de 639 px, les faits sur 2 colonnes. Tout ce qui vient d’un mail ou du formulaire s’affiche en texte, jamais en lien cliquable.

```html
<section class="panel-group" aria-labelledby="a-verifier">
  <div class="panel-group__head">
    <h2 class="panel-group__title" id="a-verifier">À vérifier<sup class="num" aria-hidden="true">1</sup><span class="visually-hidden">, 1 demande</span></h2>
  </div>
  <div class="panel">
    <ul class="inquiries" aria-label="À vérifier">
      <li class="inquiry">
        <div class="inquiry__who">
          <span class="inquiry__name">Atelier Aube</span>
          <span class="inquiry__sub">Mail · Flacon parfum, trois vues</span>
        </div>
        <dl class="inquiry__facts">
          <div><dt>Type</dt><dd>Packshot</dd></div>
          <div><dt>Langue</dt><dd>Anglais</dd></div>
          <div><dt>Reçue le</dt><dd><time class="num" datetime="2026-10-24">24/10/2026</time></dd></div>
        </dl>
        <div class="inquiry__status"><span class="badge badge--ambre"><span class="badge__dot" aria-hidden="true"></span>À vérifier</span></div>
        <div class="inquiry__actions">
          <form method="post" action="/demandes/analyser"><button class="btn btn--quiet btn--small" type="submit">Analyser</button></form>
          <form method="post" action="/demandes/rejeter"><button class="btn btn--ghost btn--small" type="submit">Rejeter</button></form>
        </div>
        <div class="inquiry__attach">
          <form method="post" action="/demandes/choisir-client">
            <label class="field"><span class="field__label">Client</span><select class="field__control" name="clientId"><option value="">Choisis un client</option></select></label>
            <button class="btn btn--quiet btn--small" type="submit">Choisir le client<span class="visually-hidden"> (demande d’Atelier Aube)</span></button>
          </form>
        </div>
        <details class="inquiry__text">
          <summary>Lire le texte</summary>
          <p class="inquiry__body">Bonjour, nous cherchons trois vues d’un flacon pour notre lancement de mars.</p>
        </details>
      </li>
    </ul>
  </div>
</section>
```

## 3. Carte d’action à confirmer

Elle montre ce qu’une action va faire et attend la décision de Thomas. Premier usage : supprimer ou anonymiser un client depuis sa fiche (spec de la partie 2, section 6). C’est le serveur qui exécute l’action, jamais la carte. La carte est un `<form method="post">` : « Confirmer » envoie le mode choisi.

| Classe | Rôle |
|---|---|
| `.action-card` | La carte (surface `--panel`, 720 px au plus). |
| `.action-card__head`, `.action-card__intro` | Titre et phrase d’introduction à gauche, badge d’état à droite. |
| `.action-card__title`, `.action-card__lead` | Le titre (`<h2>`) et une phrase grise. |
| `.action-card__lists` | Les listes, côte à côte dès que la place le permet. |
| `.action-card__list` | Une liste : `<h3 class="action-card__label">` puis `<ul>`. `--wide` : sur toute la largeur. |
| `.action-card__why` | La raison d’un élément gardé ou hors de portée, en gris sous l’élément. |
| `.action-card__mode` | `<fieldset>` du choix du mode : `<legend class="action-card__label">`, puis des boutons radio `.check` / `.check__box`, chacun avec son `.field__hint`. |
| `.action-card__due` | L’échéance (« Expire le … ») ; dans un état final, la date du résultat (« Annulée le … »). |
| `.action-card__actions` | « Confirmer » (`.btn--light`) puis « Annuler » (`.btn--quiet`). Pleine largeur sous 480 px. |

| État | Classe | Badge | Ce qui change |
|---|---|---|---|
| Proposée | `.action-card` | `.badge--ambre` « À confirmer » | Choix du mode, échéance, deux boutons. |
| 2e facteur demandé | `.action-card--facteur` | `.badge--ambre` « 2e facteur demandé » | Un `.notice.notice--ambre` explique ; « Confirmer » mène à `/connexion/confirmer`. |
| Confirmée | `.action-card--confirmee` | `.badge--ok` « Confirmée » | Sans boutons, `<fieldset disabled>`, détail en gris, date du résultat. |
| Annulée | `.action-card--annulee` | `.badge--muet` « Annulée » | Idem. |
| Expirée | `.action-card--expiree` | `.badge--muet` « Expirée » | Idem (24 heures sans réponse). |

Les mots des badges sont ceux que je recommande ; Compta peut en choisir d’autres, mais toujours un mot par état.

```html
<form class="action-card" method="post" action="/clients/12/supprimer" aria-labelledby="carte-titre">
  <header class="action-card__head">
    <div class="action-card__intro">
      <h2 class="action-card__title" id="carte-titre">Supprimer Atelier Aube</h2>
      <p class="action-card__lead">Le client et tout ce qui le concerne quittent le hub. Les pièces comptables restent.</p>
    </div>
    <span class="badge badge--ambre"><span class="badge__dot" aria-hidden="true"></span>À confirmer</span>
  </header>
  <div class="action-card__lists">
    <section class="action-card__list">
      <h3 class="action-card__label">Sera effacé</h3>
      <ul>
        <li>Les 3 contacts et les 12 notes</li>
        <li>Les 2 demandes et leurs analyses</li>
      </ul>
    </section>
    <section class="action-card__list">
      <h3 class="action-card__label">Sera gardé</h3>
      <ul>
        <li>Les recettes et les documents comptables<span class="action-card__why">Obligation comptable : le nom, l’adresse et le SIREN restent sur les factures.</span></li>
      </ul>
    </section>
    <section class="action-card__list action-card__list--wide">
      <h3 class="action-card__label">Reste hors de portée</h3>
      <ul>
        <li>Le projet Claude « Atelier Aube · Flacon »<span class="action-card__why">À supprimer à la main dans l’appli Claude, avec ses discussions.</span></li>
        <li>Les sauvegardes<span class="action-card__why">Jusqu’à leur remplacement.</span></li>
        <li>Les données de l’API chez Anthropic<span class="action-card__why">Selon leur durée de conservation.</span></li>
        <li>Les mails d’origine<span class="action-card__why">Dans la boîte OVH.</span></li>
      </ul>
    </section>
  </div>
  <fieldset class="action-card__mode">
    <legend class="action-card__label">Mode</legend>
    <div class="check">
      <label class="check__label"><input class="check__box" type="radio" name="mode" value="effacer" checked> Effacer</label>
      <span class="field__hint">La fiche et ses projets disparaissent.</span>
    </div>
    <div class="check">
      <label class="check__label"><input class="check__box" type="radio" name="mode" value="anonymiser"> Anonymiser</label>
      <span class="field__hint">La fiche devient « Client anonymisé n° 12 » ; les projets gardent leur type, leurs dates et leurs prix.</span>
    </div>
  </fieldset>
  <p class="action-card__due">Expire le <time class="num" datetime="2026-10-25T18:40">25/10/2026 à 18:40</time></p>
  <div class="action-card__actions">
    <button class="btn btn--light" type="submit">Confirmer</button>
    <button class="btn btn--quiet" type="submit" name="decision" value="annuler" formnovalidate>Annuler</button>
  </div>
</form>
```

Les autres états ne changent que la classe de la carte, le badge, le bas de la carte et l’état du `<fieldset>` :

```html
<!-- 2e facteur demandé -->
<form class="action-card action-card--facteur" method="post" action="/clients/12/supprimer" aria-labelledby="carte-titre">
  <!-- … en-tête avec <span class="badge badge--ambre"><span class="badge__dot" aria-hidden="true"></span>2e facteur demandé</span>, listes, mode … -->
  <div class="notice notice--ambre" role="status">
    <p class="notice__title">Ton 2e facteur date de plus de 10 minutes</p>
    <div class="notice__body"><p>Confirme-le, puis reviens ici : ton choix est gardé.</p></div>
  </div>
  <p class="action-card__due">Expire le <time class="num" datetime="2026-10-25T18:40">25/10/2026 à 18:40</time></p>
  <div class="action-card__actions">
    <a class="btn btn--light" href="/connexion/confirmer">Confirmer mon identité</a>
    <button class="btn btn--quiet" type="submit" name="decision" value="annuler">Annuler</button>
  </div>
</form>
```

```html
<!-- Confirmée (Annulée et Expirée : même forme, avec .action-card--annulee ou .action-card--expiree et .badge--muet) -->
<article class="action-card action-card--confirmee" aria-labelledby="carte-titre">
  <header class="action-card__head">
    <div class="action-card__intro">
      <h2 class="action-card__title" id="carte-titre">Supprimer Atelier Aube</h2>
      <p class="action-card__lead">Fait. Pense au projet Claude, à supprimer à la main.</p>
    </div>
    <span class="badge badge--ok"><span class="badge__dot" aria-hidden="true"></span>Confirmée</span>
  </header>
  <div class="action-card__lists"><!-- … les mêmes listes, en gris … --></div>
  <p class="action-card__due">Confirmée le <time class="num" datetime="2026-10-24T18:52">24/10/2026 à 18:52</time></p>
</article>
```

## 4. Modale de confirmation

Un `<dialog>` centré pour une confirmation simple (rejeter une demande, révoquer un accès). Pour la suppression d’un client, c’est la carte qui sert.

| Classe | Rôle |
|---|---|
| `.modal` | Le `<dialog>` : 480 px au plus, centré, surface `--surface`, voile `--scrim`. |
| `.modal__inner` | Le contenu, en général le `<form method="post">`. |
| `.modal__title`, `.modal__text` | La question (`<h2>`) et une phrase grise. |
| `.modal__actions` | L’action (`.btn--light`) puis « Annuler » (`.btn--quiet`). Pleine largeur sous 480 px. |
| `.modal__status` | `role="status"`, présent dès l’ouverture et vide au repos : il n’occupe alors aucune place. |

| État | Attribut | Comment |
|---|---|---|
| Ouverte | `open` | Par `dialog.showModal()` (page inerte, focus dedans, Échap ferme) ou posé par le serveur (sans script : un voile `--scrim` remplace `::backdrop`, comme pour le tiroir de Compta). |
| En cours | `aria-busy="true"` sur le `<dialog>` | Les boutons s’estompent et ne répondent plus ; le site écrit une phrase dans `.modal__status` (« Rejet en cours… »). |
| Fermée | sans `open` | `dialog.close()`, un bouton `formmethod="dialog"`, ou le retour du serveur. |

```html
<dialog class="modal" id="rejeter" aria-labelledby="rejeter-titre">
  <form class="modal__inner" method="post" action="/demandes/rejeter">
    <h2 class="modal__title" id="rejeter-titre">Rejeter cette demande ?</h2>
    <p class="modal__text">Elle quitte la liste. Le mail reste dans la boîte OVH.</p>
    <input type="hidden" name="id" value="42">
    <div class="modal__actions">
      <button class="btn btn--light" type="submit">Rejeter</button>
      <button class="btn btn--quiet" type="submit" formmethod="dialog" formnovalidate>Annuler</button>
    </div>
    <p class="modal__status" role="status"></p>
  </form>
</dialog>

<!-- En cours -->
<dialog class="modal" open aria-busy="true" aria-labelledby="rejeter-titre">
  <!-- … même contenu, avec : -->
  <p class="modal__status" role="status">Rejet en cours…</p>
</dialog>
```

## 5. Navigation mobile

La barre du haut et le menu plein écran du téléphone et de la tablette (sous 1 024 px ; au-dessus, la barre n’est pas affichée et le site montre sa `.sidebar`). Le menu reprend la navigation `.nav` de la v0.1, avec `aria-current`.

| Classe | Rôle |
|---|---|
| `.mobile-nav` | Le bloc, **enfant direct de `<body>`**, collé en haut de l’écran pendant le défilement. |
| `.mobile-nav__bar` | La barre (`<header>`, 68 px plus l’encoche, fond `--bar`). |
| `.mobile-nav__brand`, `.mobile-nav__name` | Le monogramme (`currentColor`, 40 px de haut) et le nom de l’outil. |
| `.mobile-nav__actions`, `.mobile-nav__meta` | À droite : une précision grise (l’exercice, en `.num`) et le bouton. |
| `.mobile-nav__toggle` | Le bouton du menu (44 × 44 px), avec les icônes `menu` et `fermer`. |
| `.mobile-nav__icon-open`, `.mobile-nav__icon-close` | Les deux icônes : la bonne s’affiche selon `aria-expanded`. |
| `.mobile-nav__menu` | Le menu plein écran, sous la barre (qui garde le bouton pour le fermer). |
| `.mobile-nav__foot` | Le bas du menu : choix de l’exercice, compte, « Se déconnecter » (`.btn--quiet`). |

| État | Attribut | Comment |
|---|---|---|
| Fermé | `aria-expanded="false"` sur `.mobile-nav__toggle` | Menu invisible et hors de la tabulation (`visibility: hidden`). |
| Ouvert | `aria-expanded="true"` | Le menu apparaît en fondu ; la page ne défile plus. Le site change aussi le libellé du bouton (« Fermer le menu »). |
| Page active | `aria-current="page"` sur le lien | Encre et trait devant le lien. |

Le site garde le comportement : basculer `aria-expanded` et le libellé, rendre `<main>` inerte, fermer avec Échap en rendant le focus au bouton, garder la tabulation dans la barre et le menu, fermer en passant à la largeur d’un ordinateur.

```html
<div class="mobile-nav">
  <header class="mobile-nav__bar">
    <a class="mobile-nav__brand" href="/" aria-label="Compta, accueil">
      <!-- assets/logo/monogramme.svg, en ligne -->
      <span class="mobile-nav__name" aria-hidden="true">Compta</span>
    </a>
    <div class="mobile-nav__actions">
      <span class="mobile-nav__meta num"><span class="visually-hidden">Exercice </span>2026</span>
      <button class="mobile-nav__toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu">
        <svg class="mobile-nav__icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>
        <svg class="mobile-nav__icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>
      </button>
    </div>
  </header>
  <div class="mobile-nav__menu" id="menu">
    <nav class="nav" aria-label="Navigation principale">
      <ul class="nav__group">
        <li><a href="/" aria-current="page">Accueil</a></li>
        <li><a href="/recettes">Recettes</a></li>
      </ul>
      <ul class="nav__group">
        <li><a href="/clients">Clients</a></li>
        <li><a href="/demandes">Demandes</a></li>
      </ul>
    </nav>
    <div class="mobile-nav__foot">
      <form method="post" action="/deconnexion"><button class="btn btn--quiet" type="submit">Se déconnecter</button></form>
    </div>
  </div>
</div>
```

## Pour le plan 2b : passer Compta sur ces composants

À la mise à jour vers la v0.2.0, presque rien ne change dans Compta tant que son HTML n’utilise pas ces classes : aucun nom nouveau ne reprend ceux du menu du portfolio et de Compta (`.topbar`, `.burger`, `.menu`). Compta a déjà `.panel`, `.panel--pad` et `.inquiry…` : ses règles locales passent après le paquet et l’emportent, avec les mêmes valeurs. La bordure du panneau reste donc jusqu’au plan 2b. **Un seul changement se voit dès l’installation** : sur `/demandes`, sous 1 024 px, le statut d’une demande passe à droite du nom (écart 2 ci-dessous), car Compta ne place pas `.inquiry__status`. Le test « rien ne déborde à 360 px » reste valable.

| Compta aujourd’hui | v0.2.0 |
|---|---|
| `.section`, `.section__head`, `.section__title`, `.section__aside`, `.section__link` (bloc posé sur un panneau) | `.panel-group`, `.panel-group__head`, `.panel-group__title`, `.panel-group__aside`, `.panel-group__link` |
| `.panel` (avec une bordure `--line-soft`), `.panel--pad` | `.panel`, `.panel--pad` : retirer les règles locales |
| `.empty`, `.empty__title`, `.empty__text` dans un panneau | `.panel__empty`, `.panel__empty-title`, `.panel__empty-text` |
| `.inquiries`, `.inquiry`, `.inquiry__…` | Mêmes noms : retirer les règles locales de `app.css` (bloc « Hub : demandes » et ses lignes des `@media`) |
| `.topbar`, `.brand`, `.brand__mark`, `.brand__name`, `.topbar__actions`, `.topbar__year` | `.mobile-nav__bar`, `.mobile-nav__brand`, le `<svg>` direct, `.mobile-nav__name`, `.mobile-nav__actions`, `.mobile-nav__meta` |
| `.burger`, `.burger__open`, `.burger__close` | `.mobile-nav__toggle`, `.mobile-nav__icon-open`, `.mobile-nav__icon-close` |
| `.menu` (`id="menu"`), `.menu__foot` | `.mobile-nav__menu`, `.mobile-nav__foot`, dans le même `.mobile-nav` que la barre |
| `.is-menu-open` sur `<html>` | Inutile au CSS : l’état est l’`aria-expanded` du bouton. `src/scripts/menu.ts` garde le reste (inerte, Échap, tabulation) et vise les nouvelles classes. |

Écarts de rendu voulus, à relire dans les tests navigateur :

1. Le panneau n’a plus de bordure : la surface `--panel` le sépare du fond (spec 7.7).
2. Liste des demandes, sous 1 024 px : le statut passe à droite du nom, sur la première ligne (aujourd’hui, il tombe sous les faits).
3. Menu du téléphone : chaque lien fait 44 px de haut (36 px aujourd’hui), une cible pour le pouce.
4. Barre du téléphone : elle tient compte de l’encoche et des bords arrondis (`env(safe-area-inset-*)`), utile pour l’app installée sur l’écran d’accueil (spec de la partie 2, section 9).
5. Les ancres d’un groupe (`/demandes#a-verifier`) s’arrêtent sous la barre collée en haut (`scroll-margin-top`).

Les tests de Compta visent surtout les rôles et les libellés (« Ouvrir le menu », « Navigation principale », `aria-expanded`, `aria-current`) : ils restent valables. Le test de l’accueil qui aligne les `.panel` d’une même rangée aussi.
