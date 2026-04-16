import { readFile } from "node:fs/promises";
import { ConverterPipeline } from "./core/pipeline";
import { WasmRuntimeManager } from "./wasm/runtime";
import { SyntheticWasmEngine } from "./wasm/synthetic-engine";
import type { ConversionOptions } from "./types";

export async function p2vConverter(
  filepath: string,
  filename: string,
  videoOptions: {
    fps?: number;
    format?: "mp4" | "webm";
  } = {},
  _pdf2PicOptions?: Record<string, unknown>,
  _videoPath?: string,
  thumbnail = false
) {
  const bytes = new Uint8Array(await readFile(filepath));
  const manager = new WasmRuntimeManager({
    engines: [new SyntheticWasmEngine()],
    capabilities: {
      runtime: "node",
      hasWorker: true,
      hasWebAssembly: true
    }
  });
  const pipeline = new ConverterPipeline(manager);
  const options: ConversionOptions = {
    filename,
    thumbnail,
    video: {
      fps: videoOptions.fps ?? 24,
      frameDurationMs: 1000,
      width: 1280,
      height: 720,
      format: videoOptions.format ?? "mp4"
    }
  };
  return pipeline.convert(
    {
      bytes,
      mimeType: "application/pdf",
      sourceName: filepath
    },
    options
  );
}
