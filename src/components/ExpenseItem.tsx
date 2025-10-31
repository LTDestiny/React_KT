import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Expense } from '../types';

interface ExpenseItemProps {
  expense: Expense;
  onPress: () => void;
  onLongPress: () => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onPress, onLongPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      <View style={styles.leftSection}>
        <Text style={styles.title}>{expense.title}</Text>
        <Text style={styles.date}>{formatDate(expense.createdAt)}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={[
          styles.amount,
          expense.type === 'Thu' ? styles.income : styles.expense
        ]}>
          {expense.type === 'Thu' ? '+' : '-'} {formatAmount(expense.amount)}
        </Text>
        <View style={[
          styles.typeBadge,
          expense.type === 'Thu' ? styles.incomeBadge : styles.expenseBadge
        ]}>
          <Text style={styles.typeText}>{expense.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  income: {
    color: '#4CAF50',
  },
  expense: {
    color: '#F44336',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  incomeBadge: {
    backgroundColor: '#E8F5E9',
  },
  expenseBadge: {
    backgroundColor: '#FFEBEE',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
