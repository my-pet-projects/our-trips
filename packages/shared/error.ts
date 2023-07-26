import type { Json } from "./types";

const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNAUTHENTICATED: 401,

  INTERNAL_SERVER_ERROR: 500,
  INTERNAL_CLIENT_ERROR: 500,
} as const;

type ErrorCode = keyof typeof ERROR_CODES;

export class AppError<TShape extends Json = { message: string }> extends Error {
  public readonly cause?: Error;
  public readonly code: ErrorCode;
  public readonly data?: TShape;

  constructor(opts: {
    code: keyof typeof ERROR_CODES;
    message?: string;
    cause?: unknown;
    data?: TShape;
  }) {
    const message = opts.message ?? messageFromUnknown(opts.cause, opts.code);

    super(message);
    this.code = opts.code;
    this.data = opts.data;

    if (opts.cause instanceof Error) {
      this.cause = opts.cause;
    } else if (opts.cause instanceof Response) {
      this.cause = new Error(
        `Response ${opts.cause.status} ${opts.cause.statusText}`,
      );
    } else if (typeof opts.cause === "string") {
      this.cause = new Error(opts.cause);
    } else {
      this.cause = undefined;
    }
  }

  public static async fromResponse(response: Response) {
    const resText = await response.text();
    const json = JSON.parse(resText) as Json;
    const message =
      json &&
      typeof json === "object" &&
      "message" in json &&
      typeof json.message === "string"
        ? json.message
        : undefined;
    return new AppError({
      message,
      code: getErrorTypeFromStatusCode(response.status),
      cause: response,
      data: json,
    });
  }
}

function messageFromUnknown(cause: unknown, fallback?: string) {
  if (typeof cause === "string") {
    return cause;
  }
  if (cause instanceof Error) {
    return cause.message;
  }
  if (
    cause &&
    typeof cause === "object" &&
    "message" in cause &&
    typeof cause.message === "string"
  ) {
    return cause.message;
  }
  return fallback ?? "An unknown error occurred";
}

function getErrorTypeFromStatusCode(statusCode: number): ErrorCode {
  for (const [code, status] of Object.entries(ERROR_CODES)) {
    if (status === statusCode) {
      return code as ErrorCode;
    }
  }
  return "INTERNAL_SERVER_ERROR";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getStatusCodeFromError(error: AppError<any>) {
  return ERROR_CODES[error.code] ?? 500;
}
