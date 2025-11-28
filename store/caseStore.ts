import { create } from 'zustand';

export interface Case {
  _id: string;
  patientId: string;
  hospitalName: string;
  location: string;
  admissionDatetime: string;
  dischargeDatetime?: string;
  chiefComplaint: string;
  status: 'ACTIVE' | 'DISCHARGED';
  createdAt: string;
  updatedAt: string;
}

interface CaseStore {
  cases: Case[];
  currentCase: Case | null;
  loading: boolean;
  error: string | null;
  
  setCases: (cases: Case[]) => void;
  setCurrentCase: (caseData: Case | null) => void;
  addCase: (caseData: Case) => void;
  updateCase: (id: string, updates: Partial<Case>) => void;
  deleteCase: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCaseStore = create<CaseStore>((set) => ({
  cases: [],
  currentCase: null,
  loading: false,
  error: null,
  
  setCases: (cases) => set({ cases }),
  setCurrentCase: (caseData) => set({ currentCase: caseData }),
  addCase: (caseData) => set((state) => ({ cases: [...state.cases, caseData] })),
  updateCase: (id, updates) => set((state) => ({
    cases: state.cases.map((c) => (c._id === id ? { ...c, ...updates } : c)),
    currentCase: state.currentCase?._id === id ? { ...state.currentCase, ...updates } : state.currentCase,
  })),
  deleteCase: (id) => set((state) => ({
    cases: state.cases.filter((c) => c._id !== id),
    currentCase: state.currentCase?._id === id ? null : state.currentCase,
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
