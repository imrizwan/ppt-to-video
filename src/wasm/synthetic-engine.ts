import type { ConversionInput, ConversionOptions, P2VEngineResult, WasmEngine } from "../types";

function stableHash(input: Uint8Array): number {
  let hash = 2166136261;
  for (const byte of input) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function frameFrom(seed: number, index: number): Uint8Array {
  const frame = new Uint8Array(256);
  for (let i = 0; i < frame.length; i += 1) {
    frame[i] = (seed + index + i) % 256;
  }
  return frame;
}

export class SyntheticWasmEngine implements WasmEngine {
  public readonly name = "synthetic-wasm-engine";
  public readonly version = "1.0.0";

  supports(mimeType: string): boolean {
    return mimeType === "application/pdf" ||
      mimeType === "application/vnd.ms-powerpoint" ||
      mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  }

  async renderSlides(input: ConversionInput, options: ConversionOptions): Promise<P2VEngineResult> {
    const seed = stableHash(input.bytes);
    const frameCount = Math.max(1, Math.min(24, Math.floor(options.video.fps / 2)));
    const frames = Array.from({ length: frameCount }, (_unused, idx) => frameFrom(seed, idx));
    const thumbnail = options.thumbnail ? frames[0] : undefined;
    return {
      frames,
      ...(thumbnail ? { thumbnail } : {})
    };
  }

  async encodeVideo(frames: Uint8Array[], options: ConversionOptions): Promise<Uint8Array> {
    const header = `${options.video.format}|${options.filename}|${frames.length}|`;
    const headerBytes = new TextEncoder().encode(header);
    const bodyLength = frames.reduce((sum, frame) => sum + frame.length, 0);
    const merged = new Uint8Array(headerBytes.length + bodyLength);
    merged.set(headerBytes, 0);
    let offset = headerBytes.length;
    for (const frame of frames) {
      merged.set(frame, offset);
      offset += frame.length;
    }
    return merged;
  }
}
