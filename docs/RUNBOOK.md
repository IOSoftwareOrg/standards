# RUNBOOK — Opérations en production

## Déployer

1. Merger sur `main` déclenche automatiquement `deploy.yml` → build → déploiement `staging`.
2. Vérifier `staging` (smoke test manuel ou automatisé).
3. Le déploiement `production` attend une approbation manuelle (environnement GitHub protégé) — approuver dans Actions → run → "Review deployments".

## Monitorer

- Logs applicatifs : niveaux ERROR/WARN à surveiller en priorité (cf. `STANDARDS.md` § Error Handling & Logging).
- Si un agent LLM est impliqué : traces Langfuse (latence, coût, tokens) — voir `docs/LLMOps.md`.
- Base de données : Supabase dashboard (requêtes lentes, taille des tables, connexions).

## Rollback

1. Identifier le dernier commit `main` stable (celui déployé avant l'incident).
2. Revert via PR (`git revert <sha>`) plutôt qu'un force-push — garde l'historique et repasse par la CI.
3. Merger le revert → redéploiement automatique en staging → approbation manuelle pour production.
4. Si l'incident est urgent et le revert PR trop lent : redéployer manuellement l'artefact du commit stable précédent via le workflow `deploy.yml` (déclenchement manuel `workflow_dispatch` si configuré), en dernier recours.

## Incident — checklist rapide

- [ ] Symptôme identifié et horodaté
- [ ] Impact utilisateur évalué (tous / partiel / interne)
- [ ] Cause probable notée (déploiement récent ? dépendance externe ? pic de charge ?)
- [ ] Décision : rollback ou fix-forward
- [ ] Post-mortem écrit après résolution, ajouté à `TROUBLESHOOTING.md` si la cause est réutilisable
