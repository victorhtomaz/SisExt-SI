import api from "./api";
import { LoginResponse, SignupRequest, ApiResponse } from "@/types";

export async function loginUser(
  email: string,
  senha: string
): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      senha,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function signupUser(
  data: SignupRequest
): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/auth/signup", data);

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get("/auth/me");

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function logoutUser() {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}