import { validateInput, validateOptions } from "./validate";
import type { WasmRuntimeManager } from "../wasm/runtime";
import type { ConversionInput, ConversionOptions, RuntimeKind, VideoArtifact } from "../types";

export interface PipelineOptions {
  runtimeKind?: RuntimeKind;
}

export class ConverterPipeline {
  constructor(private readonly runtimeManager: WasmRuntimeManager) {}

  async convert(input: ConversionInput, options: ConversionOptions, _pipelineOptions?: PipelineOptions): Promise<VideoArtifact> {
    validateInput(input);
    validateOptions(options);

    const runtime = this.runtimeManager.getCapabilities().runtime;
    const { video, thumbnail } = await this.runtimeManager.run(input, options);
    const frameCount = Math.max(1, Math.floor(options.video.fps / 2));
    const durationMs = frameCount * options.video.frameDurationMs;

    return {
      video,
      ...(thumbnail ? { thumbnail } : {}),
      metadata: {
        frameCount,
        durationMs,
        runtime
      }
    };
  }

  getEngineInfo() {
    const capabilities = this.runtimeManager.getCapabilities();
    return {
      runtime: capabilities.runtime,
      workerEnabled: capabilities.hasWorker,
      wasmEnabled: capabilities.hasWebAssembly
    };
  }
}
