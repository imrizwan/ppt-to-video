import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, test } from "vitest";
import { p2vConverter } from "../../src";
import { convertInWorker } from "../../src/wasm/worker";

describe("legacy and worker paths", () => {
  test("legacy p2vConverter maps to new pipeline", async () => {
    const dir = await mkdtemp(join(tmpdir(), "p2v-legacy-"));
    try {
      const file = join(dir, "legacy.pdf");
      await writeFile(file, Buffer.from([3, 4, 5, 6]));
      const result = await p2vConverter(
        file,
        "legacy-output",
        { fps: 12, format: "webm" },
        {},
        dir,
        true
      );
      expect(result.metadata.frameCount).toBe(6);
      expect(result.thumbnail).toBeDefined();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("legacy p2vConverter applies defaults", async () => {
    const dir = await mkdtemp(join(tmpdir(), "p2v-legacy-default-"));
    try {
      const file = join(dir, "legacy-default.pdf");
      await writeFile(file, Buffer.from([9, 9, 9]));
      const result = await p2vConverter(file, "legacy-default");
      expect(result.metadata.frameCount).toBe(12);
      expect(result.thumbnail).toBeUndefined();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("worker conversion function returns artifact", async () => {
    const result = await convertInWorker(
      {
        bytes: new Uint8Array([10, 11, 12]),
        mimeType: "application/pdf"
      },
      {
        filename: "worker",
        video: { fps: 10, frameDurationMs: 500, width: 640, height: 360, format: "mp4" }
      }
    );
    expect(result.video.length).toBeGreaterThan(0);
    expect(result.metadata.frameCount).toBe(5);
  });
});
