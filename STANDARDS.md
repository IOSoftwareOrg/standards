# IO Software Global Standards

## Every project must follow these rules

### Code Quality
- **Language**: TypeScript (strict mode) for backend, React/Next for frontend
- **Linter**: ESLint (config: standards/config/.eslintrc.json)
- **Formatter**: Prettier (80-char line width, config in standards/config/.prettierrc.json)
- **Testing**: Jest (minimum 70% code coverage)
  - Run: `npm test`
  - Coverage: `npm run test:coverage`

### Commits & Git
- **Message format**: Conventional Commits
  - `feat: add POI recommendations to newsletter`
  - `fix: handle null city in Blaise`
  - `docs: update README with LLMOps section`
  - `refactor: extract RAG logic to module`
- **No force-push to main**: ever
- **Branch protection**: main requires 1 approval + CI pass

### Error Handling & Logging
- **Every async function** has try-catch
- **Every catch** logs: timestamp, error class, stack, context (userId, etc.)
- **No silent failures**: if it fails, log it
- **Log level**:
  - ERROR: production-breaking issues
  - WARN: recoverable issues
  - INFO: key business events (user signup, data processed)
  - DEBUG: dev-only, never in production
- **Example**:
```javascript
try {
  const pois = await fetchPOIs(city);
} catch (e) {
  logger.error("POI fetch failed", {
    city,
    error: e.message,
    stack: e.stack,
    userId: session.userId
  });
  throw new AppError("Failed to load recommendations", 503);
}
```

### Database & Persistence
- **Primary**: Supabase + pgvector (if using embeddings)
- **Timestamps**: every table has `created_at`, `updated_at`
- **Audit trail**: log who changed what, when (for sensitive ops)
- **Upsert over INSERT+UPDATE**: idempotent by design
- **Example**:
```javascript
await supabase.from('poi')
  .upsert([{ place_id, nom, embedding, updated_at: now }], {
    onConflict: 'place_id'
  });
```

### Testing
- **Unit tests** for business logic, utils
- **Integration tests** for API endpoints
- **Coverage minimum**: 70%
- **Test structure**: Arrange-Act-Assert
- **Run before commit**: `npm test` (pre-commit hook enforces this)

### Environment & Config
- **.env.example**: commit this, never .env
- **Secrets**: use GitHub Secrets (CI) or Supabase vault
- **No hardcoded URLs, API keys, or IDs**
- **Feature flags**: use environment variable (e.g., FEATURE_POI_RANKING=true)

### LLM / Prompt Engineering (if applicable)
- **Prompts**: stored in `prompts/` folder as `.md` files + Supabase table
- **Versioning**: Git commit = version (e.g., `prompt: blaise v2.3`)
- **Monitoring**: Langfuse traces all calls (model, tokens, latency, cost)
- **A/B testing**: compare two prompt versions on same queries
- **Example**:
```markdown
# prompts/blaise-poi-recommender.md

**Version**: 2.3
**Last updated**: 2025-01-15
**Intent**: Generate warm, conversational POI recommendations

---
You are Blaise, a friendly weekend recommendation assistant...
```

### Deployment
- **CI/CD**: all deployments via GitHub Actions (no SSH)
- **Stages**: test → staging → production
- **Manual approval** required for production
- **Automatic rollback** if health checks fail (optional)
- **Deployment artifact**: track what was deployed, when, by whom

### Documentation (required for every project)
- **README.md**: what the project does, how to run locally
- **API docs**: endpoint list + response schemas
- **.env.example**: all required env vars
- **TROUBLESHOOTING.md**: common issues + fixes
- **Runbook**: how to deploy, scale, monitor, rollback

### Dependencies
- **Lock file**: commit `package-lock.json` or `yarn.lock`
- **No major version bumps** in dependencies without manual testing
- **Security**: `npm audit` must pass (pre-commit hook)
- **Minimalism**: avoid bloated dependencies (test each addition)

---

## Compliance Checklist

Before a PR can merge, all of these must be true:

- [ ] Linter passes (`npm run lint`)
- [ ] Tests pass (`npm test` ≥70% coverage)
- [ ] No security issues (`npm audit`)
- [ ] Commit messages follow Conventional Commits
- [ ] Error handling: all async calls have try-catch + log
- [ ] `.env.example` updated if new vars added
- [ ] README/docs updated if behaviour changed
- [ ] No secrets in code (pre-commit hook blocks this)

---

## Questions?

See `/docs/` folder or ask in Slack.
