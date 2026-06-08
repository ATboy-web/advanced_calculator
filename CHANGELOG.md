# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-06-08

### Added
- **Math Tutorial System** - Interactive learning tutorials based on MathWorld encyclopedia
  - Algebra tutorials: Vieta's formulas, factoring
  - Calculus tutorials: derivative definition, definite integrals
  - Geometry tutorials: Pythagorean theorem, circle area & circumference
  - Probability tutorials: classical probability, conditional probability & Bayes' theorem
  - Linear Algebra tutorials: matrix multiplication
  - Trigonometry tutorials: trigonometric identities
- **Multi-language Support (i18n)** - Full interface in Chinese, English, and Japanese
  - Language selector in header with dropdown menu
  - Language preference saved to localStorage
  - All UI labels, buttons, and tutorial content translated
- **Improved Input Labels** - Added descriptive labels and help text across all calculator panels
  - Equation panel: coefficient meanings (e.g., "a (x²系数)")
  - Statistics panel: parameter descriptions (e.g., "n (试验次数)", "p (成功概率)")
  - Number theory panel: function explanations (e.g., "φ(n): 小于n且与n互素的正整数个数")
  - Calculus panel: expression format hints and parameter meanings
  - Graph panel: improved placeholders and range labels

### Changed
- `showPanel()` function now initializes tutorial panel on first visit
- `i18n.updateUI()` now re-renders tutorial content when language changes

## [2.0.0] - 2026-06-06

### Added
- **3D Visualization** with Three.js
  - 3D surface plotting
  - Vector operations
  - Point-to-point distance calculation
  - Plane equation visualization
  - Line equation visualization
  - Parametric curve rendering
- Electron security: preload.js for context isolation
- CI/CD GitHub Actions workflows
- Issue templates (Bug Report, Feature Request)
- Pull Request template
- Contributing guide

### Fixed
- 3D panel sub-tabs click issue
- CSS z-index stacking for 3D buttons
- Event delegation for 3D type buttons

### Changed
- Reverted Electron sandbox mode for Three.js compatibility
- Improved `initThreeJS()` return value handling

## [1.5.0]

### Added
- Calculus module (derivatives, integrals, limits, series, Taylor expansion)
- Statistics module (combinations, permutations, descriptive stats, distributions)
- Number theory module (prime detection, factorization, GCD/LCM, Euler function)
- Algebra extended module (cubic equations, polynomials, sets, logic, sequences)
- Applied math module (Newton's method, regression, interpolation, numerical integration, ODE)
- Fun calculations module (relatives, loans, currency, BMI, tax, etc.)

## [1.0.0]

### Added
- Basic calculator
- Scientific calculator
- 2D function graphing
- Equation solver (linear, quadratic, system)
- Matrix operations
- Geometry calculator
- Unit converter
- Calculation history
