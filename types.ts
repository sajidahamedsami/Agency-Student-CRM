
export type ApplicationStatus = string;

export type UniResultStatus = 'Pending' | 'Offer Received (Conditional)' | 'Offer Received (Unconditional)' | 'Rejected' | 'Waitlisted';

export type TransactionType = 'Received' | 'Payment' | 'Refund';

export type ProgramType = 'Masters' | 'Bachelor' | 'PhD';

export type LanguageTestType = 'IELTS' | 'PTE' | 'TOEFL' | 'Duolingo' | 'GMAT' | 'GRE' | 'N/A';

export interface LanguageTestInfo {
  testType: LanguageTestType;
  score?: string;
  noBandLessThan?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
}

export interface UniversityApplication {
  id: string;
  universityName: string;
  course: string;
  status: UniResultStatus;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export interface AcademicInfo {
  sscGpa?: string;
  hscGpa?: string;
  bachelorCgpa?: string;
  mastersGpa?: string;
  collegeName?: string;
  languageTest?: LanguageTestInfo;
}

export interface Address {
  upazila: string;
  district: string;
  division: string;
}

export interface Student extends AcademicInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  targetCountry: string;
  program: ProgramType;
  currentStatus: ApplicationStatus;
  source: string;
  referralPerson?: string;
  agentName: string;
  enrollmentDate: string;
  address?: Address;
  applications: UniversityApplication[];
  transactions: Transaction[];
  notes: Note[];
  timeline: {
    step: string;
    isCompleted: boolean;
    dateCompleted?: string;
  }[];
}

export type LeadStatus = 'New' | 'Contacted' | 'Converted to Student';

export interface Lead extends AcademicInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  targetCountry: string;
  course: string;
  program: ProgramType;
  source: string;
  referralPerson?: string;
  status: LeadStatus;
  createdAt: string;
}
