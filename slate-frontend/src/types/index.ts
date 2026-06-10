// =========================
// User Core Structure
// =========================
export interface User {
    id: string;
    username: string;
    email: string;
    plan: 'free' | 'premium';
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  // Global state tracking inside your UserContext
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }
  
  // =========================
  // Signup Flow
  // =========================
  export interface SignupRequest {
    username: string;
    email: string;
    password: string;
  }
  
  export interface SignupResponse {
    success: boolean;
    message: string;
  }
  
  // =========================
  // Login Flow
  // =========================
  export interface LoginRequest {
    usernameOrEmail: string; // Used in the UI text form fields
    password: string;
  }
  
  export interface LoginResponse {
    accessToken: string;
    user: User;
  }
  
  // =========================
  // Forgot Password Flow (OTP System)
  // =========================
  export interface ForgotPasswordRequest {
    usernameOrEmail: string;
  }
  
  export interface VerifyOtpRequest {
    email: string;
    otp: string;
  }
  
  export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
  }
  
  // =========================
  // PDF Files Staging System
  // =========================
  export type FileStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  
  export interface StagedFile {
    id: string;
    file: File; // Native browser file object binary payload
    name: string;
    size: number;
    status: FileStatus;
    progress: number;
    error?: string; // Captures individual file runtime rejections
  }
  
  // =========================
  // PDF Engine Configurations
  // =========================
  export interface SplitConfig {
    pages: string; // e.g., "1-3, 5, 7-9"
  }
  
  export interface CompressionConfig {
    level: 'low' | 'medium' | 'high';
  }
  
  export interface ImageToPdfConfig {
    orientation: 'portrait' | 'landscape';
    pageSize: 'A4' | 'letter';
  }