# SETUP — Initialiser un nouveau projet avec les standards

Depuis la v0.1.0, `standards` est un package npm publié sur GitHub Packages (`@iosoftwareorg/standards`). Les projets ne copient plus les fichiers de config : ils installent le package et **étendent** ses configs (`extends`), ce qui rend les mises à jour aussi simples qu'un `npm update`.

## 1. Authentification à GitHub Packages

GitHub Packages exige une authentification même pour un package public. Une seule fois, sur ta machine :

1. Crée un Personal Access Token (classic) avec le scope `read:packages` : GitHub → Settings → Developer settings → Personal access tokens.
2. Ajoute-le à ton `.npmrc` global (`~/.npmrc`), ou exporte-le en variable d'environnement `GITHUB_PACKAGES_TOKEN` si tu utilises le `.npmrc` de projet fourni ci-dessous.

**En CI, `secrets.GITHUB_TOKEN` ne suffit pas** dès que `standards` vit dans un repo différent du projet consommateur : le jeton ambiant d'Actions ne peut pas lire les packages d'un autre repo, même public (erreur `403 Permission permission_denied`). Il faut un vrai PAT stocké comme secret du projet — voir point 6.

## 2. Copier les fichiers de départ dans le projet

Depuis ce repo (`standards/`) :

```bash
cp templates/.npmrc            <projet>/.npmrc
cp templates/.eslintrc.cjs     <projet>/.eslintrc.cjs
cp templates/.secretlintrc.json <projet>/.secretlintrc.json
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

Ces fichiers `templates/.eslintrc.cjs`, `templates/tsconfig.json` et `templates/jest.config.js` sont volontairement minces : ils ne font qu'`extends`/`require` la config réelle publiée dans `config/`.

`.eslintrc.cjs` (pas `.json`) et `require.resolve()` sont nécessaires : la résolution `extends` d'ESLint 8 pour un simple nom de package scope (`@iosoftwareorg/standards/config/...`) échoue si le package ne suit pas la convention de nommage `eslint-config-*` — `require.resolve()` contourne ça en donnant un chemin absolu.

Si le projet n'est pas en TypeScript (ex. JS/ESM pur), pas besoin de copier `tsconfig.json`, et `jest.config.js` doit désactiver le preset `ts-jest` hérité de la config de base (`preset: undefined`).

## 3. Fusionner package.json

Ne pas écraser le `package.json` du projet — fusionner les `scripts`, le champ `"prettier"`, et les `devDependencies` de `templates/package.json` dedans (notamment `@iosoftwareorg/standards` et `secretlint` + `@secretlint/secretlint-rule-preset-recommend`, requis par le script `secrets:scan`).

`secretlint` nécessite Node ≥ 22 — aligner `node-version` dans les workflows CI en conséquence (déjà fait dans `ci/.github/workflows/*.yml`).

## 4. Installer et activer les hooks

```bash
npm install
npx husky install
chmod +x .husky/pre-commit
```

## 5. Vérifier

```bash
npx eslint .
npx prettier --check .
npx jest
npx secretlint --secretlintignore .gitignore "**/*"
```

**Utiliser `npx` directement, pas `npm run <script>`** : sur Windows/Git Bash, le wrapper `npm.cmd` perd la sortie standard et rapporte parfois un mauvais code de retour pour les scripts npm — un bug d'environnement local, sans rapport avec la validité du code, mais qui peut faire croire à tort qu'un check échoue (ou pire, masquer un vrai échec). Le hook `pre-commit` fourni utilise déjà `npx` pour cette raison.

Si les quatre passent, le projet est conforme au socle.

## 6. Configurer les secrets CI

Deux magasins de secrets **distincts** sur GitHub, à ne pas confondre :

- **Secrets Actions** (Settings → Secrets and variables → **Actions**) : ajouter `GH_PACKAGES_TOKEN` (le PAT du point 1, scope `read:packages`) — utilisé par `ci/.github/workflows/*.yml` pour que `npm ci` puisse installer `@iosoftwareorg/standards`. Ajouter aussi les secrets applicatifs (`SUPABASE_URL`, clés API, etc.).
- **Secrets Dependabot** (Settings → Secrets and variables → **Dependabot**) : ajouter *également* un `GH_PACKAGES_TOKEN` (même valeur, magasin différent) — utilisé par `templates/.github/dependabot.yml`. `${{ secrets.GITHUB_TOKEN }}` n'existe pas dans ce contexte et fait échouer Dependabot avec `422 Secret Not Found`.

Ne jamais committer de secret en dur dans `.env`.

## 7. Environnements protégés (déploiement production)

Dans GitHub → Settings → Environments, créer `staging` et `production`, et exiger une approbation manuelle sur `production` pour respecter la règle "Manual approval required for production" de `STANDARDS.md`.

## 8. Branche `dev` et protection des branches

1. Créer la branche `dev` depuis `main` : `git checkout -b dev && git push -u origin dev`.
2. Dans GitHub → Settings → Branches, ajouter une règle de protection pour `main` ET pour `dev` : exiger une Pull Request avant merge, au moins 1 review, et que les checks CI (`test`) passent. Interdire le push direct sur les deux.
   **Sur un repo privé, la protection de branche exige GitHub Pro** (ou de passer le repo en public) — sinon l'API renvoie `403 Upgrade to GitHub Pro or make this repository public`. Sans ça, la règle reste à l'état de discipline manuelle, pas de garde-fou mécanique.
3. Définir `dev` comme branche par défaut du repo (Settings → Branches → Default branch) si tu veux que les nouvelles PR de contributeurs pointent vers `dev` plutôt que `main`.
4. Workflow au quotidien : créer une branche depuis `dev` (`feature/...`, `fix/...`) → PR vers `dev` → une fois validé, PR de `dev` vers `main` pour une release.
5. `templates/.github/dependabot.yml` ouvre automatiquement une PR vers la branche par défaut du projet à chaque nouvelle version publiée de `@iosoftwareorg/standards` — elle passe par le même circuit PR + CI + review avant merge.

## 9. Mettre à jour les standards plus tard

```bash
npm update @iosoftwareorg/standards
```

Ou laisser Dependabot ouvrir la PR automatiquement (voir point 8.5).
