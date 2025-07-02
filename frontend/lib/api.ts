import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      // window.location.href = "/auth/login"
    }
    return Promise.reject(error)
  },
)

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    const formData = new FormData()
    formData.append("username", email)
    formData.append("password", password)

    const response = await api.post("/auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    return response.data
  },

  register: async (userData: {
    first_name: string
    last_name: string
    email: string
    password: string
  }) => {
    // Transform the data to match backend expectations
    const registerData = {
      full_name: `${userData.first_name} ${userData.last_name}`,
      email: userData.email,
      password: userData.password
    }
    
    const response = await api.post("/auth/register", registerData)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me")
    return response.data
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post("/auth/refresh", {
      refresh_token: refreshToken,
    })
    return response.data
  },
}

// Meeting API functions
export const meetingApi = {
  getMeetings: async (params?: {
    search?: string
    status?: string
    sort?: string
  }) => {
    const response = await api.get("/meetings", { params })
    return response.data
  },

  getMeeting: async (id: string) => {
    const response = await api.get(`/meetings/${id}`)
    return response.data
  },

  uploadMeeting: async (formData: FormData) => {
    const response = await api.post("/upload/meeting", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  updateMeeting: async (id: string, data: any) => {
    const response = await api.put(`/meetings/${id}`, data)
    return response.data
  },

  deleteMeeting: async (id: string) => {
    const response = await api.delete(`/meetings/${id}`)
    return response.data
  },
}

// Task API functions
export const taskApi = {
  getTasks: async (meetingId?: string) => {
    const params = meetingId ? { meeting_id: meetingId } : {}
    const response = await api.get("/tasks", { params })
    return response.data
  },

  updateTask: async (id: string, data: any) => {
    const response = await api.put(`/tasks/${id}`, data)
    return response.data
  },

  createTask: async (data: any) => {
    const response = await api.post("/tasks", data)
    return response.data
  },

  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`)
    return response.data
  },
}

export default api
