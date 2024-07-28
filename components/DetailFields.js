import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../apiconfig';

const DetailFields = ({ fields, dbName, Table_Name, tran_id }) => {
  const [options, setOptions] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [currentField, setCurrentField] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalField, setModalField] = useState('');
  const [function11Formulas, setFunction11Formulas] = useState({});
  const [formulas, setFormulas] = useState([]);

  useEffect(() => {
    fetchFunction11Details();
  }, []);

  const fetchFunction11Details = async () => {
    try {
      // const tablename = Table_Name;
      const response = await axios.get(`${API_BASE_URL}/${dbName}/get-Function11-Det-Dependent-Formula-Fields/${Table_Name}`);
      const resultArray = response.data;
      setFields(resultArray);
      initializeAndBindFields(resultArray);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const initializeAndBindFields = (resultArray) => {
    const newFormulas = [];
    resultArray.forEach((result) => {
      const { formula_fields, field_name, tranId, tab_id, Table_Name } = result;
      formula_fields.forEach((formulafield) => {
        let detailsTable = Table_Name + '_det';
        if (formulafield['is_det'] == 1 && typeof formulafield === 'string') {
          const pattern = /_IS_(.*?)(?=[A-Za-z]+_)/;
          const match = formulafield.match(pattern);
          if (match) {
            detailsTable = match[1];
          }
        }

        const dettableElement = document.querySelector(`[data-tablename=${detailsTable}]`);
        let detTxnId = 0;
        if (dettableElement) {
          const detId = dettableElement.getAttribute('id');
          const parts = detId.split('_');
          if (parts.length >= 2) {
            detTxnId = parts[1];
          }
        }

        let forfields_string;
        if (formulafield['is_det'] == 1) {
          forfields_string = document.querySelector(`[data-fieldname='${formulafield['fromfield']}'][data-isdet='${formulafield['is_det']}'][data-row='${rownum}'][data-table='${detailsTable}']`)?.dataset.forfields;
        } else {
          forfields_string = document.querySelector(`[data-fieldname='${formulafield['fromfield']}'][data-isdet='${formulafield['is_det']}']`)?.dataset.forfields;
        }

        let forfields = forfields_string ? JSON.parse(forfields_string) : [];
        forfields.push({
          'forfieldname': field_name,
          'forisdet': 0,
          'fortabid': tab_id,
          'fromfieldname': formulafield['fromfield'],
          'fromfieldisdet': formulafield['is_det']
        });

        let fromtarget;
        if (formulafield['is_det'] == 1) {
          fromtarget = document.querySelector(`[data-fieldname='${formulafield['fromfield']}'][data-isdet='${formulafield['is_det']}'][data-row='${rownum}'][data-table='${detailsTable}']`);
        } else {
          fromtarget = document.querySelector(`[data-fieldname='${formulafield['fromfield']}'][data-isdet='${formulafield['is_det']}']`);
        }

        if (fromtarget) {
          fromtarget.dataset.forfields = JSON.stringify(forfields);
          document.querySelector(`#tbldetails_${detTxnId}`)?.addEventListener('keydown', (e) => handleKeyDown(e, detailsTable, rownum));
          document.querySelector(`#tbldetails_${detTxnId}`)?.addEventListener('input', (e) => handleInput(e, detailsTable, rownum));
        }
      });
    });
    setFormulas(newFormulas);
  };

  const handleKeyDown = (e, detailsTable, rownum) => {
    const keyCode = e.keyCode || e.which;
    if (e.type === 'input' || keyCode === 229 || (e.type === 'keydown' && (keyCode === 9 || keyCode === 13 || keyCode === 229))) {
      calculateAllFunction11FieldFormulaPricing(detailsTable, rownum);
    }
  };

  const handleInput = (e, detailsTable, rownum) => {
    calculateAllFunction11FieldFormulaPricing(detailsTable, rownum);
  };

  const calculateAllFunction11FieldFormulaPricing = (detailsTable, rownum) => {
  };


  useEffect(() => {
    // Fetch function11 fields
    const fetchFunction11Fields = async () => {
        const url = `${API_BASE_URL}/${dbName}/get-Function11-Field-Formulas/${Table_Name}`;
        try {
            const response = await axios.get(url);
            const resultarray = response.data;

            setFunction11Fields(resultarray);

            const newFormulas = {};
            resultarray.forEach(result => {
                const fieldname = result['field_name'];
                newFormulas[fieldname] = result['formula_fields'];
            });
            setFormulas(newFormulas);
        } catch (error) {
            console.error("Error fetching function11 fields:", error);
        }
    };

    fetchFunction11Fields();
}, [dbName, Table_Name]);

// const handleInputChange = (fieldname, value, formulafields) => {
//     formulafields.forEach(formulafield => {
//         const forfields = formulas[formulafield.fromfield] || [];
//         forfields.push({
//             'forfieldname': fieldname,
//             'forisdet': 0,
//             'fortabid': 'Header',
//             'fromfieldname': formulafield['fromfield'],
//             'fromfieldisdet': formulafield['is_det']
//         });

//         setFormulas(prevFormulas => ({
//             ...prevFormulas,
//             [formulafield.fromfield]: forfields
//         }));
//     });

//     // Your calculation logic here
//     calculateFunction11FieldFormulaHeader(fieldname, value, formulafields);
// };

  const fetchFunction11Formulas = async (tableName) => {
    try {
      const appendDetToTableName = (tableName) => `${tableName}_det`;
      const modifiedTableName = appendDetToTableName(Table_Name);
      const response = await axios.get(`${API_BASE_URL}/${dbName}/get-Function11-Field-Formulas-Only-Header/${modifiedTableName}`);
      const resultArray = response.data;
      const formulas = {};
      
      resultArray.forEach(result => {
        const { field_name, formula_fields, tab_id } = result;
        const formulaData = {
          formula_fields: formula_fields,
          tab_id: tab_id
        };
        formulas[field_name] = formulaData;
      });

      setFunction11Formulas(formulas);
    } catch (error) {
      console.error('Error fetching function 11 formulas:', error);
    }
  };

  useEffect(() => {
    fetchFunction11Formulas(Table_Name);
  }, [dbName, Table_Name]);
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
