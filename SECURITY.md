# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.1.x   | :white_check_mark: |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

### How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. Send a description of the vulnerability to [GitHub Security Advisories](https://github.com/ATboy-web/advanced_calculator/security/advisories/new)
3. Include steps to reproduce the vulnerability
4. Include the version(s) affected

### What to Expect

- Acknowledgment within 48 hours
- A fix will be developed and tested
- A security advisory will be published if necessary

## Security Considerations

### Electron App

This application uses Electron with `nodeIntegration: true` for Three.js compatibility. This is an intentional design choice for the desktop version. Users should:

- Only download from official releases
- Keep the application updated
- Be aware that the app has full Node.js access

### Web Version

The web version runs entirely in the browser with no server-side code. All calculations are performed client-side.

### Data Privacy

- No data is collected or transmitted to external servers
- Calculation history is stored locally in the browser/Electron storage
- Language preference is saved to localStorage
- No analytics or tracking is used
