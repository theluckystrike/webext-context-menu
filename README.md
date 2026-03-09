[![CI](https://github.com/theluckystrike/webext-context-menu/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-context-menu/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-context-menu)](https://www.npmjs.com/package/@theluckystrike/webext-context-menu)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@theluckystrike/webext-context-menu)](https://bundlephobia.com/package/@theluckystrike/webext-context-menu)

# webext-context-menu

> Typed context menu builder with nested menus for Chrome extensions

A fluent, type-safe API for creating and managing Chrome context menus. Build complex nested menus with ease using the builder pattern, with full TypeScript support and runtime updates.

Part of the [@zovo/webext](https://github.com/theluckystrike/webext) ecosystem.

## Features

- **Fluent Builder API** — Chain methods to build complex menu structures
- **Nested Submenus** — Create unlimited depth menu hierarchies
- **Context-Aware Items** — Support for page, selection, link, image, and more
- **Separators** — Visual dividers between menu groups
- **Radio & Checkbox** — Grouped selection with radio/checkbox types
- **Dynamic Updates** — Update or remove menu items at runtime
- **Typed Click Handlers** — Full TypeScript support for click callbacks
- **Promise-Based API** — Clean async/await interface for updates

## Install

```bash
npm install @theluckystrike/webext-context-menu
```

Or with pnpm:

```bash
pnpm add @theluckystrike/webext-context-menu
```

## Quick Start

### Simple Menu Item

```typescript
import { createMenu, registerMenus } from "webext-context-menu";

// Create a menu item for selected text
const searchItem = createMenu(
  { id: "search", title: "Search '%s'", contexts: ["selection"] },
  (info, tab) => {
    const query = encodeURIComponent(info.selectionText || "");
    chrome.tabs.create({ url: `https://google.com/search?q=${query}` });
  }
);

// Register in your extension's service worker
registerMenus([searchItem]);
```

### Menu with Submenu

```typescript
import { createMenu, createSeparator, registerMenus } from "webext-context-menu";

// Create parent menu
const toolsMenu = createMenu({ id: "tools", title: "Developer Tools", contexts: ["all"] });

// Add nested items
toolsMenu
  .addChild(
    createMenu({ id: "copy-url", title: "Copy Page URL" }, (info, tab) => {
      navigator.clipboard.writeText(tab?.url || "");
    })
  )
  .addChild(createSeparator("sep1"))
  .addChild(
    createMenu({ id: "open-settings", title: "Open Settings" }, () => {
      chrome.runtime.openOptionsPage();
    })
  );

registerMenus([toolsMenu]);
```

## Builder Pattern Showcase

The fluent API lets you build complex multi-level menus with elegant chaining:

```typescript
import { createMenu, createSeparator, registerMenus } from "webext-context-menu";

// Build a complete menu hierarchy
const root = createMenu({ id: "root", title: "My Extension", contexts: ["page"] });

// First level: Development tools
const devTools = createMenu({ id: "dev", title: "🔧 Dev Tools" });
const inspectEl = createMenu({ id: "inspect", title: "Inspect Element" }, () => {
  console.log("Inspect mode activated");
});
const consoleEl = createMenu({ id: "console", title: "View Console" });

devTools.addChild(inspectEl).addChild(consoleEl);

// Second level: Clipboard operations
const clipboard = createMenu({ id: "clipboard", title: "📋 Clipboard" });
clipboard
  .addChild(createMenu({ id: "copy-title", title: "Copy Title" }))
  .addChild(createMenu({ id: "copy-url", title: "Copy URL" }))
  .addChild(createSeparator("clip-sep"))
  .addChild(createMenu({ id: "copy-html", title: "Copy as HTML" }));

// Third level: Export options (radio group)
const exportMenu = createMenu({ id: "export", title: "Export as..." });
exportMenu
  .addChild(createMenu({ id: "export-json", title: "JSON", type: "radio", checked: true }))
  .addChild(createMenu({ id: "export-csv", title: "CSV", type: "radio" }))
  .addChild(createMenu({ id: "export-xml", title: "XML", type: "radio" }));

clipboard.addChild(exportMenu);

// Add all top-level items
root.addChildren([devTools, clipboard]);

// Register everything
registerMenus([root]);
```

## Context Types

The library supports all Chrome context menu contexts:

```typescript
// Page context — shows when clicking anywhere on a page
const pageItem = createMenu({
  id: "page-action",
  title: "On Page",
  contexts: ["page"]
});

// Selection context — shows when text is selected
const selectionItem = createMenu({
  id: "search-selection",
  title: "Search '%s'",
  contexts: ["selection"]
});

// Link context — shows when right-clicking a link
const linkItem = createMenu({
  id: "open-link",
  title: "Open Link in Tab",
  contexts: ["link"]
});

// Image context — shows when right-clicking an image
const imageItem = createMenu({
  id: "copy-image",
  title: "Copy Image Address",
  contexts: ["image"]
});

// Multiple contexts — combine as needed
const multiContext = createMenu({
  id: "multi",
  title: "Works on page or image",
  contexts: ["page", "image"]
});

// All contexts — show everywhere
const allContext = createMenu({
  id: "everywhere",
  title: "Universal Menu",
  contexts: ["all"]
});
```

### Context Types Reference

| Context | Description |
|---------|-------------|
| `all` | All contexts except `launcher` |
| `page` | Page content (except images, links, etc.) |
| `frame` | Top-level or selected frame |
| `selection` | Text selection |
| `link` | Hyperlink |
| `editable` | Editable elements (input, textarea) |
| `image` | Image element |
| `video` | Video element |
| `audio` | Audio element |
| `action` | Browser action icon |
| `browser_action` | Browser action (Chromium) |
| `page_action` | Page action (Chromium) |

## Dynamic Menus

Update or remove menu items at runtime:

```typescript
import { updateMenu, removeMenu, removeAllMenus } from "webext-context-menu";

// Update a menu item's title
await updateMenu("search", { title: "New Title" });

// Disable a menu item
await updateMenu("tools", { enabled: false });

// Show/hide based on context
await updateMenu("admin-panel", { visible: false });

// Check/uncheck radio or checkbox items
await updateMenu("option-1", { checked: true });

// Remove single menu item
await removeMenu("old-item");

// Clear all menus (useful when reinstalling)
await removeAllMenus();
```

### Conditional Menu Visibility

```typescript
// Enable/disable based on page URL patterns
const urlSensitiveItem = createMenu({
  id: "url-item",
  title: "URL Actions",
  contexts: ["page"],
  documentUrlPatterns: ["https://*.example.com/*"]
});
```

## API Reference

### `createMenu(options, onClick?)`

Creates a new menu item with the builder pattern.

```typescript
const item = createMenu(
  {
    id: string,           // Unique identifier (required)
    title: string,        // Display text (required)
    contexts?: ContextType[],  // Where to show (default: ["all"])
    type?: "normal" | "checkbox" | "radio" | "separator",
    parentId?: string,    // Parent menu ID for nesting
    enabled?: boolean,   // Enabled state (default: true)
    visible?: boolean,   // Visibility (default: true)
    checked?: boolean,   // Checked state (checkbox/radio)
    documentUrlPatterns?: string[], // URL patterns to match
    targetUrlPatterns?: string[],   // Target URL patterns (links/images)
  },
  onClick?: (info: OnClickData, tab?: Tab) => void
): MenuItem
```

### `createSeparator(id, parentId?)`

Creates a visual separator between menu items.

```typescript
const sep = createSeparator("separator-1", "parent-id");
```

### `MenuItem.addChild(child)` / `MenuItem.addChildren(children)`

Adds child items to create nested menus. Returns `this` for chaining.

```typescript
parent.addChild(child);
parent.addChildren([child1, child2, child3]);
```

### `registerMenus(items)`

Registers all menu items with Chrome. Call this in your extension's service worker.

```typescript
registerMenus([item1, item2, item3]);
```

### `updateMenu(id, updates)`

Updates a menu item's properties. Returns a Promise.

```typescript
await updateMenu("my-item", {
  title: "New Title",
  enabled: false,
  visible: true,
  checked: false
});
```

### `removeMenu(id)` / `removeAllMenus()`

Removes menu items. Returns a Promise.

```typescript
await removeMenu("item-id");
await removeAllMenus();
```

## Permissions

Add the `contextMenus` permission to your `manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "permissions": [
    "contextMenus"
  ]
}
```

If using TypeScript with Chrome types, ensure you have the appropriate types installed:

```bash
npm install @types/chrome --save-dev
```

## Part of @zovo/webext

This package is part of the [@zovo/webext](https://github.com/theluckystrike/webext) ecosystem — a collection of type-safe utilities for building Chrome extensions.

Other packages in the ecosystem:
- [webext-storage](https://github.com/theluckystrike/webext-storage) — Typed storage API
- [webext-messaging](https://github.com/theluckystrike/webext-messaging) — Type-safe message passing

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
