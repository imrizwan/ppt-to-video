# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2024-08-05

### Added
- Comprehensive test suite with both Node.js and Mocha support
- Test scripts in package.json (`npm test` and `npm run test:mocha`)
- Error handling tests for edge cases

### Changed
- **BREAKING**: Upgraded pdf2pic from v1.4.0 to v3.2.0
  - Updated API calls to use new `pdf2pic.fromPath()` method
  - Changed options format to use `saveFilename` and `savePath` instead of `savedir` and `savename`
- Updated package version to 1.1.0

### Removed
- Removed unnecessary `fs@0.0.1-security` dependency (Node.js built-in used instead)
- Removed unnecessary `path@0.12.7` dependency (Node.js built-in used instead)

### Dependencies Updated
- pdf2pic: 1.4.0 → 3.2.0 (major version upgrade)
- libreoffice-convert: 1.1.1 → 1.6.1 (automatically updated)
- lodash: 4.17.19 → 4.17.21 (security update)
- gm: 1.23.1 → 1.25.1 (automatically updated, but still deprecated)

### Development Dependencies Added
- mocha: ^11.7.1 (for advanced testing)

### Notes
- The `gm` package is now deprecated. Future versions should consider migrating to an alternative image processing library.
- All existing functionality is preserved with improved API usage.