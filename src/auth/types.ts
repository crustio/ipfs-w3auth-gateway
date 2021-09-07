interface AuthData {
  address: string;
  signature: string;
}

class AuthError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export {AuthData, AuthError};
