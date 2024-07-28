import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedSquares from './AnimatedSquares';
import GorillaSVG from './GorillaSVG';
import LoginBackground from './LoginBackground';
import API_BASE_URL from '../apiconfig'; 
const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const requestBody = { username, password };
      const response = await axios.post(`${API_BASE_URL}/login`, requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = response.data;
      if (data.success) {
        const { token } = data;
        const userId = data.user?.user_id;
        const nickname = data.user?.Nickname;

        if (token && userId && nickname) {
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('user_id', userId.trim());
          await AsyncStorage.setItem('Nickname', nickname);

          Alert.alert('Success', `Logged in as ${username}`);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Companies' }],
          });
        } else {
          Alert.alert('Error', 'Invalid response data');
        }
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        Alert.alert('Error', `Server responded with status ${error.response.status}: ${error.response.data.message}`);
      } else if (error.request) {
        Alert.alert('Error', 'No response from server. Please try again later.');
      } else {
        Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedSquares />
      <LoginBackground/>
      <Card style={styles.card}>
        <View style={styles.svgContainer}>
          <GorillaSVG />
        </View>
        <Card.Content>
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#333" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#333" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#333" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  card: {
    width: '100%',
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  svgContainer: {
    position: 'relative',
    width: 190,
    height: 190,
    marginBottom: 20,
    borderRadius: 80,
    marginLeft: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    backgroundColor: '#FF3366',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FEFEFE',
    fontSize: 16,
  },
});

export default LoginScreen;
