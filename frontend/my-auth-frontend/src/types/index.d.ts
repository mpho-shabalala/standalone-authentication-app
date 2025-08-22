export interface User {
  username: string;
  password: string;
  userID: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  result:{
    httpCode: number;
    status: 'success' | 'error';
    message: string;
    statusCode: string;
    data?: {
      user: {
        userID: string,
          username: string,
          email: string,
      };
      token?: string;
      refreshToken?: string;
    }
  }
}



export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  contacts: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthState {
  email: string | null,
  user: {
        userID: string,
          username: string,
          email: string,
      } | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface RenewPasswordPayload{
  token: string, newPassword: string
}

export interface ResponseMessage {
    success: boolean
    message: string,
    statusCode: string
}


