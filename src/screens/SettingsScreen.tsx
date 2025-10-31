import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { RootStackParamList } from '../types';
import { getAllExpensesForSync } from '../database/database';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [apiUrl, setApiUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập URL API');
      return;
    }

    try {
      setLoading(true);

      // Get all expenses from local database
      const expenses = await getAllExpensesForSync();

      // Delete all data in API first
      try {
        const existingData = await axios.get(apiUrl);
        if (Array.isArray(existingData.data)) {
          for (const item of existingData.data) {
            await axios.delete(`${apiUrl}/${item.id}`);
          }
        }
      } catch (error) {
        console.log('No existing data to delete or error deleting:', error);
      }

      // Upload all local expenses to API
      for (const expense of expenses) {
        await axios.post(apiUrl, {
          title: expense.title,
          amount: expense.amount,
          type: expense.type,
          createdAt: expense.createdAt,
        });
      }

      Alert.alert(
        'Thành công',
        `Đã đồng bộ ${expenses.length} giao dịch lên API`
      );
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert(
        'Lỗi',
        'Không thể đồng bộ dữ liệu. Vui lòng kiểm tra URL API và thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Cài đặt</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đồng bộ dữ liệu</Text>
          <Text style={styles.sectionDescription}>
            Nhập URL API từ MockAPI.io để đồng bộ dữ liệu
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>URL API</Text>
            <TextInput
              style={styles.input}
              placeholder="https://xxxxx.mockapi.io/api/v1/expenses"
              value={apiUrl}
              onChangeText={setApiUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.syncButton, loading && styles.syncButtonDisabled]}
            onPress={handleSync}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={24} color="#fff" />
                <Text style={styles.syncButtonText}>Đồng bộ lên API</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#2196F3" />
            <Text style={styles.infoText}>
              Khi đồng bộ, tất cả dữ liệu trên API sẽ bị xóa và thay thế bằng
              dữ liệu từ điện thoại của bạn.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hướng dẫn sử dụng API</Text>
          <View style={styles.guideBox}>
            <Text style={styles.guideStep}>1. Truy cập mockapi.io</Text>
            <Text style={styles.guideStep}>
              2. Tạo project mới hoặc sử dụng project có sẵn
            </Text>
            <Text style={styles.guideStep}>
              3. Tạo resource với tên "expenses" và các field:
            </Text>
            <Text style={styles.guideField}>   • title (text)</Text>
            <Text style={styles.guideField}>   • amount (number)</Text>
            <Text style={styles.guideField}>   • type (text)</Text>
            <Text style={styles.guideField}>   • createdAt (text/date)</Text>
            <Text style={styles.guideStep}>
              4. Copy URL endpoint và paste vào ô trên
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phiên bản</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sinh viên</Text>
            <Text style={styles.infoValue}>22716761 - Lê Thiên Định</Text>
          </View>
        </View>
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
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  syncButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  syncButtonDisabled: {
    backgroundColor: '#999',
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1976D2',
  },
  guideBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  guideStep: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  guideField: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});
