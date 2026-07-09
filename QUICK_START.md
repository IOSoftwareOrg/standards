# QUICK START — 5 minutes

## 1. Authentification (une fois par machine)

Crée un Personal Access Token GitHub (`read:packages`) et exporte-le :

```bash
export GITHUB_PACKAGES_TOKEN=ghp_xxx
```

## 2. Copier les fichiers de départ

```bash
cp templates/.npmrc            <projet>/.npmrc
cp templates/.eslintrc.cjs     <projet>/.eslintrc.cjs
cp templates/.secretlintrc.json <projet>/.secretlintrc.json
cp templates/tsconfig.json     <projet>/tsconfig.json
cp templates/jest.config.js    <projet>/jest.config.js
cp templates/.gitignore        <projet>/.gitignore
cp templates/.env.example      <projet>/.env.example
mkdir -p <projet>/.husky && cp hooks/.husky/pre-commit <projet>/.husky/
mkdir -p <projet>/.github/workflows && cp ci/.github/workflows/*.yml <projet>/.github/workflows/
cp templates/.github/dependabot.yml <projet>/.github/dependabot.yml
```

Projet en JS pur (pas TypeScript) ? Saute `tsconfig.json` et mets `preset: undefined` dans `jest.config.js`.

## 3. Fusionner les scripts, le champ `prettier`, et les `devDependencies` de `templates/package.json`

Ne pas écraser — merge. `@iosoftwareorg/standards` et `secretlint`/`@secretlint/secretlint-rule-preset-recommend` doivent apparaître dans `devDependencies`.

## 4. Installer

```bash
npm install
npx husky install
```

## 5. Vérifier

```bash
npx eslint . && npx prettier --check . && npx jest && npx secretlint --secretlintignore .gitignore "**/*"
```

Utilise `npx` directement, pas `npm run <script>` — sur Windows/Git Bash, `npm run` perd parfois la sortie et le code retour (bug d'environnement, pas de code).

## 6. Configurer GitHub

- Secret **Actions** `GH_PACKAGES_TOKEN` (Settings → Secrets and variables → Actions) — sinon `npm ci` échoue en CI avec `403` dès que `standards` vit dans un autre repo
- Secret **Dependabot** `GH_PACKAGES_TOKEN` — même valeur, magasin différent (Settings → Secrets and variables → Dependabot), sinon Dependabot échoue avec `422 Secret Not Found`
- Environnements `staging` / `production` avec approbation manuelle sur `production`
- Créer la branche `dev`, protéger `main` et `dev` (PR + 1 review + CI obligatoires, pas de push direct) — nécessite GitHub Pro sur un repo privé, ou de le passer en public

## 7. Mettre à jour plus tard

```bash
npm update @iosoftwareorg/standards
```

Ou laisser Dependabot ouvrir la PR automatiquement.

C'est fait. Le détail de chaque règle est dans `STANDARDS.md`, le détail de chaque étape dans `docs/SETUP.md`.
