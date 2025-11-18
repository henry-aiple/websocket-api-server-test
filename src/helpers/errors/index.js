import {StatusCodes} from 'http-status-codes';
import errorCodes from './error-codes.js';
import {inspect} from 'util';

class HttpError extends Error {
  constructor(statusCode, message, errorCode, details) {
    super(message);
    this.code = statusCode;
    this.error = {
      code: errorCode || errorCodes.GENERAL_INTERNAL_SERVER_ERROR,
      message,
      details,
    };
  }
  toString() {
    const {code, error} = this;
    let result = `${code}/${error.code}: ${error.message}`;
    if (error.details) result += `: ${inspect(error.details)}`;

    return result;
  }
}

// base http status classes.
class Unauthorized extends HttpError {
  constructor(message, errorCode) {
    super(
      StatusCodes.UNAUTHORIZED,
      message || 'unauthorized',
      errorCode || errorCodes.GENERAL_UNAUTHORIZED,
    );
  }
}

class AccessTokenExpired extends HttpError {
  constructor(message, errorCode) {
    super(
      StatusCodes.UNAUTHORIZED,
      message || 'token expired',
      errorCode || errorCodes.GENERAL_UNAUTHORIZED,
    );
  }
}

class BadRequest extends HttpError {
  constructor(message, errorCode, details) {
    super(
      StatusCodes.BAD_REQUEST,
      message || 'bad request',
      errorCode || errorCodes.GENERAL_BAD_REQUEST,
      details,
    );
  }
}

class UserLimitExceeded extends HttpError {
  constructor(message, errorCode, details) {
    super(
      StatusCodes.FORBIDDEN,
      message || 'user limit exceeded',
      errorCode || errorCodes.USER_LIMIT_EXCEEDED,
      details,
    );
  }
}

class UserBlocked extends HttpError {
  constructor(message, errorCode, details) {
    super(
      StatusCodes.FORBIDDEN,
      message || 'user blocked',
      errorCode || errorCodes.USER_BLOCKED,
      details,
    );
  }
}

class InternalServerError extends HttpError {
  constructor(message, errorCode) {
    super(
      StatusCodes.INTERNAL_SERVER_ERROR,
      message || 'internal server error',
      errorCode || errorCodes.GENERAL_INTERNAL_SERVER_ERROR,
    );
  }
}

class Forbidden extends HttpError {
  constructor(message, errorCode) {
    super(
      StatusCodes.FORBIDDEN,
      message || 'forbidden',
      errorCode || errorCodes.GENERAL_FORBIDDEN,
    );
  }
}

class NotFound extends HttpError {
  constructor(message, errorCode) {
    super(
      StatusCodes.NOT_FOUND,
      message || 'not found',
      errorCode || errorCodes.GENERAL_NOT_FOUND,
    );
  }
}

class TargetNotFound extends HttpError {
  constructor(message, errorCode, details) {
    super(
      StatusCodes.NOT_FOUND,
      message || 'target not found',
      errorCode || errorCodes.TARGET_NOT_FOUND,
      details,
    );
  }
}

class Gone extends HttpError {
  constructor(message, errorCode) {
    super(
      StatusCodes.GONE,
      message || 'gone',
      errorCode || errorCodes.GENERAL_GONE,
    );
  }
}

class LockedError extends HttpError {
  constructor(message, errorCode) {
    super(
      StatusCodes.LOCKED,
      message || 'already taken',
      errorCode || errorCodes.GENERAL_LOCKED,
    );
  }
}

class TooManyRequests extends HttpError {
  constructor(message, errorCode) {
    super(
      StatusCodes.TOO_MANY_REQUESTS,
      message || 'too many requests',
      errorCode || errorCodes.GENERAL_LOCKED,
    );
  }
}

// detailed specific error with error codes
// 400
class ReqValidationFailed extends BadRequest {
  constructor(message, details) {
    super(message, errorCodes.REQ_VALIDATION_FAILED, details);
  }
}

const handleException = (res, error) => {
  if (error instanceof HttpError) {
    return res
      .status(error.code)
      .send(error.message);
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({error: {message: 'internal server error'}});
};

export default {
  HttpError,
  errorCodes,
  Unauthorized,
  AccessTokenExpired,
  BadRequest,
  TargetNotFound,
  UserLimitExceeded,
  UserBlocked,
  InternalServerError,
  Forbidden,
  NotFound,
  Gone,
  LockedError,
  TooManyRequests,
  ReqValidationFailed,
  handleException,
};
