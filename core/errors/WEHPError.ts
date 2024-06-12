class WEHPError extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
  }
}

class UnexistingResourceError extends WEHPError {
  constructor(message) {
      super(404, message);
  }
}

class BodyParsingError extends WEHPError {
  constructor(message) {
      super(400, message);
  }
}

class StateError extends WEHPError {
  constructor(message) {
      super(400, message);
  }
}

export { WEHPError, UnexistingResourceError, BodyParsingError, StateError };

