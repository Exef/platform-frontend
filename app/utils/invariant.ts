export class InvariantError extends Error {
  type = "InvariantError";
}

export function invariant(value: any, message: string): void {
  if (!value) {
    throw new InvariantError(message);
  }
}
