# Changelog

All notable changes to this project will be documented in this file.

## [1.4.0] - 2026-09-26

### Fixed
- **`skillnet-ai` 0.1.x compatibility:** search and download results are read from the CLI's `--json` output
  (`{ok, data, error}`) instead of scraping the rich table; CLI errors surface with their message and hint.
- **`import_best_skill` / `get_skill_rules`:** the CLI stores a skill under `<target>/<skill-name>/`, so the
  tools found no `SKILL.md` and returned "No .md documentation found". They now use the path reported by the
  download and resolve older caches the same way.
- **`analyze_skills`:** `--save/--no-save` no longer exist in 0.1.x; the tool takes `output_dir` and `force`.
- **`health_check`:** uses `skillnet doctor --json` and reports the CLI version.

### Added
- **`download_skill`:** `overwrite` option (`--overwrite`).
- **`SKILLNET_BIN`** environment variable to point at a CLI outside `PATH` (e.g. a `uv tool` install).

### Security
- **`download_skill`:** the GitHub token is passed to the CLI as `GITHUB_TOKEN` instead of `-t <token>`, so it
  no longer shows up in the process list.

## [1.3.0] - 2026-07-27

### Changed
- **Skill Pool Synchronization:** Updated official package documentation (EN, TR, ZN) to reflect the milestone of empowering AI agents with 600,000+ Specialized Skills.
- **Server Execution Guard:** Enhanced server startup logic in `index.js` to guard stdio transport when imported in test suites.

## [1.2.0] - 2026-04-23

### Added
- **`skillnet-ai` v0.0.18 Integration Updates:**
  - `download_skill`: Added `--token` flag for GitHub Personal Access Tokens, improving rate limits and private repository access.
  - `download_skill`: Added `--mirror` flag for custom registry domain routing (e.g., ghfast.top).

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
