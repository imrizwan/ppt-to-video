import { describe, expect, test } from "vitest";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createDefaultPipeline, convertFromBlob, convertFromFile } from "../../src";

describe("cross-runtime adapters", () => {
  test("node adapter converts from file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "p2v-"));
    try {
      const file = join(dir, "input.pdf");
      await writeFile(file, Buffer.from([1, 2, 3, 4]));
      const pipeline = createDefaultPipeline();
      const result = await convertFromFile(
        file,
        "application/pdf",
        {
          filename: "node-adapter",
          video: { fps: 10, frameDurationMs: 1000, width: 800, height: 600, format: "webm" }
        },
        pipeline
      );
      expect(result.video.length).toBeGreaterThan(0);
      expect(result.metadata.runtime).toBe("node");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("web adapter converts from blob", async () => {
    const pipeline = createDefaultPipeline();
    const blob = new Blob([new Uint8Array([7, 8, 9])], { type: "application/pdf" });
    const result = await convertFromBlob(
      blob,
      "application/pdf",
      {
        filename: "web-adapter",
        video: { fps: 12, frameDurationMs: 1000, width: 640, height: 360, format: "mp4" }
      },
      pipeline
    );
    expect(result.video.length).toBeGreaterThan(0);
  });
});
