import React, { useContext } from 'react'

import ValidityEquipments from '../pages/main/ValidityEquipments';
import ValidityReagents from '../pages/main/ValidityReagents';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ThemeContext from '../context/ThemeContext';
import themes from '../themes/Themes';
import { ThemeProvider } from 'styled-components';

const StackValidity = createMaterialTopTabNavigator();

export default function RouteValidity({ navigation }) {

  const { theme, color } = useContext(ThemeContext);
  const themeLight = themes.light;
  const themeDark = themes.dark;

  const ControllerColor = (dark, light) => {
    return theme == "dark" ? dark : light
  }

  return (
    <ThemeProvider theme={theme === 'light' ? themeLight : themeDark}>
    <StackValidity.Navigator
      screenOptions={{
        tabBarStyle:{
          backgroundColor: ControllerColor('#222', '#DDD')
        },
        tabBarLabelStyle:{
          color: ControllerColor('#FFF', '#000')
        }
      }}
    >
      <StackValidity.Screen
        name="ValidityReagents"
        component={ValidityReagents}
        options={{
          title: 'Reagentes',
        }}
      />
      <StackValidity.Screen
        name="ValidityEquipments"
        component={ValidityEquipments}
        options={{
          title: 'Equipamentos',
        }}
      />
    </StackValidity.Navigator>
    </ThemeProvider>
  )
}