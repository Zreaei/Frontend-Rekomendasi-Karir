import axios from "axios";

// ============================================================
// Axios instance untuk seluruh panggilan API backend.
// - baseURL: alamat backend
// - withCredentials: true -> cookie refresh token ikut terkirim
// ============================================================
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ------------------------------------------------------------
// REQUEST INTERCEPTOR: tempel access token otomatis di tiap request
// ------------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------------------------------------------------
// RESPONSE INTERCEPTOR: kalau 401 (token expired/invalid),
// bersihkan sesi lalu lempar ke halaman login.
// ------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token tidak valid lagi -> hapus sesi lokal
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      // hindari loop: jangan redirect kalau memang lagi di halaman login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// ============================================================
// AUTH API
// ============================================================
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;   // student | company | company_staff | university | university_staff | admin
      status: string;
    };
  };
}

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post<LoginResponse>("/auth/login", { email, password });
    return res.data;
  },
  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },
  me: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
  updateMe: async (payload: { name?: string; phone?: string; email?: string; password?: string }) => {
    const res = await api.patch("/auth/me", payload);
    return res.data?.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.patch("/auth/password", { currentPassword, newPassword });
    return res.data;
  },
  // POST /auth/forgot-password -> kirim tautan pemulihan ke email
  // (respons selalu generik, baik email terdaftar maupun tidak)
  forgotPassword: async (email: string) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const res = await api.post("/auth/reset-password", { token, newPassword });
    return res.data;
  },
  verifyRecoveryEmail: async (token: string) => {
    const res = await api.post("/auth/recovery-email/verify", { token });
    return res.data;
  },
};

// ============================================================
// Peta role -> halaman tujuan setelah login.
// Sesuaikan path-nya dengan Router.tsx milik frontend.
// ============================================================
export const ROLE_HOME: Record<string, string> = {
  student: "/student",
  company: "/company",
  company_staff: "/company-staff",
  university: "/university",
  university_staff: "/university-staff",
  admin: "/admin",
};

