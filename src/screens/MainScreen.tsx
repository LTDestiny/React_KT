import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Expense } from '../types';
import { ExpenseItem } from '../components/ExpenseItem';
import { getExpenses, deleteExpense, searchExpenses } from '../database/database';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export const MainScreen: React.FC<Props> = ({ navigation }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'Tất cả' | 'Thu' | 'Chi'>('Tất cả');

  const loadExpenses = async () => {
    const data = await getExpenses(false);
    setExpenses(data);
    applyFilter(data, filter, searchText);
  };

  const applyFilter = (data: Expense[], filterType: 'Tất cả' | 'Thu' | 'Chi', search: string) => {
    let filtered = data;

    // Apply type filter
    if (filterType !== 'Tất cả') {
      filtered = filtered.filter(exp => exp.type === filterType);
    }

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(search.toLowerCase()) ||
        exp.amount.toString().includes(search)
      );
    }

    setFilteredExpenses(filtered);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadExpenses();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    applyFilter(expenses, filter, searchText);  
  }, [filter, searchText, expenses]);

  const handleDelete = (expense: Expense) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa "${expense.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteExpense(expense.id!);
            loadExpenses();
          },
        },
      ]
    );
  };

  const calculateSummary = () => {
    const income = filteredExpenses
      .filter(exp => exp.type === 'Thu')
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const expense = filteredExpenses
      .filter(exp => exp.type === 'Chi')
      .reduce((sum, exp) => sum + exp.amount, 0);

    return { income, expense, balance: income - expense };
  };

  const summary = calculateSummary();

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>EXPENSE TRACKER</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Statistics')}
          >
            <Ionicons name="stats-chart" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Trash')}
          >
            <Ionicons name="trash" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Thu</Text>
          <Text style={[styles.summaryAmount, styles.incomeText]}>
            {formatMoney(summary.income)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Chi</Text>
          <Text style={[styles.summaryAmount, styles.expenseText]}>
            {formatMoney(summary.expense)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Còn lại</Text>
          <Text style={[
            styles.summaryAmount,
            summary.balance >= 0 ? styles.incomeText : styles.expenseText
          ]}>
            {formatMoney(summary.balance)}
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.filterContainer}>
        {(['Tất cả', 'Thu', 'Chi'] as const).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.filterButtonActive
            ]}
            onPress={() => setFilter(filterType)}
          >
            <Text style={[
              styles.filterText,
              filter === filterType && styles.filterTextActive
            ]}>
              {filterType}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onPress={() => navigation.navigate('EditExpense', { expense: item })}
            onLongPress={() => handleDelete(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
