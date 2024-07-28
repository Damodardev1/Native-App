import React from 'react';
import { View, Text, TextInput, Picker, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const FooterFields = ({ fields, dropdownOptions = {}, headerFields, setHeaderFields }) => {
  const handleDropdownChange = (itemValue, index) => {
    const updatedFields = [...headerFields];
    updatedFields[index].value = itemValue;
    setHeaderFields(updatedFields);
  };

  const safeFields = Array.isArray(fields) ? fields : [];

  return (
    <ScrollView style={styles.container} horizontal>
      <View style={styles.card}>
        {fields.map((field, index) => {
          const { Field_Function, Field_Name, fld_label, value } = field;
          const fieldname = Field_Name;
          const options = dropdownOptions[fieldname] || [];

          const commonProps = {
            key: Field_Name, // Ensure unique key
            'data-isdet': '0',
            name: `data[${Field_Name}]`,
            'data-fieldname': Field_Name,
            value: value || '',
            onChangeText: (text) => {
              const updatedFields = [...headerFields];
              updatedFields[index].value = text;
              setHeaderFields(updatedFields);
            }
          };

          return (
            <View key={Field_Name} style={styles.row}>
              <Text style={styles.label}>{fld_label}</Text>
              {(() => {
                switch (Field_Function) {
                  case '1':
                  case '12':
                  case '11':
                  case '6':
                  case '15':
                  case '8':
                  case '27':
                  case '31':
                  case '34':
                  case '21':
                  case '40':
                  case '22':
                  case '45':
                    return (
                      <TextInput
                        {...commonProps}
                        style={styles.textInput}
                        placeholder={Field_Function === '6' || Field_Function === '15' ? 'Select Date Calendar' : 'Enter Text'}
                        multiline={Field_Function === '34'}
                        numberOfLines={Field_Function === '34' ? 4 : 1}
                      />
                    );

                  case '2':
                  case '4':
                  case '18':
                  case '19':
                  case '56':
                    return (
                      <View style={styles.dropdownContainer}>
                        <Dropdown
                          style={styles.dropdown}
                          data={options.map(option => ({ value: option.value, label: option.label }))}
                          labelField="label"
                          valueField="value"
                          placeholder={`Select ${fld_label}`}
                          search
                          searchPlaceholder="Search"
                          value={value}
                          onChange={item => {
                            const updatedFields = [...headerFields];
                            updatedFields[index].value = item.value;
                            setHeaderFields(updatedFields);
                          }}
                        />
                      </View>
                    );

                  case '5':
                  case '20':
                  case '16':
                  case '24':
                  case '3':
                  case '14':
                    return (
                      <TouchableOpacity>
                        <Picker
                          selectedValue={value}
                          style={styles.picker}
                          onValueChange={(itemValue) => handleDropdownChange(itemValue, index)}
                        >
                          {options.length > 0 ? (
                            options.map((option, optIndex) => (
                              <Picker.Item key={optIndex} label={option.label} value={option.value} />
                            ))
                          ) : (
                            <Picker.Item label="Loading..." value="" />
                          )}
                        </Picker>
                      </TouchableOpacity>
                    );

                  case '61':
                    return (
                      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Button title="Upload Image" />
                        {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 20 }} />} */}
                      </View>
                    );

                  default:
                    return null;
                }
              })()}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: 10,
    width: 150, // Adjust this value based on your design requirements
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dropdownContainer: {
    width: '100%',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
});

export default FooterFields;
  