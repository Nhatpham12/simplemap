# AI Development Guidelines: Code, Review, Fix, Test

When working on this codebase or implementing features/fixes requested by the user, always follow the 4-phase engineering pipeline:

## 1. Code Phase (AI Coder)
- Understand the existing codebase conventions and dependencies (React 19, Leaflet / React-Leaflet).
- Implement clean, modular code with clear comments and appropriate error handling.

## 2. Review Phase (AI Reviewer)
- Inspect all code modifications against:
  - Functional correctness, null safety, and boundary edge cases.
  - Security vulnerabilities (XSS, sensitive leakage, injection).
  - Code style, React hooks dependencies, clean code.

## 3. Test Phase (Automated Tester)
- Run automated tests (`npm test -- --watchAll=false` or `npm run build`).
- Verify that no regressions or syntax issues are introduced.

## 4. Fix Phase (AI Fixer / Self-Healing)
- If tests or reviews fail, diagnose the root cause (RCA).
- Apply targeted fixes and re-verify until all tests pass and review criteria are met.

