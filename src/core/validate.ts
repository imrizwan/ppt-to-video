import { ValidationError } from "../errors";
import type { ConversionInput, ConversionOptions } from "../types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new ValidationError(message);
  }
}

export function validateInput(input: ConversionInput): void {
  assert(input != null, "input is required");
  assert(input.bytes instanceof Uint8Array, "input.bytes must be Uint8Array");
  assert(input.bytes.length > 0, "input.bytes must not be empty");
  assert(typeof input.mimeType === "string" && input.mimeType.length > 0, "input.mimeType is required");
}

export function validateOptions(options: ConversionOptions): void {
  assert(options != null, "options are required");
  assert(typeof options.filename === "string" && options.filename.trim().length > 0, "filename is required");
  assert(options.video != null, "video options are required");
  assert(options.video.fps > 0 && Number.isFinite(options.video.fps), "video.fps must be > 0");
  assert(options.video.frameDurationMs > 0, "video.frameDurationMs must be > 0");
  assert(options.video.width > 0 && options.video.height > 0, "video dimensions must be > 0");
}
