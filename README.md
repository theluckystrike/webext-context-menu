[![CI](https://github.com/theluckystrike/webext-context-menu/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-context-menu/actions)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-context-menu)](https://www.npmjs.com/package/@theluckystrike/webext-context-menu)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

# webext-context-menu

Typed context menu builder with nested menus for Chrome extensions.

Part of the [chrome-extension-guide](https://github.com/theluckystrike/chrome-extension-guide) ecosystem.

## Install

```bash
npm install @theluckystrike/webext-context-menu
```

## Usage

```typescript
import { createMenu, createSeparator, registerMenus, updateMenu, removeMenu } from "webext-context-menu";

// Create a simple menu
const item = createMenu(
  { id: "search", title: "Search '%s'", contexts: ["selection"] },
  (info) => {
    console.log("Selected text:", info.selectionText);
  }
);

// Create nested menus
const parent = createMenu({ id: "tools", title: "My Tools", contexts: ["all"] });

parent
  .addChild(
    createMenu({ id: "copy-url", title: "Copy URL" }, (info) => {
      console.log(info.pageUrl);
    })
  )
  .addChild(createSeparator("sep1"))
  .addChild(
    createMenu({ id: "settings", title: "Settings" }, () => {
      chrome.runtime.openOptionsPage();
    })
  );

// Register all menus (call in service worker)
registerMenus([item, parent]);

// Update a menu item dynamically
await updateMenu("search", { title: "New Title", enabled: false });

// Remove a single menu
await removeMenu("search");
```

## API

### `createMenu(options, onClick?)`

Create a menu item. Options:

| Option | Type | Description |
|--------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Display text (`%s` for selection) |
| `contexts` | `ContextType[]` | Where to show (default: all) |
| `type` | `"normal" \| "checkbox" \| "radio" \| "separator"` | Item type |
| `parentId` | `string` | Parent menu ID |
| `enabled` | `boolean` | Enabled state |
| `visible` | `boolean` | Visibility |
| `checked` | `boolean` | Checked state (checkbox/radio) |
| `documentUrlPatterns` | `string[]` | URL patterns to match |
| `targetUrlPatterns` | `string[]` | Target URL patterns |

### `createSeparator(id, parentId?)`

Create a separator menu item.

### `MenuItem.addChild(child)` / `MenuItem.addChildren(children)`

Add child items to create nested menus. Supports chaining.

### `registerMenus(items)`

Register all menu items with Chrome. Call this in your service worker.

### `updateMenu(id, updates)`

Update a menu item's title, enabled, visible, or checked state. Returns a Promise.

### `removeMenu(id)` / `removeAllMenus()`

Remove one or all menu items. Returns a Promise.

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
