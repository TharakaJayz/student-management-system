export class AppError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status = 400, details?: unknown) {
    super(message)
    this.name = "AppError"
    this.status = status
    this.details = details
  }
}

export function toErrorResponse(error: unknown): { body: unknown; status: number } {
  if (error instanceof AppError) {
    return {
      body: { error: error.message, details: error.details },
      status: error.status,
    }
  }

  if (error instanceof Error) {
    return { body: { error: error.message }, status: 500 }
  }

  return { body: { error: "Unknown server error" }, status: 500 }
}
