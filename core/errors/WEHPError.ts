class WEHPError extends Error {
  statusCode: number;
  message: string;
  data: any;
  constructor(statusCode, message, data = null) {
      super();
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
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

class UnauthorizedError extends WEHPError {
  constructor() {
      super(401, "Unauthorized");
  }
}

type TooManyAttemptsData = {
  minutesLeft: number,
  secondsLeft: number,
  totalSeconds: number
}

class TimedOutError extends WEHPError {
  constructor(message = "Too many attempts", data: TooManyAttemptsData = null) {
      super(429, message, data);
  }
}

export { WEHPError, UnexistingResourceError, BodyParsingError, StateError, UnauthorizedError, TimedOutError };

