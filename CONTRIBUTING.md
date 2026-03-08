# Contributing to webext-context-menu

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/webext-context-menu.git
   cd webext-context-menu
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Make your changes** in the `src/` directory

2. **Run tests**
   ```bash
   npm test
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

## Pull Request Process

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request against the `main` branch

3. Ensure:
   - All tests pass
   - Code builds without errors
   - New features include tests

## Code Style

- Use TypeScript with strict mode
- Follow existing code conventions
- Add JSDoc comments for public APIs

## Reporting Issues

Use the [GitHub Issues](https://github.com/theluckystrike/webext-context-menu/issues) to report bugs or request features.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
