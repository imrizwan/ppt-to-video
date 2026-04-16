import { RuntimeError } from "../errors";
import type { ConversionInput, ConversionOptions, RuntimeKind, WasmEngine } from "../types";

export interface RuntimeCapabilities {
  hasWorker: boolean;
  hasWebAssembly: boolean;
  runtime: RuntimeKind;
}

export interface RuntimeManagerOptions {
  engines: WasmEngine[];
  capabilities?: RuntimeCapabilities;
}

export class WasmRuntimeManager {
  private readonly engines: WasmEngine[];
  private readonly capabilities: RuntimeCapabilities;

  constructor(options: RuntimeManagerOptions) {
    this.engines = options.engines;
    this.capabilities = options.capabilities ?? probeCapabilities();
    if (this.engines.length === 0) {
      throw new RuntimeError("No WASM engines configured");
    }
  }

  getCapabilities(): RuntimeCapabilities {
    return this.capabilities;
  }

  pickEngine(input: ConversionInput): WasmEngine {
    const selected = this.engines.find((engine) => engine.supports(input.mimeType));
    if (!selected) {
      throw new RuntimeError(`No WASM engine supports mime type: ${input.mimeType}`);
    }
    return selected;
  }

  async run(input: ConversionInput, options: ConversionOptions) {
    if (!this.capabilities.hasWebAssembly) {
      throw new RuntimeError("WebAssembly is unavailable in this runtime");
    }

    const engine = this.pickEngine(input);
    const rendered = await engine.renderSlides(input, options);
    const video = await engine.encodeVideo(rendered.frames, options);
    return { video, thumbnail: rendered.thumbnail, engine };
  }
}

export function probeCapabilities(): RuntimeCapabilities {
  /* c8 ignore start */
  const isNode = typeof process !== "undefined" && !!process.versions?.node;
  const isWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
  const runtime: RuntimeKind = isNode ? "node" : (isWorker ? "worker" : "browser");
  /* c8 ignore stop */
  return {
    runtime,
    hasWorker: typeof Worker !== "undefined" || isNode,
    hasWebAssembly: typeof WebAssembly !== "undefined"
  };
}
