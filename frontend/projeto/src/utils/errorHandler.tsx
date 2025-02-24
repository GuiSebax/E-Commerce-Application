import axios from "axios";

export function handleApiError(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Erro desconhecido na API!";
  }

  return "Erro desconhecido!";
}
