# SETUP — Initialiser un nouveau projet avec les standards

Depuis la v0.1.0, `standards` est un package npm publié sur GitHub Packages (`@philippecorreges/standards`). Les projets ne copient plus les fichiers de config : ils installent le package et **étendent** ses configs (`extends`), ce qui rend les mises à jour aussi simples qu'un `npm update`.

## 1. Authentification à GitHub Packages

GitHub Packages exige une authentification même pour un package public. Une seule fois, sur ta machine :

1. Crée un Personal Access Token (classic) avec le scope `read:packages` : GitHub → Settings → Developer settings → Personal access tokens.
2. Ajoute-le à ton `.npmrc` global (`~/.npmrc`), ou exporte-le en variable d'environnement `GITHUB_PACKAGES_TOKEN` si tu utilises le `.npmrc` de projet fourni ci-dessous.

En CI (GitHub Actions), `secrets.GITHUB_TOKEN` suffit — pas besoin de PAT séparé.

## 2. Copier les fichiers de départ dans le projet

Depuis ce repo (`standards/`) :

```bash
cp templates/.npmrc            <projet>/.npmrc
cp templates/.eslintrc.json    <projet>/.eslintrc.json
cp templates/tsconfig.json     <projet>/tsconfig.json
cp templates/jest.config.js    <projet>/jest.config.js
cp templates/.gitignore        <projet>/.gitignore
cp templates/.env.example      <projet>/.env.example
cp templates/README.md         <projet>/README.md
mkdir -p <projet>/.husky
cp hooks/.husky/pre-commit     <projet>/.husky/pre-commit
mkdir -p <projet>/.github/workflows
cp ci/.github/workflows/*.yml  <projet>/.github/workflows/
cp templates/.github/dependabot.yml <projet>/.github/dependabot.yml
```

Ces fichiers `templates/.eslintrc.json`, `templates/tsconfig.json` et `templates/jest.config.js` sont volontairement minces : ils ne font qu'`extends`/`require` la config réelle publiée dans `config/`.

## 3. Fusionner package.json

Ne pas écraser le `package.json` du projet — fusionner les `scripts`, le champ `"prettier"`, et les `devDependencies` de `templates/package.json` dedans (notamment `@philippecorreges/standards`).

## 4. Installer et activer les hooks

```bash
npm install
npx husky install
chmod +x .husky/pre-commit
```

## 5. Vérifier

```bash
npm run lint
npm test
```

Si les deux passent, le projet est conforme au socle.

## 6. Configurer les secrets CI

Dans GitHub → Settings → Secrets and variables → Actions, ajouter les secrets nécessaires au déploiement (`SUPABASE_URL`, clés API, etc.). Ne jamais les committer dans `.env`.

## 7. Environnements protégés (déploiement production)

Dans GitHub → Settings → Environments, créer `staging` et `production`, et exiger une approbation manuelle sur `production` pour respecter la règle "Manual approval required for production" de `STANDARDS.md`.

## 8. Branche `dev` et protection des branches

1. Créer la branche `dev` depuis `main` : `git checkout -b dev && git push -u origin dev`.
2. Dans GitHub → Settings → Branches, ajouter une règle de protection pour `main` ET pour `dev` : exiger une Pull Request avant merge, au moins 1 review, et que les checks CI (`test`) passent. Interdire le push direct sur les deux.
3. Définir `dev` comme branche par défaut du repo (Settings → Branches → Default branch) si tu veux que les nouvelles PR de contributeurs pointent vers `dev` plutôt que `main`.
4. Workflow au quotidien : créer une branche depuis `dev` (`feature/...`, `fix/...`) → PR vers `dev` → une fois validé, PR de `dev` vers `main` pour une release.
5. `templates/.github/dependabot.yml` ouvre automatiquement une PR vers la branche par défaut du projet à chaque nouvelle version publiée de `@philippecorreges/standards` — elle passe par le même circuit PR + CI + review avant merge.

## 9. Mettre à jour les standards plus tard

```bash
npm update @philippecorreges/standards
```

Ou laisser Dependabot ouvrir la PR automatiquement (voir point 8.5).
