export class NoCredentialError extends Error {
  constructor(message: string = "No credentials provided.") {
    super(message);
    this.name = "NoCredentialError";
    this.message = message;
  }
}
