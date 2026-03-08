# webext-context-menu

[![npm version](https://img.shields.io/npm/v/webext-context-menu.svg)](https://www.npmjs.com/package/webext-context-menu)
[![Build Status](https://github.com/theluckystrike/webext-context-menu/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-context-menu/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178c6.svg)](https://www.typescriptlang.org/)

Typed context menu builder with nested menus and fluent API for Chrome extensions. Part of @zovo/webext.

## Features

- **Fluent Builder API** — Chain methods to build complex menu structures with ease
- **Nested Submenus** — Create unlimited levels of nested context menus
- **Context-Aware Items** — Show menus only on specific contexts (page, selection, link, image, etc.)
- **Separators** — Add visual separators to organize menu items
- **Radio & Checkbox** — Support for radio groups and checkbox menu items
- **Dynamic Updates** — Update titles, visibility, enabled state, and checked state at runtime
- **Typed Handlers** — Full TypeScript support with type-safe click handlers

## Install

```bash
npm install webext-context-menu
```

Or with pnpm:

```bash
pnpm add webext-context-menu
```

Or with yarn:

```bash
yarn add webext-context-menu
```

## Quick Start

```typescript
import { createMenu, createSeparator, registerMenus, updateMenu, removeMenu } from "webext-context-menu";

// Create a simple menu
const item = createMenu(
  { id: "search", title: "Search '%s'", contexts: ["selection"] },
  (info) => {
    console.log("Selected text:", info.selectionText);
  }
);

// Register all menus (call in service worker)
registerMenus([item]);
```

## Builder Pattern Showcase

Build complex multi-level menus with the fluent API:

```typescript
// Create parent menu
const tools = createMenu({ id: "tools", title: "My Tools", contexts: ["all"] });

// Add nested children with chaining
tools
  .addChild(
    createMenu({ id: "copy-url", title: "Copy URL" }, (info) => {
      navigator.clipboard.writeText(info.pageUrl || "");
    })
  )
  .addChild(createSeparator("sep1"))
  .addChild(
    createMenu({ id: "open-settings", title: "Settings" }, () => {
      chrome.runtime.openOptionsPage();
    })
  )
  .addChild(
    createMenu({ id: "format", title: "Format" })
      .addChild(createMenu({ id: "bold", title: "Bold" }))
      .addChild(createMenu({ id: "italic", title: "Italic" }))
      .addChild(createSeparator("format-sep"))
      .addChild(createMenu({ id: "underline", title: "Underline" }))
  );

// Register all menus
registerMenus([tools]);
```

## Context Type Examples

Show menus only in specific contexts:

### Page Context

```typescript
const pageMenu = createMenu(
  { id: "page-info", title: "Page Info", contexts: ["page"] },
  (info, tab) => {
    console.log("Page URL:", tab?.url);
  }
);
```

### Selection Context

```typescript
const selectionMenu = createMenu(
  { id: "search-selection", title: "Search '%s' on Google", contexts: ["selection"] },
  (info) => {
    window.open(`https://google.com/search?q=${encodeURIComponent(info.selectionText || "")}`);
  }
);
```

### Link Context

```typescript
const linkMenu = createMenu(
  { id: "link-actions", title: "Link Actions", contexts: ["link"] },
  (info) => {
    console.log("Link URL:", info.linkUrl);
  }
);
```

### Image Context

```typescript
const imageMenu = createMenu(
  { id: "image-actions", title: "Image Actions", contexts: ["image"] },
  (info) => {
    console.log("Image URL:", info.srcUrl);
  }
);
```

### Multiple Contexts

```typescript
const multiContext = createMenu(
  { id: "universal", title: "Universal Action", contexts: ["page", "selection", "link", "image"] }
);
```

## Dynamic Menus

Update menu items at runtime:

```typescript
// Update title
await updateMenu("search", { title: "New Title" });

// Disable/enable menu
await updateMenu("search", { enabled: false });

// Show/hide menu
await updateMenu("search", { visible: true });

// Check/uncheck checkbox
await updateMenu("toggle-option", { checked: true });

// Remove single menu
await removeMenu("search");

// Remove all menus
await removeAllMenus();
```

## Radio & Checkbox Items

```typescript
// Radio group
const viewMode = createMenu({ id: "view-mode", title: "View Mode", type: "radio" });
viewMode
  .addChild(createMenu({ id: "view-grid", title: "Grid", type: "radio", checked: true }))
  .addChild(createMenu({ id: "view-list", title: "List", type: "radio" }))
  .addChild(createMenu({ id: "view-compact", title: "Compact", type: "radio" }));

// Checkbox items
const options = createMenu({ id: "options", title: "Options" });
options
  .addChild(createMenu({ id: "opt-dark", title: "Dark Mode", type: "checkbox", checked: false }))
  .addChild(createMenu({ id: "opt-auto", title: "Auto Save", type: "checkbox", checked: true }));
```

## API Reference

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

## Permissions

Add the `contextMenus` permission to your `manifest.json`:

```json
{
  "permissions": [
    "contextMenus"
  ]
}
```

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) | [zovo.one](https://zovo.one)
