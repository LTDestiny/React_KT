import * as SQLite from 'expo-sqlite';
import { Expense } from '../types';

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('expenses.db');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        isDeleted INTEGER DEFAULT 0
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<void> => {
  try {
    const result = await db.runAsync(
      'INSERT INTO expenses (title, amount, type, createdAt, isDeleted) VALUES (?, ?, ?, ?, ?)',
      [expense.title, expense.amount, expense.type, expense.createdAt, expense.isDeleted]
    );
    console.log('Expense added with id:', result.lastInsertRowId);
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const updateExpense = async (expense: Expense): Promise<void> => {
  try {
    await db.runAsync(
      'UPDATE expenses SET title = ?, amount = ?, type = ?, createdAt = ? WHERE id = ?',
      [expense.title, expense.amount, expense.type, expense.createdAt, expense.id!]
    );
    console.log('Expense updated');
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (id: number): Promise<void> => {
  try {
    await db.runAsync('UPDATE expenses SET isDeleted = 1 WHERE id = ?', [id]);
    console.log('Expense moved to trash');
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const restoreExpense = async (id: number): Promise<void> => {
  try {
    await db.runAsync('UPDATE expenses SET isDeleted = 0 WHERE id = ?', [id]);
    console.log('Expense restored');
  } catch (error) {
    console.error('Error restoring expense:', error);
    throw error;
  }
};

export const permanentlyDeleteExpense = async (id: number): Promise<void> => {
  try {
    await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
    console.log('Expense permanently deleted');
  } catch (error) {
    console.error('Error permanently deleting expense:', error);
    throw error;
  }
};

export const getExpenses = async (includeDeleted: boolean = false): Promise<Expense[]> => {
  try {
    const query = includeDeleted 
      ? 'SELECT * FROM expenses WHERE isDeleted = 1 ORDER BY createdAt DESC'
      : 'SELECT * FROM expenses WHERE isDeleted = 0 ORDER BY createdAt DESC';
    
    const result = await db.getAllAsync<Expense>(query);
    return result;
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

export const searchExpenses = async (searchText: string, includeDeleted: boolean = false): Promise<Expense[]> => {
  try {
    const deletedCondition = includeDeleted ? 'isDeleted = 1' : 'isDeleted = 0';
    const query = `SELECT * FROM expenses WHERE ${deletedCondition} AND (title LIKE ? OR CAST(amount AS TEXT) LIKE ?) ORDER BY createdAt DESC`;
    const searchParam = `%${searchText}%`;
    
    const result = await db.getAllAsync<Expense>(query, [searchParam, searchParam]);
    return result;
  } catch (error) {
    console.error('Error searching expenses:', error);
    return [];
  }
};

export const getAllExpensesForSync = async (): Promise<Expense[]> => {
  try {
    const result = await db.getAllAsync<Expense>('SELECT * FROM expenses WHERE isDeleted = 0');
    return result;
  } catch (error) {
    console.error('Error getting all expenses for sync:', error);
    return [];
  }
};
