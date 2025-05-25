import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ReportsScreen = ({ navigation }) => {
  // Dummy data for reports - replace with actual data from your backend
  const reports = [];

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="description" size={64} color="#b7c9a8" />
      <Text style={styles.emptyTitle}>No Reports Yet</Text>
      <Text style={styles.emptyText}>
        You haven't submitted any environmental reports yet. Start by reporting an incident in your area!
      </Text>
      <TouchableOpacity 
        style={styles.reportButton}
        onPress={() => navigation.navigate('ReportIncident')}
      >
        <Text style={styles.reportButtonText}>Report an Incident</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReportItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.reportItem}
      onPress={() => navigation.navigate('IncidentDetails', { incident: item })}
    >
      <View style={styles.reportHeader}>
        <Text style={styles.reportTitle}>{item.title}</Text>
        <Text style={styles.reportDate}>{item.date}</Text>
      </View>
      <Text style={styles.reportDescription}>{item.description}</Text>
      <View style={styles.reportFooter}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={styles.reportLocation}>{item.locationDetails}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return '#b7c9a8';
      case 'in-progress':
        return '#8ca982';
      case 'resolved':
        return '#6b7a5e';
      default:
        return '#b7c9a8';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#b7c9a8", "#8ca982"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reports</Text>
      </LinearGradient>

      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f3',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4b5e3c',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7a5e',
    textAlign: 'center',
    marginBottom: 24,
  },
  reportButton: {
    backgroundColor: '#6b7a5e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3a22',
  },
  reportDate: {
    fontSize: 14,
    color: '#6b7a5e',
  },
  reportDescription: {
    fontSize: 16,
    color: '#4b5e3c',
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  reportLocation: {
    fontSize: 14,
    color: '#6b7a5e',
  },
});

export default ReportsScreen; 