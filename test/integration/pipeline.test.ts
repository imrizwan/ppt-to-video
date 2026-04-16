import { describe, expect, test } from "vitest";
import { createDefaultPipeline } from "../../src";
import { RuntimeError } from "../../src/errors";

describe("pipeline integration", () => {
  test("returns engine runtime info", () => {
    const pipeline = createDefaultPipeline();
    const info = pipeline.getEngineInfo();
    expect(info.wasmEnabled).toBe(true);
    expect(typeof info.runtime).toBe("string");
  });

  test("converts deterministic payload", async () => {
    const pipeline = createDefaultPipeline();
    const result = await pipeline.convert(
      {
        bytes: new Uint8Array([10, 20, 30, 40]),
        mimeType: "application/pdf",
        sourceName: "slides.pdf"
      },
      {
        filename: "demo",
        thumbnail: true,
        video: { fps: 24, frameDurationMs: 500, width: 1920, height: 1080, format: "mp4" }
      }
    );

    expect(result.video.length).toBeGreaterThan(10);
    expect(result.thumbnail).toBeDefined();
    expect(result.metadata.frameCount).toBe(12);
    expect(result.metadata.durationMs).toBe(6000);
  });

  test("rejects unsupported mime", async () => {
    const pipeline = createDefaultPipeline();
    await expect(
      pipeline.convert(
        {
          bytes: new Uint8Array([10, 20]),
          mimeType: "text/plain"
        },
        {
          filename: "demo",
          video: { fps: 24, frameDurationMs: 500, width: 1920, height: 1080, format: "mp4" }
        }
      )
    ).rejects.toThrow(RuntimeError);
  });
});
