<div align="center">

# @theluckystrike/webext-context-menu

Typed context menu builder with nested menus for Chrome extensions. Declarative API for building right-click menus.

[![npm version](https://img.shields.io/npm/v/@theluckystrike/webext-context-menu)](https://www.npmjs.com/package/@theluckystrike/webext-context-menu)
[![npm downloads](https://img.shields.io/npm/dm/@theluckystrike/webext-context-menu)](https://www.npmjs.com/package/@theluckystrike/webext-context-menu)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@theluckystrike/webext-context-menu)

[Installation](#installation) · [Quick Start](#quick-start) · [API](#api) · [License](#license)

</div>

---

## Features

- **Builder pattern** -- fluent API for defining menu items
- **Nested menus** -- unlimited depth for sub-menus
- **Context types** -- page, selection, link, image, video, audio, frame, editable
- **Typed callbacks** -- click handlers with typed `OnClickData`
- **Dynamic updates** -- update, remove, or replace items at runtime
- **Separator support** -- visual dividers between menu groups

## Installation

```bash
npm install @theluckystrike/webext-context-menu
```

<details>
<summary>Other package managers</summary>

```bash
pnpm add @theluckystrike/webext-context-menu
# or
yarn add @theluckystrike/webext-context-menu
```

</details>

## Quick Start

```typescript
import { ContextMenu } from "@theluckystrike/webext-context-menu";

ContextMenu.create({
  id: "search",
  title: "Search '%s'",
  contexts: ["selection"],
  onclick: (info) => {
    chrome.tabs.create({ url: `https://google.com/search?q=${info.selectionText}` });
  },
});
```

## API

| Method | Description |
|--------|-------------|
| `create(options)` | Create a context menu item |
| `update(id, options)` | Update an existing item |
| `remove(id)` | Remove a menu item |
| `removeAll()` | Remove all menu items |
| `onClicked(callback)` | Global click handler |

## Permissions

```json
{ "permissions": ["contextMenus"] }
```

## Part of @zovo/webext

This package is part of the [@zovo/webext](https://github.com/theluckystrike) family -- typed, modular utilities for Chrome extension development:

| Package | Description |
|---------|-------------|
| [webext-storage](https://github.com/theluckystrike/webext-storage) | Typed storage with schema validation |
| [webext-messaging](https://github.com/theluckystrike/webext-messaging) | Type-safe message passing |
| [webext-tabs](https://github.com/theluckystrike/webext-tabs) | Tab query helpers |
| [webext-cookies](https://github.com/theluckystrike/webext-cookies) | Promise-based cookies API |
| [webext-i18n](https://github.com/theluckystrike/webext-i18n) | Internationalization toolkit |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License -- see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) · [zovo.one](https://zovo.one)

</div>
