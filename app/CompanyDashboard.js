import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header'; 

const CompanyDashboard = () => {
  const route = useRoute();
  const { dbName, compName } = route.params;

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>Database Name: {dbName}</Text>
        <Text style={styles.text}>Company Name: {compName}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, 
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    textAlign: 'center',
    maxWidth: '100%',
  },
});

export default CompanyDashboard;
