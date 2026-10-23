# Charte graphique

## Logo (`assets/logo/`)
| Rôle | Fichier | Usage |
|---|---|---|
| **Logo principal** | `tuile.svg` (251 × 250) | Tuile noire `#0F0F0F` à angles arrondis, monogramme blanc. Avatar, favicon, couverture, documents. Couleurs fixes. |
| **Monogramme** | `monogramme.svg` (96 × 166) | Bloc vertical avec l'initiale évidée, en `currentColor` : encre sur fond sombre, `--paper-ink` sur papier. Sidebar, en-têtes. |
| **Variation** | `plein.svg` (108 × 184) | L'initiale pleine (« tirage du moule »), en `currentColor`. Usages graphiques, motifs. |

- **Zone de protection** : x = ¼ de la largeur du monogramme, sur les quatre côtés.
- **Tailles minimales** : tuile 16 px · monogramme 24 px de haut · plein 12 px de haut.
- **Composition avec le nom** : monogramme + « Thomas Remblier » (450) + « Artiste CGI produit » (350, gris) ; hauteur du monogramme = deux lignes de texte.
- **Interdits** : déformer, pivoter, ajouter ombre, contour ou dégradé, remplir en couleur de lumière, poser le monogramme sur une image chargée sans la tuile, redessiner la lettre.

## Couleurs
Neutres (≈ 98 % de la surface) :
| Variable | Hex | Rôle |
|---|---|---|
| `--bg` | `#0F0F0F` | Noir studio : fond |
| `--surface` | `#161616` | Vignettes, panneaux, tableaux |
| `--surface-2` | `#1E1E1E` | Champs, boutons discrets, état actif |
| `--surface-3` | `#262626` | Survols |
| `--muted` | `#8F8C87` | Texte secondaire |
| `--ink` | `#EDEBE7` | Texte, titres |
| `--accent` | `#F3F3F2` | Action principale, focus |

Lumière studio (≈ 2 %, uniquement en lumière) : `--key` `#FFE2BE` (chaude) et `--rim` `#C4D6FF` (froide), en **triplets RVB** : `rgb(var(--key) / 0.13)`. Graphiques : `--chart-chaud`, `--chart-froid` `#9FB6E6`, `--chart-neutre`.

États (outil seulement, toujours avec un mot) : `--amber` `#D9A441` à surveiller · `--red` `#E26D5C` en retard · `--ok` `#8FB996` fait · `--error` `#EC9A90` texte et contour d'erreur.

Papier (devis, factures) : `--paper` `#F3F3F2`, `--paper-surface` `#EBE9E5`, `--paper-ink` `#0F0F0F`, `--paper-muted` `#6B6964`, `--paper-line`. Classe `.papier` pour basculer un bloc.

Proportions : 70 % noir studio · 20 % surfaces · 8 % texte · 2 % lumière.

## Typographie
**Geist** (OFL), trois graisses : 300 titres / accroches / chiffres clés · 350 texte et interface · 450 boutons et titres de vignettes.
| Style | Classe | Taille | Graisse | Interligne | Approche |
|---|---|---|---|---|---|
| Display | `.t-display` | 32 → 64 px | 300 | 1,0 | −0,035 em |
| Titre | `.t-titre` | 28 → 40 px | 300 | 1,05 | −0,03 em |
| Accroche | `.t-accroche` | 20 → 26 px | 300 | 1,3 | −0,015 em |
| Corps | `.t-corps` | 17 → 19 px | 350 | 1,55 | 0 |
| Interface | `.t-interface` | 16 px | 350 | 1,4 | 0 |
| Bouton | `.t-bouton` | 16 px | 450 | 1 | +0,005 em |
| Petit | `.t-petit` | 13 → 14 px | 350 | 1,45 | 0 |
| Chiffre clé | `.t-chiffre` | 20 → 26 px | 300 | 1,1 | −0,02 em, tabulaires |

Aucune capitale de mise en forme, rien au-dessus de 450, alignement à gauche, colonne de texte 560 px (`.colonne`).

## Lumière et matière
- **Fond studio** (`.studio`) : noir, halos key et rim, dérive lente (48, 62, 75 s), grain 7 % en lumière douce.
- **Rendus produit** : fond sombre neutre, key chaude et douce, rim froide et fine, sol légèrement réfléchissant. La passe clay se montre comme une étape. Pas de fond saturé, de flare ni d'effet gratuit.
- **Logo en 3D** : plaque extrudée, rugosité 0,24, vernis 1, key `#FFE2BE` 3,4 et rim `#C4D6FF` 2,6.
- **Portraits** : même éclairage (fond sombre, key chaude d'un côté, contour froid), retouche légère, peau texturée.

## Icônes (`assets/icones/`)
Grille 24 px, trait 1,6 px, extrémités arrondies, sans remplissage, `currentColor` : `fermer`, `bas`, `haut`, `droite`, `retour`, `remonter`, `glisser`, `menu`, `lien-externe`, `lecture` (plein), `ajouter`. Réseaux sociaux : logos officiels monochromes à 19 px, sans texte, gris au repos, encre au survol.

## Applications
- **Avatar** : la tuile (recadrage rond accepté). Portrait de Thomas pour LinkedIn, Malt, Fiverr.
- **Signature e-mail** : `assets/signature/signature.html` (s'adapte aux modes clair et sombre ; logo servi par https://thomasremblier.fr/logo/signature-tuile.png).
- **Documents** : en-tête papier avec la composition monogramme + nom ; coordonnées légales à demander à Thomas (jamais dans un dépôt public).
- **Bannières réseaux** : fond studio, monogramme, nom, signature, offres et contact ; aucune image derrière le texte.
