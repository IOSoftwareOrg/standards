# IO Software — Global Standards

Socle transversal de bonnes pratiques (code, tests, CI/CD, LLMOps, documentation) à réutiliser sur tous les projets IO Software / Weekigo.

## Contenu

- [`STANDARDS.md`](STANDARDS.md) — la charte : les règles à respecter sur chaque projet
- [`QUICK_START.md`](QUICK_START.md) — mise en place en 5 minutes sur un nouveau projet
- `config/` — configurations partagées (ESLint, Prettier, TypeScript, Jest)
- `templates/` — fichiers de départ pour un nouveau projet (`package.json`, `.env.example`, `.gitignore`, `README.md`)
- `hooks/.husky/` — hook de pre-commit (lint + format + tests + scan de secrets)
- `ci/.github/workflows/` — workflows GitHub Actions (tests, déploiement staging/production)
- `docs/` — [`SETUP.md`](docs/SETUP.md), [`TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md), [`RUNBOOK.md`](docs/RUNBOOK.md), [`LLMOps.md`](docs/LLMOps.md)

## Comment un projet en hérite

`standards` est publié comme package npm (`@iosoftwareorg/standards`) sur GitHub Packages. Un projet l'installe en devDependency et **étend** ses configs (ESLint, TypeScript, Jest, Prettier) au lieu de les copier — voir `docs/SETUP.md`. Les mises à jour se font via `npm update @iosoftwareorg/standards`, ou automatiquement proposées en PR par Dependabot (`templates/.github/dependabot.yml`).

Seuls les fichiers "à copier une fois" (hooks Husky, workflows GitHub Actions, `.gitignore`, `.env.example`) restent des templates copiés au démarrage — ils vivent dans le projet consommateur, pas dans `node_modules`.

## Principe

Un standard qui n'est pas automatisé (pre-commit hook, CI) finit par être contourné. Les règles de `STANDARDS.md` ne comptent que si elles sont vérifiées mécaniquement, pas seulement écrites.
