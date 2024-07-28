import axios from 'axios';
import API_BASE_URL from '../apiconfig';

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

  try {
    for (const field of fields) {
      const { Field_Function, Field_Name } = field;
      
      // Skip if Field_Function does not have a URL
      if (!checkOptionsUrls[Field_Function]) continue;

      // Fetch check options
      const response = await axios.get(checkOptionsUrls[Field_Function], {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: { 'data[field_name]': Field_Name, 'table_name': Table_Name }
      });

      const responseData = response.data;

      // Process response data
      for (const [key, value] of Object.entries(responseData)) {
        if (value.noofoptions === 1) {
          // Set selected values if the field_name matches
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
    if (functionUrl) {
      const response = await axios.post(functionUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
