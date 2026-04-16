import { readFile } from "node:fs/promises";
import type { ConverterPipeline } from "../core/pipeline";
import type { ConversionOptions, VideoArtifact } from "../types";

export async function convertFromFile(
  filePath: string,
  mimeType: string,
  options: ConversionOptions,
  pipeline: ConverterPipeline
): Promise<VideoArtifact> {
  const bytes = new Uint8Array(await readFile(filePath));
  return pipeline.convert(
    {
      bytes,
      mimeType,
      sourceName: filePath
    },
    options
  );
}
