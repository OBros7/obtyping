// components/MyLib/apiError.ts
export class ApiError extends Error {
  constructor(public message: string, public status?: number, public response?: Response) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}
