export type Role = 'ADMIN' | 'USER' | 'MANAGER';

export type TenderStatus = 'ACTIVE' | 'SUBMITTED' | 'WON' | 'LOST' | 'CANCELLED';

export type DocumentType = 'TENDER' | 'CONTRACT' | 'TECH_SPEC' | 'SCOPE';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tender {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  status: TenderStatus;
  estimatedValue?: number;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}
