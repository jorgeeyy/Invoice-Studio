import type { AuthResponse, LoginInput, SignupInput, User } from '@/types';
import { apiClient } from './client';

export async function login(input: LoginInput): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/login', input, { public: true });
}

export async function register(input: SignupInput): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/register', input, { public: true });
}

export async function logout(): Promise<void> {
  return apiClient.post('/auth/logout', {}, { public: true });
}

export async function fetchCurrentUser(): Promise<User> {
  return apiClient.get<User>('/auth/me', undefined, { public: true });
}