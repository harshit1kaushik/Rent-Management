export interface Tenant {
  id: string;
  unitId: string;
  name: string;
  code: string; // e.g. TN-8821
  role: string; // Software Architect
  location: string; // Austin, TX
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  occupancyCount: number;
  occupancyDescription: string;
  leaseStart: string;
  leaseEnd: string;
  tier: string;
  isReturningResident?: boolean;
  previousFlat?: string;
  status: 'active' | 'notice' | 'past';
  avatarUrl?: string;
  initials: string;
  monthlyRent: number;
  latePenalty: number;
  daysLate?: number;
  depositAmount: number;
  escrowProtected: boolean;
  fdicInsured: boolean;
  notes: LandlordNote[];
  documents: TenantDocument[];
  paymentHistory: PaymentRecord[];
}

export interface LandlordNote {
  id: string;
  author: string;
  authorRole: string;
  date: string;
  content: string;
  tags: string[];
}

export interface TenantDocument {
  id: string;
  title: string;
  subtitle: string;
  isValidated: boolean;
  expires?: string;
  type: 'lease' | 'id' | 'police' | 'utility';
}

export interface PaymentRecord {
  id: string;
  monthYear: string;
  status: 'OVERDUE' | 'PAID' | 'PAID (LATE 3D)' | 'PENDING';
  amount: number;
  balance: number;
  dueDate: string;
  paidDate?: string;
  receiptNumber?: string;
}

export interface Unit {
  id: string;
  flatNumber: string;
  buildingName: string;
  shortBuilding: string;
  floor: string;
  bhk: string;
  sqft: number;
  status: 'Occupied' | 'Vacant';
  rentStatus: 'Rent Paid' | 'Overdue' | 'Expiring Soon' | 'Ready for Move-in';
  overdueAmount?: number;
  monthlyRent: number;
  depositAmount: number;
  tenantId?: string;
  tenantName?: string;
  tenantCode?: string;
  tenantAvatar?: string;
  moveInDate?: string;
  ownerInfo: string; // "Sarah M. (90%)"
  features?: string[];
  keysStatus?: string;
  expiresInDays?: number;
  nextDue?: string;
}

export interface UrgentTask {
  id: string;
  type: 'overdue' | 'lease_expiry' | 'maintenance';
  title: string;
  subtitle: string;
  amount?: number;
  tag?: string;
  items?: {
    tenantName: string;
    flat: string;
    daysLate: number;
    initials: string;
    amount: number;
  }[];
}

export interface ActivityItem {
  id: string;
  tenantName: string;
  flat: string;
  type: 'payment' | 'maintenance' | 'escrow';
  title: string;
  detail: string;
  timestamp: string;
  amount?: string;
  status: 'Paid' | 'In Progress' | 'Escrowed';
  avatar?: string;
}

export interface MaintenanceTicket {
  id: string;
  flatNumber: string;
  buildingName: string;
  title: string;
  tenantName: string;
  severity: 'URGENT' | 'HIGH' | 'NORMAL';
  status: 'Vendor Dispatched' | 'Assigned' | 'Scheduled' | 'Completed';
  vendorName: string;
  eta?: string;
  reportedAt: string;
  cost?: number;
}
