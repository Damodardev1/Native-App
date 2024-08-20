import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, FlatList, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import TableLabels from '../components/TableLabels';
import HeaderFields from '../components/HeaderFields';
import DetailFields from '../components/DetailFields';
import FooterFields from '../components/footerFields'; 
import Header from '../components/Header';
import API_BASE_URL from '../apiconfig';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const fieldwidthpx = 150; // Adjust field width as needed
const isFieldReadOnly = false;

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
  const [hiddenFieldValue, setHiddenFieldValue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  useEffect(() => {
    fetchFunction11Details();
  }, []);

  const fetchFunction11Details = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${dbName}/get-Function11-Det-Dependent-Formula-Fields/${Table_Name}`);
      const resultArray = response.data;
      setHiddenFieldValue(JSON.stringify(resultArray));
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleDateChange = (event, date) => {
    const currentDate = date || selectedDate;
    setSelectedDate(currentDate);
  };

  const renderFooterField = (footerfield) => {
    switch (footerfield.Field_Function) {
      case 15:
        return (
          <View style={[styles.inputContainer, { width: fieldwidthpx }]}>
            <TextInput
              style={styles.input}
              name={`data[${footerfield.Field_Name}]`}
              dataFieldName={footerfield.Field_Name.toLowerCase()}
              editable={!isFieldReadOnly}
              required
            />
          </View>
        );

      case 18:
        return (
          <View style={[styles.inputContainer, { width: fieldwidthpx }]}>
            <Picker
              style={styles.picker}
              name={`data[${footerfield.Field_Name}]`}
              dataFieldName={footerfield.Field_Name.toLowerCase()}
              enabled={!isFieldReadOnly}
              required
            >
              <Picker.Item label="Select From Ajax suggestion box" value="" />
            </Picker>
          </View>
        );

      case 8:
        return (
          <View style={[styles.inputContainer, { width: fieldwidthpx }]}>
            <TouchableOpacity onPress={handleFileUpload}>
              <Text>Upload File</Text>
            </TouchableOpacity>
          </View>
        );

      case 19:
        return (
          <View style={[styles.inputContainer, { width: fieldwidthpx }]}>
            <View
              dataFieldName={footerfield.Field_Name.toLowerCase()}
              dataReadOnly={isFieldReadOnly ? 'readonly' : undefined}
            />
          </View>
        );

      case 27:
        return (
          <View style={[styles.inputContainer, { width: fieldwidthpx }]}>
            <TextInput
              style={styles.input}
              name={`data[${footerfield.Field_Name}]`}
              dataFieldName={footerfield.Field_Name.toLowerCase()}
              editable={!isFieldReadOnly}
              required
              value={new Date().toISOString()}
            />
          </View>
        );

      case 31:
        return (
          <View style={[styles.inputContainer, { width: fieldwidthpx }]}>
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
              style={styles.picker}
            />
          </View>
        );

      case 40:
        return (
          <View style={[styles.inputContainer, { width: fieldwidthpx }]}>
            <TouchableOpacity onPress={handleImageUpload}>
              <Text>Upload Image</Text>
            </TouchableOpacity>
          </View>
        );

      case 22:
        return (
          <View style={[styles.inputContainer, { width: fieldwidthpx }]}>
            <TextInput
              style={styles.input}
              name={`data[${footerfield.Field_Name}]`}
              dataFieldName={footerfield.Field_Name.toLowerCase()}
              editable={false}
              required
            />
          </View>
        );

      case 20:
      case 3:
      case 14:
      case 16:
      case 24:
        return (
          <View style={[styles.inputContainer, { width: fieldwidthpx }]}>
            <Picker
              style={styles.picker}
              name={`data[${footerfield.Field_Name}]`}
              dataFieldName={footerfield.Field_Name.toLowerCase()}
              enabled={!isFieldReadOnly}
              required
            />
          </View>
        );

      case 34:
        return (
          <View style={[styles.inputContainer, { width: fieldwidthpx }]}>
            <TextInput
              style={styles.textArea}
              name={`data[${footerfield.Field_Name}]`}
              dataFieldName={footerfield.Field_Name.toLowerCase()}
              editable={!isFieldReadOnly}
              multiline
              required
            />
          </View>
        );

      case 21:
      case 45:
        return (
          <View style={[styles.inputContainer, { width: fieldwidthpx }]}>
            <TextInput
              style={styles.input}
              name={`data[${footerfield.Field_Name}]`}
              dataFieldName={footerfield.Field_Name.toLowerCase()}
              editable={!isFieldReadOnly}
              required
              value={footerfield.Field_Value || ''}
            />
          </View>
        );

      default:
        return null;
    }
  };

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
        <TextInput
          style={{ display: 'none' }}
          value={hiddenFieldValue}
          onChangeText={(value) => setHiddenFieldValue(value)}
          id="hf_function11_pricing_fields"
        />
        {headerFields.length > 0 && (
          <View style={styles.section}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              <HeaderFields fields={headerFields} dbName={dbName} Table_Name={Table_Name} tran_id={tran_id} data-isdet="0" />
            </ScrollView>
          </View>
        )}
        {Object.keys(detailFields).length > 0 && (
          <View style={styles.section}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              {Object.entries(detailFields).map(([key, fields]) => (
                <DetailFields key={key} fields={fields} dbName={dbName} Table_Name={Table_Name} tran_id={tran_id} data-isdet="1" />
              ))}
            </ScrollView>
          </View>
        )}
        {footerFields.length > 0 && (
          <ScrollView horizontal>
            <View style={styles.footerContainer}>
              <View style={styles.tableHeader}>
                {footerFields.map((field) => (
                  <Text key={field.Field_Name} style={styles.headerCell}>{field.fld_label}</Text>
                ))}
              </View>
              <View style={styles.tableBody}>
                {footerFields.map((field) => renderFooterField(field))}
              </View>
            </View>
          </ScrollView>
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
  footerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#EB2333', // Set the desired background color for the card
    padding: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 8,
  },
  headerCell: {
    width: fieldwidthpx,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    padding: 4,
  },
  tableBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    padding: 8,
    justifyContent: 'center',
  },
  inputContainer: {
    width: fieldwidthpx,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    width: '100%',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    width: '100%',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    width: '100%',
    height: 100,
    textAlignVertical: 'top',
  },
});

export default AddTransactionInsertRoleFieldsComponent;
