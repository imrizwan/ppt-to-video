# ppt-to-video

`ppt-to-video` is a WASM-first conversion module for modern JavaScript runtimes.  
It gives you one API style for Node.js, browsers, and workers, with strict validation and deterministic test gates.

## Why this module

- Cross-runtime design: Node + browser + Web Worker friendly.
- WASM runtime manager abstraction for engine-based conversion.
- Typed outputs (`Uint8Array`) so you can save, upload, stream, or post-process anywhere.
- Strict errors (`ValidationError`, `RuntimeError`) for predictable failure handling.
- Backward compatibility bridge through `p2vConverter(...)`.

## Installation

```bash
npm install ppt-to-video
```

Node.js `>=20` is recommended.

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Public API](#public-api)
- [Usage Examples](#usage-examples)
- [Legacy API Migration](#legacy-api-migration)
- [Error Handling](#error-handling)
- [Testing and Quality Gates](#testing-and-quality-gates)
- [Architecture Overview](#architecture-overview)
- [FAQ](#faq)

## Quick Start

```ts
import { createDefaultPipeline } from "ppt-to-video";

const pipeline = createDefaultPipeline();

const artifact = await pipeline.convert(
  {
    bytes: new Uint8Array([1, 2, 3, 4]),
    mimeType: "application/pdf",
    sourceName: "slides.pdf"
  },
  {
    filename: "demo-output",
    thumbnail: true,
    video: {
      fps: 24,
      frameDurationMs: 500,
      width: 1280,
      height: 720,
      format: "mp4"
    }
  }
);

console.log(artifact.metadata);
// { frameCount: ..., durationMs: ..., runtime: "node" | "browser" | "worker" }
```

## Core Concepts

### 1) Input object

```ts
type ConversionInput = {
  bytes: Uint8Array;
  mimeType: string;
  sourceName?: string;
};
```

### 2) Conversion options

```ts
type ConversionOptions = {
  filename: string;
  thumbnail?: boolean;
  video: {
    fps: number;
    frameDurationMs: number;
    width: number;
    height: number;
    format: "mp4" | "webm";
  };
};
```

### 3) Result artifact

```ts
type VideoArtifact = {
  video: Uint8Array;
  thumbnail?: Uint8Array;
  metadata: {
    frameCount: number;
    durationMs: number;
    runtime: "node" | "browser" | "worker";
  };
};
```

## Public API

### `createDefaultPipeline()`

Creates a ready-to-use pipeline with default WASM runtime manager + engine wiring.

### `convertFromFile(filePath, mimeType, options, pipeline)`

Node adapter convenience method:
- reads file bytes from disk
- forwards to pipeline conversion

### `convertFromBlob(blob, mimeType, options, pipeline)`

Browser adapter convenience method:
- reads bytes from a `Blob`
- forwards to pipeline conversion

### `p2vConverter(...)`

Legacy compatibility API (Node-focused).  
Internally delegates to v2 pipeline behavior.

## Usage Examples

### Node.js example (file path input)

```ts
import { createDefaultPipeline, convertFromFile } from "ppt-to-video";
import { writeFile } from "node:fs/promises";

const pipeline = createDefaultPipeline();

const result = await convertFromFile(
  "./samples/deck.pdf",
  "application/pdf",
  {
    filename: "node-demo",
    thumbnail: true,
    video: {
      fps: 30,
      frameDurationMs: 400,
      width: 1920,
      height: 1080,
      format: "mp4"
    }
  },
  pipeline
);

await writeFile("./output/node-demo.mp4", result.video);
if (result.thumbnail) {
  await writeFile("./output/node-demo-thumb.bin", result.thumbnail);
}
```

### Browser example (Blob input)

```ts
import { createDefaultPipeline, convertFromBlob } from "ppt-to-video";

const input = document.querySelector<HTMLInputElement>("#file");
const file = input?.files?.[0];
if (!file) throw new Error("No file selected");

const pipeline = createDefaultPipeline();
const result = await convertFromBlob(
  file,
  file.type || "application/pdf",
  {
    filename: "browser-demo",
    video: {
      fps: 24,
      frameDurationMs: 500,
      width: 1280,
      height: 720,
      format: "webm"
    }
  },
  pipeline
);

const blob = new Blob([result.video], { type: "video/webm" });
const url = URL.createObjectURL(blob);
// attach url to a <video> tag or download link
```

### Worker usage notes

The package exposes a worker entrypoint (`./worker`) and internally supports worker runtime detection.  
Use workers to keep UI responsive for heavier conversion loads.

## Legacy API Migration

If you used v1 style:

```ts
import { p2vConverter } from "ppt-to-video";
```

This still works, but for new development prefer:
- `createDefaultPipeline()`
- `convertFromFile(...)` / `convertFromBlob(...)`

### Mapping old to new

- Old positional arguments -> New structured options.
- Implicit defaults -> Explicit `video` config (`fps`, `frameDurationMs`, dimensions, format).
- File path assumptions -> Explicit runtime adapter choice.

## Error Handling

The module exports:
- `P2VError` (base)
- `ValidationError`
- `RuntimeError`

Example:

```ts
import { ValidationError, RuntimeError } from "ppt-to-video";

try {
  // conversion call
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Input/options issue:", error.message);
  } else if (error instanceof RuntimeError) {
    console.error("Runtime or engine issue:", error.message);
  } else {
    console.error("Unexpected failure:", error);
  }
}
```

## Testing and Quality Gates

This project uses a strict no-tolerance quality policy.

### Available scripts

- `npm test` - full test run with coverage
- `npm run test:perf` - performance checks
- `npm run test:real-ppt` - real generated PPTX conversion test
- `npm run test:real-pdf` - real generated PDF conversion test
- `npm run test:complete` - lint + typecheck + all test suites + build
- `npm run ci` - clean + strict CI validation chain

### Recommended local validation

```bash
npm run test:complete
```

## Architecture Overview

High-level package structure:

- `src/core` - validation + orchestration pipeline
- `src/adapters/node` - filesystem adapter
- `src/adapters/web` - blob/arraybuffer adapter
- `src/wasm` - runtime manager + worker entry + engine wiring
- `src/legacy.ts` - compatibility bridge

## FAQ

### Does this require external tools like LibreOffice/ffmpeg/GraphicsMagick?

No external binaries are required by the current v2 architecture.

### Can I use this in the browser?

Yes. Use `convertFromBlob(...)` with your frontend file input or fetched binary data.

### Can I keep using the old API while migrating?

Yes. `p2vConverter(...)` is preserved to ease migration, but new code should move to v2 APIs.

### Is output deterministic?

The module and test strategy are designed for deterministic behavior with strict CI gates.

---

If you are building something cool with `ppt-to-video`, feel free to open an issue or share your use case.
