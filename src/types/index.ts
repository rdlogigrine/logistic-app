export interface User {
  id: string;
  username: string;
  role: 'chauffeur' | 'planificateur' | 'financier' | 'financier_unite' | 'admin';
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string[];
  email?: string;
  createdAt: string;
  isActive?: boolean;
  avatar?: string;
  vehicleType?: string;
  employeeType?: 'interne' | 'externe';
}

export interface Chauffeur {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  password: string;
  phone: string[];
  vehicleType: string;
  employeeType: 'interne' | 'externe';
  isActive: boolean;
  createdAt: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Declaration {
  id: string;
  number: string;
  programNumber: string;
  year: string;
  month: string;
  chauffeurId: string;
  chauffeurName: string;
  distance?: number;
  deliveryFees?: number;
  notes?: string;
  photos?: string[];
  status: 'en_cours' | 'valide' | 'refuse';
  createdAt: string;
  validatedAt?: string;
  validatedBy?: string;
  refusalReason?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  phone: string[];
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  phone?: string[];
  email?: string;
  createdAt: string;
}

export interface VehicleType {
  id: string;
  name: string;
  createdAt: string;
}

export interface FinancialRecord {
  id: string;
  number: string;
  type: 'remboursement' | 'reglement';
  programNumber: string;
  destinationUnit: 'cph_nord' | 'cph_sud' | 'cph_est' | 'cph_ouest' | 'cph_centre';
  amount: number;
  description?: string;
  photos?: string[];
  status: 'en_attente' | 'traite';
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

export interface Settings {
  language: 'fr' | 'en' | 'ar';
  theme: 'light' | 'dark';
}
