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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Expense } from '../types';
import { ExpenseItem } from '../components/ExpenseItem';
import { getExpenses, restoreExpense, permanentlyDeleteExpense, searchExpenses } from '../database/database';

type Props = NativeStackScreenProps<RootStackParamList, 'Trash'>;

export const TrashScreen: React.FC<Props> = ({ navigation }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadExpenses = async () => {
    const data = await getExpenses(true);
    setExpenses(data);
    applySearch(data, searchText);
  };

  const applySearch = (data: Expense[], search: string) => {
    if (search.trim()) {
      const filtered = data.filter(exp =>
        exp.title.toLowerCase().includes(search.toLowerCase()) ||
        exp.amount.toString().includes(search)
      );
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses(data);
    }
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
    applySearch(expenses, searchText);
  }, [searchText, expenses]);

  const handleRestore = (expense: Expense) => {
    Alert.alert(
      'Khôi phục',
      `Bạn có muốn khôi phục "${expense.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục',
          onPress: async () => {
            await restoreExpense(expense.id!);
            loadExpenses();
            Alert.alert('Thành công', 'Đã khôi phục giao dịch');
          },
        },
      ]
    );
  };

  const handlePermanentDelete = (expense: Expense) => {
    Alert.alert(
      'Xóa vĩnh viễn',
      `Bạn có chắc muốn xóa vĩnh viễn "${expense.title}"? Hành động này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await permanentlyDeleteExpense(expense.id!);
            loadExpenses();
            Alert.alert('Đã xóa', 'Giao dịch đã được xóa vĩnh viễn');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Thùng rác</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm trong thùng rác..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onPress={() => handleRestore(item)}
            onLongPress={() => handlePermanentDelete(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trash-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Thùng rác trống</Text>
            <Text style={styles.emptySubText}>
              Nhấn giữ item để khôi phục{'\n'}hoặc xóa vĩnh viễn
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#F44336',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
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
  listContent: {
    paddingBottom: 20,
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
  emptySubText: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
});
