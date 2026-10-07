import axios from "axios";

//* ValidationPipe answers 400 with { message: string[] },
//* NotFoundException with { message: string }.
export function getErrorMessage(error: unknown): string[] {
  if (axios.isAxiosError(error) && error.response) {
    const { message } = error.response.data as { message?: string | string[] };
    if (Array.isArray(message)) return message;
    if (message) return [message];
  }
  return ["Something went wrong, please try again."];
}
