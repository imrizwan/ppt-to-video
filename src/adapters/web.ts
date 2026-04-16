import type { ConverterPipeline } from "../core/pipeline";
import type { ConversionOptions, VideoArtifact } from "../types";

export async function convertFromBlob(
  blob: Blob,
  mimeType: string,
  options: ConversionOptions,
  pipeline: ConverterPipeline
): Promise<VideoArtifact> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  return pipeline.convert({ bytes, mimeType }, options);
}
