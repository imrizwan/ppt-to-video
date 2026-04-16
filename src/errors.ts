export class P2VError extends Error {
  public readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "P2VError";
    this.code = code;
  }
}

export class ValidationError extends P2VError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message);
    this.name = "ValidationError";
  }
}

export class RuntimeError extends P2VError {
  constructor(message: string) {
    super("RUNTIME_ERROR", message);
    this.name = "RuntimeError";
  }
}
