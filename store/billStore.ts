import { create } from 'zustand';

export interface Bill {
  _id: string;
  caseId: string;
  totalAmount: number;
  fileUrl?: string;
  parsedData: Record<string, any>;
  fraudScore: number;
  estimatedOverchargeMin: number;
  estimatedOverchargeMax: number;
  analysisExplanation: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillItem {
  _id: string;
  billId: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  timestamp?: string;
  isSuspicious: boolean;
  suspicionReasons: string[];
}

interface BillStore {
  bills: Bill[];
  currentBill: Bill | null;
  billItems: BillItem[];
  loading: boolean;
  
  setBills: (bills: Bill[]) => void;
  setCurrentBill: (bill: Bill | null) => void;
  addBill: (bill: Bill) => void;
  setBillItems: (items: BillItem[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useBillStore = create<BillStore>((set) => ({
  bills: [],
  currentBill: null,
  billItems: [],
  loading: false,
  
  setBills: (bills) => set({ bills }),
  setCurrentBill: (bill) => set({ currentBill: bill }),
  addBill: (bill) => set((state) => ({ bills: [...state.bills, bill] })),
  setBillItems: (items) => set({ billItems: items }),
  setLoading: (loading) => set({ loading }),
}));
