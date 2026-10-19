# Contributing to PackWise AI

Thank you for your interest in contributing to PackWise AI! We welcome contributions to improve our multi-LLM routing, offline synchronization engine, UI/UX aesthetics, and cross-platform native builds.

## Code of Conduct
Please be respectful, collaborative, and inclusive in all discussions and pull requests.

## Development Workflow

1. **Fork & Branch**: Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Setup Dependencies**:
   ```bash
   npm run install:all
   ```
3. **Run Dev Environment**:
   ```bash
   npm run dev
   ```
4. **Code Quality**:
   - Verify client builds: `cd client && npm run build`
   - Verify server syntax: `cd server && node --check server.js`
5. **Commit Message Format**: Follow Conventional Commits:
   - `feat: add offline search index`
   - `fix: resolve currency symbol fallback in budget grid`
   - `perf: streamline 3D bundle splitting`

## Pull Request Guidelines
- Provide a clear summary of what was changed and why.
- Include screenshots or GIFs for UI changes.
- Ensure all CI verification passes cleanly.
