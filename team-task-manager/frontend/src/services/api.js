import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  login: (data) => api.post("/auth/login", data),

  signup: (data) => api.post("/auth/signup", data),

  listUsers: () => api.get("/auth/users"),
};

// Project APIs
export const projectApi = {
  list: () => api.get("/projects"),

  create: (data) => api.post("/projects", data),

  addMember: (id, data) =>
    api.post(`/projects/${id}/add-member`, data),
};

// Task APIs
export const taskApi = {
  list: (params) => api.get("/tasks", { params }),

  create: (data) => api.post("/tasks", data),

  update: (id, data) => api.patch(`/tasks/${id}`, data),

  remove: (id) => api.delete(`/tasks/${id}`),
};

// Dashboard APIs
export const dashboardApi = {
  get: () => api.get("/dashboard"),
};

export default api;
