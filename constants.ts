
import { Student, Lead } from './types';

export const PROCESS_STEPS = [
  "File opening",
  "Uni Apply Doc Collection",
  "LOR and SOP",
  "University Application",
  "Conditional Offer letter",
  "Documents Prepare",
  "Unconditional offer letter",
  "Student payment",
  "Tution fee",
  "Visa doc Collect",
  "Embassy fee payment",
  "Visa application",
  "Visa",
  "Final Student payment",
  "Depart"
];

export const INITIAL_COUNTRIES = ["USA", "UK", "Canada", "Australia", "Germany", "Sweden", "Finland"];

export const INITIAL_LEADS: Lead[] = [
  { id: 'l1', name: 'Rahat Hassan', phone: '01711223344', email: 'rahat@example.com', targetCountry: 'Canada', program: 'Bachelor', course: 'CS', source: 'Facebook Ad', status: 'New', createdAt: '2023-11-01' },
  { id: 'l2', name: 'Anika Tabassum', phone: '01811223344', email: 'anika@example.com', targetCountry: 'UK', program: 'Masters', course: 'Law', source: 'Referral', referralPerson: 'Karim Ullah', status: 'Contacted', createdAt: '2023-11-02' },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'CA-MA-US-23-001',
    name: 'Sakib Ahmed',
    phone: '01911223344',
    email: 'sakib@example.com',
    targetCountry: 'USA',
    program: 'Masters',
    currentStatus: 'File opening',
    source: 'Website Form',
    agentName: 'Tanvir Hossain',
    enrollmentDate: '2023-10-28',
    applications: [
      { id: 'a1', universityName: 'Arizona State University', course: 'MS in CS', status: 'Pending' }
    ],
    transactions: [],
    notes: [
      { id: 'n1', text: 'Interested in AI specializations.', createdAt: '2023-10-28' }
    ],
    timeline: PROCESS_STEPS.map((step, idx) => ({
      step,
      isCompleted: idx === 0,
      dateCompleted: idx === 0 ? '2023-10-28' : undefined
    }))
  }
];
