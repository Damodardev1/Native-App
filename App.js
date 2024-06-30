import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Companies from './components/Companies';
import CompanyDashboard from './CompanyDashboard';
import LoginScreen from './components/LoginScreen';
// import AddTransactionInsertRoleFields from './app/AddTransactionInsertRoleFields'; 
const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Companies" component={Companies} />
            <Stack.Screen name="CompanyDashboard" component={CompanyDashboard} />
            <Stack.Screen name="AddTransactionInsertRoleFields" component={AddTransactionInsertRoleFields} />          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
