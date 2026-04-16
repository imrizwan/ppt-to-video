import { describe, expect, test } from "vitest";
import { createDefaultPipeline } from "../../src";

describe("performance gates", () => {
  test("small payload conversion stays under threshold", async () => {
    const pipeline = createDefaultPipeline();
    const start = performance.now();
    await pipeline.convert(
      {
        bytes: new Uint8Array(4096).fill(1),
        mimeType: "application/pdf"
      },
      {
        filename: "perf",
        video: { fps: 24, frameDurationMs: 100, width: 1280, height: 720, format: "mp4" }
      }
    );
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(250);
  });
});
