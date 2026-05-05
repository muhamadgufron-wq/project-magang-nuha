export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  is_vip: boolean;
  created_at: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
}

export interface AuthResponse {
  user: {
    id: number;
    uuid: string;
    name: string;
    email: string;
    role: string;
    is_vip: boolean;
  };
  token: string;
}
