export type RuntimeKind = "node" | "browser" | "worker";

export interface VideoOptionsV2 {
  fps: number;
  frameDurationMs: number;
  width: number;
  height: number;
  format: "mp4" | "webm";
}

export interface ConversionOptions {
  filename: string;
  thumbnail?: boolean;
  video: VideoOptionsV2;
}

export interface ConversionInput {
  bytes: Uint8Array;
  mimeType: string;
  sourceName?: string;
}

export interface VideoArtifact {
  video: Uint8Array;
  thumbnail?: Uint8Array;
  metadata: {
    frameCount: number;
    durationMs: number;
    runtime: RuntimeKind;
  };
}

export interface P2VEngineResult {
  frames: Uint8Array[];
  thumbnail?: Uint8Array;
}

export interface WasmEngine {
  readonly name: string;
  readonly version: string;
  supports(mimeType: string): boolean;
  renderSlides(input: ConversionInput, options: ConversionOptions): Promise<P2VEngineResult>;
  encodeVideo(frames: Uint8Array[], options: ConversionOptions): Promise<Uint8Array>;
}
