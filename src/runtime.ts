import type { PluginRuntime } from "openclaw/plugin-sdk/core";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import type { CoreConfig } from "./types.js";

const { setRuntime: setVkRuntime, getRuntime: getVkRuntime } =
  createPluginRuntimeStore<PluginRuntime>("VK runtime not initialized - plugin not registered");

type CompatibleRuntimeConfig = PluginRuntime["config"] & {
  loadConfig?: () => unknown;
};

export function readVkRuntimeConfig(runtime: PluginRuntime = getVkRuntime()): CoreConfig {
  const config = runtime.config as CompatibleRuntimeConfig;
  if (typeof config.current === "function") {
    return config.current() as unknown as CoreConfig;
  }
  if (typeof config.loadConfig === "function") {
    return config.loadConfig() as CoreConfig;
  }
  throw new Error("OpenClaw runtime does not expose a readable config API");
}

export { getVkRuntime, setVkRuntime };
