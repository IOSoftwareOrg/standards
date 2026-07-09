# QUICK START — 5 minutes

## 1. Authentification (une fois par machine)

Crée un Personal Access Token GitHub (`read:packages`) et exporte-le :

```bash
export GITHUB_PACKAGES_TOKEN=ghp_xxx
```

## 2. Copier les fichiers de départ

```bash
cp templates/.npmrc            <projet>/.npmrc
cp templates/.eslintrc.json    <projet>/.eslintrc.json
cp templates/tsconfig.json     <projet>/tsconfig.json
cp templates/jest.config.js    <projet>/jest.config.js
cp templates/.gitignore        <projet>/.gitignore
cp templates/.env.example      <projet>/.env.example
mkdir -p <projet>/.husky && cp hooks/.husky/pre-commit <projet>/.husky/
mkdir -p <projet>/.github/workflows && cp ci/.github/workflows/*.yml <projet>/.github/workflows/
cp templates/.github/dependabot.yml <projet>/.github/dependabot.yml
```

## 3. Fusionner les scripts, le champ `prettier`, et les `devDependencies` de `templates/package.json`

Ne pas écraser — merge. `@philippecorreges/standards` doit apparaître dans `devDependencies`.

## 4. Installer

```bash
npm install
npx husky install
```

## 5. Vérifier

```bash
npm run lint && npm test
```

## 6. Configurer GitHub

- Secrets (Settings → Secrets and variables → Actions)
- Environnements `staging` / `production` avec approbation manuelle sur `production`
- Créer la branche `dev`, protéger `main` et `dev` (PR + 1 review + CI obligatoires, pas de push direct)

## 7. Mettre à jour plus tard

```bash
npm update @philippecorreges/standards
```

Ou laisser Dependabot ouvrir la PR automatiquement.

C'est fait. Le détail de chaque règle est dans `STANDARDS.md`, le détail de chaque étape dans `docs/SETUP.md`.
