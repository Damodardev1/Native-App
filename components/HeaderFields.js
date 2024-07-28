import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import debounce from 'lodash.debounce';
import axios from 'axios';
import { fetchCheckOptions, fetchDropdownOptions } from './apiUtils'; 
import API_BASE_URL from '../apiconfig';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const HeaderFields = ({ fields, dbName, Table_Name }) => {
  const [selectedValues, setSelectedValues] = useState({});
  const [dropdownOptions, setDropdownOptions] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [currentField, setCurrentField] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCheckOptions(fields, dbName, Table_Name, setSelectedValues)
      // .then(() => console.log('Check options fetched successfully'))
      .catch(error => setError('Failed to fetch check options'));
  }, [fields, dbName, Table_Name]);

  const debouncedSearch = useCallback(debounce(async (fieldName, searchTerm) => {
    if (searchTerm.length > 0 && fields.find(f => f.Field_Name === fieldName).Field_Function === '4') {
      try {
        const options = await fetchDropdownOptions(fieldName, fields.find(f => f.Field_Name === fieldName).Field_Function, searchTerm, dbName, Table_Name);
        setDropdownOptions(prevOptions => ({
          ...prevOptions,
          [fieldName]: options,
        }));
      } catch (error) {
        setError(`Failed to fetch dropdown options for ${fieldName}`);
      }
    } else {
      setDropdownOptions(prevOptions => ({
        ...prevOptions,
        [fieldName]: []
      }));
    }
  }, 300), [fields, dbName, Table_Name]);

  const handleSearchTextChange = (text, fieldName) => {
    setSearchTerms(prevTerms => ({ ...prevTerms, [fieldName]: text }));
    setCurrentField(fieldName);
    debouncedSearch(fieldName, text);
  };

  const handleDropdownChange = async (fieldName, selectedId, selectedName) => {
    const truncatedName = selectedName.length > 10 ? `${selectedName.substring(0, 10)}...` : selectedName;

    setSelectedValues(prevValues => ({
      ...prevValues,
      [fieldName]: truncatedName
    }));

    setSearchTerms(prevTerms => ({ ...prevTerms, [fieldName]: '' }));
    closeDropdown(); 

    try {
      const field = fields.find(f => f.Field_Name === fieldName);
      if (field && field.Field_Function === '4') {
        await fetchAdditionalData(['3', '24', '46', '49', '50', '51', '52'], fieldName, selectedId);
      }
    } catch (error) {
      console.error('Failed to handle dropdown change:', error);
      setError(`Failed to handle dropdown change for ${fieldName}`);
    }
  };

  const fetchAdditionalData = async (fieldFunctions, fieldName, selectedId) => {
    try {
      const targetFieldNames = ["3", "24", "49", "46", "50", "51", "52"]; 

      for (const fieldFunction of fieldFunctions) {
        const params = new URLSearchParams();
        params.append('table_name', Table_Name);
        params.append('scr_field', fieldName);
        params.append('field_val', selectedId);

        const checkOptionsUrl = `${API_BASE_URL}/${dbName}/get-function${fieldFunction}-fieldvalues-checkoptions`;
        const checkOptionsResponse = await axios.post(checkOptionsUrl, params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const checkOptionsData = checkOptionsResponse.data;

        if (Array.isArray(checkOptionsData)) {
          const filteredRecords = checkOptionsData.filter(record => record.noofoptions === 1);
          for (const record of filteredRecords) {
            const fieldToUpdate = fields.find(f => f.Field_Name === record.field_name);
            if (fieldToUpdate) {
              setSelectedValues(prevValues => ({
                ...prevValues,
                [record.field_name]: record.field_value,
              }));
            }
          }
        }

        if (checkOptionsData.noofoptions === 1) {
          const additionalParams = new URLSearchParams();
          additionalParams.append('table_name', Table_Name);
          additionalParams.append('field_name', fieldName);

          const additionalResponse = await axios.post(`${API_BASE_URL}/${dbName}/get-function${fieldFunction}-fieldvalues`, additionalParams, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });

          const additionalData = additionalResponse.data;

          const options = additionalData
            .filter(item => targetFieldNames.includes(item.field_name))
            .map(item => ({
              id: item.field_name,
              name: item.field_value,
            }));

          for (const option of options) {
            const fieldToUpdate = fields.find(f => f.Field_Name === option.id);
            if (fieldToUpdate) {
              setSelectedValues(prevValues => ({
                ...prevValues,
                [option.id]: option.name,
              }));
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch additional data:', error);
      setError('Failed to fetch additional data');
    }
  };

  const renderDropdownOptions = (fieldName) => {
    const options = dropdownOptions[fieldName] || [];
    const searchTerm = searchTerms[fieldName] || '';
    const filteredOptions = options.filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return filteredOptions.length > 0 ? (
      <FlatList
        data={filteredOptions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedValues(prevValues => ({ ...prevValues, [fieldName]: item.name }));
              setCurrentField(null);
              handleDropdownChange(fieldName, item.id, item.name);
            }}
            style={styles.dropdownItem}
            key={item.id}
          >
            <Text style={styles.dropdownItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    ) : null;
  };

  const openDropdown = (fieldName) => {
    setCurrentField(fieldName);
    if (fields.find(f => f.Field_Name === fieldName).Field_Function === '4') {
      fetchDropdownOptions(fieldName, fields.find(f => f.Field_Name === fieldName).Field_Function, '', dbName, Table_Name)
        .then(options => setDropdownOptions(prevOptions => ({
          ...prevOptions,
          [fieldName]: options,
        })))
        .catch(error => setError(`Failed to fetch dropdown options for ${fieldName}`));
    }
  };

  const closeDropdown = () => {
    setCurrentField('');
    setSearchTerms(prevTerms => ({ ...prevTerms, [currentField]: '' }));
  };

  const clearSelectedValue = (fieldName) => {
    setSelectedValues(prevValues => ({
      ...prevValues,
      [fieldName]: ''
    }));
    setSearchTerms(prevTerms => ({ ...prevTerms, [fieldName]: '' }));
    closeDropdown();
  };

  const renderFieldByFunction = (field, index) => {
    const { Field_Function, Field_Name, fld_label } = field;
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
    const handleConfirm = (date) => {
      setSelectedDate(date.toISOString().split('T')[0]); 
      setSelectedValues((prevValues) => ({ ...prevValues, [Field_Name]: date.toISOString().split('T')[0] }));
      hideDatePicker();
    };
  
  

    if (['3','5', '24', '46', '49', '50', '51', '52'].includes(Field_Function)) {
      return (
        <View key={index} style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>{fld_label}</Text>
          <TextInput
            value={selectedValues[Field_Name] || ''}
            editable={false}
            style={styles.textInput}
            data-isdet='0' 
            name={`data[${Field_Name}]`} 
            data-fieldname={Field_Name} 
          />
        </View>
      );
    }
    
    const isSearchable = ['4', '2', '8'].includes(Field_Function);
    const isDateField = Field_Function === '6';

    return (
      <View key={index} style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{fld_label}</Text>
        {isSearchable && (
          <TouchableWithoutFeedback onPress={() => openDropdown(Field_Name)}>
            <View style={styles.dropdownContainer}>
              <TextInput
                onFocus={() => openDropdown(Field_Name)}
                value={searchTerms[Field_Name] || ''}
                onChangeText={(text) => handleSearchTextChange(text, Field_Name)}
                placeholder={`Search ${fld_label}`}
                style={styles.textInput}
                data-isdet='0' 
                name={`data[${Field_Name}]`} 
                data-fieldname={Field_Name} 
              />
              {currentField === Field_Name && (
                <ScrollView style={styles.dropdown}>
                  {renderDropdownOptions(Field_Name)}
                </ScrollView>
              )}
              {selectedValues[Field_Name] && (
                <View style={styles.selectedValueContainer}>
                  <Text style={styles.selectedValue}>{selectedValues[Field_Name]}</Text>
                  <TouchableOpacity onPress={() => clearSelectedValue(Field_Name)}>
                    <Text style={styles.clearButton}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}
        {isDateField && (
          <TouchableWithoutFeedback onPress={showDatePicker}>
            <View style={styles.dateContainer}>
              <TextInput
                value={selectedDate || ''}
                editable={false}
                placeholder={`Select ${fld_label}`}
                style={styles.textInput}
                data-isdet='0' 
                name={`data[${Field_Name}]`} 
                data-fieldname={Field_Name} 
              />
            </View>
          </TouchableWithoutFeedback>
        )}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    );
  };

 

  const renderFillFields = () => {
    const FillFields = fields.filter(field => !['3', '24', '46', '49', '50', '51', '52'].includes(field.Field_Function));

    return (
      <View>
        <Text style={styles.heading}> Fill Details</Text>
        {FillFields.map((field, index) => renderFieldByFunction(field, index))}
      </View>
    );
  }; 






  

  const renderAutoFillFields = () => {
    const autoFillFields = fields.filter(field => ['3', '24', '46', '49', '50', '51', '52'].includes(field.Field_Function));

    return (
      <View>
        <Text style={styles.heading}>Auto Fill</Text>
        {autoFillFields.map((field, index) => renderFieldByFunction(field, index))}
      </View>
    );
  };

  return (
    // <ScrollView style={styles.container}>
    <View>
       {renderFillFields()}
      {renderAutoFillFields()}
      {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  fieldContainer: {
    marginVertical: 5,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    marginTop: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  dropdown: {
    maxHeight: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  selectedValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  selectedValue: {
    fontSize: 14,
    color: '#000',
    marginRight: 5,
  },
  clearButton: {
    fontSize: 14,
    color: 'red',
  },
  cardContainer: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginVertical: 10,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default HeaderFields;

