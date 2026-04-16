# Changelog

## [2.0.0] - 2026-04-16

### Changed
- Replaced monolithic CommonJS implementation with modular TypeScript architecture.
- Added WASM runtime manager abstraction and worker entrypoint.
- Added Node/browser adapters and deterministic conversion pipeline contracts.
- Removed external binary-driven dependency model from core implementation path.

### Testing
- Replaced permissive tests with strict Vitest unit/integration/perf suites.
- Added coverage thresholds and CI gate scripts.

### Compatibility
- Preserved `p2vConverter(...)` as a legacy compatibility bridge to the new pipeline.
