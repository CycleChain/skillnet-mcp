# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-03-18

### Added
- **`skillnet-ai` v0.0.14 Integration Updates:**
  - `search_skills`: Added `--page` for keyword pagination.
  - `search_skills`: Added `--min-stars` to skip low-rated skills in keyword search.
  - `search_skills`: Added `--threshold` to adjust accuracy in vector semantic search.
  - `create_skill`: Added `--max-files` parameter for GitHub repository parsers to control token limits during extraction.
  - `evaluate_skill`: Added `--name`, `--category`, and `--description` overrides instead of relying purely on auto-detection.
  - `evaluate_skill`: Added `--max-workers` for batched internal evaluation concurrency.
  - `analyze_skills`: Added explicitly `--save` and `--no-save` flag toggles for the graph generation.

### Changed
- Official package READMEs (EN, TR, ZN) updated to reflect the new milestone of empowering AI agents with 400k+ Specialized Skills (previously 200k+).
- Expanded testing suite (`tests/index.test.js` & `tests/env.test.js`) to enforce test coverage on new flags and config environments.

---

## [1.0.0] - 2026-03-17

### Added
- Initial Core MCP Server bridging the `@modelcontextprotocol/sdk` to `skillnet-ai`.
- `health_check` endpoint for diagnosing NodeJS/Python/Skillnet environment configurations autonomously.
- Native capabilities exposed to MCP Clients (Cursor, Claude, Windsurf):
  - `import_best_skill`
  - `get_skill_rules`
  - `search_skills`
  - `download_skill`
  - `create_skill`
  - `evaluate_skill`
  - `analyze_skills`
- Docker compatibility (via `fmdogancan/skillnet-mcp`).
- Multi-language README documentations.
