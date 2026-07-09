# LLMOps — Prompts & Monitoring

## Versioning des prompts

- Les prompts vivent dans `prompts/` en `.md`, versionnés en Git (source de vérité humaine, lisible).
- Convention de nommage : `prompts/<agent>_system_prompt.v<N>.md`.
- Commit dédié à chaque changement de prompt : `prompt: <agent> system v<N>` (cf. Conventional Commits dans `STANDARDS.md`).
- En production, le prompt actif peut être chargé depuis une table Supabase `prompts` pour permettre un ajustement sans redéploiement — le fichier Git reste la référence, la table est une copie synchronisée.

## Monitoring avec Langfuse

Chaque appel LLM doit être tracé :

```javascript
import Langfuse from "langfuse-node";
const langfuse = new Langfuse();

const trace = langfuse.trace({
  name: "agent_action",
  userId: sessionId,
  metadata: { /* contexte utile : ville, longueur de requête, etc. */ }
});

const generation = trace.generation({
  name: "llm_call",
  model: "claude-...",
  input: systemPrompt + userQuery,
});

const response = await callModel(systemPrompt, userQuery);

generation.end({
  output: response,
  usage: { input_tokens: X, output_tokens: Y },
});

trace.end();
```

Métriques à surveiller : latence, coût par requête, tokens consommés, taux de "je ne sais pas" / clarification.

## A/B testing de prompts

- Comparer deux versions de prompt sur le même jeu de questions de test (`eval/testset.json` si le projet en a un).
- Ne remplacer la version active qu'après comparaison chiffrée (precision/recall, taux de grounding respecté) — jamais au ressenti seul.

## Grounding et hallucinations

- Un agent RAG ne doit répondre qu'à partir des résultats retournés par ses tools de recherche (cf. règle "Grounding strict" dans les system prompts type `rh_system_prompt.v1.md`).
- Si les résultats sont insuffisants, l'agent doit dire explicitement qu'il ne sait pas plutôt que de compléter avec ses connaissances générales.

## Évaluation

- Traiter l'évaluation comme un pipeline data science : jeu de test versionné (`testset.json`), script d'automatisation des métriques (`run_eval.js`), résultats comparables dans le temps.
- Isoler les cas particuliers (ex. questions sensibles au temps) du calcul global de precision/recall.
