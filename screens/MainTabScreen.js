import React from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import ExploreScreen from './ExploreScreen';
import CardItemDetails from './CardItemDetails';
import CardListScreen from './CardListScreen';
import TestDetails from './TestDetails';

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();

const MainTabScreen = () => (
  <Tab.Navigator initialRouteName="Home" activeColor="#fff">
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Explore',
        tabBarColor: '#d02860',
        tabBarIcon: ({color}) => (
          <Icon name="ios-aperture" color={color} size={26} />
        ),
      }}
    />
    {/* <Tab.Screen
      name="Details"
      component={DetailsScreen}
      options={{
        tabBarLabel: 'Details',
        tabBarColor: '#d02860',
        tabBarIcon: ({color}) => (
          <Icon name="ios-aperture" color={color} size={26} />
        ),
      }}
    /> */}
    <Tab.Screen
      name="Test"
      component={TestDetails}
      options={{
        tabBarLabel: 'Details',
        tabBarColor: '#d02860',
        tabBarIcon: ({color}) => (
          <Icon name="ios-aperture" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={ExploreScreen} />
      <HomeStack.Screen name="CardItemDetails" component={CardItemDetails} />
      <HomeStack.Screen name="CardListScreen" component={CardListScreen} />
    </HomeStack.Navigator>
  );
};
