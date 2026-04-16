import { ConverterPipeline } from "../core/pipeline";
import { WasmRuntimeManager } from "./runtime";
import { SyntheticWasmEngine } from "./synthetic-engine";
import type { ConversionInput, ConversionOptions } from "../types";

const manager = new WasmRuntimeManager({
  engines: [new SyntheticWasmEngine()]
});
const pipeline = new ConverterPipeline(manager);

export async function convertInWorker(input: ConversionInput, options: ConversionOptions) {
  return pipeline.convert(input, options);
}

type WorkerRequest = {
  type: "convert";
  payload: {
    input: ConversionInput;
    options: ConversionOptions;
  };
};

if (typeof self !== "undefined" && "postMessage" in self) {
  self.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
    if (event.data?.type !== "convert") {
      return;
    }
    void (async () => {
      try {
        const result = await convertInWorker(event.data.payload.input, event.data.payload.options);
        self.postMessage({ ok: true, result });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown worker error";
        self.postMessage({ ok: false, error: message });
      }
    })();
  });
}
