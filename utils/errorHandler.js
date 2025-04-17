export class ErrorHandler extends Error {
  constructor(msg, statusCode) {
    super(msg);
    this.statusCode = statusCode;
  }
}
