[![CI](https://github.com/theluckystrike/webext-context-menu/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-context-menu/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-context-menu)](https://www.npmjs.com/package/@theluckystrike/webext-context-menu)
[![Downloads](https://img.shields.io/npm/dm/@theluckystrike/webext-context-menu)](https://www.npmjs.com/package/@theluckystrike/webext-context-menu)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/min/@theluckystrike/webext-context-menu)](https://bundlephobia.com/package/@theluckystrike/webext-context-menu)

# webext-context-menu

A type-safe, fluent API for building Chrome extension context menus with support for nested menus, click handlers, and dynamic updates.

## Features

- **🛡️ TypeScript First** — Full type safety with autocomplete for all menu options
- **📦 Fluent API** — Chainable methods for building nested menus effortlessly
- **🔄 Dynamic Updates** — Update titles, visibility, enabled state, and checked state at runtime
- **🎯 Context Awareness** — Support for all Chrome context types (selection, link, image, etc.)
- **📂 Nested Menus** — Create complex multi-level menu hierarchies with ease
- **🧪 Well Tested** — Comprehensive test suite with Vitest

## Installation

```bash
npm install @theluckystrike/webext-context-menu
```

## Quick Start

```typescript
import { createMenu, createSeparator, registerMenus } from "@theluckystrike/webext-context-menu";

// Create a simple context menu item
const searchItem = createMenu(
  { id: "search", title: "Search '%s'", contexts: ["selection"] },
  (info) => {
    const query = encodeURIComponent(info.selectionText || "");
    window.open(`https://google.com/search?q=${query}`);
  }
);

// Register your menus in the service worker
registerMenus([searchItem]);
```

## API Reference

### `createMenu(options, onClick?)`

Creates a new menu item. Returns a `MenuItem` instance that supports chaining.

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `string` | Required | Unique identifier for the menu item |
| `title` | `string` | Required | Display text. Use `%s` to insert selected text |
| `type` | `"normal" \| "checkbox" \| "radio" \| "separator"` | `"normal"` | Menu item type |
| `contexts` | `ContextType[]` | `["all"]` | Contexts where the menu appears |
| `parentId` | `string` | `undefined` | Parent menu ID for nesting |
| `enabled` | `boolean` | `true` | Whether the item is enabled |
| `visible` | `boolean` | `true` | Whether the item is visible |
| `checked` | `boolean` | `false` | Checked state (checkbox/radio only) |
| `documentUrlPatterns` | `string[]` | `undefined` | URL patterns to match (using match patterns) |
| `targetUrlPatterns` | `string[]` | `undefined` | Target URL patterns for links/images |

**Click Handler Signature:**
```typescript
type ClickHandler = (
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab
) => void;
```

### `createSeparator(id, parentId?)`

Creates a separator line for visual grouping of menu items.

### `MenuItem.addChild(child)` / `MenuItem.addChildren(children)`

Add child menu items to create nested menus. Returns the parent for chaining.

```typescript
const parent = createMenu({ id: "tools", title: "Tools" });
parent
  .addChild(createMenu({ id: "copy", title: "Copy" }, handler))
  .addChild(createSeparator("sep1"))
  .addChild(createMenu({ id: "paste", title: "Paste" }, handler));
```

### `registerMenus(items)`

Registers all menu items with Chrome's contextMenus API. Call this in your **service worker** or background script. This also sets up the click listener automatically.

```typescript
// In your service worker (e.g., service-worker.ts)
import { registerMenus, createMenu } from "@theluckystrike/webext-context-menu";

const menu = createMenu({ id: "hello", title: "Hello" }, () => {
  console.log("Menu clicked!");
});

registerMenus([menu]);
```

### `updateMenu(id, updates)`

Dynamically update a menu item's properties. Returns a Promise.

```typescript
import { updateMenu } from "@theluckystrike/webext-context-menu";

// Update multiple properties
await updateMenu("search", { 
  title: "New Title", 
  enabled: false,
  visible: true,
  checked: false
});
```

### `removeMenu(id)` / `removeAllMenus()`

Remove individual menu items or clear all menus. Returns a Promise.

```typescript
import { removeMenu, removeAllMenus } from "@theluckystrike/webext-context-menu";

// Remove a single item
await removeMenu("old-menu");

// Clear all menus
await removeAllMenus();
```

### Context Types

Available contexts for menu placement:

```typescript
type ContextType =
  | "all"        // All contexts
  | "page"       // Page context
  | "frame"      // Frame context
  | "selection" // Text selection
  | "link"       // Links
  | "editable"   // Editable elements
  | "image"      // Images
  | "video"      // Videos
  | "audio"      // Audio
  | "action"     // Browser action
  | "browser_action" // Browser action (legacy)
  | "page_action";    // Page action
```

## Examples

### Example 1: Selection Search Menu

Search selected text in different search engines:

```typescript
import { createMenu, registerMenus } from "@theluckystrike/webext-context-menu";

const searchEngine = (name: string, url: string) =>
  createMenu(
    { id: `search-${name}`, title: name, parentId: "search-menu" },
    (info) => {
      const query = encodeURIComponent(info.selectionText || "");
      window.open(`${url}${query}`);
    }
  );

const searchMenu = createMenu({ id: "search-menu", title: "Search..." });
searchMenu.addChildren([
  searchEngine("Google", "https://google.com/search?q="),
  searchEngine("Bing", "https://bing.com/search?q="),
  searchEngine("DuckDuckGo", "https://duckduckgo.com/?q="),
]);

registerMenus([searchMenu]);
```

### Example 2: Link Actions Menu

Perform actions on links:

```typescript
import { createMenu, createSeparator, registerMenus } from "@theluckystrike/webext-context-menu";

const linkActions = createMenu({ id: "link-actions", title: "Link Actions", contexts: ["link"] });

linkActions
  .addChild(createMenu({ id: "copy-link", title: "Copy Link" }, (info) => {
    navigator.clipboard.writeText(info.linkUrl || "");
  }))
  .addChild(createSeparator("sep1"))
  .addChild(createMenu({ id: "open-new-tab", title: "Open in New Tab" }, (info) => {
    window.open(info.linkUrl, "_blank");
  }))
  .addChild(createMenu({ id: "open-incognito", title: "Open in Incognito" }, (info) => {
    chrome.windows.create({ url: info.linkUrl, incognito: true });
  }));

registerMenus([linkActions]);
```

### Example 3: Checkbox Menu for Settings

A menu with toggleable options:

```typescript
import { createMenu, registerMenus, updateMenu } from "@theluckystrike/webext-context-menu";

// Track state (in real app, persist to storage)
const settings = { darkMode: false, notifications: true };

const settingsMenu = createMenu({ id: "settings", title: "Settings" });

settingsMenu
  .addChild(createMenu(
    { id: "dark-mode", title: "Dark Mode", type: "checkbox", checked: settings.darkMode },
    async (info) => {
      settings.darkMode = info.checked;
      await updateMenu("dark-mode", { checked: settings.darkMode });
      // Apply theme...
    }
  ))
  .addChild(createMenu(
    { id: "notifications", title: "Notifications", type: "checkbox", checked: settings.notifications },
    async (info) => {
      settings.notifications = info.checked;
      await updateMenu("notifications", { checked: settings.notifications });
    }
  ));

registerMenus([settingsMenu]);
```

### Example 4: Dynamic Menu Based on Page Content

Show different options based on the current page:

```typescript
import { createMenu, registerMenus, removeAllMenus } from "@theluckystrike/webext-context-menu";

function updateMenusForPage(hasVideo: boolean, hasAudio: boolean) {
  removeAllMenus();
  
  const items = [createMenu({ id: "page-action", title: "Page Actions", contexts: ["page"] })];
  
  if (hasVideo) {
    items[0].addChild(createMenu({ id: "download-video", title: "Download Video" }, downloadVideo));
  }
  
  if (hasAudio) {
    items[0].addChild(createMenu({ id: "download-audio", title: "Download Audio" }, downloadAudio));
  }
  
  registerMenus(items);
}

// Call from content script or service worker based on page analysis
```

## Chrome Extension Guide

This package is part of the **chrome-extension-guide** ecosystem — a comprehensive collection of building blocks for building modern Chrome extensions.

Explore related packages and guides:

- [chrome-extension-guide](https://github.com/theluckystrike/chrome-extension-guide) — Main repository with docs and examples
- [@theluckystrike/webext-storage](https://github.com/theluckystrike/webext-storage) — Type-safe storage wrapper
- [@theluckystrike/webext-messaging](https://github.com/theluckystrike/webext-messaging) — Simplified message passing
- [Create Chrome Extension](https://github.com/theluckystrike/create-chrome-extension) — Scaffold a new extension in seconds

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
