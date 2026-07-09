# QUICK START — 5 minutes

## 1. Copier les fichiers dans ton projet

```bash
cp config/.eslintrc.json     <projet>/
cp config/.prettierrc.json   <projet>/
cp config/tsconfig.json      <projet>/
cp config/jest.config.js     <projet>/
cp templates/.gitignore      <projet>/
cp templates/.env.example    <projet>/
mkdir -p <projet>/.husky && cp hooks/.husky/pre-commit <projet>/.husky/
mkdir -p <projet>/.github/workflows && cp ci/.github/workflows/*.yml <projet>/.github/workflows/
```

## 2. Fusionner les scripts de `templates/package.json` dans le `package.json` du projet

Ne pas écraser — merge des `scripts` et `devDependencies`.

## 3. Installer

```bash
npm install
npx husky install
```

## 4. Vérifier

```bash
npm run lint && npm test
```

## 5. Configurer GitHub

- Secrets (Settings → Secrets and variables → Actions)
- Environnements `staging` / `production` avec approbation manuelle sur `production`

C'est fait. Le détail de chaque règle est dans `STANDARDS.md`, le détail de chaque étape dans `docs/SETUP.md`.
