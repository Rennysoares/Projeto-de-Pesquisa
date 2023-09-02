//Importações dos Core Components do React e do React Native
import { React, useState, useEffect } from 'react';
import { Entypo, Ionicons, AntDesign } from 'react-native-vector-icons';

import { createDrawerNavigator } from '@react-navigation/drawer';

import ThemeContext from '../context/ThemeContext';

import * as SecureStorage from 'expo-secure-store';

const SECURE_STORAGE_KEY = 'selectedTheme';
const SECURE_STORAGE_KEY2 = 'selectedColor';

//Import Main Screens
import Home from '../pages/main/Home';
import DrawerTab from '../components/DrawerTab';
//Children routes
import RouteReagents from './RouteReagents';
import RouteGlasswares from './RouteGlasswares';
import RouteEquipments from './RouteEquipments';
import RouteValidity from './RouteValidity';
import RouteSettings from './RouteSettings';

const StackMain = createDrawerNavigator();

export default function RouteMain(){

  const [theme, setTheme] = useState('light');
  const [color, setColor] = useState('#55f400'); // Estado para controlar o tema

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const settingColor = (paramColor) => {
    const newColor = paramColor;
    setColor(newColor)
  }

  useEffect(() => {
    async function loadStoredTheme() {
      try {
        const storedTheme = await SecureStorage.getItemAsync(SECURE_STORAGE_KEY);
        if (storedTheme) {
          setTheme(storedTheme);
        }
      } catch (error) {
        console.error('Error loading stored theme', error);
      }
    }

    loadStoredTheme();
  }, []);

  useEffect(() => {
    SecureStorage.setItemAsync(SECURE_STORAGE_KEY, theme)
      .catch(error => {
        console.error('Error saving theme', error);
      });
  }, [theme]);

  useEffect(() => {
    async function loadStoredColor() {
      try {
        const storedColor = await SecureStorage.getItemAsync(SECURE_STORAGE_KEY2);
        if (storedColor) {
          setColor(storedColor);
        }
      } catch (error) {
        console.error('Error loading stored color', error);
      }
    }

    loadStoredColor();
  }, []);

  useEffect(() => {
    SecureStorage.setItemAsync(SECURE_STORAGE_KEY2, color)
      .catch(error => {
        console.error('Error saving theme', error);
      });
  }, [color]);

  const ControllerColor = (dark, light) => {
    return theme=="dark" ? dark : light
  }
  
    return(
      <ThemeContext.Provider value={{theme, toggleTheme, color, settingColor}}>
        <StackMain.Navigator 
          drawerContent={(props) => <DrawerTab {...props}/>}
          screenOptions={{
            headerStyle: {
              backgroundColor: `${ControllerColor("#191919", color)}`,
              shadowRadius: 30,
              shadowColor: '#000',
            },
            headerTintColor: `${ControllerColor("#fff", "#000")}`,
            drawerLabelStyle:{
              marginLeft: -20,
              fontWeight: 'bold',
              fontSize: 15
            },
            drawerActiveTintColor: "#FFF",
            drawerActiveBackgroundColor: color,
            drawerInactiveTintColor: `${ControllerColor("#aaa", "#555")}`,
          }}
          >
        <StackMain.Screen
        name="Home"
        component={Home}
        options={{
          title: "Tela inicial",
          drawerIcon: ({color})=>(
            <Entypo name='home' size={22} color={color}/>
          )
        }}
       />
       <StackMain.Screen
        name="RouteReagents"
        component={RouteReagents}
        options={{
          headerShown: false,
          title: 'Reagentes', 
          drawerIcon: ({color})=>(<Entypo name='list' size={22} color={color}/>),
        }}
       />
       <StackMain.Screen
        name="RouteGlasswares"
        component={RouteGlasswares}
        options={{
          headerShown: false,
          title: 'Vidrarias', 
          drawerIcon: ({color})=>(<Entypo name='list' size={22} color={color}/>),
        }}
       />
       <StackMain.Screen
        name="RouteEquipments"
        component={RouteEquipments}
        options={{
          headerShown: false,
          title: 'Equipamentos',
          drawerIcon: ({color})=>(<Entypo name='list' size={22} color={color}/>),
        }}
       />
       <StackMain.Screen
        name="RouteValidity"
        component={RouteValidity}
        options={{
          title: 'Controle de validade',
          drawerIcon: ({color})=>(<AntDesign name='clockcircleo' size={22} color={color}/>),
        }}
       />
       <StackMain.Screen
        name="RouteSettings"
        component={RouteSettings}
        options={{
          title: 'Configurações',
          headerShown: false,
          drawerIcon: ({color})=>(<Ionicons name='settings-sharp' size={22} color={color}/>),
        }}
       />
      </StackMain.Navigator>
      </ThemeContext.Provider>
    )
}