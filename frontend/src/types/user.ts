export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  avatar?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  company?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
