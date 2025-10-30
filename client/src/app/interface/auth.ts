export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  area: string;
  is_verified?: boolean;
  role?: string;
  createdAt?:string;
  id?:string
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  area: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Services {
  serviceName: string;
  serviceType: string[] | string;
  serviceHeader?: string;
  serviceDetails?: string;
  serviceImage?:File| string,
  serviceInclude?:string[] | string
}



export interface BookingFormData {
  name: string;
  phone: string;
  applianceType: string;
  serviceType: string;
  preferredDate: string;
  bookingImage: File | null;
  address: string;
  problemDescription: string;
  userId?:string;
  _id?:string,
  status:string;
  assignedTo?:string;
  assignedBy?:string;
  email?:string;
  feedback?:string;
  rating?:string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}