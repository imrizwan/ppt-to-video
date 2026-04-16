import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import PptxGenJS from "pptxgenjs";
import { describe, expect, test } from "vitest";
import { convertFromFile, createDefaultPipeline } from "../../src";

async function createRealPptx(targetPath: string): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  const slide = pptx.addSlide();
  slide.addText("Real PPTX integration test", {
    x: 0.6,
    y: 0.8,
    w: 8.0,
    h: 1.0,
    fontSize: 24,
    bold: true
  });
  slide.addText("This file is generated during test runtime.", {
    x: 0.6,
    y: 2.0,
    w: 8.5,
    h: 0.8,
    fontSize: 14
  });
  await pptx.writeFile({ fileName: targetPath });
}

describe("real ppt conversion", () => {
  test("converts a real generated pptx file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "p2v-real-ppt-"));
    try {
      const pptxPath = join(dir, "sample.pptx");
      await createRealPptx(pptxPath);

      const pipeline = createDefaultPipeline();
      const result = await convertFromFile(
        pptxPath,
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        {
          filename: "real-ppt-converted",
          thumbnail: true,
          video: {
            fps: 24,
            frameDurationMs: 500,
            width: 1280,
            height: 720,
            format: "mp4"
          }
        },
        pipeline
      );

      expect(result.video.length).toBeGreaterThan(0);
      expect(result.thumbnail).toBeDefined();
      expect(result.metadata.frameCount).toBe(12);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
