# TROUBLESHOOTING

## `husky: command not found` ou hook qui ne se déclenche pas

- Vérifier que `npx husky install` a bien été exécuté après `npm install`.
- Sur Windows, `.husky/pre-commit` doit être exécutable via Git Bash ; si le hook ne se lance pas, vérifier `git config core.hooksPath` (doit pointer vers `.husky`).

## Le pre-commit hook bloque un commit alors que le code semble correct

Lancer manuellement chaque étape pour isoler le problème — utiliser `npx` directement, pas `npm run <script>` (voir l'entrée dédiée ci-dessous) :

```bash
npx eslint .
npx prettier --check .
npx jest
npx secretlint --secretlintignore .gitignore "**/*"
```

`format:check` échoue souvent parce que le code n'a pas été passé par `npm run format` avant le commit.

## `npm run <script>` échoue silencieusement (pas de sortie, mauvais code retour) sous Windows

Sur Windows/Git Bash, le wrapper `npm.cmd` perd parfois la sortie standard du process enfant et rapporte un code retour incorrect (souvent `1` sans aucun message), même quand la commande sous-jacente réussit. C'est un bug d'environnement local (npm.cmd + cmd.exe + Git Bash), pas un problème de config ni de code — reproductible en comparant `npm run lint` (silencieux, exit 1) et `npx eslint .` (sortie normale, bon exit code) sur la même machine. Le hook `pre-commit` fourni par ce repo appelle donc toujours les outils via `npx` directement. Ce bug n'affecte pas la CI (Linux) ; il n'est pertinent qu'en local sur Windows.

## ESLint : "couldn't find the config ... to extend from"

ESLint 8 résout `extends` pour un nom de package scope (`@iosoftwareorg/standards/config/...`) selon sa propre convention de nommage (`eslint-config-*`), pas comme une résolution Node générique — ça échoue silencieusement pour un package qui ne suit pas cette convention, même si le fichier existe bien dans `node_modules`. La solution : un `.eslintrc.cjs` (pas `.json`) qui utilise `require.resolve()` pour obtenir un chemin absolu, comme dans `templates/.eslintrc.cjs`.

## Dependabot échoue avec `422 Secret Not Found: GITHUB_TOKEN`

`dependabot.yml` ne peut pas référencer `secrets.GITHUB_TOKEN` (le jeton ambiant d'Actions) — Dependabot a son propre magasin de secrets, distinct de celui des Actions, même si l'interface GitHub range les deux sous "Secrets and variables". Il faut créer un secret **Dependabot** (Settings → Secrets and variables → **Dependabot**, pas Actions) avec le même nom que celui référencé dans `templates/.github/dependabot.yml` (`GH_PACKAGES_TOKEN`).

## Erreurs ESLint `@typescript-eslint/no-explicit-any`

C'est un warning, pas une erreur bloquante — mais à corriger si possible en typant explicitement. Si vraiment nécessaire, désactiver ligne par ligne avec un commentaire expliquant pourquoi (`// eslint-disable-next-line @typescript-eslint/no-explicit-any — <raison>`), jamais en désactivant la règle globalement.

## Couverture de tests sous les 70% et le build échoue en CI

`jest.config.js` impose un seuil global de 70% (branches/functions/lines/statements). Ajouter des tests pour le code non couvert plutôt que de baisser le seuil.

## Le déploiement `production` ne se déclenche jamais

Vérifier que l'environnement GitHub `production` est bien configuré avec les reviewers requis (Settings → Environments), et que quelqu'un a approuvé le déploiement en attente (Actions → run en cours → "Review deployments").

## Secrets détectés par `secrets:scan` sur un faux positif

Vérifier qu'il ne s'agit pas réellement d'une clé committée par erreur avant d'ignorer l'alerte. Si c'est un faux positif confirmé (ex. exemple de clé dans la doc), l'exclure explicitement dans la config de l'outil de scan plutôt que de contourner le hook avec `--no-verify`.

## `npm install` échoue avec 401/403 sur `@iosoftwareorg/standards`

GitHub Packages exige une authentification même pour un package public. Vérifier :
- Qu'un Personal Access Token (`read:packages`) est bien exporté en `GITHUB_PACKAGES_TOKEN` (ou présent dans `~/.npmrc`).
- Que le `.npmrc` du projet contient bien `@iosoftwareorg:registry=https://npm.pkg.github.com`.
- **En CI, `secrets.GITHUB_TOKEN` ne suffit pas** dès que `standards` vit dans un repo différent du projet consommateur (erreur `403 Permission permission_denied: The requested installation does not exist`) : le jeton ambiant d'Actions n'a pas accès en lecture aux packages d'un autre repo, même public. Il faut un vrai PAT (`read:packages`) stocké comme secret **Actions** du projet (ex. `GH_PACKAGES_TOKEN`), référencé explicitement dans le workflow.

## Divergence entre les configs locales et celles du repo `standards`

Ce repo n'est pas branché en submodule (choix assumé pour la simplicité sur un usage solo) : les fichiers copiés ne se mettent pas à jour automatiquement. Repasser périodiquement par `docs/SETUP.md` pour resynchroniser manuellement après une mise à jour de `standards`.
