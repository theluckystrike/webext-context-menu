[![CI](https://github.com/theluckystrike/webext-context-menu/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-context-menu/actions)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-context-menu)](https://www.npmjs.com/package/@theluckystrike/webext-context-menu)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

# webext-context-menu

Typed context menu builder with nested menus for Chrome extensions.

Part of the [zovo/webext](https://github.com/theluckystrike/webext) ecosystem.

## Features

- **Fluent Builder API** — Chain methods intuitively for readable menu definitions
- **Nested Submenus** — Create unlimited depth menu hierarchies with ease
- **Context-Aware Items** — Show menus only for page, selection, link, image, or other contexts
- **Separators** — Visually group related menu items
- **Radio & Checkbox Items** — Create selectable options with proper state management
- **Dynamic Updates** — Modify menu title, visibility, enabled state at runtime
- **Typed Click Handlers** — Get full TypeScript types for click event info

## Install

```bash
npm install @theluckystrike/webext-context-menu
```

## Quick Start

### Simple Menu Item

Create a context menu that appears when text is selected:

```typescript
import { createMenu, registerMenus } from "@theluckystrike/webext-context-menu";

const searchItem = createMenu(
  { id: "search", title: "Search '%s'", contexts: ["selection"] },
  (info) => {
    const query = encodeURIComponent(info.selectionText || "");
    window.open(`https://google.com/search?q=${query}`);
  }
);

registerMenus([searchItem]);
```

### Menu with Submenu

Build nested menus using the fluent API:

```typescript
import { createMenu, createSeparator, registerMenus } from "@theluckystrike/webext-context-menu";

const toolsMenu = createMenu({ id: "tools", title: "Developer Tools", contexts: ["page"] });

toolsMenu
  .addChild(
    createMenu({ id: "copy-url", title: "Copy Page URL" }, (info) => {
      navigator.clipboard.writeText(info.pageUrl || "");
    })
  )
  .addChild(createSeparator("sep1"))
  .addChild(
    createMenu({ id: "view-source", title: "View Source" }, (info) => {
      window.open(`${info.pageUrl}?view-source`);
    })
  )
  .addChild(createSeparator("sep2"))
  .addChild(
    createMenu({ id: "open-console", title: "Open DevTools" }, () => {
      chrome.devtools.inspectedWindow.eval("devtools.openConsole()");
    })
  );

registerMenus([toolsMenu]);
```

## Builder Pattern Showcase

The fluent builder API lets you construct complex multi-level menus with readable, chainable code:

```typescript
import { createMenu, createSeparator, registerMenus } from "@theluckystrike/webext-context-menu";

// Build a complex menu structure with multiple nesting levels
const rootMenu = createMenu({ id: "root", title: "🛠️ Utilities", contexts: ["all"] });

// Level 1: Main categories
const sharing = createMenu({ id: "sharing", title: "Share" });
const editing = createMenu({ id: "editing", title: "Edit" });
const lookups = createMenu({ id: "lookups", title: "Look Up" });

// Level 2: Share submenu items
sharing
  .addChild(
    createMenu({ id: "share-twitter", title: "Share on Twitter", contexts: ["page"] }, (info) => {
      window.open(`https://twitter.com/intent/tweet?url=${info.pageUrl}`);
    })
  )
  .addChild(
    createMenu({ id: "share-email", title: "Share via Email", contexts: ["page"] }, (info) => {
      window.open(`mailto:?body=${info.pageUrl}`);
    })
  );

// Level 2: Edit submenu items with radio groups
const formatMenu = createMenu({ id: "format", title: "Format Selection" });
formatMenu
  .addChild(
    createMenu({ id: "fmt-bold", title: "Bold", type: "radio", checked: true }, () => {
      document.execCommand("bold");
    })
  )
  .addChild(
    createMenu({ id: "fmt-italic", title: "Italic", type: "radio" }, () => {
      document.execCommand("italic");
    })
  )
  .addChild(
    createMenu({ id: "fmt-underline", title: "Underline", type: "radio" }, () => {
      document.execCommand("underline");
    })
  );

editing
  .addChild(formatMenu)
  .addChild(createSeparator("edit-sep"))
  .addChild(
    createMenu({ id: "copy-html", title: "Copy as HTML" }, (info) => {
      // Copy implementation
    })
  );

// Level 2: Look up with nested submenu
lookups
  .addChild(
    createMenu({ id: "lookup-dictionary", title: "Dictionary", contexts: ["selection"] }, (info) => {
      window.open(`https://dictionary.com/browse/${info.selectionText}`);
    })
  )
  .addChild(
    createMenu({ id: "lookup-wikipedia", title: "Wikipedia", contexts: ["selection"] }, (info) => {
      window.open(`https://en.wikipedia.org/wiki/${info.selectionText}`);
    })
  )
  .addChild(
    createMenu({ id: "lookup-translate", title: "Translate" }, () => {
      // Translation feature
    })
  );

// Level 3: Translate submenu
const translateMenu = createMenu({ id: "translate-sub", title: "Translate to..." });
translateMenu
  .addChild(createMenu({ id: "tr-es", title: "Spanish", type: "radio" }, () => {}))
  .addChild(createMenu({ id: "tr-fr", title: "French", type: "radio" }, () => {}))
  .addChild(createMenu({ id: "tr-de", title: "German", type: "radio" }, () => {}))
  .addChild(createMenu({ id: "tr-ja", title: "Japanese", type: "radio" }, () => {}));

lookups.children.find(c => c.options.id === "lookup-translate")?.children.push(translateMenu.getItem());

// Build the root
rootMenu.addChildren([sharing, editing, lookups]);

registerMenus([rootMenu]);
```

## Context Types

The library supports all Chrome context menu context types. Here are examples for each:

### Page Context

Shows when right-clicking anywhere on the page:

```typescript
createMenu({ id: "page-info", title: "Page Info", contexts: ["page"] }, (info) => {
  console.log("Page URL:", info.pageUrl);
});
```

### Selection Context

Shows when text is selected:

```typescript
createMenu({ 
  id: "search-selection", 
  title: "Search '%s'", 
  contexts: ["selection"] 
}, (info) => {
  console.log("Selected:", info.selectionText);
});
```

### Link Context

Shows when right-clicking a hyperlink:

```typescript
createMenu({ id: "copy-link", title: "Copy Link", contexts: ["link"] }, (info) => {
  console.log("Link URL:", info.linkUrl);
  navigator.clipboard.writeText(info.linkUrl || "");
});
```

### Image Context

Shows when right-clicking an image:

```typescript
createMenu({ id: "image-search", title: "Search Image", contexts: ["image"] }, (info) => {
  window.open(`https://lens.google.com/uploadbyurl?url=${info.srcUrl}`);
});
```

### Combined Contexts

Combine multiple contexts for a single menu item:

```typescript
createMenu({ 
  id: "open-link", 
  title: "Open in New Tab", 
  contexts: ["link", "page"] 
}, (info, tab) => {
  const url = info.linkUrl || info.pageUrl;
  chrome.tabs.create({ url, active: false });
});
```

## Dynamic Menus

Update or remove menu items at runtime:

```typescript
import { createMenu, registerMenus, updateMenu, removeMenu, removeAllMenus } from "@theluckystrike/webext-context-menu";

// Enable/disable menu items based on state
await updateMenu("search", { enabled: false });

// Show/hide menu items dynamically
await updateMenu("admin-tools", { visible: false });

// Update checkbox/radio state
await updateMenu("option-1", { checked: true });

// Remove a specific menu item
await removeMenu("old-feature");

// Clear all menus (useful for cleanup)
await removeAllMenus();
```

## API Reference

### `createMenu(options, onClick?)`

Creates a menu item. Returns a `MenuItem` for chaining.

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `string` | — | Unique identifier (required) |
| `title` | `string` | — | Display text. Use `%s` for selected text |
| `contexts` | `ContextType[]` | `["all"]` | Contexts where menu appears |
| `type` | `"normal"` \| `"checkbox"` \| `"radio"` \| `"separator"` | `"normal"` | Menu item type |
| `parentId` | `string` | — | Parent menu ID (for flat structure) |
| `enabled` | `boolean` | `true` | Whether item is clickable |
| `visible` | `boolean` | `true` | Whether item is visible |
| `checked` | `boolean` | `false` | Checked state (checkbox/radio) |
| `documentUrlPatterns` | `string[]` | — | URL patterns to match (page context) |
| `targetUrlPatterns` | `string[]` | — | URL patterns for link/image targets |

**ContextType:** `"all"` \| `"page"` \| `"frame"` \| `"selection"` \| `"link"` \| `"editable"` \| `"image"` \| `"video"` \| `"audio"` \| `"action"` \| `"browser_action"` \| `"page_action"`

### `createSeparator(id, parentId?)`

Creates a separator line for visual grouping.

### `MenuItem.addChild(child)` / `MenuItem.addChildren(children)`

Adds child items to create nested menus. Both methods return `this` for chaining.

### `registerMenus(items)`

Registers all menu items with Chrome. Call this in your service worker/background script. Sets up the click listener automatically.

### `updateMenu(id, updates)`

Updates a menu item. Returns a Promise.

**Available updates:** `title`, `enabled`, `visible`, `checked`

### `removeMenu(id)`

Removes a single menu item by ID. Returns a Promise.

### `removeAllMenus()`

Removes all context menus. Returns a Promise.

## Permissions

Add the `contextMenus` permission to your `manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0.0",
  "permissions": [
    "contextMenus"
  ],
  "background": {
    "service_worker": "background.js"
  }
}
```

## Part of @zovo/webext

This library is part of the [zovo/webext](https://github.com/theluckystrike/webext) ecosystem — a collection of TypeScript utilities for building Chrome extensions.

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
