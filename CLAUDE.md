# Travailler dans ce dépôt

Design system de la marque Thomas Remblier, publié en public sur GitHub (`thomasrembl/design-system`) et consommé par ses sites (`npm i github:thomasrembl/design-system`) et par le plugin Claude Code `marque`.

- Répondre à Thomas en français ; code, commits et noms de fichiers en anglais ou kebab-case sans accents, docs et commentaires en français.
- Git : travailler sur `dev`, commits libres ; jamais de commit ni de fusion sur `main` : ouvrir une PR `dev` → `main` et attendre la validation de Thomas.
- Tokens : la source est `tokens/tokens.json`. Après modification : `npm run build`. Ne jamais éditer `css/tokens.css` à la main.
- Ne jamais renommer ni supprimer une variable déjà utilisée par les sites (liste dans `scripts/tokens.test.mjs`) : le portfolio et Compta en dépendent.
- Composants : uniquement des variables, aucune couleur en dur ; ajouter l'exemple HTML en commentaire et dans `demo/index.html`.
- Avant chaque commit : `npm test` vert ; pour le plugin, `claude plugin validate .` et `claude plugin validate plugins/marque`.
- Dépôt public : aucune donnée personnelle (adresse, SIRET, portrait, coordonnées bancaires).
- Règles de marque et ton de voix : `plugins/marque/skills/marque-thomas-remblier/` (la source de vérité éditoriale, à tenir à jour avec le Figma).
