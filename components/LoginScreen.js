import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity,ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import AnimatedSquares from './AnimatedSquares';
import Icon from 'react-native-vector-icons/FontAwesome';
import Svg, { Circle, Path, G, Defs, ClipPath, Use, Polygon, Rect, Ellipse } from 'react-native-svg';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import GorillaSVG from './GorillaSVG';
const GorillaSVG = ({ isPasswordFocused }) => (
  <View style={styles.svgContainer}>
    <Svg style={styles.mySVG} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <Defs>
        <Circle id="armMaskPath" cx="100" cy="100" r="100" />
      </Defs>
      <ClipPath id="armMask">
        <Use href="#armMaskPath" overflow="visible" />
      </ClipPath>
      <Circle cx="100" cy="100" r="100" fill="#a9ddf3" />
      <G className="body">
        <Path className="bodyBGnormal" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#FFFFFF"
          d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z" />
        <Path fill="#DDF1FA" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z" />
      </G>
      <G className="earL">
        <G className="outerEar" fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5">
          <Circle cx="47" cy="83" r="11.5" />
          <Path d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1" strokeLinecap="round" strokeLinejoin="round" />
        </G>
        <G className="earHair">
          <Rect x="51" y="64" fill="#FFFFFF" width="15" height="35" />
          <Path d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9" fill="#fff" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </G>
      </G>
      <G className="earR">
        <G className="outerEar">
          <Circle fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" cx="153" cy="83" r="11.5" />
          <Path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            d="M153.7,78.9c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1" />
        </G>
        <G className="earHair">
          <Rect x="134" y="64" fill="#FFFFFF" width="15" height="35" />
          <Path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            d="M146.6,62.8c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5c-1.2-0.7-3.4-1.4-5.2-1.9" />
        </G>
      </G>
      <Path className="chin" d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1" fill="none" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path className="face" fill="#DDF1FA" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46" />
      <Path className="hair" fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        d="M81.457,27.929c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474" />
      <G className="eyebrow">
        <Path fill="#FFFFFF" d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z" />
        <Path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          d="M63.56,55.102c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037c4.913-0.481,9.857-1.34,14.787-2.599" />
      </G>
      <G className="eyeL">
        <Circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77" />
        <Circle cx="84" cy="76" r="1" fill="#fff" />
      </G>
      <G className="eyeR">
        <Circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77" />
        <Circle cx="113" cy="76" r="1" fill="#fff" />
      </G>
      <G className="mouth">
        <Path className="mouthBG" fill="#617E92"
          d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
        <Path style={{ display: 'none' }} className="mouthSmallBG" fill="#617E92"
          d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
        <Path style={{ display: 'none' }} className="mouthMediumBG"
          d="M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2c0,4.5-3.7,8.2-8.2,8.2H95z" />
        <Path style={{ display: 'none' }} className="mouthLargeBG"
          d="M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z"
          fill="#617e92" stroke="#3a5e77" strokeLinejoin="round" strokeWidth="2.5" />
        <Defs>
          <Path id="mouthMaskPath" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
        </Defs>
        <ClipPath id="mouthMask">
          <Use href="#mouthMaskPath" overflow="visible" />
        </ClipPath>
        <G clipPath="url(#mouthMask)">
          <G className="tongue">
            <Circle cx="100" cy="107" r="8" fill="#cc4a6c" />
            <Ellipse className="tongueHighlight" cx="100" cy="100.5" rx="3" ry="1.5" opacity=".1" fill="#fff" />
          </G>
        </G>
        <Path clipPath="url(#mouthMask)" className="tooth" style={{ fill: '#FFFFFF' }} d="M106,97h-4c-1.1,0-2-0.9-2-2v-2h8v2C108,96.1,107.1,97,106,97z" />
        <Path className="mouthOutline" fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinejoin="round"
          d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z" />
      </G>
      <Path className="nose" d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill="#3a5e77" />
      <G className="arms" clipPath="url(#armMask)">
        {/* <G className="armL" style={{ visibility: isPasswordFocused ? 'visible' : 'hidden' }}>
          <Polygon fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="121.3,98.4 111,59.7 149.8,49.3 169.8,85.4" />
          <Path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M134.4,53.5l19.3-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-10.3,2.8" />
          <Path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M150.9,59.4l26-7c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-21.3,5.7" /> */}

          {/* <G className="twoFingers">
            <Path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
              d="M158.3,67.8l23.1-6.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-23.1,6.2" />
            <Path fill="#A9DDF3" d="M180.1,65l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L180.1,65z" />
            <Path fill="#DDF1FA" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10"
              d="M160.8,77.5l19.4-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-18.3,4.9" />
            <Path fill="#A9DDF3" d="M178.8,75.7l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L178.8,75.7z" />
          </G>
          <Path fill="#A9DDF3" d="M175.5,55.9l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L175.5,55.9z" />
          <Path fill="#A9DDF3" d="M152.1,50.4l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L152.1,50.4z" />
          <Path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            d="M123.5,97.8c-41.4,14.9-84.1,30.7-108.2,35.5L1.2,81c33.5-9.9,71.9-16.5,111.9-21.8" />
          <Path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            d="M108.5,60.4c7.7-5.3,14.3-8.4,22.8-13.2c-2.4,5.3-4.7,10.3-6.7,15.1c4.3,0.3,8.4,0.7,12.3,1.3c-4.2,5-8.1,9.6-11.5,13.9c3.1,1.1,6,2.4,8.7,3.8c-1.4,2.9-2.7,5.8-3.9,8.5c2.5,3.5,4.6,7.2,6.3,11c-4.9-0.8-9-0.7-16.2-2.7" />
          <Path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            d="M94.5,103.8c-0.6,4-3.8,8.9-9.4,14.7c-2.6-1.8-5-3.7-7.2-5.7c-2.5,4.1-6.6,8.8-12.2,14c-1.9-2.2-3.4-4.5-4.5-6.9c-4.4,3.3-9.5,6.9-15.4,10.8c-0.2-3.4,0.1-7.1,1.1-10.9" />
          <Path fill="#FFFFFF" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            d="M97.5,63.9c-1.7-2.4-5.9-4.1-12.4-5.2c-0.9,2.2-1.8,4.3-2.5,6.5c-3.8-1.8-9.4-3.1-17-3.8c0.5,2.3,1.2,4.5,1.9,6.8c-5-0.6-11.2-0.9-18.4-1c2,2.9,0.9,3.5,3.9,6.2" /> */}
        {/* </G> */}
      </G>
    </Svg>
  </View>
);

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const requestBody = { username, password };
      const response = await axios.post('https://jd1.bigapple.in/api/login', requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = response.data;
      if (data.success) {
        await AsyncStorage.setItem('token', data.token);
        Alert.alert('Success', `Logged in as ${username}`);
        navigation.navigate('Companies');
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', 'An error occurred. Please try again later.');
      } else if (error.request) {
        Alert.alert('Error', 'No response from server. Please try again later.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedSquares /> 
      {/* <GorillaSVG/> */}
      <Card style={styles.card}>
        <Card.Content>
          <GorillaSVG isPasswordFocused={isPasswordFocused} /> 
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
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#333" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign in'}</Text>
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
    marginLeft:20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mySVG: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
