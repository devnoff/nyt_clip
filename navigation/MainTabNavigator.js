import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import WebViewScreen from '../screens/WebViewScreen';
import ClippedScreen from '../screens/ClippedScreen';


const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Modal: WebViewScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'ios-filing'}
    />
  ),
};

const ClippedStack = createStackNavigator({
  Clipped: ClippedScreen,
  Modal: WebViewScreen
});

ClippedStack.navigationOptions = {
  tabBarLabel: 'Clipped',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'ios-bookmark'}
    />
  )
};


export default createBottomTabNavigator({
  HomeStack,
  ClippedStack
});
