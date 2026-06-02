---
'@hz-9/docs-build': minor
---

refactor: unify multi-site and single-site docs-build into a single module

- Merge `multi.docs-build.ts` and `single.docs-build.ts` into unified `docs-build.ts`
- Add root-level `docs-build.config.json` configuration file
- Remove api-extractor dependency and related config
- Redesign config interface with typed options
- Add automatic root README collection for site homepage
