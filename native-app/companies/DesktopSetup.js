import React from 'react';
import Headers from '../Headers'; // Adjust the import path as needed
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const DesktopSetup = ({ authenticated }) => {
  return (
    <div style={{ backgroundColor: 'white' }}>
        <Headers authenticated={authenticated} /> {/* Render the Headers component */}
      <h1> Welcome Native  Dashboard</h1>
      {/* <p>Hello, world!</p> */}
    </div>
  );
};

export default DesktopSetup;
