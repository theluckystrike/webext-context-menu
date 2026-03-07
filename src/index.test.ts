import { describe, it, expect, vi, beforeEach } from "vitest";
import { MenuItem, createMenu, createSeparator, registerMenus, updateMenu, removeMenu, removeAllMenus } from "./index";

// Mock chrome API
const mockCreate = vi.fn();
const mockRemove = vi.fn((_id: string, cb: () => void) => cb());
const mockRemoveAll = vi.fn((cb: () => void) => cb());
const mockUpdate = vi.fn((_id: string, _props: any, cb: () => void) => cb());
const mockAddListener = vi.fn();

const globalAny = globalThis as any;
globalAny.chrome = {
  contextMenus: {
    create: mockCreate,
    remove: mockRemove,
    removeAll: mockRemoveAll,
    update: mockUpdate,
    onClicked: { addListener: mockAddListener },
  },
  runtime: { lastError: null },
};

describe("webext-context-menu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalAny.chrome.runtime.lastError = null;
  });

  it("creates a basic menu item", () => {
    const item = createMenu({ id: "test", title: "Test Item" });
    expect(item).toBeInstanceOf(MenuItem);
    expect(item.getItem().options.id).toBe("test");
    expect(item.getItem().options.title).toBe("Test Item");
  });

  it("creates a menu item with contexts", () => {
    const item = createMenu({ id: "ctx", title: "Context", contexts: ["selection", "link"] });
    expect(item.getItem().options.contexts).toEqual(["selection", "link"]);
  });

  it("creates a separator", () => {
    const sep = createSeparator("sep1");
    expect(sep.getItem().options.type).toBe("separator");
    expect(sep.getItem().options.title).toBe("");
  });

  it("creates a separator with parentId", () => {
    const sep = createSeparator("sep2", "parent");
    expect(sep.getItem().options.parentId).toBe("parent");
  });

  it("adds a child to a menu item", () => {
    const parent = createMenu({ id: "parent", title: "Parent" });
    const child = createMenu({ id: "child", title: "Child" });
    parent.addChild(child);
    expect(parent.getItem().children).toHaveLength(1);
    expect(parent.getItem().children[0].options.id).toBe("child");
  });

  it("adds multiple children", () => {
    const parent = createMenu({ id: "p", title: "Parent" });
    const c1 = createMenu({ id: "c1", title: "Child 1" });
    const c2 = createMenu({ id: "c2", title: "Child 2" });
    parent.addChildren([c1, c2]);
    expect(parent.getItem().children).toHaveLength(2);
  });

  it("supports chaining addChild", () => {
    const parent = createMenu({ id: "p", title: "P" });
    const c1 = createMenu({ id: "c1", title: "C1" });
    const c2 = createMenu({ id: "c2", title: "C2" });
    const result = parent.addChild(c1).addChild(c2);
    expect(result).toBe(parent);
    expect(parent.getItem().children).toHaveLength(2);
  });

  it("registers menus with chrome API", () => {
    const item = createMenu({ id: "reg", title: "Register" });
    registerMenus([item]);
    expect(mockRemoveAll).toHaveBeenCalled();
    // removeAll callback triggers create
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ id: "reg", title: "Register" })
    );
    expect(mockAddListener).toHaveBeenCalled();
  });

  it("registers nested menus with parentId", () => {
    const parent = createMenu({ id: "p", title: "Parent" });
    const child = createMenu({ id: "c", title: "Child" });
    parent.addChild(child);
    registerMenus([parent]);
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ id: "c", parentId: "p" })
    );
  });

  it("dispatches click handlers", () => {
    const handler = vi.fn();
    const item = createMenu({ id: "click", title: "Click Me" }, handler);
    registerMenus([item]);

    const listener = mockAddListener.mock.calls[mockAddListener.mock.calls.length - 1][0];
    const info = { menuItemId: "click" } as chrome.contextMenus.OnClickData;
    listener(info, undefined);
    expect(handler).toHaveBeenCalledWith(info, undefined);
  });

  it("updates a menu item", async () => {
    await updateMenu("test", { title: "Updated" });
    expect(mockUpdate).toHaveBeenCalledWith("test", { title: "Updated" }, expect.any(Function));
  });

  it("removes a menu item", async () => {
    await removeMenu("test");
    expect(mockRemove).toHaveBeenCalledWith("test", expect.any(Function));
  });

  it("removes all menus", async () => {
    await removeAllMenus();
    expect(mockRemoveAll).toHaveBeenCalled();
  });

  it("rejects on update error", async () => {
    globalAny.chrome.runtime.lastError = { message: "update failed" };
    mockUpdate.mockImplementationOnce((_id: string, _props: any, cb: () => void) => cb());
    await expect(updateMenu("bad", { title: "X" })).rejects.toThrow("update failed");
  });

  it("creates menu with checkbox type", () => {
    const item = createMenu({ id: "cb", title: "Check", type: "checkbox", checked: true });
    expect(item.getItem().options.type).toBe("checkbox");
    expect(item.getItem().options.checked).toBe(true);
  });
});
