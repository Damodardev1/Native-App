import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Assuming you are using React Navigation

// Assuming these are your imported images and styles
const admin = require('../assets/images/admin.png'); // Replace with actual path
const getNickname = async () => {
  try {
    const storedNickname = await AsyncStorage.getItem('Nickname');
    if (storedNickname !== null) {
      getNickname(storedNickname);
    }
  } catch (error) {
    console.log('Error fetching user_id from AsyncStorage:', error);
  }
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3498db', // Example background color
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 60, // Adjust as needed based on your header height
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 18,
    color: '#333',
  },
});

const Header = () => {
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to manage dropdown visibility
  const [userId, setUserId] = useState('');

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
    setDropdownVisible(false);
  };

  const handleLogout = () => {
    setDropdownVisible(false); // Hide dropdown after logout
  };

  // Assuming userId is obtained from somewhere in your application state

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={toggleDropdown} style={styles.userContainer}>
          <Text style={styles.headerText}>{Nickname}</Text>
          <Image source={admin} style={styles.image} />
        </TouchableOpacity>
      </View>
      {dropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={handleProfile} style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Header;
