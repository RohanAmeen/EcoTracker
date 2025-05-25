import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { incidentsAPI } from '../services/api';
import { useAuth } from '../AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const AdminDashboard = ({ navigation }) => {
  const { signOut } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await incidentsAPI.getAllIncidents();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'Failed to fetch reports. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchReports();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress':
        return '#FFA000';
      case 'rejected':
        return '#D32F2F';
      case 'resolved':
        return '#2E7D32';
      default:
        return '#4a5c39';
    }
  };

  const getTypeIcon = (type) => {
    if (!type) return 'warning';
    
    switch (type.toLowerCase()) {
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

  const filteredReports = reports.filter(report => {
    if (!report) return false;
    
    const matchesSearch = 
      (report.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (report.type?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (report.reportedBy?.username?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const renderReportItem = ({ item }) => {
    if (!item) return null;
    
    return (
      <TouchableOpacity 
        style={styles.reportItem}
        onPress={() => navigation.navigate('ReportDetails', { report: item })}
      >
        <View style={styles.reportHeader}>
          <View style={styles.titleContainer}>
            <View style={styles.typeContainer}>
              <Icon 
                name={getTypeIcon(item.type)} 
                size={20} 
                color="#4a5c39" 
                style={styles.typeIcon}
              />
              <Text style={styles.typeTitle}>
                {item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Unknown'}
              </Text>
            </View>
            <Text style={styles.reportDate}>
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'No date'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.reportDescription} numberOfLines={1}>
          {item.description || 'No description provided'}
        </Text>

        <View style={styles.reportFooter}>
          <View style={styles.reporterInfo}>
            <Icon name="person" size={16} color="#666" />
            <Text style={styles.reporterText}>
              {item.reportedBy?.username || 'Unknown'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
              {item.status === 'in-progress' ? 'In Progress' : 
               item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Unknown'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="description" size={64} color="#b7c9a8" />
      <Text style={styles.emptyTitle}>No Reports Found</Text>
      <Text style={styles.emptyText}>
        {searchQuery || filterStatus !== 'all' 
          ? 'Try adjusting your search or filters'
          : 'There are no reports in the system yet.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Dashboard</Text>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Icon name="logout" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search reports..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterStatus === 'all' && styles.filterButtonActive]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[styles.filterButtonText, filterStatus === 'all' && styles.filterButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterStatus === 'in-progress' && { backgroundColor: '#FFA000' }]}
          onPress={() => setFilterStatus('in-progress')}
        >
          <Text style={[styles.filterButtonText, filterStatus === 'in-progress' && styles.filterButtonTextActive]}>
            In Progress
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterStatus === 'resolved' && { backgroundColor: '#2E7D32' }]}
          onPress={() => setFilterStatus('resolved')}
        >
          <Text style={[styles.filterButtonText, filterStatus === 'resolved' && styles.filterButtonTextActive]}>
            Resolved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterStatus === 'rejected' && { backgroundColor: '#D32F2F' }]}
          onPress={() => setFilterStatus('rejected')}
        >
          <Text style={[styles.filterButtonText, filterStatus === 'rejected' && styles.filterButtonTextActive]}>
            Rejected
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a5c39" />
        </View>
      ) : (
        <FlatList
          data={filteredReports}
          renderItem={renderReportItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#2c3e50',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    letterSpacing: 0.5,
  },
  signOutButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  filterButtonActive: {
    backgroundColor: '#2c3e50',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
  },
  reportItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    marginRight: 8,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a5c39',
  },
  reportDate: {
    fontSize: 12,
    color: '#666',
  },
  reportDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  reporterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reporterText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 90,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a5c39',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AdminDashboard; 