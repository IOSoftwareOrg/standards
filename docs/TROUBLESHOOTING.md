# TROUBLESHOOTING

## `husky: command not found` ou hook qui ne se déclenche pas

- Vérifier que `npx husky install` a bien été exécuté après `npm install`.
- Sur Windows, `.husky/pre-commit` doit être exécutable via Git Bash ; si le hook ne se lance pas, vérifier `git config core.hooksPath` (doit pointer vers `.husky`).

## Le pre-commit hook bloque un commit alors que le code semble correct

Lancer manuellement chaque étape pour isoler le problème :

```bash
npm run lint
npm run format:check
npm test
npm run secrets:scan
```

`format:check` échoue souvent parce que le code n'a pas été passé par `npm run format` avant le commit.

## Erreurs ESLint `@typescript-eslint/no-explicit-any`

C'est un warning, pas une erreur bloquante — mais à corriger si possible en typant explicitement. Si vraiment nécessaire, désactiver ligne par ligne avec un commentaire expliquant pourquoi (`// eslint-disable-next-line @typescript-eslint/no-explicit-any — <raison>`), jamais en désactivant la règle globalement.

## Couverture de tests sous les 70% et le build échoue en CI

`jest.config.js` impose un seuil global de 70% (branches/functions/lines/statements). Ajouter des tests pour le code non couvert plutôt que de baisser le seuil.

## Le déploiement `production` ne se déclenche jamais

Vérifier que l'environnement GitHub `production` est bien configuré avec les reviewers requis (Settings → Environments), et que quelqu'un a approuvé le déploiement en attente (Actions → run en cours → "Review deployments").

## Secrets détectés par `secrets:scan` sur un faux positif

Vérifier qu'il ne s'agit pas réellement d'une clé committée par erreur avant d'ignorer l'alerte. Si c'est un faux positif confirmé (ex. exemple de clé dans la doc), l'exclure explicitement dans la config de l'outil de scan plutôt que de contourner le hook avec `--no-verify`.

## `npm install` échoue avec 401/403 sur `@philippecorreges/standards`

GitHub Packages exige une authentification même pour un package public. Vérifier :
- Qu'un Personal Access Token (`read:packages`) est bien exporté en `GITHUB_PACKAGES_TOKEN` (ou présent dans `~/.npmrc`).
- Que le `.npmrc` du projet contient bien `@philippecorreges:registry=https://npm.pkg.github.com`.
- En CI : que le workflow a `permissions: packages: write` (pour publier) ou au minimum `read` (pour installer), et utilise `secrets.GITHUB_TOKEN`.

## Divergence entre les configs locales et celles du repo `standards`

Ce repo n'est pas branché en submodule (choix assumé pour la simplicité sur un usage solo) : les fichiers copiés ne se mettent pas à jour automatiquement. Repasser périodiquement par `docs/SETUP.md` pour resynchroniser manuellement après une mise à jour de `standards`.
