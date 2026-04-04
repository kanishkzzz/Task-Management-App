import api from './api';
import { LoginPayload, RegisterPayload, AuthTokens } from '@/types/auth';
import { tokenStorage } from './storage';

export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post<AuthTokens>('/auth/login', payload);
  tokenStorage.setTokens(data);
  return data;
}

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<AuthTokens>('/auth/register', payload);
  tokenStorage.setTokens(data);
  return data;
}

export function logoutUser() {
  tokenStorage.clear();
}

export function isAuthenticated() {
  return Boolean(tokenStorage.getAccessToken());
}
