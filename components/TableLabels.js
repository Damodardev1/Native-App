import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const TableLabels = ({ labels }) => {
  const safeLabels = Array.isArray(labels) ? labels : [];

  return (
    <ScrollView style={styles.container}>
      {safeLabels.map((label, index) => (
        <View key={index} style={styles.labelContainer}>
          <Text>{label}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  labelContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
  },
});

export default TableLabels;
