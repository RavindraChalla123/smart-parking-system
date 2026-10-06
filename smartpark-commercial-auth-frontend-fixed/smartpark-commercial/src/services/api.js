import axios from "axios";

// Local development uses Vite's /api proxy, which forwards to Spring Boot on :8080.
// Set VITE_API_URL only when you intentionally want to call a remote backend directly.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
  withCredentials: true,
});

export function apiError(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (typeof error?.response?.data === "string") return error.response.data;
  if (error?.code === "ECONNABORTED") return "The backend took too long to respond.";
  if (error?.code === "ERR_NETWORK") return "Cannot reach the Spring Boot backend. Make sure it is running on port 8080.";
  return error?.message || "Something went wrong while contacting the backend.";
}


export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

export const parkingApi = {
  all: () => api.get("/parking-spots"),
  available: () => api.get("/parking-spots/available"),
  one: (id) => api.get(`/parking-spots/${id}`),
  create: (data) => api.post("/parking-spots", data),
  update: (id, data) => api.put(`/parking-spots/${id}`, data),
  remove: (id) => api.delete(`/parking-spots/${id}`),
};

export const userApi = {
  all: () => api.get("/users"),
  one: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
};

export const bookingApi = {
  all: () => api.get("/bookings"),
  mine: (userId) => api.get(`/bookings/user/${userId}`),
  one: (id) => api.get(`/bookings/${id}`),
  create: (userId, parkingSpotId, data) =>
    api.post(`/bookings?userId=${encodeURIComponent(userId)}&parkingSpotId=${encodeURIComponent(parkingSpotId)}`, data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};
