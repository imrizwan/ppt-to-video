import { describe, expect, test } from "vitest";
import { validateInput, validateOptions } from "../../src/core/validate";
import { ValidationError } from "../../src/errors";

describe("validateInput", () => {
  test("accepts valid input", () => {
    expect(() =>
      validateInput({
        bytes: new Uint8Array([1, 2, 3]),
        mimeType: "application/pdf"
      })
    ).not.toThrow();
  });

  test("rejects empty bytes", () => {
    expect(() =>
      validateInput({
        bytes: new Uint8Array(),
        mimeType: "application/pdf"
      })
    ).toThrow(ValidationError);
  });
});

describe("validateOptions", () => {
  test("accepts valid options", () => {
    expect(() =>
      validateOptions({
        filename: "out",
        video: {
          fps: 24,
          frameDurationMs: 1000,
          width: 1280,
          height: 720,
          format: "mp4"
        }
      })
    ).not.toThrow();
  });

  test("rejects invalid fps", () => {
    expect(() =>
      validateOptions({
        filename: "out",
        video: {
          fps: 0,
          frameDurationMs: 1000,
          width: 1280,
          height: 720,
          format: "mp4"
        }
      })
    ).toThrow(ValidationError);
  });
});
