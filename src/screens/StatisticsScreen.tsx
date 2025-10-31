import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { RootStackParamList, Expense } from '../types';
import { getExpenses } from '../database/database';

type Props = NativeStackScreenProps<RootStackParamList, 'Statistics'>;

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export const StatisticsScreen: React.FC<Props> = ({ navigation }) => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStatistics();
    });

    return unsubscribe;
  }, [navigation]);

  const loadStatistics = async () => {
    const expenses = await getExpenses(false);
    
    // Calculate total
    const income = expenses
      .filter((exp: Expense) => exp.type === 'Thu')
      .reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
    
    const expense = expenses
      .filter((exp: Expense) => exp.type === 'Chi')
      .reduce((sum: number, exp: Expense) => sum + exp.amount, 0);

    setTotalIncome(income);
    setTotalExpense(expense);

    // Group by month
    const monthlyMap: { [key: string]: MonthlyData } = {};
    
    expenses.forEach((exp: Expense) => {
      const date = new Date(exp.createdAt);
      const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }

      if (exp.type === 'Thu') {
        monthlyMap[monthKey].income += exp.amount;
      } else {
        monthlyMap[monthKey].expense += exp.amount;
      }
    });

    const sortedData = Object.values(monthlyMap)
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split('/').map(Number);
        const [monthB, yearB] = b.month.split('/').map(Number);
        if (yearA !== yearB) return yearA - yearB;
        return monthA - monthB;
      })
      .slice(-6); // Get last 6 months

    setMonthlyData(sortedData);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Thống kê</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Ionicons name="arrow-up-circle" size={32} color="#4CAF50" />
            <Text style={styles.summaryLabel}>Tổng thu</Text>
            <Text style={[styles.summaryAmount, styles.incomeText]}>
              {formatMoney(totalIncome)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="arrow-down-circle" size={32} color="#F44336" />
            <Text style={styles.summaryLabel}>Tổng chi</Text>
            <Text style={[styles.summaryAmount, styles.expenseText]}>
              {formatMoney(totalExpense)}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="wallet" size={32} color="#2196F3" />
            <Text style={styles.summaryLabel}>Còn lại</Text>
            <Text style={[
              styles.summaryAmount,
              totalIncome - totalExpense >= 0 ? styles.incomeText : styles.expenseText
            ]}>
              {formatMoney(totalIncome - totalExpense)}
            </Text>
          </View>
        </View>

        {monthlyData.length > 0 && (
          <>
            <Text style={styles.chartTitle}>Biểu đồ thu chi theo tháng</Text>
            <View style={styles.chartContainer}>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                  <Text style={styles.legendText}>Thu</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
                  <Text style={styles.legendText}>Chi</Text>
                </View>
              </View>
              <BarChart
                data={{
                  labels: monthlyData.map(d => d.month),
                  datasets: [
                    {
                      data: monthlyData.map(d => d.income),
                    },
                    {
                      data: monthlyData.map(d => d.expense),
                    },
                  ],
                }}
                width={screenWidth - 32}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForLabels: {
                    fontSize: 10,
                  },
                }}
                style={styles.chart}
              />
            </View>

            <Text style={styles.chartTitle}>Xu hướng thu chi</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: monthlyData.map(d => d.month),
                  datasets: [
                    {
                      data: monthlyData.map(d => d.income - d.expense),
                      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                  legend: ['Chênh lệch (Thu - Chi)'],
                }}
                width={screenWidth - 32}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForLabels: {
                    fontSize: 10,
                  },
                }}
                bezier
                style={styles.chart}
              />
            </View>
          </>
        )}

        {monthlyData.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="bar-chart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Chưa có dữ liệu thống kê</Text>
          </View>
        )}
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
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
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
});
