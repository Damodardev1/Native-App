import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header'; // Adjust the path based on your project structure

const CompanyDashboard = () => {
  const route = useRoute();
  const { dbName, compName } = route.params;

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text>Database Name: {dbName}</Text>
        <Text>Company Name: {compName}</Text>
        {/* Render the rest of your component content here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default CompanyDashboard;
