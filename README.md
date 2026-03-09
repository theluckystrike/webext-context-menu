# webext-context-menu

[![CI](https://github.com/theluckystrike/webext-context-menu/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/webext-context-menu/actions)
[![npm](https://img.shields.io/npm/v/@theluckystrike/webext-context-menu)](https://www.npmjs.com/package/@theluckystrike/webext-context-menu)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

Typed context menu builder with nested menus and fluent API for Chrome extensions. Part of @zovo/webext.

## Features

- **Fluent Builder API** — Chain methods intuitively for readable menu definitions
- **Nested Submenus** — Create unlimited depth menu hierarchies with ease
- **Context-Aware Items** — Show menus only for page, selection, link, image, or other contexts
- **Separators** — Visually group related menu items
- **Radio & Checkbox Items** — Create selectable options with proper state management
- **Dynamic Updates** — Modify menu title, visibility, enabled state at runtime
- **Typed Click Handlers** — Full TypeScript types for click event info

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
  );

registerMenus([toolsMenu]);
```

## Builder Pattern Showcase

The fluent builder API lets you construct complex multi-level menus:

```typescript
import { createMenu, createSeparator, registerMenus } from "@theluckystrike/webext-context-menu";

const rootMenu = createMenu({ id: "root", title: "🛠️ Utilities", contexts: ["all"] });

const sharing = createMenu({ id: "sharing", title: "Share" });
const editing = createMenu({ id: "editing", title: "Edit" });

sharing
  .addChild(createMenu({ id: "share-twitter", title: "Twitter", contexts: ["page"] }, (info) => {
    window.open(`https://twitter.com/intent/tweet?url=${info.pageUrl}`);
  }))
  .addChild(createMenu({ id: "share-email", title: "Email", contexts: ["page"] }, (info) => {
    window.open(`mailto:?body=${info.pageUrl}`);
  }));

const formatMenu = createMenu({ id: "format", title: "Format" });
formatMenu
  .addChild(createMenu({ id: "fmt-bold", title: "Bold", type: "radio", checked: true }, () => {}))
  .addChild(createMenu({ id: "fmt-italic", title: "Italic", type: "radio" }, () => {}));

editing.addChild(formatMenu);

rootMenu.addChildren([sharing, editing]);
registerMenus([rootMenu]);
```

## Context Types

The library supports all Chrome context menu contexts:

### Page Context

```typescript
createMenu({ id: "page-info", title: "Page Info", contexts: ["page"] }, (info) => {
  console.log("Page URL:", info.pageUrl);
});
```

### Selection Context

```typescript
createMenu({ id: "search-selection", title: "Search '%s'", contexts: ["selection"] }, (info) => {
  console.log("Selected:", info.selectionText);
});
```

### Link Context

```typescript
createMenu({ id: "copy-link", title: "Copy Link", contexts: ["link"] }, (info) => {
  navigator.clipboard.writeText(info.linkUrl || "");
});
```

### Image Context

```typescript
createMenu({ id: "image-search", title: "Search Image", contexts: ["image"] }, (info) => {
  window.open(`https://lens.google.com/uploadbyurl?url=${info.srcUrl}`);
});
```

## Dynamic Menus

Update or remove menu items at runtime:

```typescript
import { updateMenu, removeMenu, removeAllMenus } from "@theluckystrike/webext-context-menu";

await updateMenu("search", { enabled: false });
await updateMenu("option-1", { checked: true });
await removeMenu("old-feature");
await removeAllMenus();
```

## API Reference

### `createMenu(options, onClick?)`

Creates a menu item. Returns a `MenuItem` for chaining.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `string` | — | Unique identifier (required) |
| `title` | `string` | — | Display text. Use `%s` for selected text |
| `contexts` | `ContextType[]` | `["all"]` | Contexts where menu appears |
| `type` | `"normal"` \| `"checkbox"` \| `"radio"` \| `"separator"` | `"normal"` | Menu item type |
| `parentId` | `string` | — | Parent menu ID |
| `enabled` | `boolean` | `true` | Whether item is clickable |
| `visible` | `boolean` | `true` | Whether item is visible |
| `checked` | `boolean` | `false` | Checked state (checkbox/radio) |

### `createSeparator(id)`

Creates a separator line for visual grouping.

### `MenuItem.addChild(child)` / `MenuItem.addChildren(children)`

Adds child items to create nested menus. Returns `this` for chaining.

### `registerMenus(items)`

Registers all menu items with Chrome. Sets up click listener automatically.

### `updateMenu(id, updates)`

Updates a menu item. Available: `title`, `enabled`, `visible`, `checked`.

### `removeMenu(id)` / `removeAllMenus()`

Removes a single menu or all menus.

## Permissions

Add `contextMenus` to your `manifest.json`:

```json
{
  "manifest_version": 3,
  "permissions": ["contextMenus"]
}
```

## License

MIT

---

Built by [theluckystrike](https://github.com/theluckystrike) — [zovo.one](https://zovo.one)
