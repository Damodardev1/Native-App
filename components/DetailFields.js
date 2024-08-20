import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../apiconfig';
import { DataTable } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DetailFields = ({ fields, dbName, Table_Name, tran_id }) => {
  const [options, setOptions] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [currentField, setCurrentField] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalField, setModalField] = useState('');
  const [function11Formulas, setFunction11Formulas] = useState({});
  const [formulas, setFormulas] = useState([]);
  const [rows, setRows] = useState([{}]);
  const filteredFields = fields.filter((field) => field.fld_label !== 'row_id');


  const fetchCheckOptions = async () => {
    try {
      const modifiedTableName = appendDetToTableName(Table_Name);
      const checkOptionsUrls = {
        "2": `${API_BASE_URL}/${dbName}/get-function2-fieldvalues-checkoptions/${modifiedTableName}`,
        "4": `${API_BASE_URL}/${dbName}/get-function4-tablerows-checkoptions/${modifiedTableName}`,
        "5": `${API_BASE_URL}/${dbName}/get-function5-codes-checkoptions/${modifiedTableName}`,
        "18": `${API_BASE_URL}/${dbName}/get-function18-users-checkoptions/${modifiedTableName}`,
        "20": `${API_BASE_URL}/${dbName}/get-function20-user-checkoptions/${modifiedTableName}`,
        "56": `${API_BASE_URL}/${dbName}/get-function56-tablerows-checkoptions/${modifiedTableName}`
      };

      for (const field of fields) {
        const { Field_Function, Field_Name } = field;

        if (!checkOptionsUrls[Field_Function]) continue;

        const response = await axios.get(checkOptionsUrls[Field_Function], {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          params: { 'data[field_name]': Field_Name, 'table_name': modifiedTableName }
        });

        const responseData = response.data;
        for (const [key, value] of Object.entries(responseData)) {
          if (value.noofoptions === 1) {
            const fieldValue = value.single_text || 'Default Value';
            setSelectedValues(prevValues => ({
              ...prevValues,
              [Field_Name]: fieldValue
            }));
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch check options for fields:', error);
    }
  };

  useEffect(() => {
    fetchCheckOptions();
  }, [dbName, Table_Name, fields]);

  const appendDetToTableName = (tableName) => `${tableName}_det`;

  useEffect(() => {
    const fetchInitialOptions = async (field) => {
      try {
        const modifiedTableName = appendDetToTableName(Table_Name);
        const response = await axios.post(
          `${API_BASE_URL}/${dbName}/get-function4-tablerows`,
          `data[table_name]=${modifiedTableName}&data[field_name]=${field.Field_Name}`,
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }
        );

        const optionsData = response.data;
        const transformedOptions = optionsData.map(option => ({
          label: option.text,
          value: option.id
        }));

        setOptions(prevOptions => ({
          ...prevOptions,
          [field.Field_Name]: transformedOptions
        }));
      } catch (error) {
        console.error('Error fetching initial options:', error);
      }
    };

    const fetchOptionsOnFieldClick = (field) => {
      fetchInitialOptions(field);
    };

    if (currentField) {
      const field = fields.find(f => f.Field_Name === currentField);
      if (field) {
        fetchOptionsOnFieldClick(field);
      }
    }
  }, [currentField, dbName, Table_Name]);

  const handleSearchTextChange = (text, fieldName) => {
    setSearchTerms(prevTerms => ({ ...prevTerms, [fieldName]: text }));
    fetchOptions(fieldName, text);
  };

  const fetchOptions = async (fieldName, searchTerm = '') => {
    try {
      const modifiedTableName = appendDetToTableName(Table_Name);
      const response = await axios.post(
        `${API_BASE_URL}/${dbName}/get-function4-tablerows`,
        `data[table_name]=${modifiedTableName}&data[field_name]=${fieldName}&searchTerm=${searchTerm}`,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );

      const optionsData = response.data;
      const transformedOptions = optionsData.map(option => ({
        label: option.text,
        value: option.id
      }));

      setOptions(prevOptions => ({
        ...prevOptions,
        [fieldName]: transformedOptions
      }));
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchDependentFieldValues = async (selectedValue, fieldName) => {
    const modifiedTableName = appendDetToTableName(Table_Name);
    const fieldFunctionApis = [
      `${API_BASE_URL}/${dbName}/get-function3-fieldvalues-checkoptions`,
      `${API_BASE_URL}/${dbName}/get-function24-fieldvalues-checkoptions`,
      `${API_BASE_URL}/${dbName}/get-function46-fieldvalues-checkoptions`,
      `${API_BASE_URL}/${dbName}/get-function48-fieldvalues-checkoptions`,
      `${API_BASE_URL}/${dbName}/get-function50-fieldvalues-checkoptions`,
      `${API_BASE_URL}/${dbName}/get-function51-fieldvalues-checkoptions`,
      `${API_BASE_URL}/${dbName}/get-function52-fieldvalues-checkoptions`,
      `${API_BASE_URL}/${dbName}/get-function57-fieldvalues-checkoptions`,
    ];

    const payload = new URLSearchParams();
    payload.append('table_name', modifiedTableName);
    payload.append('scr_field', fieldName);
    payload.append('field_val', selectedValue);

    const fetchData = async (api) => {
      try {
        const response = await axios.post(api, payload.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const responseData = response.data;
        for (const [key, value] of Object.entries(responseData)) {
          if (value.noofoptions === 1) {
            setSelectedValues(prevValues => ({
              ...prevValues,
              [value.field_name]: value.field_value || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching dependent field values:', error);
      }
    };

    const fetchAllData = async () => {
      for (const api of fieldFunctionApis) {
        await fetchData(api);
      }
    };

    fetchAllData();
  };

  const clearSelectedValue = (fieldName) => {
    setSelectedValues(prevValues => ({ ...prevValues, [fieldName]: null }));
    setSearchTerms(prevTerms => ({ ...prevTerms, [fieldName]: '' }));
  };

  const renderDropdownOptions = (fieldName) => {
    const filteredOptions = (options[fieldName] || []).filter(option =>
      option.label.toLowerCase().includes((searchTerms[fieldName] || '').toLowerCase())
    );

    return filteredOptions.map(option => (
      <TouchableOpacity
        key={option.value}
        onPress={() => {
          setSelectedValues(prevValues => ({ ...prevValues, [fieldName]: option.label }));
          setSearchTerms(prevTerms => ({ ...prevTerms, [fieldName]: option.label }));
          fetchDependentFieldValues(option.value, fieldName);
          setIsModalVisible(false);
        }}
        style={styles.option}
      >
        <Text>{option.label}</Text>
      </TouchableOpacity>
    ));
  };

  const addRow = () => {
    setRows([...rows, {}]);
  };

  const deleteRow = (index) => {
    setRows(prevRows => prevRows.filter((_, rowIndex) => rowIndex !== index));
  };
  
  // const handleSearchTextChange = (text, fieldName) => {
  //   setSearchTerms(prevTerms => ({
  //     ...prevTerms,
  //     [fieldName]: text
  //   }));
  // };

  // const clearSelectedValue = (fieldName) => {
  //   setSelectedValues(prevValues => ({
  //     ...prevValues,
  //     [fieldName]: ''
  //   }));
  //   setSearchTerms(prevTerms => ({
  //     ...prevTerms,
  //     [fieldName]: ''
  //   }));
  // };

  const renderField = (field) => {
    switch (field.Field_Function) {
      case '4':
        const selectedValue = selectedValues[field.Field_Name];
        const displayValue = selectedValue ? (selectedValue.length > 5 ? `${selectedValue.substring(0, 5)}...` : selectedValue) : '';
        const placeholderText = displayValue || `Search ${field.fld_label}`;
  
        return (
          <View style={styles.fieldContainer} key={field.Field_Name}>
            <TouchableOpacity
              onPress={() => {
                setCurrentField(field.Field_Name);
                setModalField(field.Field_Name);
                setIsModalVisible(true);
              }}
              style={styles.textInput}
            >
              <Text>{displayValue || placeholderText}</Text>
            </TouchableOpacity>
            {currentField === field.Field_Name && (
              <Modal
                visible={isModalVisible && modalField === field.Field_Name}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <TextInput
                      value={searchTerms[field.Field_Name] || displayValue}
                      onChangeText={(text) => handleSearchTextChange(text, field.Field_Name)}
                      placeholder={placeholderText}
                      style={styles.searchTextInput}
                      autoFocus
                    />
                    <ScrollView style={styles.dropdown}>
                      {renderDropdownOptions(field.Field_Name)}
                    </ScrollView>
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => {
                        clearSelectedValue(field.Field_Name);
                        setIsModalVisible(false);
                      }}
                    >
                      <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}
          </View>
        );
      default:
        const inputValue = selectedValues[field.Field_Name] || '';
        return (
          <View style={styles.fieldContainer} key={field.Field_Name}>
            <TextInput
              value={inputValue}
              onChangeText={(text) => setSelectedValues(prevValues => ({ ...prevValues, [field.Field_Name]: text }))}
              style={styles.textInput}
              autoCapitalize="none"
              placeholder={field.fld_label}
            />
          </View>
        );
    }
  };
  

  if (!Array.isArray(fields) || fields.length === 0) {
    return null;
  }

  const tableHeaders = (
    <DataTable.Header style={styles.tableHeader}>
      {filteredFields.map(field => (
        <DataTable.Title key={field.Field_Name} style={styles.tableHeaderTitle}>
          <Text style={styles.headerText}>{field.fld_label}</Text>
        </DataTable.Title>
      ))}
      <DataTable.Title style={styles.tableHeaderTitle}>
        <Text style={styles.headerText}>Actions</Text>
      </DataTable.Title>
    </DataTable.Header>
  );

  const tableRows = rows.map((row, rowIndex) => (
    <DataTable.Row key={rowIndex} style={styles.tableRow}>
      {filteredFields.map((field, index) => (
        <DataTable.Cell key={index} style={styles.tableCell}>
          {renderField(field)}
        </DataTable.Cell>
      ))}
      <DataTable.Cell style={styles.tableCell}>
        <TouchableOpacity onPress={addRow} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteRow(rowIndex)} style={styles.deleteButton}>
          <FontAwesome name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </DataTable.Cell>
    </DataTable.Row>
  ));
  

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View style={styles.card}>
          <DataTable>
            {tableHeaders}
            {tableRows}
          </DataTable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  tableHeader: {
    backgroundColor: '#EB2333',
  },
  tableHeaderTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 100,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#EB2333',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    marginLeft: 10,
  },
  headerText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 50,
  },
  cellText: {
    textAlign: 'center',
  },
  addButton: {
    padding: 10,
    backgroundColor: '#EB2333',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  fieldContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 50,
    width: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  searchTextInput: {
    height: 40,
    width: 300,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  dropdown: {
    maxHeight: 150,
    marginTop: 10,
  },
  option: {
    padding: 10,
  },
  clearButton: {
    marginTop: 10,
  },
  clearButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
export default DetailFields;
