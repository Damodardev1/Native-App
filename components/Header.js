import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Animated, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import API_BASE_URL from '../apiconfig';

// import * as Location from 'expo-location';

const CustomHamburger = ({ isOpen, toggleMenu }) => {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [isOpen]);

  const firstLineRotation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const thirdLineRotation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-45deg'],
  });

  const middleLineTranslateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const middleLineTranslateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 330],
  });

  const middleLineRotation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const firstLineTranslateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const thirdLineTranslateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <TouchableOpacity onPress={toggleMenu} style={styles.container}>
      {/* First Line */}
      <Animated.View
        style={[
          styles.line,
          {
            transform: [
              { translateY: firstLineTranslateY },
              { rotate: firstLineRotation },
            ],
          },
        ]}
      />
      {/* Middle Line */}
      <Animated.View
        style={[
          styles.line,
          {
            transform: [
              { translateX: middleLineTranslateX },
              { translateY: middleLineTranslateY },
              { rotate: middleLineRotation },
            ],
          },
        ]}
      />
      {/* Third Line */}
      <Animated.View
        style={[
          styles.line,
          {
            transform: [
              { translateY: thirdLineTranslateY },
              { rotate: thirdLineRotation },
            ],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const logo = require('../assets/images/big_apple_erp_favicon1.png');
const BigappleLogo = require('../assets/images/Bigapple_logo.png');
const API_KEY_GEOCODE = '9f04e9f8bd414c7686486783fdada126';
const API_KEY_WEATHER = 'bc02178a8bce17367dfe437127f99257';
const profileImage = require('../assets/images/profile-img.png');
const Header = () => {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('');
  const [menus, setMenus] = useState({});
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null); 
  const [expandedSubsubmenu, setExpandedSubsubmenu] = useState(null); 
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [sidebarWidth] = useState(new Animated.Value(40));
  const [showBigappleLogo, setShowBigappleLogo] = useState(false);
  const [companyNews, setCompanyNews] = useState([]); 
  const [weatherData, setWeatherData] = useState(null); 
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  // useEffect(() => {
  //   Animated.timing(sidebarAnim, {
  //     toValue: sidebarExpanded ? 0 : -250, // 0 brings sidebar into view, -250 hides it
  //     duration: 300,
  //     useNativeDriver: false,
  //   }).start();
  // }, [sidebarExpanded]);


  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const storedNickname = await AsyncStorage.getItem('Nickname');
        if (storedNickname !== null) {
          setNickname(storedNickname);
        }
      } catch (error) {
        console.log('Error fetching Nickname from AsyncStorage:', error);
      }
    };

    fetchNickname();
  }, []);

  const fetchMenus = async () => {
    try {
      const dbName = await AsyncStorage.getItem('dbName');
      const token = await AsyncStorage.getItem('token');
      
      if (dbName && token) {
        const response = await axios.get(`${API_BASE_URL}/${dbName}/menus`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // Send token in the Authorization header
          }
        });
  
        if (response.status === 200) {
          const data = response.data;
          const staticMenus = {
            home: {
              menu: { id: 'home', Menu_name: 'Home' },
              submenus: []
            },
            dashboard: {
              menu: { id: 'dashboard', Menu_name: 'Dashboard' },
              submenus: []
            }
          };
          setMenus({ ...staticMenus, ...data.menus });
        } else {
          console.log('Failed to fetch menu data 256:', response.status);
        }
      } else {
        if (!dbName) console.log('dbName not found in AsyncStorage');
        if (!token) console.log('Token not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  };
  
  useEffect(() => {
    fetchMenus();
  }, []);
    useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission to access location was denied');
        return;
      }

      // Get the current position
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      getCityName(latitude, longitude);
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Failed to fetch your location.');
    }
  };

  const getCityName = async (lat, lon) => {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${API_KEY_GEOCODE}`;
      const response = await axios.get(url);
      if (response.data.results && response.data.results.length > 0) {
        const components = response.data.results[0].components;
        const city = components.city || components.town || components.village || 'City not found';
        const country = components.country || 'Country not found';
        setCity(city);
        setCountry(country);
        getWeather(city);
      } else {
        Alert.alert('Error', 'City not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch city name');
    }
  };

  const getWeather = async (cityName) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY_WEATHER}&units=metric`;
      const response = await axios.get(url);
      if (response.data) {
        setWeatherData(response.data);
      } else {
        Alert.alert('Error', 'Weather data not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch weather data');
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderWeatherInfo = () => {
    if (!weatherData) {
      return ;
    }
  
    const weatherDescription = capitalizeFirstLetter(weatherData.weather[0].description);
    const icon = weatherData.weather[0].icon;
    const temperature = weatherData.main.temp.toFixed(0);
    // const humidity = weatherData.main.humidity;
    // const windSpeed = weatherData.wind.speed.toFixed(2);
  
    const weatherIconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  
    return (
      <View style={styles.weatherContainer}>
        <View style={styles.weatherInfo}>
          <Image 
            source={{ uri: weatherIconUrl }} 
            style={styles.weatherIcon} 
            onError={(e) => console.log('Error loading weather icon:', e.nativeEvent.error)} 
          />
          <Text style={styles.tempText}>{temperature}°C</Text>
        </View>
      </View>
    );
  };
  

  const toggleSidebar = () => {
    const newWidth = sidebarExpanded ? 40 : 250;
    Animated.timing(sidebarWidth, {
      toValue: newWidth,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(backgroundOpacity, {
      toValue: sidebarExpanded ? 0 : 0.5, // Opacity goes to 0.5 when expanded, 0 when collapsed
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSidebarExpanded(!sidebarExpanded);
    setShowBigappleLogo(!sidebarExpanded);
    setProfileMenuVisible(!sidebarExpanded);
    setIsOpen(!sidebarExpanded);
    setExpandedMenu(null);
    setExpandedSubmenu(null); 
    setExpandedSubsubmenu(null);    
    if (!sidebarExpanded) {
      fetchCompanyNews();
    }
  };
  
  const toggleExpandSubsubmenu = (subsubmenuId) => {
    setExpandedSubsubmenu(expandedSubsubmenu === subsubmenuId ? null : subsubmenuId);
  };
  const toggleExpandMenu = (id) => {
    if (expandedMenu === id) {
      setExpandedMenu(null);
      if (showBigappleLogo) {
        Animated.timing(sidebarWidth, {
          toValue: 40,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setShowBigappleLogo(false);
        setSidebarExpanded(false);
        setProfileMenuVisible(false);
        setIsOpen(false);
        Animated.timing(backgroundOpacity, {
          toValue: 0, // Background opacity back to 0 when collapsing
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    } else {
      setExpandedMenu(id);
      if (!showBigappleLogo) {
        Animated.timing(sidebarWidth, {
          toValue: 250,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setShowBigappleLogo(true);
        setSidebarExpanded(true);
        setProfileMenuVisible(true);
        setIsOpen(true);

      }
      fetchCompanyNews();
    }
  };  

  const handleProfile = () => {
    navigation.navigate('Profile');
    setProfileMenuVisible(false);
  };

  const handleLogout = async () => {
    try {
      const dbName = await AsyncStorage.getItem('dbName');
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Access token not found.');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/${dbName}/dologout`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        await AsyncStorage.removeItem('token');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        console.error('Logout failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getStaticMenuIcon = (menuName) => {
    switch (menuName) {
      case 'Home':
        return <Icon name="home-outline" size={20} color="#131010" style={styles.menusIcon} />;
      case 'Dashboard':
        return <Icon name="view-dashboard-outline" size={20} color="#131010" style={styles.menusIcon} />;
      case 'Transactions':
        return <Icon name="swap-horizontal" size={20} color="#131010" style={styles.menusIcon} />;
      case 'Payroll':
        return <Icon name="account-cash-outline" size={20} color="#131010" style={styles.menusIcon} />;
      case 'Configuration':
        return <Icon name="cog-outline" size={20} color="#131010" style={styles.menusIcon} />;
      case 'Company':
        return <Icon name="domain" size={20} color="#131010" style={styles.menusIcon} />;
      case 'Reports':
        return <Icon name="file-chart-outline" size={20} color="#131010" style={styles.menusIcon} />;
      default:
        return null;
    }
  };

  const handleMenuPress = async (menu) => {
    if (menu.id === 'home') {
      navigation.navigate('Companies');
    } else if (menu.id === 'dashboard') {
      const dbName = await AsyncStorage.getItem('dbName');
      const compName = await AsyncStorage.getItem('compName');

      if (dbName && compName) {
        await handleNavigate({ db_name: dbName, comp_name: compName });
      } else {
        console.log('dbName or compName not found in AsyncStorage');
      }
    }
  };

  const handleNavigate = async (company) => {
    try {
      await AsyncStorage.setItem('dbName', company.db_name);
      await AsyncStorage.setItem('compName', company.comp_name);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/${company.db_name}/company-dashboard`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        navigation.navigate('CompanyDashboard', {
          dbName: company.db_name,
          compName: company.comp_name,
          companyData: response.data,
        });

        fetchCompanyNews();
      } else {
        console.error('Failed to retrieve dashboard data:', response.status);
        Alert.alert('Error', 'Failed to retrieve company dashboard data.');
      }
    } catch (error) {
      console.error('Error navigating to company dashboard:', error);
      Alert.alert('Error', 'Failed to navigate to company dashboard. Please try again.');
    }
  };

  const fetchCompanyNews = async () => {
    try {
      const dbName = await AsyncStorage.getItem('dbName');
      const token = await AsyncStorage.getItem('token');
      if (dbName) {
        const response = await axios.get(
          `${API_BASE_URL}/${dbName}/company-dashboard`, 
          {
            headers: {
              'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`
            },
          }
        );

        if (response.status === 200) {
          setCompanyNews(response.data.companynews); 
        } else {
          console.error('Failed to retrieve company news:', response.status);
          Alert.alert('Error', 'Failed to retrieve company news.');
        }
      } else {
        console.log('dbName not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching company news:', error);
      Alert.alert('Error', 'Failed to fetch company news. Please try again.');
    }
  };

  const renderMenuItems = (menuItems) => {
    const topMenus = Object.keys(menuItems)
      .filter(key => menuItems[key].menu.id === 'home' || menuItems[key].menu.id === 'dashboard')
      .reduce((obj, key) => {
        obj[key] = menuItems[key];
        return obj;
      }, {});
  
    const otherMenus = Object.keys(menuItems)
      .filter(key => menuItems[key].menu.id !== 'home' && menuItems[key].menu.id !== 'dashboard')
      .reduce((obj, key) => {
        obj[key] = menuItems[key];
        return obj;
      }, {});
  
    return (
      <ScrollView style={styles.menuDropdown}>
        {Object.keys(topMenus).map((key) => {
          const menuItem = topMenus[key];
          const { menu, submenus } = menuItem;
          const isExpanded = expandedMenu === menu.id;
  
          return (
            <View key={menu.id} style={styles.menuItemContainer}>
              <TouchableOpacity
                onPress={() => handleMenuPress(menu)}
                style={styles.iconContainer}
              >
                {getStaticMenuIcon(menu.Menu_name)}
                <Text style={styles.menuText}>{menu.Menu_name}</Text>
              </TouchableOpacity>
  
              {isExpanded && (
                <View style={styles.submenuContainer}>
                  {renderSubmenus(submenus)}
                </View>
              )}
            </View>
          );
        })}
  
        {Object.keys(otherMenus).map((key) => {
          const menuItem = otherMenus[key];
          const { menu, submenus } = menuItem;
          const isExpanded = expandedMenu === menu.id;
  
          return (
            <View key={menu.id} style={styles.menuItemContainer}>
              <TouchableOpacity
                onPress={() => toggleExpandMenu(menu.id)}
                style={styles.iconContainer}
              >
                {getStaticMenuIcon(menu.Menu_name)}
                <Text style={styles.menuText}>{menu.Menu_name}</Text>
              </TouchableOpacity>
  
              {isExpanded && (
                <View style={styles.submenuContainer}>
                  {renderSubmenus(submenus)}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    );
  };
  
  const renderSubmenus = (submenus) => {
    return (
      <ScrollView style={styles.submenuContainer}>
        <View>
          {submenus.map((submenu) => {
            const isSubExpanded = expandedSubmenu === submenu.id;
            return (
              <View key={submenu.id} style={styles.submenuItemContainer}>
                <TouchableOpacity 
                  onPress={() => toggleSubmenu(submenu.id)} 
                  style={styles.submenuItem}
                >
                  <Text style={styles.submenuText}>
                    {submenu.Menu_name || submenu.mname}
                  </Text>
                </TouchableOpacity>
                
                {isSubExpanded && submenu.submenus && (
                  <View style={styles.subSubmenuContainer}>
                    {renderSubsubmenus(submenu.submenus)}
                  </View>
                )}
  
                {/* Handle transaction_menu_pages */}
                {isSubExpanded && submenu.transaction_menu_pages && (
                  <View style={styles.subSubmenuContainer}>
                    {renderTransactionSubsubmenus(submenu.transaction_menu_pages)}
                  </View>
                )}
              </View>
            );
          })}
        </View> 
      </ScrollView>
    );
  };
  const renderTransactionSubsubmenus = (transactionMenuPages) => {
    return (
      <ScrollView style={styles.subSubmenuScrollContainer}>
        {transactionMenuPages.map((page) => (
          <View key={page.id} style={styles.subsubmenuItemContainer}>
            <TouchableOpacity 
              onPress={() => handleTransactionPage(page)} 
              style={styles.subsubmenuItem}
            >
              <Text style={styles.subsubmenuText}>
                {page.Table_Name} 
              </Text>
              <View style={styles.iconContainer}>
                {page.Edit_Roles.trim() === "yes" && (
                  <TouchableOpacity onPress={() => handleEditClick(page)} style={styles.iconButton}>
                    <Image 
                      source={require('../assets/images/Combined-Shape-edit.png')} 
                      style={styles.iconImage}
                    />
                  </TouchableOpacity>
                )}
                {page.Insert_Roles.trim() === "yes" && (
                  <TouchableOpacity onPress={() => handleInsertClick(page)} style={styles.iconButton}>
                    <Image 
                      source={require('../assets/images/plus-outline.png')} 
                      style={styles.iconImage}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };
  
  
  const handleTransactionPage = (page) => {
    console.log('Navigating to:', page.Table_Name);
    // You can add additional navigation logic here if needed
  };
  
  const handleEditClick = async (page) => {
    try {
      const dbName = await AsyncStorage.getItem('dbName');
      const { Table_Name, id } = page;
      if (dbName && Table_Name && id) {
        navigation.navigate('AddTransactionInsertRoleFields', { dbName, Table_Name, id });
      } else {
        console.log('Missing dbName, Table_Name, or id');
      }
    } catch (error) {
      console.log('Error fetching dbName:', error);
    }
  };
  
  const handleInsertClick = async (page) => {
    try {
      const dbName = await AsyncStorage.getItem('dbName');
      const { Table_Name, id } = page;
      if (dbName && Table_Name && id) {
        navigation.navigate('AddTransactionInsertRoleFields', { dbName, Table_Name, id });
      } else {
        console.log('Missing dbName, Table_Name, or id');
      }
    } catch (error) {
      console.log('Error fetching dbName:', error);
    }
  };
  
  const toggleSubmenu = (submenuId) => {
    setExpandedSubmenu(prev => (prev === submenuId ? null : submenuId));
  };
  
  const renderSubsubmenus = (subsubmenus) => {
    return (
      <ScrollView style={styles.subSubmenuScrollContainer}>
        {subsubmenus.map((subsubmenu) => {
          const isSubSubExpanded = expandedSubsubmenu === subsubmenu.id;
          return (
            <View key={subsubmenu.id} style={styles.subsubmenuItemContainer}>
              <TouchableOpacity 
                onPress={() => toggleExpandSubsubmenu(subsubmenu.id)} 
                style={styles.subsubmenuItem}
              >
                <Text style={styles.subsubmenuText}>
                  {subsubmenu.Menu_name || transaction_menu_pages.Table_Name}
                </Text>
              </TouchableOpacity>
    
            </View>
          );
        })}
      </ScrollView>
    );
  };
  
  

  return (
    <Animated.View style={[styles.container, { width: sidebarWidth, height: '100%' }]}>
      
      <TouchableOpacity 
        style={styles.logoContainer} 
        onPress={toggleSidebar}
      >
        <CustomHamburger isOpen={isOpen} toggleMenu={toggleSidebar} />
        {showBigappleLogo && (
          <Image 
            source={BigappleLogo} 
            style={styles.bigappleLogo} 
            resizeMode="contain" 
          />
        )}
      </TouchableOpacity>
  
      {renderMenuItems(menus)}
  
      {showBigappleLogo && (
        <View style={styles.companyNewsContainer}>
          {renderWeatherInfo()}
          <View style={styles.profileImageWrapper}>
            <ImageBackground
              source={profileImage}
              style={styles.profileImage}
              imageStyle={styles.profileImageBackground}
            />
          </View>
          <Text style={styles.companyNewsTitle}>News</Text>
          {companyNews.length > 0 ? (
            <View style={styles.newsItem}>
              <View style={styles.newsHeader}>
                <Text style={styles.newsTitle}>{companyNews[0].News}</Text>
                <Icon name="chevron-right" size={16} color="#888" style={styles.newsArrowIcon} />
                <View style={styles.newsDateContainer}>
                  <Text style={styles.newsDate}>{companyNews[0].date}</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.noNewsText}>No company news available.</Text>
          )}
        </View>
      )}
  
      {/* Nickname and Logout Section */}
      <TouchableOpacity
        style={styles.nicknameContainer}
        onPress={() => {
          setProfileMenuVisible(!profileMenuVisible);
          if (!profileMenuVisible) {
            Animated.timing(sidebarWidth, {
              toValue: 250,
              duration: 300,
              useNativeDriver: false,
            }).start();

            setShowBigappleLogo(true);
            setSidebarExpanded(true);
            setIsOpen(true);
          } else {
            Animated.timing(sidebarWidth, {
              toValue: 40,
              duration: 300,
              useNativeDriver: false,
            }).start();
            setShowBigappleLogo(false);
            setSidebarExpanded(false);
            setIsOpen(false);
          }
        }}
      >
        <View style={styles.nicknameCircle}>
          <Text style={styles.nicknameLetter}>{nickname.charAt(0)}</Text>
        </View>
  
        {profileMenuVisible && (
        <Animated.View style={[styles.profileMenu, styles.row]}>
        <Text style={styles.fullNickname}>{nickname}</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#333" />
        </TouchableOpacity>
      </Animated.View>
      
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5A6AD',
    borderColor: '#ddd',
    flex: 1,
    paddingLeft:5,
  },
  // container: {
  //   width: 50,
  //   height: 50,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: 10,
  // },
  line: {
    width: 25,
    height: 4,
    backgroundColor: '#000',
    marginVertical: 3,
    borderRadius: 2,
    marginLeft:-8,
  },
  logoContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10, // Set this to a positive value for spacing
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the start
  },
  bigappleLogo: {
    width: 120,
    height: 40,
    marginLeft: 10, // Add margin for space between hamburger and logo
  },

  logo: {
    width: 30,
    height: 30,
    marginLeft:-5,
  },

  menusIcon: {
    flexDirection: 'row', // Align icons in a row
    alignItems: 'center', // Center icons vertically
    justifyContent: 'center', // Center icons horizontally
    marginHorizontal: 0, 
  },
  profileContainer:{
    alignItems: 'right', 
    justifyContent: 'right',  
    backgroundColor: 'transparent', 
  },
  // middleLine: {
  //   height: 2,
  //   width: 24,
  //   backgroundColor: '#000',
  //   position: 'absolute',
  //   marginLeft:13,
  // },
  menu: {
    position: 'absolute',
    top: 50,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
  },
  weatherInfo: {
    flexDirection: 'row',
  },
  weatherIcon: {
    width: 50,
    height: 50, 
    marginLeft:142,
    // marginTop:-37,
    top:-32,
  },
  tempText: {
    fontSize: 16,           
    fontWeight: '600',       
    color: '#333',          
    marginVertical: -39,  
    marginHorizontal:-30, 
    textAlign: 'center',     
  },
  
  cityText: {
    fontSize: 18,  
    fontWeight: 'bold',
    marginBottom: 5,
  },

  weatherDesc: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  menuDropdown: {
    flex: 1,
    height: '100%',
    marginVertical: 0,  // Reduced margin between dropdowns
  },
  
  menuItemContainer: {
    flexDirection: 'column',
    marginVertical: 10,  // Minimized vertical margin to reduce space between items
    marginLeft: 10,  // Adjust to fit alignment with the icons
    paddingLeft: 0,  // Remove any padding that adds extra space between icons
  },
  // iconContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',  // Ensures the icon and text are vertically aligned
  // },
  
  menuText: {
    fontSize: 16,
    marginLeft: 5,
  },
  submenuContainer: {
    paddingLeft: 10,
    paddingTop: 2,
    height: 150,
  },
  submenuItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submenuItemContainer: {
    marginVertical: 10,
  },

  submenuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subSubmenuContainer: {
    paddingLeft: 20,
  },
  subSubmenuScrollContainer: {
    paddingVertical: 1,
  },
  subsubmenuItemContainer: {
    marginVertical: 5,
    marginBottom: 1,

  },
  subsubmenuItem: {
    padding: 10,
    backgroundColor: '#F0F0F0',
     borderRadius: 8,
     
  },
  subsubmenuText: {
    fontSize: 14,
    color: '#555',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  iconButton: {
    padding: 5, // Padding for the icon buttons
    borderRadius: 5,
    backgroundColor: '#e7e7e7', // Background color for icons
    marginLeft: 5, // Space between icons
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 20,
    height: 20, // Set desired size for icons
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
  },
  nicknameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    padding: 5,
    borderRadius: 15,
    marginBottom:10,
  },
  nicknameCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9C4C8',
    borderRadius: 20, 
    width: 30, 
    height: 30,

  },
  nicknameLetter: {
    color: '#333',
    fontSize: 18, 
    fontWeight: 'bold',
  },
  profileMenu: {
    padding: 10,
    backgroundColor: '#F9C4C8',
    borderRadius: 8,
    alignItems: 'center', 
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    left:20,
  },
  fullNickname: {
    fontSize: 18,
    color: '#333',
    marginRight: 10, 
  },
  logoutButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileMenuButton: {
    marginBottom: 5,
  },
  profileMenuItem: {
    fontSize: 14,
    color: '#333',
  },
  // logoutButton: {
  //   paddingVertical: 5,
  //   paddingHorizontal: 10,
  //   backgroundColor: '#f44336',
  //   borderRadius: 5,
  //       marginBottom: -5,
  // },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  // companyNewsContainer: {
  //   // flex: 1,                  
  //   paddingVertical: 30,
  //   paddingHorizontal: 15,
  //   backgroundColor: '#F8BCC1',
  //   borderRadius: 15,
  //   borderWidth: 1,
  //   borderColor: '#ddd',
  //   position: 'relative',      
  //   marginHorizontal: 10, 
  //   bottom:10,
  // },
  companyNewsContainer: {
    paddingVertical: 20,          // Reduced padding for better layout balance
    paddingHorizontal: 20,        // Improved padding for readability
    backgroundColor: '#FAC9CC',   // Soft Pinkish Hue
    borderRadius: 20,             // Rounded edges for a modern look
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',      
    marginHorizontal: 15,         // More horizontal margin for spacing from edges
    marginBottom: 10,             // Correct bottom margin for positioning
  },
  
  
  profileImageWrapper: {
    position: 'absolute',
    top: -50,
    left: 60,
    zIndex: 1,
    alignItems:'center',
  },
  profileImage: {
    width: 100,   
    height: 80,       
    backgroundColor: 'transprent', 
  },

  companyNewsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  newsItem: {
    backgroundColor: '#F8BCC1',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    // marginTop:-50,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsTitle: {
    fontSize: 12,
    fontWeight: '600',
    // color: '#333',
  },
  // newsDateContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  newsDate: {
    fontSize: 12,
    // color: '#999',
    fontWeight: '600',
    // marginRight: 5,
  },
  newsArrowIcon: {
    // marginLeft: 5,
  },
  noNewsText: {
    fontSize: 14,
    paddingVertical: 10,
  },
  iconWrapper: {
    width: 25,
    height: 25,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DC3F41',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    backgroundColor: '#fff',
  },
});

export default Header;
