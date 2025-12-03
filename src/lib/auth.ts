import axios from "axios";
import Cookies from "js-cookie";

const TOKEN_KEY = "token";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
    provider: string;
  };
  token?: string;
  errors?: Record<string, string[]>;
}

// Login with email and password
export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(
      "/api/auth/login",
      credentials
    );

    if (response.data.success && response.data.token) {
      Cookies.set(TOKEN_KEY, response.data.token, { expires: 30 });
    }

    return response.data;
  } catch (error: unknown) {
    return (
      (error as { response: { data: AuthResponse } })?.response?.data || {
        success: false,
        message: "حدث خطأ ما. يرجى المحاولة لاحقاً",
      }
    );
  }
}

// Register with email and password
export async function register(
  credentials: RegisterCredentials
): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(
      "/api/auth/register",
      credentials
    );

    if (response.data.success && response.data.token) {
      Cookies.set(TOKEN_KEY, response.data.token, { expires: 30 });
    }

    return response.data;
  } catch (error: unknown) {
    return (
      (error as { response: { data: AuthResponse } })?.response?.data || {
        success: false,
        message: "حدث خطأ ما. يرجى المحاولة لاحقاً",
      }
    );
  }
}

// Login with Google
export async function loginWithGoogle(
  access_token: string
): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>("/api/auth/google", {
      access_token,
    });

    if (response.data.success && response.data.token) {
      Cookies.set(TOKEN_KEY, response.data.token, { expires: 30 });
    }

    return response.data;
  } catch (error: unknown) {
    return (
      (error as { response: { data: AuthResponse } })?.response?.data || {
        success: false,
        message: "حدث خطأ ما. يرجى المحاولة لاحقاً",
      }
    );
  }
}

// Get token
export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

// Remove token (logout)
export function logout(): void {
  Cookies.remove(TOKEN_KEY);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getToken();
}
