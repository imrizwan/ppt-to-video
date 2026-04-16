import { ConverterPipeline } from "./core/pipeline";
import { WasmRuntimeManager } from "./wasm/runtime";
import { SyntheticWasmEngine } from "./wasm/synthetic-engine";
import { convertFromFile } from "./adapters/node";
import { convertFromBlob } from "./adapters/web";
import { p2vConverter } from "./legacy";

export type { ConversionInput, ConversionOptions, VideoArtifact, VideoOptionsV2 } from "./types";
export { ValidationError, RuntimeError, P2VError } from "./errors";
export { p2vConverter, convertFromFile, convertFromBlob };

export function createDefaultPipeline() {
  const manager = new WasmRuntimeManager({
    engines: [new SyntheticWasmEngine()]
  });
  return new ConverterPipeline(manager);
}
