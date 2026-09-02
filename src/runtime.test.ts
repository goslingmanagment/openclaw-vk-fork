import type { PluginRuntime } from "openclaw/plugin-sdk/core";
import { describe, expect, it, vi } from "vitest";
import { readVkRuntimeConfig } from "./runtime.js";

vi.mock("openclaw/plugin-sdk/runtime-store", () => ({
  createPluginRuntimeStore: () => ({
    setRuntime: vi.fn(),
    getRuntime: vi.fn(),
  }),
}));

describe("readVkRuntimeConfig", () => {
  it("uses the current OpenClaw config API", () => {
    const expected = { channels: { vk: { enabled: true } } };
    const current = vi.fn().mockReturnValue(expected);
    const runtime = { config: { current } } as unknown as PluginRuntime;

    expect(readVkRuntimeConfig(runtime)).toBe(expected);
    expect(current).toHaveBeenCalledOnce();
  });

  it("falls back to the legacy OpenClaw config API", () => {
    const expected = { channels: { vk: { enabled: true } } };
    const loadConfig = vi.fn().mockReturnValue(expected);
    const runtime = { config: { loadConfig } } as unknown as PluginRuntime;

    expect(readVkRuntimeConfig(runtime)).toBe(expected);
    expect(loadConfig).toHaveBeenCalledOnce();
  });

  it("fails clearly when no readable config API exists", () => {
    const runtime = { config: {} } as unknown as PluginRuntime;

    expect(() => readVkRuntimeConfig(runtime)).toThrow(
      "OpenClaw runtime does not expose a readable config API",
    );
  });
});
