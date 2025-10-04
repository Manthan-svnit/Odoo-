// API service for backend communication
const API_BASE_URL = '/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Employee';
  company: Company;
  manager?: string;
}

export interface Company {
  _id: string;
  name: string;
  country?: string;
  defaultCurrency: string;
  createdBy: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterCompanyData {
  companyName: string;
  adminName: string;
  adminEmail: string;
  password: string;
  country?: string;
  currency: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async registerCompany(data: RegisterCompanyData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register-company', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    this.setToken(response.token);
    return response;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    this.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Token management
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // User methods
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Company methods
  async getCompany(companyId: string): Promise<Company> {
    return this.request<Company>(`/company/${companyId}`);
  }
}

export const apiService = new ApiService();
export default apiService;
