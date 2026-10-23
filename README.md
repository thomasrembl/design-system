# Design system — Thomas Remblier

Tokens, CSS, composants, assets et plugin Claude Code de la marque **Thomas Remblier**, artiste CGI produit (packshots, films 3D, web interactif, outils Houdini). Direction « studio » : monochrome, une seule couleur — la lumière d'un plateau 3D — et la police Geist en graisses fines.

- Figma (charte, bibliothèque, assets) : https://www.figma.com/design/NX4WhM0e2jx6oObUMxQ5x0/Claude
- Démo de tous les composants : [`demo/index.html`](demo/index.html)

## Utiliser le design system dans un site
```bash
npm i github:thomasrembl/design-system
```
```css
@import "@thomasremblier/design-system/css/fonts.css"; /* Geist auto-hébergée (bundler : Astro, Vite) */
@import "@thomasremblier/design-system/css/index.css"; /* tokens, base, fond studio, composants */
```
| Fichier | Contenu |
|---|---|
| `css/tokens.css` | Toutes les variables (`--bg`, `--ink`, `--muted`, `--accent`, `--space-24`, `--ease`…). Généré, ne pas modifier. |
| `css/base.css` | Reset, typo, focus, contextes `data-contexte="outil"` et `.papier`, styles de texte `.t-*`, mouvement réduit. |
| `css/studio.css` | Fond studio : halos de lumière key / rim et grain. |
| `css/components.css` | Bouton, champ, case à cocher, carte projet, grille, badge, notice, KPI, jauge, sidebar et navigation, tableau, tiroir. |
| `tokens/tokens.json` | Source des tokens (format W3C Design Tokens). |
| `assets/` | Logos, 11 icônes, favicons, signature e-mail. |

Le HTML de chaque composant est commenté dans `css/components.css` et visible dans la démo.

## Brancher Claude Code sur la marque
Une fois par ordinateur :
```text
/plugin install marque --marketplace thomasrembl/design-system
```
(Claude Code antérieur à 2.1.275 : `/plugin marketplace add thomasrembl/design-system` puis `/plugin install marque@thomasremblier`.)

Ensuite, pour tout site, page, composant, visuel ou texte de la marque, Claude charge le skill `marque-thomas-remblier` : plateforme et ton de voix, charte, règles web, composants et installation de ce paquet. `/plugin update marque` récupère les nouvelles versions.

## Faire évoluer le design system
1. Modifier `tokens/tokens.json` (jamais `css/tokens.css`), puis `npm run build`.
2. Composants : `css/components.css`, uniquement avec des variables.
3. `npm test` : fichier généré à jour, contrastes AA, aucune variable manquante ni couleur en dur, icônes en `currentColor`, manifestes du plugin.
4. Changement de marque ou de règle : mettre à jour les références du skill (`plugins/marque/skills/marque-thomas-remblier/`) et la version du plugin (`plugin.json` et `.claude-plugin/marketplace.json`).

## Licence
Code (CSS, scripts, tokens) : [MIT](LICENSE). Logos, icônes et éléments de marque : tous droits réservés ([assets/LICENCE.md](assets/LICENCE.md)).
