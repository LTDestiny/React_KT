export interface Expense {
  id?: number;
  title: string;
  amount: number;
  type: 'Thu' | 'Chi';
  createdAt: string;
  isDeleted: number; // 0 = active, 1 = deleted
}

export type RootStackParamList = {
  Main: undefined;
  AddExpense: undefined;
  EditExpense: { expense: Expense };
  Trash: undefined;
  Statistics: undefined;
  Settings: undefined;
};
