import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Expense {
  id: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Lodging' | 'Activities' | 'Other';
  note?: string;
  date: string;
}

interface BudgetState {
  totalBudget: number;
  expenses: Expense[];
  currency: string;
  setTotalBudget: (budget: number) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  deleteExpense: (id: string) => void;
  getSpentAmount: () => number;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      totalBudget: 2400,
      // Pre-fill with data that matches our visual mock of $1550 spent
      expenses: [
        { id: 'mock-1', amount: 800, category: 'Lodging', date: new Date().toISOString(), note: 'Hotel booking' },
        { id: 'mock-2', amount: 500, category: 'Transport', date: new Date().toISOString(), note: 'Flights' },
        { id: 'mock-3', amount: 250, category: 'Food', date: new Date().toISOString(), note: 'Dinners' }
      ],
      currency: 'USD',
      
      setTotalBudget: (budget) => set({ totalBudget: budget }),
      
      addExpense: (expense) => set((state) => ({
        expenses: [
          {
            ...expense,
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString()
          },
          ...state.expenses
        ]
      })),
      
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id)
      })),
      
      getSpentAmount: () => {
        return get().expenses.reduce((sum, e) => sum + e.amount, 0);
      }
    }),
    {
      name: 'packwise-budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
