/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoomType = 'Normal' | 'TP Informatique';
export type VacationType = 'Jour' | 'Soir' | 'Week-end';
export type StudyYear = '1ère année' | '2ème année';

export type PoleType = 'Informatique & IA' | 'Management & Commerce' | 'Tourisme & Hôtellerie';

export interface Room {
  id: string;
  label: string;
  capacity: number;
  type: RoomType;
  fixedSlots?: FixedSlot[];
}

export interface FixedSlot {
  subject: string;
  day: string;
  slotIndex: number;
  roomId?: string;
  classIds?: string[];
}

export interface ClassGroup {
  id: string;
  label: string;
  studentCount: number;
  year: StudyYear;
  pole: PoleType;
  vacationType: VacationType;
}

export interface Unavailability {
  day: string;
  slotIndex: number;
}

export interface ProfessorAssignment {
  subject: string;
  classId: string;
  sessionsPerWeek: number;
  durationPerSession: number; // in hours, e.g., 1.5 or 3.0
}

export interface Professor {
  id: string;
  name: string;
  specialty: string;
  subjects: string[];
  targetWeeklyHours: number;
  unavailabilities: Unavailability[];
  assignments: ProfessorAssignment[];
}

export interface ScheduleEntry {
  id: string;
  classId: string;
  profId: string;
  roomId: string;
  day: string;
  slotIndex: number;
  subject: string;
}

export type WeekStatus = 'Active' | 'Brouillon' | 'Archivée';

export interface Week {
  id: string;
  label: string;
  startDate: string; // ISO format or YYYY-MM-DD
  endDate: string;
  status: WeekStatus;
  schedule: ScheduleEntry[];
}

export const FILIERES_BY_POLE: Record<PoleType, string[]> = {
  'Informatique & IA': [
    'Intelligence Artificielle (IA)',
    'Cybersécurité (CYB)',
    'Développement Informatique (DI)',
    'Systèmes & Réseaux Informatiques (SRI)',
    'Gestion Informatisée (GI)'
  ],
  'Management & Commerce': [
    'Financier Comptable (FC)',
    'Commerce International (CI)',
    'Gestion des Entreprises (GE)',
    'Action Commerciale et Marketing (AC)'
  ],
  'Tourisme & Hôtellerie': [
    'Gestion Hôtelière (GH)',
    'Réception d\'Hôtel'
  ]
};

export const POLES: PoleType[] = ['Informatique & IA', 'Management & Commerce', 'Tourisme & Hôtellerie'];
export const YEARS: StudyYear[] = ['1ère année', '2ème année'];
export const VACATION_TYPES: VacationType[] = ['Jour', 'Soir', 'Week-end'];

export const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
export const SLOTS = [
  "08H45 - 10H15",
  "10H30 - 12H00",
  "14H45 - 16H15",
  "16H30 - 18H00",
  "18H30 - 19H30",
  "19H30 - 20H30"
];

export interface Conflict {
  type: 'danger' | 'warning' | 'info';
  message: string;
  relatedIds: string[];
}
