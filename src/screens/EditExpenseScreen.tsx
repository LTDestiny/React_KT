import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { updateExpense } from '../database/database';

type Props = NativeStackScreenProps<RootStackParamList, 'EditExpense'>;

export const EditExpenseScreen: React.FC<Props> = ({ navigation, route }) => {
  const { expense } = route.params;
  
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [type, setType] = useState<'Thu' | 'Chi'>(expense.type);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên khoản chi');
      return;
    }

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }

    try {
      await updateExpense({
        ...expense,
        title: title.trim(),
        amount: Number(amount),
        type,
      });

      Alert.alert('Thành công', 'Đã cập nhật giao dịch', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật giao dịch');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Sửa giao dịch</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'Chi' && [styles.typeButtonActive, { backgroundColor: '#F44336' }]
            ]}
            onPress={() => setType('Chi')}
          >
            <Ionicons 
              name="arrow-down-circle" 
              size={24} 
              color={type === 'Chi' ? '#fff' : '#F44336'} 
            />
            <Text style={[
              styles.typeText,
              type === 'Chi' && styles.typeTextActive
            ]}>
              Chi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'Thu' && [styles.typeButtonActive, { backgroundColor: '#4CAF50' }]
            ]}
            onPress={() => setType('Thu')}
          >
            <Ionicons 
              name="arrow-up-circle" 
              size={24} 
              color={type === 'Thu' ? '#fff' : '#4CAF50'} 
            />
            <Text style={[
              styles.typeText,
              type === 'Thu' && styles.typeTextActive
            ]}>
              Thu
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên khoản chi/thu</Text>
          <TextInput
            style={styles.input}
            placeholder="VD: Tiền ăn, Lương tháng..."
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số tiền (VND)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>Cập nhật giao dịch</Text>
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    gap: 8,
  },
  typeButtonActive: {
    borderColor: 'transparent',
  },
  expenseButton: {
  },
  incomeButton: {
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeTextActive: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
