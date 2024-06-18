// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { DataTable } from 'react-native-paper';
// import admin from '../assets/images/admin.png';
// import { useNavigation } from '@react-navigation/native';

// // Create an axios instance
// const api = axios.create({
//   baseURL: 'https://jd1.bigapple.in/api',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
// });

// const Companies = () => {
//   const [userId, setUserId] = useState('');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [token, setToken] = useState('');
//   const [companies, setCompanies] = useState([]);
//   const [isDataLoaded, setIsDataLoaded] = useState(false);
//   const navigation = useNavigation();

//   useEffect(() => {
//     getUserId();
//     getToken();
//   }, []);

//   useEffect(() => {
//     if (token) {
//       fetchUserData();
//     }
//   }, [token]);

//   const getUserId = async () => {
//     try {
//       const storedUserId = await AsyncStorage.getItem('user_id');
//       if (storedUserId !== null) {
//         setUserId(storedUserId);
//       }
//     } catch (error) {
//       console.log('Error fetching user_id from AsyncStorage:', error);
//     }
//   };

//   const getToken = async () => {
//     try {
//       const storedToken = await AsyncStorage.getItem('token');
//       if (storedToken !== null) {
//         setToken(storedToken);
//         // Set token in axios instance
//         api.defaults.headers.Authorization = `Bearer ${storedToken}`;
//       } else {
//         console.log('No token found in AsyncStorage');
//       }
//     } catch (error) {
//       console.log('Error fetching token from AsyncStorage:', error);
//     }
//   };

//   const fetchUserData = async () => {
//     try {
//       const response = await api.get('/companies');
//       const formattedCompanies = response.data.datas.map((company) => ({
//         ...company,
//         fs_date: formatDate(company.fs_date),
//         fe_date: formatDate(company.fe_date),
//       }));
//       setCompanies(formattedCompanies);
//       setIsDataLoaded(true);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//       if (error.response) {
//         console.log('Error response:', error.response.data);
//       } else if (error.request) {
//         console.log('Error request:', error.request);
//       } else {
//         console.log('Error message:', error.message);
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
//   };

//   const toggleDropdown = () => {
//     setDropdownVisible(!dropdownVisible);
//   };

//   const handleProfile = () => {
//     console.log('Profile clicked');
//     setDropdownVisible(false);
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await api.post('/get-logout');
//       if (response.status === 200) {
//         console.log('Logout successful');
//         Alert.alert('Success', 'You have been logged out.');
//         await AsyncStorage.removeItem('token');
//         await AsyncStorage.removeItem('user_id');
//         await AsyncStorage.removeItem('Nickname');
//         navigation.navigate('index');
//       } else {
//         console.log('Logout failed', response.data);
//         Alert.alert('Error', 'Logout failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error logging out:', error);
//       Alert.alert('Error', 'Logout failed. Please try again.');
//     }
//     setDropdownVisible(false);
//   };

//   const handleNavigate = async (company) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         console.error('Access token not found.');
//         return;
//       }
  
//       await AsyncStorage.setItem('dbName', company.db_name);
//       await AsyncStorage.setItem('compName', company.comp_name); 
//       console.log(company.db_name, company.comp_name);
//       const response = await axios.get(
//         `https://jd1.bigapple.in/api/${company.db_name}/company-dashboard`, 
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             comp_name: company.comp_name
//           },
//         }
//       );
  
//       if (response.status === 200) {
//         console.log('Successfully sent dbName to the backend:', response.data);
//         // navigation.navigate(`${company.db_name}/company-dashboard`);
//       } else {
//         console.error('Failed to send dbName to the backend:', response.status);
//       }
//     } catch (error) {
//       console.error('Error sending dbName to the backend:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity onPress={toggleDropdown} style={styles.userContainer}>
//             <Text style={styles.headerText}>{userId}</Text>
//             <Image source={admin} style={styles.image} />
//           </TouchableOpacity>
//         </View>
//         {dropdownVisible && (
//           <View style={styles.dropdown}>
//             <TouchableOpacity onPress={handleProfile} style={styles.dropdownItem}>
//               <Text style={styles.dropdownText}>Profile</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
//               <Text style={styles.dropdownText}>Logout</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//       <View style={styles.body}>
//         {isDataLoaded ? (
//           <ScrollView horizontal={true}>
//             <DataTable>
//               <DataTable.Header>
//                 <DataTable.Title style={{ width: 40 }}>#</DataTable.Title>
//                 <DataTable.Title style={{ width: 60 }}>ID</DataTable.Title>
//                 <DataTable.Title style={{ width: 150 }}>Company Name</DataTable.Title>
//                 <DataTable.Title style={{ width: 120 }}>Database Name</DataTable.Title>
//                 <DataTable.Title style={{ width: 100 }}>Start Date</DataTable.Title>
//                 <DataTable.Title style={{ width: 100 }}>End Date</DataTable.Title>
//               </DataTable.Header>
//               {companies.map((company, index) => (
//                 <DataTable.Row key={company.id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
//                   <DataTable.Cell style={{ width: 40 }}>
//                     <TouchableOpacity onPress={() => handleNavigate(company)}>
//                       <Text style={styles.linkText}>Go to</Text>
//                     </TouchableOpacity>
//                   </DataTable.Cell>
//                   <DataTable.Cell style={{ width: 60 }}>{company.id}</DataTable.Cell>
//                   <DataTable.Cell style={{ width: 150 }}>{company.comp_name}</DataTable.Cell>
//                   <DataTable.Cell style={{ width: 120 }}>{company.db_name}</DataTable.Cell>
//                   <DataTable.Cell style={{ width: 100 }}>{company.fs_date}</DataTable.Cell>
//                   <DataTable.Cell style={{ width: 100 }}>{company.fe_date}</DataTable.Cell>
//                 </DataTable.Row>
//               ))}
//             </DataTable>
//           </ScrollView>
//         ) : (
//           <Text>Loading ...</Text>
//         )}
//       </View>
//       <View style={styles.footer}>
//         <Text>2024 © Big Apple.</Text>
//         <Text>Design & Develop by Bigapple</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     height: 60,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     paddingHorizontal: 10,
//     position: 'relative',
//     zIndex: 1000,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 'auto',
//   },
//   userContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   image: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginLeft: 10,
//   },
//   headerText: {
//     fontSize: 18,
//   },
//   dropdown: {
//     position: 'absolute',
//     top: 60,
//     right: 10,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     zIndex: 1000,
//   },
//   dropdownItem: {
//     padding: 10,
//   },
//   dropdownText: {
//     fontSize: 16,
//   },
//   body: {
//     flex: 1,
//   },
//   linkText: {
//     color: 'blue',
//     textDecorationLine: 'underline',
//   },
//   footer: {
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
//   },
//   evenRow: {
//     backgroundColor: '#f2f2f2',
//   },
//   oddRow: {
//     backgroundColor: '#ffffff',
//   },
// });

// export default Companies;
