import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [expandedSubmenus, setExpandedSubmenus] = useState({});
  const [menus, setMenus] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Access token not found.');
          return;
        }

        const compName = sessionStorage.getItem('dbName');
        if (!compName) {
          console.error('Company name not found in session storage.');
          return;
        }

        const menuResponse = await axios.get(
          `http://127.0.0.1:6363/api/${compName}/menus`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              compName: compName,
            },
          }
        );
        setMenus(menuResponse.data.menus);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Access token not found.');
        return;
      }

      const response = await axios.post(
        'http://127.0.0.1:6363/api/dologout',
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

  const toggleExpandedMenu = (menuId) => {
    setExpandedMenus((prevExpandedMenus) => ({
      ...prevExpandedMenus,
      [menuId]: !prevExpandedMenus[menuId],
    }));
  };

  const toggleExpandedSubmenu = (submenuId) => {
    setExpandedSubmenus((prevExpandedSubmenus) => ({
      ...prevExpandedSubmenus,
      [submenuId]: !prevExpandedSubmenus[submenuId],
    }));
  };

  const navigateTo = (url) => {
    navigate(url);
  };

  const renderTransactionPages = ({ item }) => (
    <TouchableOpacity onPress={() => item.url && navigateTo(item.url)}>
      <View key={item.id} style={styles.transactionPage}>
        <Text>{item.table_label}</Text>
        <View style={styles.iconRow}>
          {item.View_Roles.trim() === 'yes' && (
            <Image
              source={require('./assets/eye-light.svg')}
              style={styles.menusIcon}
            />
          )}
          {item.Edit_Roles.trim() === 'yes' && (
            <Image
              source={require('./assets/Combined-Shape-edit.svg')}
              style={styles.menusIcon}
            />
          )}
          {item.Insert_Roles.trim() === 'yes' && (
            <Image
              source={require('./assets/plus-outline.svg')}
              style={styles.menusIcon}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSubMenu = ({ item }) => {
    const { submenus, transaction_menu_pages } = item;
    const isExpanded = expandedSubmenus[item.id];
  
    const renderSubSubMenu = ({ item: subSubMenu }) => (
      <TouchableOpacity onPress={() => handleSubMenuClick(subSubMenu)}>
        <Text style={styles.subSubMenuText}>{subSubMenu.mname || subSubMenu.Menu_name}</Text>
      </TouchableOpacity>
    );
  
    return (
      <View key={item.id} style={styles.subMenuContainer}>
        <TouchableOpacity onPress={() => handleSubMenuClick(item)}>
          <Text style={styles.subMenuText}>{item.mname || item.Menu_name}</Text>
        </TouchableOpacity>
        {isExpanded && transaction_menu_pages && (
          <FlatList
            data={transaction_menu_pages}
            keyExtractor={(page) => page.id.toString()}
            renderItem={renderTransactionPages}
          />
        )}
        {isExpanded && submenus && submenus.length > 0 && (
          <FlatList
            data={submenus}
            keyExtractor={(submenu) => submenu.id.toString()}
            renderItem={renderSubSubMenu}
          />
        )}
      </View>
    );
  };

  const handleSubMenuClick = (submenu) => {
    if (submenu.submenus && submenu.submenus.length > 0) {
      toggleExpandedSubmenu(submenu.id);
    } else if (submenu.url) {
      navigateTo(submenu.url);
    } else {
      toggleExpandedSubmenu(submenu.id);
    }
  };

  const renderMenuItem = ({ item }) => {
    const { menu, submenus } = item;
    const isExpanded = expandedMenus[menu.id];

    return (
      <View key={menu.id} style={styles.menuItem}>
        <TouchableOpacity style={styles.menuLink} onPress={() => menu.url ? navigateTo(menu.url) : toggleExpandedMenu(menu.id)}>
          <Image
            source={
              menu.Menu_name === 'Home'
                ? require('./assets/Fill-1home.svg')
                : menu.Menu_name === 'Dashboard'
                ? require('./assets/Categorydash.svg')
                : menu.Menu_name === 'Transactions'
                ? require('./assets/Group 1410105249trans.svg')
                : menu.Menu_name === 'Payroll'
                ? require('./assets/3-Userpayroll.svg')
                : menu.Menu_name === 'Configuration'
                ? require('./assets/Settingconf.svg')
                : menu.Menu_name === 'Company'
                ? require('./assets/Vectorcompany.svg')
                : menu.Menu_name === 'Reports'
                ? require('./assets/Blackreport.svg')
                : require('./assets/Blackreport.svg')
            }
            style={styles.icon}
          />
          <Text>{menu.Menu_name}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.menuDropdown}>
            <FlatList
              data={submenus}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderSubMenu}
            />
          </View>
        )}
      </View>
    );
  };

return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('./assets/big_apple_erp_favicon1.png')}
          style={styles.logo}
        />
        <TouchableOpacity style={styles.menuIcon} onPress={() => setShowMenuOptions(!showMenuOptions)}>
          <Text style={styles.menuIconText}>☰</Text>
        </TouchableOpacity>
        <Image
          source={require('./assets/Notification.svg')}
          style={styles.notificationIcon}
        />
        <TouchableOpacity style={styles.profileSection} onPress={() => setShowProfileOptions(!showProfileOptions)}>
          <Text style={styles.profileText}>Profile</Text>
          <View style={styles.userInfo}>
            <Image
              source={require('./assets/admin.png')}
              style={[styles.profileImage, styles.roundedImage]}
            />
          </View>
        </TouchableOpacity>
      </View>

      {showProfileOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={() => console.log('Edit Profile')}>
            <Text style={styles.optionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handleLogout}>
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {showMenuOptions && (
        <ScrollView style={styles.menuContainer}>
          {/* Here, the ScrollView component is added */}
          <FlatList
            data={[
              { menu: { id: 'home', Menu_name: 'Home', url: '/companies' } },
              { menu: { id: 'dashboard', Menu_name: 'Dashboard', url: '/company-dashboard' } },
              ...Object.values(menus)
            ]}
            keyExtractor={(item) => item.menu.id.toString()}
            renderItem={renderMenuItem}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    color: '#495057',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
  },
  roundedImage: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ada8a8',
  },
  logo: {
    width: 40,
    height: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userId: {
    marginRight: 10,
  },
  optionsContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
    padding: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 10,
  },
  menuIcon: {
    padding: 10,
    marginLeft: '-20%',
  },
  menuIconText: {
    fontSize: 24,
    color: 'black',
  },
  notificationIcon: {
    width: 24,
    height: 24,
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    width: '50%',
    zIndex: 10,
  },
  menuItem: {
    marginVertical: 5,
  },
  menuLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  subMenuContainer: {
    paddingLeft: 20,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
  },
  subMenuText: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  subSubMenuText: {
    fontSize: 14,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  transactionPage: {
    paddingLeft: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  optionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  menusIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  menuDropdown: {
    backgroundColor: '#fff',
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
    marginLeft: 10,
  },
});

export default Header;
