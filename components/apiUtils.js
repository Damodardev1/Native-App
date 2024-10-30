import axios from 'axios';
import API_BASE_URL from '../apiconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const fetchCheckOptions = async (fields, dbName, Table_Name, setSelectedValues) => {
  // Define URLs based on Field_Function values
  const checkOptionsUrls = {
    "2": `${API_BASE_URL}/${dbName}/get-function2-fieldvalues-checkoptions/${Table_Name}`,
    "4": `${API_BASE_URL}/${dbName}/get-function4-tablerows-checkoptions/${Table_Name}`,
    "5": `${API_BASE_URL}/${dbName}/get-function5-codes-checkoptions/${Table_Name}`,
    "18": `${API_BASE_URL}/${dbName}/get-function18-users-checkoptions/${Table_Name}`,
    "20": `${API_BASE_URL}/${dbName}/get-function20-user-checkoptions/${Table_Name}`,
    "56": `${API_BASE_URL}/${dbName}/get-function56-tablerows-checkoptions/${Table_Name}`
  };

  // Group fields by Field_Function
  const fieldsByFunction = fields.reduce((acc, field) => {
    if (!acc[field.Field_Function]) {
      acc[field.Field_Function] = [];
    }
    acc[field.Field_Function].push(field);
    return acc;
  }, {});

  try {
    for (const [functionId, functionFields] of Object.entries(fieldsByFunction)) {
      // Skip if Field_Function does not have a URL
      if (!checkOptionsUrls[functionId]) continue;

      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(checkOptionsUrls[functionId], {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded',   Authorization: `Bearer ${token}` },
        params: { 'table_name': Table_Name }
      });

      const responseData = response.data;

      // Process response data
      functionFields.forEach(field => {
        const { Field_Name } = field;
        const value = responseData[Field_Name];

        if (value && value.noofoptions === 1) {
          // Set selected value if field_name matches and noofoptions is 1
          const fieldValue = value.single_text || 'Default Value';

          // Update the selected values state
          setSelectedValues(prevValues => ({
            ...prevValues,
            [Field_Name]: fieldValue
          }));
          console.log(`Set ${Field_Name} to ${fieldValue}`);
        }
      });
    }
  } catch (error) {
    console.error('Failed to fetch check options for fields:', error);
    throw error;
  }
};


export const fetchDropdownOptions = async (fieldName, fieldFunction, searchTerm, dbName, Table_Name) => {
  const urls = {
    "2": `${API_BASE_URL}/${dbName}/get-function2-fieldvalues`,
    "4": `${API_BASE_URL}/${dbName}/get-function4-tablerows`,
    "5": `${API_BASE_URL}/${dbName}/get-function5-codes`,
    "18": `${API_BASE_URL}/${dbName}/get-function18-users`,
    "19": `${API_BASE_URL}/${dbName}/get-function19-fieldvalues`,
    "20": `${API_BASE_URL}/${dbName}/get-function20-user`,
    "56": `${API_BASE_URL}/${dbName}/get-function56-tablerows`
  };

  try {
    const params = new URLSearchParams();
    params.append('data[table_name]', Table_Name);
    params.append('data[field_name]', fieldName);
    params.append('searchTerm', searchTerm);

    const functionUrl = urls[fieldFunction];
    const token = await AsyncStorage.getItem('token');
    if (functionUrl) {
      const response = await axios.post(functionUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded',   Authorization: `Bearer ${token}` },
      });

      return response.data.map(item => ({
        id: item.id,
        name: item.text
      }));
    }
  } catch (error) {
    console.error(`Failed to fetch options for ${fieldName}`, error);
    throw error;
  }
};
