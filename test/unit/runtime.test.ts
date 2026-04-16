import { describe, expect, test } from "vitest";
import { WasmRuntimeManager } from "../../src/wasm/runtime";
import { RuntimeError } from "../../src/errors";
import { SyntheticWasmEngine } from "../../src/wasm/synthetic-engine";

describe("WasmRuntimeManager", () => {
  test("throws when no engines configured", () => {
    expect(
      () =>
        new WasmRuntimeManager({
          engines: [],
          capabilities: { runtime: "node", hasWorker: true, hasWebAssembly: true }
        })
    ).toThrow(RuntimeError);
  });

  test("selects synthetic engine for pdf", () => {
    const manager = new WasmRuntimeManager({
      engines: [new SyntheticWasmEngine()],
      capabilities: { runtime: "node", hasWorker: true, hasWebAssembly: true }
    });
    const selected = manager.pickEngine({
      bytes: new Uint8Array([1]),
      mimeType: "application/pdf"
    });
    expect(selected.name).toBe("synthetic-wasm-engine");
  });

  test("throws when wasm is unavailable", async () => {
    const manager = new WasmRuntimeManager({
      engines: [new SyntheticWasmEngine()],
      capabilities: { runtime: "node", hasWorker: true, hasWebAssembly: false }
    });
    await expect(
      manager.run(
        { bytes: new Uint8Array([1, 2]), mimeType: "application/pdf" },
        {
          filename: "x",
          video: { fps: 24, frameDurationMs: 1000, width: 1, height: 1, format: "mp4" }
        }
      )
    ).rejects.toThrow(RuntimeError);
  });
});
