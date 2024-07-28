import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, FlatList, ImageBackground } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import TableLabels from '../components/TableLabels';
import HeaderFields from '../components/HeaderFields';
import DetailFields from '../components/DetailFields';
import FooterFields from '../components/footerFields'; // Ensure correct import
import Header from '../components/Header';
import API_BASE_URL from '../apiconfig';

const AddTransactionInsertRoleFieldsComponent = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { dbName, Table_Name, id: tran_id } = route.params || {};

  const [tableLabels, setTableLabels] = useState([]);
  const [headerFields, setHeaderFields] = useState([]);
  const [detailFields, setDetailFields] = useState({});
  const [footerFields, setFooterFields] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setTableLabels([]);
      setHeaderFields([]);
      setDetailFields({});
      setFooterFields([]);
      setDropdownOptions({});
      setIsLoading(true);
      setError(null);

      const url = `${API_BASE_URL}/${dbName}/add-transaction-insert-role-fields/${Table_Name}/${tran_id}`;
      const response = await axios.get(url);

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from the server');
      }

      console.log('Data received:', response.data);

      if (response.data.tablefound && response.data.tablefound.table_label) {
        setTableLabels(response.data.tablefound.table_label);
      } else {
        console.warn('table_label not found in tablefound object');
      }

      if (response.data.headerfields) {
        setHeaderFields(response.data.headerfields);
      } else {
        console.warn('headerfields not found in response data');
      }

      if (response.data.detailfields) {
        setDetailFields(response.data.detailfields);
      } else {
        console.warn('detailfields not found in response data');
      }

      if (response.data.footerfields) {
        setFooterFields(response.data.footerfields);
      } else {
        console.warn('footerfields not found in response data');
      }

      // Fetch dropdown options based on Field_Function
      // Example for Field_Function 4:
      // const dropdownUrl = `${API_BASE_URL}/${dbName}/get-function4-tablerows-checkoptions/${Table_Name}`;
      // const dropdownResponse = await axios.get(dropdownUrl);
      // setDropdownOptions(dropdownResponse.data.options || {});

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError(error.message);
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [dbName, Table_Name, tran_id])
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.topContainer}>
        <ImageBackground
          source={require('../assets/images/Rectangleback.svg')}
          style={styles.image}
          resizeMode="cover"
        >
          <View style={styles.labelContainer}>
            <FlatList
              data={tableLabels}
              horizontal
              renderItem={({ item }) => (
                <Text style={styles.label}>{item}</Text>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ImageBackground>
      </View>
      <ScrollView>
        <TableLabels labels={tableLabels} />
        <View style={styles.horizontalLine} />
        {headerFields.length > 0 && (
          <View style={styles.section}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              <HeaderFields fields={headerFields} dbName={dbName} Table_Name={Table_Name} tran_id={tran_id} />
            </ScrollView>
          </View>
        )}
        {Object.keys(detailFields).length > 0 && (
          <View style={styles.section}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              {Object.entries(detailFields).map(([key, fields]) => (
                <DetailFields key={key} fields={fields} dbName={dbName} Table_Name={Table_Name} />
              ))}
            </ScrollView>
          </View>
        )}
        {footerFields.length > 0 && (
          <View style={styles.section}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              <FooterFields 
                fields={footerFields} 
                dropdownOptions={dropdownOptions}
                headerFields={headerFields}
                setHeaderFields={setHeaderFields}
                dbName={dbName}
                Table_Name={Table_Name}
                tran_id={tran_id} 
              />
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scrollView: {
    maxHeight: 2400,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  topContainer: {
    width: '100%',
    height: 180,
    marginBottom: 10,
  },
  image: {
    position: 'absolute',
    top: 0,
    width: '105%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -5,
    marginTop: 60,
  },
  labelContainer: {
    paddingVertical: 10,
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 20,
    marginBottom: -30,
  },
  label: {
    fontSize: 14,
    color: '#fff',
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
  },
});

export default AddTransactionInsertRoleFieldsComponent;
