import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const admin = require('../assets/images/admin.png');
const notification = require('../assets/images/Notification.svg');
const logo = require('../assets/images/big_apple_erp_favicon1.png');

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  logo: {
    width: 40,
    height: 30,
    marginBottom: 10,
    marginRight:20,
  },

  notification: {
    marginRight: 20,
    marginTop: 15,
  },
  headerText: {
    fontSize: 14,
    color: '#303030',
    marginLeft: 5,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#Eb2333',
    // marginLeft: '-45%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  menuDropdown: {
    position: 'absolute',
    top: 50,
    left: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 2000,
    maxHeight: 300,
    width: 250,
  },
  adminDropdown: {
    position: 'absolute',
    top: 50,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 2000,
    maxHeight: 150,
    width: 120,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  submenuContainer: {
    paddingLeft: 20,
  },
  arrowIcon: {
    position: 'absolute',
    right: 15,
  },
  dropdownText: {
    fontSize: 14,
    color: '#303030',
    marginLeft: 10,
  },
  menusIcon: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 30,  
    height: 30,
    borderRadius: 5, 
    borderWidth: 1,
    borderColor: '#DC3F41',
    justifyContent: 'center', 
    alignItems: 'center',     
    marginHorizontal: 3,    
  },
  activeMenuItem: {
    backgroundColor: '#EB2333',
  },
  
});

const Header = () => {
  const [expandedTransactionMenu, setExpandedTransactionMenu] = useState(null);
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState([]);
  const [nicknameVisible, setNicknameVisible] = useState(false);
  const [nickname, setNickname] = useState('');
  const [menus, setMenus] = useState({});
  const windowWidth = useWindowDimensions().width;

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
      if (dbName) {
        const response = await fetch(`https://jd1.bigapple.in/api/${dbName}/menus`);
        if (response.ok) {
          const data = await response.json();
          setMenus(data.menus);
          setMenuVisible(true);
        } else {
          console.log('Failed to fetch menu data');
        }
      } else {
        console.log('dbName not found in AsyncStorage');
      }
    } catch (error) {
      console.log('Error fetching menu data:', error);
    }
  };

  const toggleMenuIcon = () => {
    if (!menuVisible) {
      fetchMenus();
    }
    setMenuVisible(!menuVisible);
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
    setNicknameVisible(false);
  };

  const handleLogout = () => {
    setNicknameVisible(false);
    navigation.navigate('index');
  };

  const toggleExpandMenu = (id) => {
    setExpandedMenus((prevExpandedMenus) =>
      prevExpandedMenus.includes(id)
        ? prevExpandedMenus.filter((menuId) => menuId !== id)
        : [...prevExpandedMenus, id]
    );
  };

  const handleTransactionMenuClick = (transactionMenuPage) => {
    setExpandedTransactionMenu(transactionMenuPage.id === expandedTransactionMenu ? null : transactionMenuPage.id);
  };

  const renderMenuItems = (menuItems) => {
    return (
      <ScrollView style={styles.menuDropdown}>
        {Object.keys(menuItems).map((key, index) => {
          const menuItem = menuItems[key];
          const { menu, submenus, transaction_menu_pages } = menuItem;
          const isExpanded = expandedMenus.includes(menu.id);

          return (
            <View key={menu.id}>
              {index > 0 && <View style={{ height: 1, backgroundColor: '#E1E1E1' }} />}
              {submenus && submenus.length > 0 ? (
                <TouchableOpacity onPress={() => toggleExpandMenu(menu.id)} style={[styles.dropdownItem, isExpanded && styles.activeMenuItem]}>
                  {getStaticMenuIcon(menu.Menu_name)}
                  <Text style={styles.dropdownText}>{menu.Menu_name || menu.mname}</Text>
                  <Icon
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={15}
                    color="#131010"
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              ) : transaction_menu_pages ? (
                <TouchableOpacity
                onPress={() => toggleExpandMenu(menu.id)}
                style={[styles.dropdownItem, isExpanded && styles.activeMenuItem]}
              >
                  {getStaticMenuIcon(menu.Menu_name)}
                  <Text style={styles.dropdownText}>{menu.Menu_name || menu.mname}</Text>
                  <Icon
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={15}
                    color="#131010"
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                onPress={() => handleMenuPress(menu)}
                style={styles.dropdownItem}
              >
                 {getStaticMenuIcon(menu.Menu_name)}
                  <Text style={styles.dropdownText}>{menu.Menu_name || menu.mname}</Text>
                </TouchableOpacity>
              )}
              {isExpanded && submenus && submenus.length > 0 && (
                <View style={styles.submenuContainer}>
                  {renderSubmenus(submenus)}
                </View>
              )}
              {isExpanded && transaction_menu_pages && transaction_menu_pages.length > 0 && (
                <View style={styles.submenuContainer}>
                  {renderTransactionMenuPages(transaction_menu_pages)}
                </View>
              )}
              {/* {renderRoleBasedIcons(menu)} */}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  // const renderRoleBasedIcons = (menu) => {
  //   return (
  //     <View style={styles.iconRow}>
  //       {menu.View_Roles && menu.View_Roles.trim() === 'yes' && (
  //         <Image source={require('../assets/images/eye-light.svg')} style={styles.menusIcon} />
  //       )}
  //       {menu.Edit_Roles && menu.Edit_Roles.trim() === 'yes' && (
  //         <Image source={require('../assets/images/Combined-Shape-edit.svg')} style={styles.menusIcon} />
  //       )}
  //       {menu.Insert_Roles && menu.Insert_Roles.trim() === 'yes' && (
  //         <Image source={require('../assets/images/plus-outline.svg')} style={styles.menusIcon} />
  //       )}
  //     </View>
  //   );
  // };

  const getStaticMenuIcon = (menuName) => {
    switch (menuName) {
      case 'Home':
        return <Image source={require('../assets/images/Fill-1home.svg')} style={styles.menusIcon} />;
      case 'Dashboard':
        return <Image source={require('../assets/images/Categorydash.svg')} style={styles.menusIcon} />;
      case 'Transactions':
        return <Image source={require('../assets/images/Group 1410105249trans.svg')} style={styles.menusIcon} />;
      case 'Payroll':
        return <Image source={require('../assets/images/3-Userpayroll.svg')} style={styles.menusIcon} />;
      case 'Configuration':
        return <Image source={require('../assets/images/Settingconf.svg')} style={styles.menusIcon} />;
      case 'Company':
        return <Image source={require('../assets/images/Vectorcompany.svg')} style={styles.menusIcon} />;
      case 'Reports':
        return <Image source={require('../assets/images/Blackreport.svg')} style={styles.menusIcon} />;
    }
  };


  const renderSubmenus = (submenus) => {
    return submenus.map((submenu) => (
      <View key={submenu.id} style={styles.submenuContainer}>
        {submenu.submenus && submenu.submenus.length > 0 ? (
          <TouchableOpacity onPress={() => toggleExpandMenu(submenu.id)} style={styles.dropdownItem}>
            {getStaticMenuIcon(submenu.Menu_name)}
            <Text style={styles.dropdownText}>{submenu.Menu_name || submenu.mname}</Text>
            <Icon
              name={expandedMenus.includes(submenu.id) ? 'chevron-up' : 'chevron-down'}
              size={15}
              color="#131010"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        ) : submenu.transaction_menu_pages ? (
          <TouchableOpacity onPress={() => toggleExpandMenu(submenu.id)} style={styles.dropdownItem}>
            {getStaticMenuIcon(submenu.Menu_name)}
            <Text style={styles.dropdownText}>{submenu.Menu_name || submenu.mname}</Text>
            <Icon
              name={expandedMenus.includes(submenu.id) ? 'chevron-up' : 'chevron-down'}
              size={15}
              color="#131010"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => handleMenuPress(submenu)} style={styles.dropdownItem}>
            {getStaticMenuIcon(submenu.Menu_name)}
            <Text style={styles.dropdownText}>{submenu.Menu_name || submenu.mname}</Text>
          </TouchableOpacity>
        )}
        {expandedMenus.includes(submenu.id) && submenu.submenus && submenu.submenus.length > 0 && (
          <View style={styles.submenuContainer}>
            {renderSubmenus(submenu.submenus)}
          </View>
        )}
        {expandedMenus.includes(submenu.id) && submenu.transaction_menu_pages && submenu.transaction_menu_pages.length > 0 && (
          <View style={styles.submenuContainer}>
            {renderTransactionMenuPages(submenu.transaction_menu_pages)}
          </View>
        )}
      </View>
    ));
  };

  const renderTransactionMenuPages = (transactionMenuPages) => {
    return transactionMenuPages.map((transactionMenuPage) => (
      <TouchableOpacity
        key={transactionMenuPage.id}
        onPress={() => handleTransactionMenuClick(transactionMenuPage)}
        style={[styles.dropdownItem, { backgroundColor: expandedTransactionMenu === transactionMenuPage.id ? '#E1E1E1' : '#FFFFFF' }]}
      >
        <Text style={styles.dropdownText}>{transactionMenuPage.table_label}</Text>
        {expandedTransactionMenu === transactionMenuPage.id && renderTransactionMenuPageIcons(transactionMenuPage)}
      </TouchableOpacity>
    ));
  };
  
const renderTransactionMenuPageIcons = (transactionMenuPage) => {
  const handleEyeClick = async () => {
    try {
      const dbName = await AsyncStorage.getItem('dbName');
      const { Table_Name, id } = transactionMenuPage;
      setMenuVisible(false);
      if (dbName && Table_Name && id) {
        navigation.navigate('AddTransactionInsertRoleFields', {dbName, Table_Name, id });
      } else {
        console.log('Missing dbName, Table_Name, or id');
      }
    } catch (error) {
      console.log('Error fetching dbName:', error);
    }
  };
  
  const handlePlusClick = async () => {
    try {
      const dbName = await AsyncStorage.getItem('dbName');
      const { Table_Name, id } = transactionMenuPage;
      setMenuVisible(false);

      if (dbName && Table_Name && id) {
        navigation.navigate('AddTransactionInsertRoleFields', {dbName, Table_Name, id });
      } else {
        console.log('Missing dbName, Table_Name, or id');
      }
    } catch (error) {
      console.log('Error fetching dbName:', error);
    }
  };

  return (
    <>
    <View style={styles.iconWrapper}>
      <TouchableOpacity onPress={handlePlusClick}>
        <Image source={require('../assets/images/plus-outline.svg')}  />
      </TouchableOpacity>
    </View>
    <View style={styles.iconWrapper}>
      <TouchableOpacity onPress={handleEyeClick}>
        <Image source={require('../assets/images/Combined-Shape-edit.svg')} />
      </TouchableOpacity>
    </View>
    </>
  );
};
    
  
  
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleMenuIcon}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={logo} style={styles.logo} />
          <Icon name="menu" size={20} color="#303030"/>
        </View>
      </TouchableOpacity>
      <Image source={notification} style={styles.notification} />
      <TouchableOpacity onPress={() => setNicknameVisible(!nicknameVisible)} style={styles.userContainer}>
        <View style={styles.imageContainer}>
          <Image source={admin} style={styles.image} />
        </View>
        <Text style={styles.headerText}>
          {nickname ? nickname.substring(0, 7) : ''}
        </Text>
        <Icon name="chevron-down" size={20} color="#303030" />
      </TouchableOpacity>
      {menuVisible && renderMenuItems(menus)}
      {nicknameVisible && (
        <View style={styles.adminDropdown}>
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
