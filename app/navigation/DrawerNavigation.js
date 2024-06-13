import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItem,
    createDrawerNavigator,
} from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../../components/LoginScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <DrawerItem
                    label='Login'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='log-in-outline' size={24} color='white' />}
                    onPress={() => props.navigation.navigate('Login')}
                />
                <DrawerItem
                    label='Companies'
                    labelStyle={styles.drawerItemLabel}
                    icon={() => <Ionicons name='business-outline' size={24} color='white' />}
                    onPress={() => props.navigation.navigate('Companies')}
                />
            </DrawerContentScrollView>
        </View>
    );
};

const DrawerNavigation = () => {
    const navigation = useNavigation();
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;

    return (
        <Drawer.Navigator
            initialRouteName='Login'
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: {
                    backgroundColor: '#0D0D0D',
                },
                drawerType: isLargeScreen ? 'permanent' : 'front',
                headerLeft: isLargeScreen
                    ? () => null
                    : () => (
                        <Ionicons
                            name='menu'
                            size={24}
                            color='white'
                            style={styles.menuIcon}
                            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        />
                    ),
            }}
        >
            <Drawer.Screen name='Login' component={LoginScreen} />
            <Drawer.Screen name='Companies' component={Companies} />
        </Drawer.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171717',
        padding: 8,
        paddingTop: 16,
    },
    drawerItemLabel: {
        color: '#fff',
    },
    menuIcon: {
        marginHorizontal: 14,
    },
});

export default DrawerNavigation;
