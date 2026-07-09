# SETUP — Initialiser un nouveau projet avec les standards

## 1. Copier les fichiers de configuration

Depuis ce repo (`standards/`) :

```bash
cp config/.eslintrc.json      <projet>/.eslintrc.json
cp config/.prettierrc.json    <projet>/.prettierrc.json
cp config/tsconfig.json       <projet>/tsconfig.json
cp config/jest.config.js      <projet>/jest.config.js
cp templates/.gitignore       <projet>/.gitignore
cp templates/.env.example     <projet>/.env.example
cp templates/README.md        <projet>/README.md
mkdir -p <projet>/.husky
cp hooks/.husky/pre-commit    <projet>/.husky/pre-commit
mkdir -p <projet>/.github/workflows
cp ci/.github/workflows/*.yml <projet>/.github/workflows/
```

## 2. Fusionner package.json

Ne pas écraser le `package.json` du projet — fusionner les `scripts` et `devDependencies` de `templates/package.json` dedans.

## 3. Installer et activer les hooks

```bash
npm install
npx husky install
chmod +x .husky/pre-commit
```

## 4. Vérifier

```bash
npm run lint
npm test
```

Si les deux passent, le projet est conforme au socle.

## 5. Configurer les secrets CI

Dans GitHub → Settings → Secrets and variables → Actions, ajouter les secrets nécessaires au déploiement (`SUPABASE_URL`, clés API, etc.). Ne jamais les committer dans `.env`.

## 6. Environnements protégés (déploiement production)

Dans GitHub → Settings → Environments, créer `staging` et `production`, et exiger une approbation manuelle sur `production` pour respecter la règle "Manual approval required for production" de `STANDARDS.md`.
