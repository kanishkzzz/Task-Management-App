import api from './api';
import { LoginPayload, RegisterPayload, AuthResponse } from '@/types/auth';
import { tokenStorage } from './storage';

export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  tokenStorage.setAuth(data.data);
  return data.data;
}

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  tokenStorage.setAuth(data.data);
  return data.data;
}

export function logoutUser() {
  tokenStorage.clear();
}

export function isAuthenticated() {
  return Boolean(tokenStorage.getAccessToken());
}
