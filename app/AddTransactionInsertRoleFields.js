import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, ScrollView, TextInput, TouchableOpacity, Picker, CheckBox } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import Header from '../components/Header';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const AddTransactionInsertRoleFields = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { dbName, Table_Name, id } = route.params ? route.params : {};
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [tableLabels, setTableLabels] = useState([]);
  const [headerFields, setHeaderFields] = useState([]);
  const [detailFields, setDetailFields] = useState([]);
  const [footerFields, setFooterFields] = useState([]);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentFieldIndex, setCurrentFieldIndex] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [checkboxValues, setCheckboxValues] = useState({ Telugu: false, English: false, Hindi: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://jd1.bigapple.in/api/${dbName}/add-transaction-insert-role-fields/${Table_Name}/${id}`;
        const response = await axios.get(url);
  
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response from the server');
        }
  
        console.log('Data received:', response.data);
        setResponseData(response.data);
  
        if (response.data.tablefound && response.data.tablefound.table_label) {
          setTableLabels(response.data.tablefound.table_label);
        } else {
          console.warn('table_label not found in tablefound object');
        }
  
        if (response.data.headerfields) {
          setHeaderFields(response.data.headerfields);
          const function2Url = `https://jd1.bigapple.in/api/${dbName}/get-function2-fieldvalues-checkoptions/${Table_Name}`;
          
          try {
            console.log('Fetching dropdown options for table:', Table_Name); // Log the table name
        
            const function2Response = await axios.get(function2Url, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              }
            });
        
            if (function2Response.data && function2Response.data.dropdownOptions) {
              setDropdownOptions(function2Response.data.dropdownOptions);
            } else {
              console.warn('Dropdown options for Field_Function === "2" not found in response data');
            }
          } catch (error) {
            console.error('Error fetching dropdown options:', error.message);
            setError(error.message);
          }
        } else {
          console.warn('No headerfields found where Field_Function === "2"');
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
  
        // Example: Assuming dropdown options are fetched from response data
        if (response.data.dropdownOptions) {
          setDropdownOptions(response.data.dropdownOptions);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(error.message);
      }
    };
  
    if (dbName && Table_Name && id) {
      fetchData();
    }
  }, [dbName, Table_Name, id]);
    
  const showDatePicker = (index) => {
    setCurrentFieldIndex(index);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);
    if (currentFieldIndex !== null) {
      const updatedFields = [...headerFields];
      updatedFields[currentFieldIndex].value = date.toLocaleDateString(); // Adjust as needed
      setHeaderFields(updatedFields);
    }
  };

  const handleDropdownChange = (itemValue, index) => {
    const updatedFields = [...headerFields];
    updatedFields[index].value = itemValue;
    setHeaderFields(updatedFields);
  };

  const handleCheckboxChange = (label) => {
    setCheckboxValues({ ...checkboxValues, [label]: !checkboxValues[label] });
  };

  const renderFieldsByType = (fields) => {
    const autoFillFields = fields.filter(field => field.Field_Function === "3");
    const fillDeatails = fields.filter(field => field.Field_Function !== "3");
  
    return (
      <>
        {/* Remaining Header Fields Section */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Fill Details</Text>
          <Text style={styles.fieldCount}>Fields: {fillDeatails.length}</Text>
        </View>
        {fillDeatails.map((field, index) => (
          <View key={index}>
            <Text style={styles.field}>{field.fld_label}</Text>
            {renderFieldByFunction(field, index)}
          </View>
        ))}
        <View style={styles.horizontalLine} />
  
        {/* Auto Fill Section */}
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>Auto Fill</Text>
        </View>
        <View style={styles.autoFillContainer}>
          {autoFillFields.map((field, index) => (
            <View key={index}>
              <Text style={styles.field}>{field.fld_label}</Text>
              {renderAutoFillFieldByFunction(field, index)}
            </View>
          ))}
        </View>
        <View style={styles.horizontalLine} />
      </>
    );
  };
  
  const renderFieldByFunction = (field, index) => {
    if (field.Field_Function === "1") {
      return (
        <TextInput
          style={styles.textInput}
          placeholder="Enter Text"
          value={field.value || ''}
          onChangeText={(text) => {
            const updatedFields = [...headerFields];
            updatedFields[index].value = text;
            setHeaderFields(updatedFields);
          }}
        />
      );
    } else if (field.Field_Function === "2") {
      return (
        <Picker
          selectedValue={field.value}
          onValueChange={(itemValue) => handleDropdownChange(itemValue, index)}
          style={styles.picker}
        >
          {dropdownOptions.map((option, optIndex) => (
            <Picker.Item key={optIndex} label={option.label} value={option.value} />
          ))}
        </Picker>
      );
    } else if (field.Field_Function === "4") {
      return (
        <Picker
          selectedValue={field.value}
          onValueChange={(itemValue) => handleDropdownChange(itemValue, index)}
          style={styles.picker}
        >
          {dropdownOptions.map((option, optIndex) => (
            <Picker.Item key={optIndex} label={option.label} value={option.value} />
          ))}
        </Picker>
      );
    } else if (field.Field_Function === "6") {
      return (
        <TextInput
          style={styles.textInput}
          placeholder="Enter Text"
          value={field.value || ''}
          onChangeText={(text) => {
            const updatedFields = [...headerFields];
            updatedFields[index].value = text;
            setHeaderFields(updatedFields);
          }}
        />
      );
    } else if (field.Field_Function === "8") {
      return (
        <TextInput
          style={styles.textInput}
          placeholder="Enter Text"
          value={field.value || ''}
          onChangeText={(text) => {
            const updatedFields = [...headerFields];
            updatedFields[index].value = text;
            setHeaderFields(updatedFields);
          }}
        />
      );
    } else if (field.Field_Function === "19") {
      return (
        <View style={styles.checkboxContainer}>
          {Object.keys(checkboxValues).map((label, idx) => (
            <View key={idx} style={styles.checkboxItem}>
              <CheckBox
                value={checkboxValues[label]}
                onValueChange={() => handleCheckboxChange(label)}
              />
              <Text>{label}</Text>
            </View>
          ))}
        </View>
      );
    } else if (field.Field_Function === "27") {
      return (
        <TextInput
          style={styles.textInput}
          placeholder="Enter Text"
          value={field.value || ''}
          onChangeText={(text) => {
            const updatedFields = [...headerFields];
            updatedFields[index].value = text;
            setHeaderFields(updatedFields);
          }}
        />
      );
    } else if (field.Field_Function === "31") {
      return (
        <TextInput
          style={styles.textInput}
          placeholder="Enter Text"
          value={field.value || ''}
          onChangeText={(text) => {
            const updatedFields = [...headerFields];
            updatedFields[index].value = text;
            setHeaderFields(updatedFields);
          }}
        />
      );
    } else if (field.Field_Function === "40") {
      return (
        <TextInput
          style={styles.textInput}
          placeholder="Enter Text"
          value={field.value || ''}
          onChangeText={(text) => {
            const updatedFields = [...headerFields];
            updatedFields[index].value = text;
            setHeaderFields(updatedFields);
          }}
        />
      );
    } else if (field.Field_Function === "18") {
      return (
        <TouchableOpacity>
        <Picker
          selectedValue={field.value}
          onValueChange={(itemValue) => handleDropdownChange(itemValue, index)}
          style={styles.picker}
        >
          {dropdownOptions.map((option, optIndex) => (
            <Picker.Item key={optIndex} label={option.label} value={option.value} />
          ))}
        </Picker>
        </TouchableOpacity>
      );
    } else if (field.Field_Function === "56") {
      return (
        <TouchableOpacity>
        <Picker
          selectedValue={field.value}
          onValueChange={(itemValue) => handleDropdownChange(itemValue, index)}
          style={styles.picker}
        >
          {dropdownOptions.map((option, optIndex) => (
            <Picker.Item key={optIndex} label={option.label} value={option.value} />
          ))}
        </Picker>
        </TouchableOpacity>
      );
    } else if (field.Field_Function === "14") {
      return (
        <TouchableOpacity>
        <Picker
          selectedValue={field.value}
          onValueChange={(itemValue) => handleDropdownChange(itemValue, index)}
          style={styles.picker}
        >
          {dropdownOptions.map((option, optIndex) => (
            <Picker.Item key={optIndex} label={option.label} value={option.value} />
          ))}
        </Picker>
        </TouchableOpacity>
      );
    } else if (field.Field_Function === "34") {
      return (
        <TextInput
          style={styles.textArea}
          placeholder="Enter Text"
          value={field.value || ''}
          onChangeText={(text) => {
            const updatedFields = [...headerFields];
            updatedFields[index].value = text;
            setHeaderFields(updatedFields);
          }}
          multiline={true}
          numberOfLines={4}
        />
      );  
    } else if (field.Field_Function === "15") {
      return (
        <TextInput
          style={styles.textInput}
          placeholder="Enter Text"
          value={field.value || ''}
          onChangeText={(text) => {
            const updatedFields = [...headerFields];
            updatedFields[index].value = text;
            setHeaderFields(updatedFields);
          }}
        />
      );
      } else if (field.Field_Function === "16") {
        return (
          <TouchableOpacity>
          <Picker
            selectedValue={field.value}
            onValueChange={(itemValue) => handleDropdownChange(itemValue, index)}
            style={styles.picker}
          >
            {dropdownOptions.map((option, optIndex) => (
              <Picker.Item key={optIndex} label={option.label} value={option.value} />
            ))}
          </Picker>
          </TouchableOpacity>
        );
      } else if (field.Field_Function === "20") {
        return (
          <TouchableOpacity>
          <Picker
            selectedValue={field.value}
            onValueChange={(itemValue) => handleDropdownChange(itemValue, index)}
            style={styles.picker}
          >
            {dropdownOptions.map((option, optIndex) => (
              <Picker.Item key={optIndex} label={option.label} value={option.value} />
            ))}
          </Picker>
          </TouchableOpacity>
        );
      }else if(field.Field_Function == "11") {
        return (
          <TextInput
            style={styles.textInput}
            placeholder="Enter Text"
            value={field.value || ''}
            onChangeText={(text) => {
              const updatedFields = [...headerFields];
              updatedFields[index].value = text;
              setHeaderFields(updatedFields);
            }}
          />
        );
      }else if(field.Field_Function == "45") {
        return (
          <TextInput
            style={styles.textInput}
            placeholder="Enter Text"
            value={field.value || ''}
            onChangeText={(text) => {
              const updatedFields = [...headerFields];
              updatedFields[index].value = text;
              setHeaderFields(updatedFields);
            }}
          />
        );
      }else if(field.Field_Function == "27") {
        return (
          <TextInput
            style={styles.textInput}
            placeholder="Enter Text"
            value={field.value || ''}
            onChangeText={(text) => {
              const updatedFields = [...headerFields];
              updatedFields[index].value = text;
              setHeaderFields(updatedFields);
            }}
          />
        );
      
      }else if(field.Field_Function == "17") {
        return (
          <TouchableOpacity>
          <Picker
            selectedValue={field.value}
            onValueChange={(itemValue) => handleDropdownChange(itemValue, index)}
            style={styles.picker}
          >
            {dropdownOptions.map((option, optIndex) => (
              <Picker.Item key={optIndex} label={option.label} value={option.value} />
            ))}
          </Picker>
          </TouchableOpacity>
        );
      }
  }

  const renderAutoFillFieldByFunction = (field, index) => {
    if (field.Field_Function === "3") {
      return (
       <TouchableOpacity>
          <Picker
            selectedValue={field.value}
            onValueChange={(itemValue) => handleDropdownChange(itemValue, index)}
            style={styles.picker}
          >
            {dropdownOptions.map((option, optIndex) => (
              <Picker.Item key={optIndex} label={option.label} value={option.value} />
            ))}
          </Picker>
          </TouchableOpacity>
      );
    }

  }
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Header />
        <View style={styles.topContainer}>
          <ImageBackground
            source={{ uri: 'assets/images/Rectangleback.svg' }}
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

        <View style={styles.cardContainer}>
          <View style={styles.fieldsCard}>
            {renderFieldsByType(headerFields)}
            <View style={styles.horizontalLine} />
            {detailFields.length > 0 && (
              <View>
                <View style={styles.sectionHeaderContainer}>
                  <Text style={styles.sectionHeader}>Details</Text>
                </View>
                <View style={styles.detailFieldsWrapper}>
                  <FlatList
                    data={detailFields}
                    horizontal
                    renderItem={({ item }) => (
                      <Text style={styles.detailField}>{item.fld_label}</Text>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.detailFieldsContainer}
                  />
                </View>
              </View>
            )}
          </View>
          {footerFields.length > 0 && (
            <View style={styles.footerFieldsCard}>
              <FlatList
                data={footerFields}
                horizontal
                renderItem={({ item }) => (
                  <Text style={styles.footerField}>{item.fld_label}</Text>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.footerFieldsContainer}
              />
            </View>
          )}
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={renderFieldByFunction.Field_Function === '6' ? 'date' : 'time'}
          date={selectedDate}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEFEFE',
  },
  image: {
    position: 'absolute',
    top: 0,
    width: '120%',
    height: 120, // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -20,
  },
  topContainer: {
    width: '100%',
    height: 200, // Adjust the height to match the image
    marginBottom: 20, // Adjust margin as needed
  },
  labelContainer: {
    paddingVertical: 10,
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 20,
  },
  label: {
    fontSize: 12,
    color: 'white',
    marginHorizontal: 0,
    marginBottom: 5,
  },
  cardContainer: {
    alignItems: 'center',
    width: '100%',
  },
  fieldsCard: {
    backgroundColor: 'white',
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#E1E1E1',
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  footerFieldsCard: {
    backgroundColor: '#EB2333',
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#E1E1E1',
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fieldCount: {
    fontSize: 14,
    color: '#999',
  },
  field: {
    fontSize: 14,
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#E1E1E1',
    marginVertical: 10,
  },
  autoFillContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  autoFillText: {
    fontSize: 14,
    color: '#999',
  },
  detailFieldsWrapper: {
    backgroundColor: '#EB2333',
    padding: 10,
    borderRadius: 10,
  },
  detailField: {
    fontSize: 14,
    marginHorizontal: 10,
    padding: 10,
    color: 'white',
    backgroundColor: 'transparent',
  },
  detailFieldsContainer: {
    alignItems: 'center',
  },
  footerField: {
    fontSize: 14,
    marginHorizontal: 10,
    padding: 10,
    color: 'white',
    backgroundColor: 'transparent',
  },
  footerFieldsContainer: {
    alignItems: 'center',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 10,
    height: 100,
    textAlignVertical: 'top',
  },
});

export default AddTransactionInsertRoleFields;
