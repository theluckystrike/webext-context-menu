# Contributing to webext-context-menu

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/webext-context-menu.git
   cd webext-context-menu
   ```

## Setup

Install dependencies using pnpm:

```bash
pnpm install
```

## Development

Build the TypeScript:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

## Creating a Branch

Create a new branch for your feature or fix:

```bash
git checkout -b feature/your-feature-name
```

Or for bug fixes:

```bash
git checkout -b fix/your-bug-fix
```

## Making Changes

1. Make your changes in the `src/` directory
2. Ensure tests pass: `pnpm test`
3. Build the project: `pnpm build`
4. Commit your changes with a descriptive message

## Pull Request

1. Push your branch to your fork
2. Open a Pull Request against the `main` branch
3. Describe your changes and why they're needed
4. Ensure all CI checks pass

## Code Style

- Use TypeScript
- Follow existing code conventions
- Add tests for new features
- Keep the API consistent

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
