import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useNavigate } from 'react-router-dom';

const Companies = ({ authenticated }) => {
  const [companies, setCompanies] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Access token not found.');
          return;
        }

        const response = await axios.get('http://127.0.0.1:6363/api/companies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });



        const formattedCompanies = response.data.datas.map(company => ({
          ...company,
          fs_date: formatDate(company.fs_date),
          fe_date: formatDate(company.fe_date)
        }));
        setCompanies(formattedCompanies);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    return formattedDate;
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Access token not found.');
        return;
      }

      const response = await axios.post(
        'http://127.0.0.1:6363/api/get-logout',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        localStorage.removeItem('token');
        navigate('/');
        location.reload();
      } else {
        console.error('Logout failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNavigate = async (company) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Access token not found.');
        return;
      }
  
      sessionStorage.setItem('dbName', company.db_name);
      sessionStorage.setItem('compName', company.comp_name); 
      console.log(company.db_name, company.comp_name);
      const response = await axios.get(
        `http://127.0.0.1:6363/api/${company.db_name}/company-dashboard`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            comp_name: company.comp_name
          },
        }
      );
  
      if (response.status === 200) {
        console.log('Successfully sent dbName to the backend:', response.data);
        navigate(`/${company.db_name}/company-dashboard`);
      } else {
        console.error('Failed to send dbName to the backend:', response.status);
      }
    } catch (error) {
      console.error('Error sending dbName to the backend:', error);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.header} onPress={() => setShowOptions(!showOptions)}>
          <Text style={styles.profileText}>Profile</Text>
          <View style={styles.userInfo}>
            {userId && (
              <Text style={styles.userId}>User ID: {userId}</Text>
            )}
            <Image
              source={require('./assets/admin.png')}
              style={[styles.profileImage, styles.roundedImage]}
            />
          </View>
        </TouchableOpacity>

        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => navigate('/edit-profile')}
            >
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={handleLogout}
            >
              <Text style={styles.optionText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>#</DataTable.Title>
            <DataTable.Title>ID</DataTable.Title>
            <DataTable.Title>Company Name</DataTable.Title>
            <DataTable.Title>Database Name</DataTable.Title>
            <DataTable.Title>Start Date</DataTable.Title>
            <DataTable.Title>End Date</DataTable.Title>
          </DataTable.Header>
          {companies.map((company) => (
            <DataTable.Row key={company.id}>
              <DataTable.Cell>
                <TouchableOpacity onPress={() => handleNavigate(company)}>
                  <Text style={styles.linkText}>Go to <Text style={styles.linkSymbol}></Text></Text>
                </TouchableOpacity>
              </DataTable.Cell>
              <DataTable.Cell>{company.id}</DataTable.Cell>
              <DataTable.Cell>{company.comp_name}</DataTable.Cell>
              <DataTable.Cell>{company.db_name}</DataTable.Cell>
              <DataTable.Cell>{company.fs_date}</DataTable.Cell>
              <DataTable.Cell>{company.fe_date}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
       {/* Footer */}
       <View style={styles.footer}>
        <Text style={styles.footerTextLeft}>2024 © Big Apple.</Text>
        <Text style={styles.footerTextRight}>Design & Develop by Bigapple</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  headerContainer: {
    alignItems: 'flex-end', // Align header to the top right
    paddingHorizontal: 20,
    zIndex: 10, // Ensure the header has a higher z-index
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#FFFFFF',
  },
  profileText: {
    color: '#495057',
    fontSize: 18,
    fontWeight: 'bold',
    verticalAlign: 'middle', // Replace textAlignVertical with verticalAlign
  },
  profileImage: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  roundedImage: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ada8a8',
  },
  userId: {
    marginRight: 10,
    verticalAlign: 'middle', // Replace textAlignVertical with verticalAlign
  },
  optionsContainer: {
    position: 'absolute',
    top: 60, // Adjust to move the dropdown below the header
    right: 0, // Align to the right
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
    padding: 10,
    alignItems: 'flex-start', // Align options to the left
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 10, // Ensure the dropdown has a higher z-index
  },
  optionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  linkText: {
    color: 'blue', // Change color to your preference
    textDecorationLine: 'underline', // Add underlining
  },
  linkSymbol: {
    marginLeft: 5, // Adjust spacing as needed
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10, // Added padding to make it visually distinct
  },
  footerTextLeft: {
    color: '#495057',
  },
  footerTextRight: {
    color: '#495057',
  }
});


export default Companies;


