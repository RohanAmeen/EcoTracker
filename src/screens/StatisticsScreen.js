import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView as RNSafeAreaViewContext } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import { incidentsAPI, usersAPI } from '../services/api';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useAuth } from '../AuthContext';

const StatisticsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalReports: 0,
    reportsBySeverity: {
      low: 0,
      medium: 0,
      high: 0,
    },
    monthlyReports: [],
    recentActivity: [],
    impactScore: 0,
    rank: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchUserStatistics();
  }, []);

  const fetchUserStatistics = async () => {
    try {
      setLoading(true);
      const [incidents, leaderboard] = await Promise.all([
        incidentsAPI.getMyIncidents(),
        usersAPI.getLeaderboard(),
      ]);
      
      const reportsBySeverity = {
        low: 0,
        medium: 0,
        high: 0,
      };

      // Process monthly reports
      const monthlyData = Array(6).fill(0);
      const currentDate = new Date();
      
      incidents.forEach(incident => {
        reportsBySeverity[incident.severity]++;
        
        const incidentDate = new Date(incident.createdAt);
        const monthDiff = (currentDate.getMonth() - incidentDate.getMonth() + 12) % 12;
        if (monthDiff < 6) {
          monthlyData[monthDiff]++;
        }
      });

      // Calculate impact score (weighted sum of reports by severity)
      const impactScore = incidents.reduce((score, incident) => {
        const severityWeight = {
          low: 1,
          medium: 2,
          high: 3,
        };
        return score + severityWeight[incident.severity];
      }, 0);

      // Find user's rank
      const userRank = leaderboard.findIndex(leaderboardUser => leaderboardUser._id === user._id) + 1;

      setUserStats({
        totalReports: incidents.length,
        reportsBySeverity,
        monthlyReports: monthlyData.reverse(),
        recentActivity: incidents.slice(0, 5),
        impactScore,
        rank: userRank || leaderboard.length + 1, // If not found, put at the end
        totalUsers: leaderboard.length,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'trash':
        return 'delete';
      case 'air':
        return 'air';
      case 'water':
        return 'water-drop';
      case 'noise':
        return 'volume-up';
      default:
        return 'warning';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'high':
        return '#f44336';
      default:
        return '#4caf50';
    }
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(74, 92, 57, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const screenWidth = Dimensions.get('window').width - 32;

  if (loading) {
    return (
      <RNSafeAreaViewContext style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
        <View style={styles.headerContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.logoText}>EcoTracker</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a5c39" />
        </View>
      </RNSafeAreaViewContext>
    );
  }

  return (
    <RNSafeAreaViewContext style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.headerContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.logoText}>EcoTracker</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Impact Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="insights" size={24} color="#4a5c39" />
            <Text style={styles.cardTitle}>Your Impact</Text>
          </View>
          <View style={styles.impactContainer}>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>{userStats.totalReports}</Text>
              <Text style={styles.impactLabel}>Total Reports</Text>
            </View>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>{userStats.impactScore}</Text>
              <Text style={styles.impactLabel}>Impact Score</Text>
            </View>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>#{userStats.rank}</Text>
              <Text style={styles.impactLabel}>Rank</Text>
            </View>
          </View>
        </View>

        {/* Monthly Activity Chart */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="trending-up" size={24} color="#4a5c39" />
            <Text style={styles.cardTitle}>Monthly Activity</Text>
          </View>
          <LineChart
            data={{
              labels: ['6m ago', '5m ago', '4m ago', '3m ago', '2m ago', 'Last month'],
              datasets: [{
                data: userStats.monthlyReports
              }]
            }}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Reports by Severity */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="bar-chart" size={24} color="#4a5c39" />
            <Text style={styles.cardTitle}>Reports by Severity</Text>
          </View>
          <BarChart
            data={{
              labels: ['Low', 'Medium', 'High'],
              datasets: [{
                data: [
                  userStats.reportsBySeverity.low,
                  userStats.reportsBySeverity.medium,
                  userStats.reportsBySeverity.high
                ]
              }]
            }}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="schedule" size={24} color="#4a5c39" />
            <Text style={styles.cardTitle}>Recent Activity</Text>
          </View>
          <View style={styles.activityContainer}>
            {userStats.recentActivity.map((incident, index) => (
              <View key={incident._id} style={styles.activityItem}>
                <View style={styles.activityIconContainer}>
                  <Icon name={getTypeIcon(incident.type)} size={20} color="#4a5c39" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityType}>
                    {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
                  </Text>
                  <Text style={styles.activityTime}>
                    {new Date(incident.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(incident.severity) }]}>
                  <Text style={styles.severityBadgeText}>
                    {incident.severity}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} currentScreen="Statistics" />
    </RNSafeAreaViewContext>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0ede3',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Add extra padding at the bottom for the navbar
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
    borderBottomColor: '#e0e4da',
  },
  logoContainer: {
    backgroundColor: '#4a5c39',
    borderRadius: 16,
    padding: 4,
    marginRight: 8,
  },
  logo: {
    width: 32,
    height: 32,
    opacity: 1,
    tintColor: '#fff',
    ...(Platform.OS === 'android' && { fontWeight: '900' }),
  },
  logoText: {
    fontSize: 26,
    fontWeight: Platform.OS === 'android' ? '900' : '800',
    color: '#4a5c39',
    letterSpacing: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a5c39',
    marginLeft: 8,
  },
  impactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  impactItem: {
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a5c39',
  },
  impactLabel: {
    fontSize: 14,
    color: '#6b7a5e',
    marginTop: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  activityContainer: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ede3',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f6f8f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a5c39',
  },
  activityTime: {
    fontSize: 14,
    color: '#6b7a5e',
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  severityBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default StatisticsScreen; 