export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

