import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../apiconfig';

const DetailFields = ({ fields, dbName, Table_Name }) => {
  const [options, setOptions] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [currentField, setCurrentField] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalField, setModalField] = useState('');

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

  const renderField = (field) => {
    switch (field.Field_Function) {
      case '4':
        const selectedValue = selectedValues[field.Field_Name];
        const displayValue = selectedValue ? (selectedValue.length > 5 ? `${selectedValue.substring(0, 5)}...` : selectedValue) : '';
        const placeholderText = displayValue || `Search ${field.fld_label}`;

        return (
          <View style={styles.fieldContainer}>
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
                      style={styles.textInput}
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
          <TextInput
            value={inputValue}
            onChangeText={(text) => setSelectedValues(prevValues => ({ ...prevValues, [field.Field_Name]: text }))}
            placeholder={field.fld_label}
            style={styles.textInput}
            data-isdet='1'
            name={`data[${field.Field_Name}]`}
            data-fieldname={field.Field_Name}
          />
        );
    }
  };

  if (!Array.isArray(fields) || fields.length === 0) {
    return null;
  }

  return (
    <ScrollView style={styles.container} horizontal>
      <View style={styles.fieldRow}>
        {fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.fld_label || 'No Label'}</Text>
            {renderField(field)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  fieldRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fieldContainer: {
    margin: 5,
    flex: 1,
  },
  fieldLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    height: 40,
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
